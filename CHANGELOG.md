# 1.0.0

- Verify public HTTPS playlist and media before enabling stream-link copying.
- Retry public failures without stopping recording; distinguish local DNS failure.
- Add a self-hosted browser HLS player via Online preview; keep the VRChat .m3u8 URL separate.
- Confirm that ending the broadcaster closes public access.

# 0.5.1

- Fix window audio startup failing when the window process has no mixer entry; route actual audio-session processes.
- Roll back failed mixer changes and continue process-only capture with a warning.
- Add native failure-stage and HRESULT diagnostics and real Chromium-window audio regression test.
- Remove CSS black background behind the already-transparent PNG logo.
- Disable quality Apply when resolution and FPS have not changed.

# 0.5.0

- Minimal three-step interface, contextual audio hints and collapsed advanced settings.
- Offline Info tutorial beside the language selector, in Polish, English, Russian and Japanese.
- Owner-supplied Windows ICO and in-app PNG logo.
- Keyboard-accessible dialog with Escape, scrolling and focus return.

# 0.4.0

- Live resolution/FPS changes preserve the URL and tunnel using HLS discontinuities.
- Window audio captures only the selected process tree. Full-screen audio remains system-wide.
- Random nondefault application output with persisted restoration and crash recovery.
- Bundled self-contained Windows audio helper; no .NET install required for end users.
- Polish, English, Russian and Japanese messages updated.

# 0.3.0

- Independent SD/HD/Full HD/QHD resolution and 15/30/60 FPS selectors.
- Steady video frames for static windows, fixed output geometry, continuous silent audio.
- Background capture timers stay active while the broadcaster is minimized; prevent idle suspension during live capture.
- Parallel tunnel/capture preparation and one-second HLS segments.
- Early copyable link with a starting indicator; local DNS checks no longer terminate an established stream.
- Consistent playlist response lengths during atomic updates.
- Explicit capture errors, stall/reconnect warnings, and redacted diagnostic copying.
- Polish, English, Russian and Japanese UI preserved.


## 1.1.3
- First-launch terms and privacy notice in eight languages, explicit local versioned acceptance before capture or YouTube login. Reopen from the footer.
- Discord support link beside diagnostics, no automatic report submission.
- German, French, Korean and Simplified Chinese translations, local country flag graphics and keyboard-accessible theme-aware language menus.
- Privacy help distinguishes local settings from outgoing live media and YouTube recordings.


## 1.1.4
- Updated the author contact in all eight versions of the terms and privacy notice to hawierowsky@gmail.com.


## 1.1.5
- Fixed rejection of YouTube RTMPS ingestion addresses on rtmps.youtube.com. Added regression coverage using the documented server format.
- Added safe YouTube API failure diagnostics (operation, HTTP status, known reason only). No response bodies, credentials or ingestion keys logged.
- YouTube connect button is red when disconnected and green with Connected when connected.
- Rewrote the Info quick start, troubleshooting and latency explanation for YouTube in all eight languages, without AI attribution.


## 1.1.6
- Added a prominent first-live channel activation notice to Info and YouTube settings in all eight languages, including verification, up to 24 hours of waiting, countdown guidance and a YouTube Studio button. Expanded the channel-permission error with the same next steps.


## 1.1.7
- Added a separate RGB theme with smoothly changing glowing borders on dark surfaces. Respects reduced motion; Escape turns it off.
- Renamed the previous rainbow theme to Strobe in all eight languages. Existing warning and opt-in on each launch retained.
- Includes the first-live activation instructions from 1.1.6.


## 1.2.0
- Added 4K 2160p at 15/30/60 FPS and weak/standard/best/manual quality profiles. YouTube 4K uses normal latency; a lower-resolution low-latency live must be restarted to enable 4K.
- Read-only YouTube live-permission check before creating a broadcast or requesting capture.
- Live audio meter and mute gain, timer and encoder-reported FPS; health reflects recent encoder progress and service status.
- Global Ctrl+Alt+M mute and Ctrl+Alt+End stop shortcuts, with conflict notice.
- Bounded YouTube encoder recovery reuses the existing stream/broadcast; tunnel already retries connections.
- Optional GitHub Releases checks with configurable repository, startup opt-in and update banner. Downloads require a user click. No repository is configured yet.
