using System.Diagnostics;
using System.Text.Json;
using NAudio.CoreAudioApi;
using NAudio.Wave;
using System.Runtime.Versioning;
[assembly: SupportedOSPlatform("windows")]
static class Program {
 static void Event(string type,string? message=null)=>Console.Error.WriteLine(JsonSerializer.Serialize(new{type,message}));
 static int Tone(int frequency){
  using var devices=new MMDeviceEnumerator();
  using var device=devices.EnumerateAudioEndPoints(DataFlow.Render,DeviceState.Active).First(d=>d.FriendlyName.StartsWith("CABLE Input",StringComparison.OrdinalIgnoreCase));
  using var player=new WasapiPlayerBuilder().WithDevice(device).Build();
  var signal=new NAudio.Wave.SampleProviders.SignalGenerator(48000,2){Frequency=frequency,Gain=0.05,Type=NAudio.Wave.SampleProviders.SignalGeneratorType.Sin};
  player.Init(new NAudio.Wave.SampleProviders.SampleToWaveProvider(signal));player.Play();Event("ready");Thread.Sleep(12000);player.Stop();return 0;
 }

 static int Probe(uint pid,int seconds){
  if(!OperatingSystem.IsWindowsVersionAtLeast(10,0,20348))return 2;
  using var output=Console.OpenStandardOutput();
  using var recorder=new WasapiRecorderBuilder().WithProcessLoopback(pid,ProcessLoopbackMode.IncludeTargetProcessTree).WithFormat(WaveFormat.CreateIeeeFloatWaveFormat(48000,2)).BuildAsync().GetAwaiter().GetResult();
  recorder.DataAvailable+=(buffer,flags,pos,time)=>output.Write(buffer);
  recorder.StartRecording();Event("ready");Thread.Sleep(Math.Clamp(seconds,1,30)*1000);recorder.StopRecording();return 0;
 }
 static void Diagnostic(string stage,Exception ex){
  Console.Error.WriteLine(JsonSerializer.Serialize(new{type="diagnostic",stage,exception=ex.GetType().Name,operation=ex.Data["operation"],role=ex.Data["role"],hresult="0x"+ex.HResult.ToString("X8"),inner=ex.InnerException?.GetType().Name,innerHresult=ex.InnerException==null?null:"0x"+ex.InnerException.HResult.ToString("X8")}));
 }
 [MTAThread] static int Main(string[] args) {
  if(args.Length==2&&args[0]=="tone")return Tone(int.Parse(args[1]));
  if(args.Length==2&&args[0]=="selftest"){RoutingTests.Run(args[1]);return 0;}
  if(args.Length==3&&args[0]=="probe")return Probe(uint.Parse(args[1]),int.Parse(args[2]));
  Routing? routing=null;AudioPolicy? policy=null;string stage="arguments";
  try{
   if(args.Length==2&&args[0]=="recover"){
    stage="restore";policy=new AudioPolicy();routing=new Routing(args[1],policy);return 0;
   }
   if(args.Length==1&&args[0]=="devices"){
    using var devices=new MMDeviceEnumerator();
    foreach(var device in devices.EnumerateAudioEndPoints(DataFlow.Render,DeviceState.Active))using(device)Event("device",device.FriendlyName);
    return 0;
   }
   if(args.Length==1&&args[0]=="outputs"){Console.WriteLine(JsonSerializer.Serialize(SystemOutputs.List()));return 0;}
   if(args.Length==2&&args[0]=="system-selftest"){SystemOutputs.SelfTest(args[1]);return 0;}
   if(args.Length==3&&args[0]=="system-output"){SystemOutputs.Change(args[1],args[2]);Console.WriteLine("true");return 0;}
   if(args.Length==2&&args[0]=="system-restore"){SystemOutputs.Restore(args[1]);Console.WriteLine("true");return 0;}
   if(args.Length!=3)throw new Exception("ERR_APP_AUDIO");
   if(!OperatingSystem.IsWindowsVersionAtLeast(10,0,20348))throw new Exception("ERR_APP_AUDIO_UNSUPPORTED");
   stage="source-process";var pid=Processes.FromWindow(long.Parse(args[0]));
   using var parent=Process.GetProcessById(int.Parse(args[1]));
   stage="process-loopback";
   using var recorder=new WasapiRecorderBuilder().WithProcessLoopback(pid,ProcessLoopbackMode.IncludeTargetProcessTree).WithFormat(WaveFormat.CreateIeeeFloatWaveFormat(48000,2)).BuildAsync().GetAwaiter().GetResult();
   string? target=null,deviceName=null;bool routeEnabled=false,announced=false;
   // Mixer routing is optional. Its failure must never replace process capture with system audio.
   try{
    stage="route-setup";policy=new AudioPolicy();routing=new Routing(args[2],policy);
    if(!routing.Restore())Event("warning","ERR_AUDIO_RESTORE");
    else{
     using var devices=new MMDeviceEnumerator();
     using var main=devices.GetDefaultAudioEndpoint(DataFlow.Render,Role.Multimedia);
     var alternatives=new List<(string Id,string Name)>();
     foreach(var device in devices.EnumerateAudioEndPoints(DataFlow.Render,DeviceState.Active))using(device){if(device.ID!=main.ID)alternatives.Add((device.ID,device.FriendlyName));}
     if(alternatives.Count==0)Event("warning","WARN_NO_SPEAKER");
     else{var chosen=alternatives[Random.Shared.Next(alternatives.Count)];target=AudioPolicy.Endpoint(chosen.Id);deviceName=chosen.Name;routeEnabled=true;}
    }
   }catch(Exception ex){Diagnostic(stage,ex);Event("warning","WARN_AUDIO_ROUTE");}
   void Route(){
    if(!routeEnabled||routing==null||target==null)return;
    try{
     // Chromium's window process often has no mixer entry; use its actual audio-session process.
     var processes=Processes.AudioTree(pid);
     if(processes.Count==0)return;
     routing.Apply(processes,target);
     if(!announced&&routing.HasPending){announced=true;Event("routed",deviceName);}
    }catch(Exception ex){
     routeEnabled=false;Diagnostic("route",ex);Event("warning","WARN_AUDIO_ROUTE");
     try{if(!routing.Restore())Event("warning","ERR_AUDIO_RESTORE");}catch(Exception restore){Diagnostic("route-rollback",restore);Event("warning","ERR_AUDIO_RESTORE");}
    }
   }
   using var output=Console.OpenStandardOutput();Exception? failure=null;bool ending=false;
   recorder.DataAvailable+=(buffer,flags,position,time)=>{try{output.Write(buffer);}catch(Exception ex){Interlocked.CompareExchange(ref failure,ex,null);}};
   recorder.RecordingStopped+=(_,e)=>{if(!ending)Interlocked.CompareExchange(ref failure,e.Exception??new Exception("ERR_APP_AUDIO_CAPTURE"),null);};
   stage="capture-start";recorder.StartRecording();Event("ready");Route();
   var commands=new System.Collections.Concurrent.ConcurrentQueue<string>();
   var input=Task.Run(()=>{string? line;while((line=Console.ReadLine())!=null){commands.Enqueue(line);if(line=="stop")return;}commands.Enqueue("stop");});
   bool stop=false;int tick=0;
   while(!stop&&!parent.HasExited&&failure==null){
    Thread.Sleep(100);
    while(commands.TryDequeue(out var line)){
     if(line=="stop"){stop=true;break;}
     int commandId=0;
     try{
      using var command=JsonDocument.Parse(line);commandId=command.RootElement.GetProperty("id").GetInt32();
      var endpoint=command.RootElement.GetProperty("target").GetString()!;
      var available=SystemOutputs.List();var chosen=available.FirstOrDefault(d=>d.id==endpoint);
      if(chosen==null)throw new Exception("ERR_AUDIO_DEVICE");
      routeEnabled=false;
      if(routing==null||!routing.Restore())throw new Exception("ERR_AUDIO_RESTORE");
      target=AudioPolicy.Endpoint(chosen.id);deviceName=chosen.name;announced=false;routeEnabled=true;
      Route();if(!routeEnabled)throw new Exception("ERR_AUDIO_DEVICE");
      Console.Error.WriteLine(JsonSerializer.Serialize(new{type="route-result",id=commandId,ok=true}));
     }catch(Exception ex){Diagnostic("manual-route",ex);Console.Error.WriteLine(JsonSerializer.Serialize(new{type="route-result",id=commandId,ok=false}));}
    }
    if(!stop&&++tick%10==0)Route();
   }
   ending=true;recorder.StopRecording();
   if(failure!=null){stage="capture-running";throw failure;}
   return 0;
  }catch(Exception ex){Diagnostic(stage,ex);Event("error",ex.Message.StartsWith("ERR_")?ex.Message:"ERR_APP_AUDIO");return 1;}
  finally{
   if(routing!=null){try{Event(routing.Restore()?"restored":"pending");}catch(Exception ex){Diagnostic("restore",ex);Event("pending","ERR_AUDIO_RESTORE");}}
   policy?.Dispose();
  }
 }
}

