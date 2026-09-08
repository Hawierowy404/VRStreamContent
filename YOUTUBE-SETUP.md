# YouTube mode (1.1.2)

This build implements desktop Google OAuth with PKCE, automatic unlisted broadcast creation, encrypted RTMPS ingestion, and the existing Copy link/Open preview controls. A channel account is connected in Settings. The user chooses a title and whether the content is made for kids. The app checks the actual visibility returned by YouTube; it never silently falls back to public broadcasts. Low-latency preference is requested to allow the existing 1440p and live quality controls. Actual player latency and PC/Quest compatibility still require a real end-to-end test.

## Publisher setup, once for the distributed app

1. Enable YouTube Data API v3 in the publisher's Google project. No virtual machine is required.
2. Configure Google Auth Platform branding, contact details and consent screen. For personal testing use External/Testing and add the intended test users. Publishing for arbitrary users requires completing Google's applicable OAuth verification, public privacy policy and consent requirements. Testing is not a public plug-and-play release; test refresh tokens may expire after seven days.
3. Create an OAuth client of type **Desktop app**, not Web application, API key or service account.
4. Save the downloaded desktop-client JSON as `youtube-client.json` next to `main.cjs` BEFORE building. Desktop client metadata is shipped to every installation and is not a confidential server credential. Never use a web-client secret or embed user access/refresh tokens. The clean GitHub export excludes the local client JSON; provide the publisher configuration separately when producing the public Windows build.
5. Each user enables live streaming on their channel if needed (first activation may take up to 24 hours), then signs in using Settings > YouTube. The browser consent screen is controlled by Google. Never ask users to share passwords, stream keys or token files.

The scope is `https://www.googleapis.com/auth/youtube.force-ssl`, required for the live API. The application uses it only to list the user's channel, create its own broadcasts/streams, bind them and stop/clean up those created resources. The app does not read Gmail or Google Drive. Desktop authorization uses a short-lived localhost listener, unpredictable state and PKCE S256. Tokens are stored using Electron safeStorage in the current Windows user's app-data directory, never in the application folder, renderer or diagnostics. Disconnect removes the local token and attempts Google revocation; if offline, the UI explains how to revoke access manually.

## Live lifecycle

Start creates an unlisted broadcast and a non-reusable stream, binds them, then encodes H264/AAC to YouTube's RTMPS destination. The watch URL appears in the existing link field; copying is enabled only after YouTube reports the broadcast live and still unlisted. Quality changes restart the encoder with the same stream/broadcast. Stop ends the encoder and requests completion of the broadcast. A recording may remain on YouTube: manage it in YouTube Studio. The application does not delete finished recordings. On connection loss during Stop, the user is told to check Studio; after an application/PC crash, also check Studio for a remaining live session (auto-stop is disabled to permit live quality changes).

No third-party server or tunnel receives the YouTube-mode stream. Existing tunnel mode remains available. YouTube moderation, channel eligibility, quota and content restrictions still apply to unlisted streams. Do not assume this works for content YouTube blocks.

## Validation

Automated tests cover OAuth state/PKCE callbacks, token refresh and local removal, unlisted visibility enforcement, startup cancellation, stable broadcast identity across quality changes, and stopping. FFmpeg was separately tested with local generated video/audio through the actual FLV H264/AAC arguments. Those are not real YouTube or VRChat playback tests. Google client configuration, real sign-in/consent and a test broadcast are still needed before marking this integration ready for distribution.

References:
- https://developers.google.com/identity/protocols/oauth2/native-app
- https://developers.google.com/youtube/v3/live/guides/implementation/broadcasts-and-streams
- https://developers.google.com/youtube/v3/live/docs/liveBroadcasts/insert
- https://support.google.com/youtube/answer/2474026
