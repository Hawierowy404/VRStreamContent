# VRStreamConrtent

Windows screen/window sharing with audio, unlisted YouTube broadcasts and an optional HTTPS HLS tunnel for compatible VRChat live players. Version **1.4.0**. Languages: Polish, English, Russian, Japanese, German, French, Korean and Simplified Chinese.

## YouTube integration preview

Settings now includes Connect YouTube and a stream destination selector. The app creates unlisted broadcasts and places the YouTube watch URL in the existing Copy link field. Every broadcaster connects their own account. **The local Windows test build now includes the publisher Desktop OAuth configuration. Google currently limits login to test users. Real sign-in and YouTube/VRChat playback tests are still required before public release.** See [YOUTUBE-SETUP.md](YOUTUBE-SETUP.md).

## Use

### New in 1.4.0

Click another source tile during a live to change the shared screen/window without creating a new broadcast or link. A short playback pause is possible. If the replacement cannot be opened, the old source remains active. If audio setup fails after replacement begins, the app stops with an error rather than broadcasting unrelated sound.

The stream volume slider changes only the audience audio, and keeps its level through mute/unmute and source changes. Expand Speakers and audio output during a live to choose a device, then use the separate app or Windows output button. App routing requires a shared window with audio. Previous outputs are restored after the live; later changes made outside this app are preserved. Windows output changes refresh full-screen capture. Devices marked with a star are the Windows multimedia default.

Choose YouTube latency before starting a broadcast with the three-position slider: ultra-low, low or normal. Up to 1080p supports all modes, 1440p supports low/normal, and 4K requires normal. Raising resolution adjusts the slider to a compatible mode. The choice is saved locally and locked during a live. The app cannot change the VRChat world's playback buffer or guarantee an exact delay in seconds. Starting in ultra-low mode requires a new live to move above 1080p.

The dark studio layout has a larger preview, violet accents and subtle animations that respect reduced-motion settings.

Extract the entire Windows ZIP and run **VRStreamConrtent.exe**. End users do not need Node.js, .NET, OBS, FFmpeg or cloudflared installed separately.

Select a screen/window, quality and computer audio. Click Start streaming, wait for the stream-ready status, then paste it into a compatible VRChat player in Live / Stream mode. Viewers may need Allow Untrusted URLs; some public worlds restrict custom domains.

Language and theme are available in Settings. Preferences are remembered locally. Stop or close the app to end capture and the broadcast.

## Standalone app and stream settings

The portable Windows app runs independently and requires internet access to the selected streaming provider.

Resolution and frame rate are separate: SD 480p (854×480), HD 720p, Full HD 1080p, 2K/QHD 1440p (2560×1440), and 4K/UHD 2160p (3840×2160), each with 15, 30 or 60 FPS. During a live, select new settings and click **Apply quality during live**. Quality changes retain the broadcast link but may cause brief buffering. YouTube 4K starts in normal latency mode; a live started below 4K must be restarted to enable 4K. High resolutions and frame rates require substantial CPU and upload capacity.

Quality presets, an audio meter, live mute, duration, encoder FPS and connection status are available on the main screen. Status describes the encoder and service checks, not delay at a viewer. Global shortcuts: Ctrl+Alt+M to mute/unmute, Ctrl+Alt+End to stop. YouTube encoder failures retry up to three times using the same broadcast and link.

Updates are optional: enter the publisher's GitHub repository in Settings after it exists. Startup checks are disabled by default. Checks contact GitHub; the download button opens the release page and never installs or runs files automatically.

Tunnel startup runs in parallel with capture preparation. Copying becomes available after an HTTPS request through the public tunnel retrieves a valid HLS playlist and MPEG-TS media. Failed checks retry without stopping recording. Online preview opens a separate browser player; the .m3u8 link is for compatible VRChat players. Local DNS failure is reported distinctly if a scoped HTTPS DNS check can still verify the public stream. No Windows DNS settings are changed. Provider startup time still varies.

## Window capture and stability

A fixed-size canvas keeps sending frames when the selected window is static, and normalizes source size changes. Silent system audio is kept active. The broadcaster app can be minimized without throttling its capture timers.

Keep the shared source window restored: some Windows apps stop rendering when minimized. The stream can preserve the last frame, but cannot make another app render fresh content. Closing the source ends capture with an explicit message. The app never automatically switches from a selected window to the whole desktop.

If a problem recurs, click **Copy diagnostics** and include the copied text in a bug report. The in-memory log contains pipeline/encoder/tunnel events; it excludes media and window titles, and redacts local paths and stream URLs.

## Synchronization

Start at **0 ms**. The encoder follows source timestamps and compensates for audio timestamp gaps and drift. Capture uses the selected height and an independent 15 / 30 / 60 FPS setting.

- Audio **ahead** of the picture: positive correction, e.g. **+2000 ms**.
- Audio **behind** the picture: negative correction, e.g. **−2000 ms**.

Range: ±10 seconds. Stop and restart after changing the setting. Positive values delay audio; negative values delay video. The muted preview shows the source before correction. Check synchronization in the receiving player.

## Requirements and limitations

Windows 10/11 x64, an active desktop session, internet access, and adequate CPU/upload capacity. There is no macOS/Linux build.

