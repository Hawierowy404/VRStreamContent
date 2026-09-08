using System.Text.Json;
static class RoutingTests {
 sealed class Fake : IAudioPolicy {
  public readonly Dictionary<(uint,int),string?> Values=new();public int FailRole=-1;
  public string? Get(uint pid,int role)=>Values.GetValueOrDefault((pid,role));
  public void Set(uint pid,int role,string? value){if(role==FailRole){FailRole=-1;throw new Exception("test");}Values[(pid,role)]=value;}
 }
 public static void Run(string directory){
  Directory.CreateDirectory(directory);var file=Path.Combine(directory,"routing-test.json");var p=new Processes.Info(42,"test.exe",1);var policy=new Fake();
  policy.Set(42,0,null);policy.Set(42,1,"speaker-old");policy.Set(42,2,"headset");
  var route=new Routing(file,policy,_=>42);route.Apply(new(){p},"speaker-new");
  if(!File.Exists(file)||Enumerable.Range(0,3).Any(r=>policy.Get(42,r)!="speaker-new"))throw new Exception("apply");
  var recovery=new Routing(file,policy,_=>42);policy.Set(42,2,"manual-choice");
  if(!recovery.Restore()||policy.Get(42,0)!=null||policy.Get(42,1)!="speaker-old"||policy.Get(42,2)!="manual-choice"||File.Exists(file))throw new Exception("restore");
  policy.FailRole=1;try{route=new Routing(file,policy,_=>42);route.Apply(new(){p},"speaker-new");}catch{}
  recovery=new Routing(file,policy,_=>42);if(!recovery.Restore()||policy.Get(42,0)!=null)throw new Exception("partial restore");
  route=new Routing(file,policy,_=>null);route.Apply(new(){p},"speaker-new");if(route.Restore()||!File.Exists(file))throw new Exception("pending");
  recovery=new Routing(file,policy,_=>42);if(!recovery.Restore())throw new Exception("later recovery");
  var originals=Enumerable.Range(0,3).Select(r=>policy.Get(42,r)).ToArray();
  route=new Routing(file,policy,_=>42);route.Apply(new(){p},"manual-output-one");
  if(!route.Restore())throw new Exception("manual switch restore");
  route.Apply(new(){p},"manual-output-two");
  if(Enumerable.Range(0,3).Any(r=>policy.Get(42,r)!="manual-output-two"))throw new Exception("manual target");
  if(!route.Restore()||!originals.SequenceEqual(Enumerable.Range(0,3).Select(r=>policy.Get(42,r))))throw new Exception("manual final restore");
  Console.WriteLine("PASS routing: exact outputs, default, manual override, partial failure, restart journal, absent process");
 }
}

