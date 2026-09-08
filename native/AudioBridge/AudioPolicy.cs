using System.Runtime.InteropServices;
// ABI slots and interface IDs are documented by the MIT-licensed EarTrumpet project.
// Raw IInspectable calls avoid depending on .NET's removed built-in WinRT projections.
interface IAudioPolicy {string? Get(uint pid,int role);void Set(uint pid,int role,string? value); }
sealed unsafe class AudioPolicy : IDisposable, IAudioPolicy {
 IntPtr factory;
 [DllImport("combase.dll")] static extern int RoInitialize(uint mode);
 [DllImport("combase.dll")] static extern int WindowsCreateString([MarshalAs(UnmanagedType.LPWStr)] string value,uint length,out IntPtr str);
 [DllImport("combase.dll")] static extern int WindowsDeleteString(IntPtr str);
 [DllImport("combase.dll")] static extern IntPtr WindowsGetStringRawBuffer(IntPtr str,out uint length);
 [DllImport("combase.dll")] static extern int RoGetActivationFactory(IntPtr classId,ref Guid iid,out IntPtr factory);
 public AudioPolicy(){
  RoInitialize(1);const string name="Windows.Media.Internal.AudioPolicyConfig";
  Marshal.ThrowExceptionForHR(WindowsCreateString(name,(uint)name.Length,out var cls));
  try{int hr=-1;foreach(var id in new[]{"ab3d4648-e242-459f-b02f-541c70306324","2a59116d-6c4f-45e0-a74f-707e3fef9258"}){var guid=new Guid(id);hr=RoGetActivationFactory(cls,ref guid,out factory);if(hr>=0)return;}Marshal.ThrowExceptionForHR(hr);}finally{WindowsDeleteString(cls);}
 }
 IntPtr Slot(int slot)=>Marshal.ReadIntPtr(Marshal.ReadIntPtr(factory),slot*IntPtr.Size);
 public string? Get(uint pid,int role){
  IntPtr value=IntPtr.Zero;
  int hr=((delegate* unmanaged[Stdcall]<IntPtr,uint,int,int,IntPtr*,int>)Slot(26))(factory,pid,0,role,&value);
  if(hr<0){var error=Marshal.GetExceptionForHR(hr)!;error.Data["operation"]="get-output";error.Data["role"]=role;error.Data["pid"]=pid;throw error;}
  try{if(value==IntPtr.Zero)return null;var pointer=WindowsGetStringRawBuffer(value,out var length);return length==0?null:Marshal.PtrToStringUni(pointer,(int)length);}finally{WindowsDeleteString(value);}
 }
 public void Set(uint pid,int role,string? value){
  IntPtr h=IntPtr.Zero;
  if(!string.IsNullOrEmpty(value))Marshal.ThrowExceptionForHR(WindowsCreateString(value,(uint)value.Length,out h));
  try{int hr=((delegate* unmanaged[Stdcall]<IntPtr,uint,int,int,IntPtr,int>)Slot(25))(factory,pid,0,role,h);if(hr<0){var error=Marshal.GetExceptionForHR(hr)!;error.Data["operation"]="set-output";error.Data["role"]=role;throw error;}}finally{WindowsDeleteString(h);}
 }
 public static string Endpoint(string id)=>@"\\?\SWD#MMDEVAPI#"+id+"#{e6327cad-dcec-4949-ae8a-991e976a79d2}";
 public void Dispose(){if(factory!=IntPtr.Zero){Marshal.Release(factory);factory=IntPtr.Zero;}}
}
