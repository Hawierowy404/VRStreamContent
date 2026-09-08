using System.Diagnostics;
using System.Runtime.InteropServices;
static class Processes {
 [StructLayout(LayoutKind.Sequential,CharSet=CharSet.Unicode)] struct Entry { public uint size,usage,pid;public UIntPtr heap;public uint module,threads,parent;public int priority;public uint flags;[MarshalAs(UnmanagedType.ByValTStr,SizeConst=260)]public string name; }
 [DllImport("kernel32.dll")] static extern IntPtr CreateToolhelp32Snapshot(uint flags,uint pid);
 [DllImport("kernel32.dll",CharSet=CharSet.Unicode)] static extern bool Process32FirstW(IntPtr handle,ref Entry entry);
 [DllImport("kernel32.dll",CharSet=CharSet.Unicode)] static extern bool Process32NextW(IntPtr handle,ref Entry entry);
 [DllImport("kernel32.dll")] static extern bool CloseHandle(IntPtr handle);
 [DllImport("user32.dll")] static extern uint GetWindowThreadProcessId(IntPtr hwnd,out uint pid);
 delegate bool WindowCallback(IntPtr hwnd,IntPtr arg);
 [DllImport("user32.dll")] static extern bool EnumChildWindows(IntPtr hwnd,WindowCallback callback,IntPtr arg);
 public static Dictionary<uint,uint> Parents(){var result=new Dictionary<uint,uint>();var h=CreateToolhelp32Snapshot(2,0);if(h==new IntPtr(-1))return result;try{var e=new Entry{size=(uint)Marshal.SizeOf<Entry>()};if(Process32FirstW(h,ref e))do{result[e.pid]=e.parent;}while(Process32NextW(h,ref e));}finally{CloseHandle(h);}return result;}
 public static uint FromWindow(long hwnd){
  GetWindowThreadProcessId(new IntPtr(hwnd),out uint pid);if(pid==0)throw new Exception("ERR_SOURCE");
  if(Process.GetProcessById((int)pid).ProcessName.Equals("ApplicationFrameHost",StringComparison.OrdinalIgnoreCase)){
   uint child=0;EnumChildWindows(new IntPtr(hwnd),(w,_)=>{GetWindowThreadProcessId(w,out uint p);if(p!=0&&p!=pid){child=p;return false;}return true;},IntPtr.Zero);if(child!=0)pid=child;
  }
  var parents=Parents();var own=Identity(pid).Path;
  while(parents.TryGetValue(pid,out var parent)&&parent!=0){try{if(!Identity(parent).Path.Equals(own,StringComparison.OrdinalIgnoreCase))break;pid=parent;}catch{break;}}
  return pid;
 }
 public record Info(uint Pid,string Path,long Started);
 public static Info Identity(uint pid){using var p=Process.GetProcessById((int)pid);return new(pid,p.MainModule?.FileName??throw new Exception("ERR_SOURCE"),p.StartTime.ToUniversalTime().Ticks);}
 public static List<Info> Tree(uint root){
  var parents=Parents();var ids=new HashSet<uint>{root};bool added;do{added=false;foreach(var pair in parents)if(ids.Contains(pair.Value)&&ids.Add(pair.Key))added=true;}while(added);
  return ids.Select(pid=>{try{return Identity(pid);}catch{return null;}}).Where(p=>p!=null).Cast<Info>().ToList();
 }
 public static List<Info> AudioTree(uint root){
  var active=new HashSet<uint>();
  using var devices=new NAudio.CoreAudioApi.MMDeviceEnumerator();
  foreach(var device in devices.EnumerateAudioEndPoints(NAudio.CoreAudioApi.DataFlow.Render,NAudio.CoreAudioApi.DeviceState.Active)){
   using(device){try{using var sessions=device.AudioSessionManager.Sessions;for(int i=0;i<sessions.Count;i++){using var session=sessions[i];var pid=session.GetProcessID;if(pid!=0)active.Add(pid);}}catch{}}
  }
  return Tree(root).Where(p=>active.Contains(p.Pid)).GroupBy(p=>p.Path,StringComparer.OrdinalIgnoreCase).Select(g=>g.First()).ToList();
 }

 public static uint? Find(Info info){try{var p=Identity(info.Pid);if(p.Started==info.Started&&p.Path==info.Path)return p.Pid;}catch{}
  foreach(var p in Process.GetProcessesByName(System.IO.Path.GetFileNameWithoutExtension(info.Path)))try{var current=Identity((uint)p.Id);if(current.Path.Equals(info.Path,StringComparison.OrdinalIgnoreCase))return current.Pid;}catch{}finally{p.Dispose();}
  return null;
 }
}