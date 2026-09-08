using System.Text.Json;
sealed class Routing {
 public record Saved(Processes.Info Process,string?[] Roles,string Target);
 readonly string file;readonly IAudioPolicy policy;readonly Func<Processes.Info,uint?> find;readonly List<Saved> entries;
 public Routing(string file,IAudioPolicy policy,Func<Processes.Info,uint?>? find=null){this.find=find??Processes.Find;this.file=file;this.policy=policy;entries=File.Exists(file)?JsonSerializer.Deserialize<List<Saved>>(File.ReadAllText(file))??new():new();}
 void Save(){Directory.CreateDirectory(Path.GetDirectoryName(Path.GetFullPath(file))!);var tmp=file+".tmp";File.WriteAllText(tmp,JsonSerializer.Serialize(entries));File.Move(tmp,file,true);}
 public void Apply(List<Processes.Info> processes,string target){
  var additions=processes.Where(p=>!entries.Any(e=>e.Process.Path.Equals(p.Path,StringComparison.OrdinalIgnoreCase))).Select(p=>new Saved(p,Enumerable.Range(0,3).Select(role=>policy.Get(p.Pid,role)).ToArray(),target)).ToList();
  if(additions.Count==0)return;entries.AddRange(additions);Save(); // Persist originals before the first mixer change.
  foreach(var entry in additions)for(int role=0;role<3;role++)policy.Set(entry.Process.Pid,role,target);
 }
 public bool Restore(){
  foreach(var entry in entries.ToArray()){
   var pid=find(entry.Process);if(pid==null)continue;
   try{
    for(int role=0;role<3;role++){
     var current=policy.Get(pid.Value,role);
     // Preserve changes explicitly made by the user while streaming.
     if(string.Equals(current,entry.Target,StringComparison.OrdinalIgnoreCase))policy.Set(pid.Value,role,entry.Roles[role]);
    }
    entries.Remove(entry);
   }catch{}
  }
  if(entries.Count==0){File.Delete(file);return true;}Save();return false;
 }
 public bool HasPending=>entries.Count>0;
}
