# Third-party components

Electron retains its MIT license and bundled Chromium/Node notices. Keep LICENSE and LICENSES.chromium.html from the runtime. Source: https://github.com/electron/electron

ffmpeg-static 5.2.0 is GPL-3.0-or-later. Source: https://github.com/eugeneware/ffmpeg-static/tree/v5.2.0

The supplied FFmpeg 6.0 Windows essentials binary is GPL v3, built by gyan.dev. Preserve node_modules/ffmpeg-static/ffmpeg.exe.LICENSE and ffmpeg.exe.README, which include source revision and build information. FFmpeg revision: https://github.com/FFmpeg/FFmpeg/commit/ea3d24bbe3 . Build provider: https://www.gyan.dev/ffmpeg/builds/

cloudflared 2026.8.3 is Apache-2.0. Source and component notices: https://github.com/cloudflare/cloudflared/tree/2026.8.3

Other npm components retain the licenses in their package directories. The supplied PNG logo and ICO application icon are copied unchanged from owner-provided files. The project owner determines the license for original code and artwork before publishing.


NAudio.Wasapi / NAudio.Core 3.0.0: MIT, copyright Mark Heath 2026. Source: https://github.com/naudio/NAudio/tree/23922d2a87cf9508883a939af8b1495a0d35cb5a . Preserve licenses/NAudio-MIT.txt.

.NET 10 runtime and System.Numerics.Tensors: Microsoft, MIT; preserve the runtime LICENSE.txt and ThirdPartyNotices.txt in bin/audio. Source: https://github.com/dotnet/runtime .

AudioPolicy uses independently implemented raw Windows ABI calls; interface IDs and method ordering were researched in EarTrumpet (MIT): https://github.com/File-New-Project/EarTrumpet . No EarTrumpet binary is bundled.

hls.js 1.7.2 is Apache-2.0, copyright Dailymotion and contributors. Bundled runtime license: node_modules/hls.js/LICENSE. Source: https://github.com/video-dev/hls.js . The browser player serves the bundled library from the same tunnel, without a third-party script CDN.