Screen capture includes all PC audio. Window capture uses Windows process-loopback for the selected application and its child processes; it never falls back to system-wide audio. This requires Windows 11 or Windows Server build 20348+. Browsers may include other tabs in the same application tree. Microphone capture is not implemented.

With window audio enabled, the app chooses a random active output other than the main multimedia output, saves the application’s previous mixer outputs, and restores them when the live ends. It does not change the system default output. An additional physical speaker can still be audible. If no extra output exists, application-only capture remains enabled without rerouting. Some applications may need playback restarted to adopt a changed mixer output.

A recovery journal handles interrupted shutdown. If the source application has already closed or Windows rejects restoration, the app reports the problem and keeps the journal. Reopen the source application and VRStreamConrtent to retry, or restore its output in Windows Volume Mixer. Manual mixer changes made during a live are preserved.

Live support depends on the player and world. Unity players do not support this live stream. Quest compatibility requires a test in the chosen world. Not every computer, network or world can be guaranteed compatible.

Quick Tunnels are a Cloudflare test service without uptime guarantees. Links change at each start. DNS filtering, firewalls or VPNs can prevent access. Anyone with the URL can watch; Cloudflare relays the media. Several seconds of HLS latency are normal.

Protected/minimized windows may show black video. Growing drift may indicate CPU overload: try 720p. Windows builds are unsigned.

## Build from source

Install Node.js 24 and .NET 10 SDK on Windows, then run:

```sh
npm ci
npm run setup
npm test
npm start
npm run build
```

The result is **release/VRStreamConrtent-win32-x64**. Distribute the whole folder as a ZIP.

Setup downloads missing tools. The package lock fixes npm dependencies. Downloaded binaries, caches and builds are excluded from Git. The included GitHub Actions workflow tests and builds a Windows artifact on pushes, pull requests and manual runs, without repository secrets. It does not publish a release automatically.

## Verification

Tests check real WebM→HLS encoding, restricted HTTP file access, synchronization across an audio timestamp gap, positive/negative offsets and translation completeness. UI checked in all four languages. The user confirmed the previous live transport; new end-to-end timing inside VRChat still needs validation.

## References

- https://creators.vrchat.com/worlds/udon/video-players/
- https://www.electronjs.org/docs/latest/api/desktop-capturer/
- https://ffmpeg.org/ffmpeg-resampler.html
- https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/

See INSTRUKCJA-PL.md and THIRD-PARTY-NOTICES.md.


## Interface and help

The interface follows three steps: choose a source, select quality, and share the link. Info, beside the language selector, opens an offline guide in all four languages. It includes quick start and seven expandable topics. Advanced synchronization and diagnostics are grouped under More settings & help. Opening the guide does not stop a stream. The Windows icon and in-app logo use the owner-supplied ICO and PNG files.

## Audio routing fallback (0.5.1)

The selected application audio is captured independently of speaker rerouting. Routing uses actual audio-session processes rather than the browser window process. If Windows rejects a mixer change, partial changes are rolled back and the live continues with application-only audio and a visible warning. This never falls back to all PC audio. Native diagnostics include the failing stage, operation and HRESULT. The in-app PNG logo remains transparent, without a CSS background.

## Keeping the link active

Keep the broadcaster app and live running. Closing the app invalidates the stream; the same old link will not work after restarting. Use Online preview in a browser and Copy link for VRChat. A browser opening a bare .m3u8 file may download it instead of playing it. Local DNS, VPN or filtering can still prevent a particular device from opening an otherwise working public hostname; resolve the indicated network issue on that device. The app does not promise compatibility with every VRChat world or network.

## Tunnel update (1.0.1)

The default is localhost.run over the Windows OpenSSH client. If OpenSSH is absent, Cloudflare is used. SSH uses no personal keys or agent and stores its server fingerprint in the app-owned temporary root. Free localhost.run tunnels have speed limits and changing addresses; high resolution / FPS is not guaranteed. Connection loss triggers up to three reconnect attempts. A replacement link must be pasted into VRChat again. Ordinary DNS must work before Copy becomes enabled; a diagnostic DNS fallback is never enough. No Windows DNS settings are changed.

Public / Group Public instances additionally require the world creator to allow the domain. Other instances require Allow Untrusted URLs and a compatible AVPro live player.

Validation: synthetic 480p30 HLS decoded through localhost.run in Chromium with ordinary DNS, plus automated encoder and HTTP tests. Playback in a specific VRChat world is not yet verified.

## Latency update (1.0.2)

The live playlist now retains six one-second segments instead of twelve. The browser preview targets two HLS target durations behind live and catches up beyond three. Old segments cannot re-enter the playlist after trimming. VRChat player buffering and provider throughput still determine end-to-end latency; no fixed latency is guaranteed.



Pierwsze uruchomienie pokazuje regulamin i prywatność. Akceptacja jest lokalna; można odmówić i zamknąć aplikację. Regulamin jest też dostępny w stopce. W Ustawieniach dostępne są PL, EN, RU, JA, DE, FR, KO i chiński uproszczony. Przy diagnostyce znajduje się zatwierdzony link Discord.
