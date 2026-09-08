using NAudio.CoreAudioApi;
using System.Runtime.InteropServices;
using System.Text.Json;

static unsafe class SystemOutputs {
 public record Device(string id,string name,bool isDefault);
 public record Saved(string[] originals,string target);
 public static List<Device> List(){
  using var enumerator=new MMDeviceEnumerator();string? current=null;
  try{using var d=enumerator.GetDefaultAudioEndpoint(DataFlow.Render,Role.Multimedia);current=d.ID;}catch{}
  var result=new List<Device>();
  foreach(var d in enumerator.EnumerateAudioEndPoints(DataFlow.Render,DeviceState.Active))using(d)result.Add(new(d.ID,d.FriendlyName,d.ID==current));
  return result;
 }
 static string[] Defaults(){using var e=new MMDeviceEnumerator();return Enumerable.Range(0,3).Select(r=>{using var d=e.GetDefaultAudioEndpoint(DataFlow.Render,(Role)r);return d.ID;}).ToArray();}
 [DllImport("ole32.dll")] static extern int CoInitializeEx(IntPtr reserved,uint mode);
 [DllImport("ole32.dll")] static extern int CoCreateInstance(ref Guid cls,IntPtr outer,uint context,ref Guid iid,out IntPtr instance);
 // IPolicyConfig Win7+ ABI, also used by EarTrumpet (MIT): SetDefaultEndpoint is slot 13.
 static void Set(string id,int role){
  CoInitializeEx(IntPtr.Zero,0);
  var cls=new Guid("870af99c-171d-4f9e-af0d-e63df40c2bc9");var iid=new Guid("f8679f50-850a-41cf-9c72-430f290290c8");
  Marshal.ThrowExceptionForHR(CoCreateInstance(ref cls,IntPtr.Zero,1,ref iid,out var instance));
  try{var slot=Marshal.ReadIntPtr(Marshal.ReadIntPtr(instance),13*IntPtr.Size);fixed(char* text=id)Marshal.ThrowExceptionForHR(((delegate* unmanaged[Stdcall]<IntPtr,char*,int,int>)slot)(instance,text,role));}
  finally{Marshal.Release(instance);}
 }
 public static void Change(string file,string id){
  if(!List().Any(d=>d.id==id))throw new Exception("ERR_AUDIO_DEVICE");
  // Restore the last application change before saving a new target. Preserve external edits.
  Restore(file);var saved=new Saved(Defaults(),id);
  Directory.CreateDirectory(Path.GetDirectoryName(Path.GetFullPath(file))!);
  File.WriteAllText(file+".tmp",JsonSerializer.Serialize(saved));File.Move(file+".tmp",file,true);
  try{for(int role=0;role<3;role++)Set(id,role);}catch{Restore(file);throw;}
 }
 public static void Restore(string file){
  if(!File.Exists(file))return;
  var saved=JsonSerializer.Deserialize<Saved>(File.ReadAllText(file))??throw new Exception("ERR_AUDIO_RESTORE");
  var current=Defaults();for(int role=0;role<3;role++)if(current[role]==saved.target)Set(saved.originals[role],role);
  File.Delete(file);
 }
 public static void SelfTest(string file){
  if(File.Exists(file))throw new Exception("Test journal already exists");
  var before=Defaults();
  try{Change(file,before[1]);if(Defaults().Any(id=>id!=before[1]))throw new Exception("Default output switch failed");}
  finally{Restore(file);}
  if(!before.SequenceEqual(Defaults())||File.Exists(file))throw new Exception("Default output restoration failed");
  Console.WriteLine("PASS system output: COM set and exact restoration of all three roles");
 }
}
