---
title: Privacy policy and terms — VRStreamContent
---

# VRStreamContent — Privacy policy and terms

[Back to the application](index.html)

Last updated: 19 September 2026. This policy describes VRStreamContent's desktop application and this documentation website. This online revision expands the Google/YouTube data disclosures; an older installed application may display an earlier version of the text.

## Your responsibility

VRStreamContent shares video and audio. You are responsible for your content, necessary rights, consent from people whose data or voice you share, and compliance with law and service rules, including YouTube and VRChat. Do not use the app to violate other people’s rights.

## Author’s liability

Use the app at your own risk. To the extent permitted by applicable law, the author is not liable for unlawful user actions or damage caused by misuse. The app is provided without a guarantee of uninterrupted operation, third-party service availability or specific latency. This does not exclude liability that cannot legally be excluded or your statutory rights.

## Local storage

Settings, accepted terms version and acceptance date are stored locally. YouTube credentials (tokens and channel name) are stored locally with Windows encryption; the app does not store your Google password. Diagnostics stay in memory and are copied to the clipboard only when you click Copy diagnostics. They may include timestamps, technical settings, errors and device names; review before sharing. Windows/Electron may also create local caches and logs.

## Streaming uses the internet

Not all data stays local: video and audio are sent to YouTube or through localhost.run / Cloudflare to viewers. These services also receive connection data such as your IP address and process it under their own policies. Tunnel mode writes temporary media segments locally and removes them on normal shutdown; they may remain after a crash. Anyone with the link can watch, record or share it. A link is not a password or access control.


## Google user data accessed

VRStreamContent uses YouTube API Services and requests the OAuth permission `https://www.googleapis.com/auth/youtube.force-ssl`. This permission allows management of YouTube data; the application uses it for the live-streaming operations described below. Signing in takes place on Google's website. VRStreamContent does not receive your Google password and does not access Gmail, Google Drive or Google contacts.

With your authorization, the application receives:

- OAuth access and refresh tokens, their expiry information and related authorization metadata.
- Your channel's metadata returned by the YouTube channels API, including its identifier and snippet (such as channel title and thumbnail information). The channel title is retained locally to identify the connected channel; other returned channel metadata is not deliberately saved to the account file.
- Broadcast and stream identifiers, titles, broadcast settings (including privacy, audience and latency settings), scheduled start time, broadcast lifecycle/status, the YouTube viewing URL, and ingestion information including the private stream key and RTMPS server address.
- The screen or application-window video and audio you choose to transmit. This media is captured on your computer and uploaded to YouTube when you start a YouTube live stream.

## How Google user data is used

Tokens authorize API requests and renew access without requiring you to sign in for every stream. The channel title identifies the connected channel in the interface. Broadcast and stream data is used to create an unlisted broadcast, configure it, connect it to an upload stream, check its status, display a viewing link, and stop or clean up the broadcast. The private stream key and server address are passed to the local encoder so that it can send your selected video and audio to YouTube.

The application does not use Google user data for advertising, profiling, sale, or training AI or machine-learning models. VRStreamContent's use and transfer to any other app of information received from Google APIs will adhere to the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including its Limited Use requirements.

## Sharing, transfer and disclosure of Google user data

The desktop application communicates directly with Google/YouTube to authenticate, operate broadcasts and upload media. Google/YouTube receives the authorization requests, broadcast information and selected media required for those operations, as well as connection information such as your IP address. Google processes this information under its [Privacy Policy](https://policies.google.com/privacy).

The author does not operate a server that receives your Google tokens, channel information, private stream keys or transmitted media. These Google account credentials are not sent to GitHub, Discord, Cloudflare or localhost.run by the YouTube integration. Alternative tunnel streaming sends selected media through the selected tunnel provider; it is a separate streaming path, not a destination for Google account credentials.

When you share a viewing link, viewers (including people using a VRChat video player) can access the broadcast subject to YouTube's playback rules. An unlisted link can be forwarded, and viewers may record the content. It is not password protection.

Support is voluntary: opening the Discord support link does not upload data. If you manually send a report, screenshot, viewing link or account information, the recipients and the messaging/email provider receive what you send. Review it first and never send tokens or private stream keys. Such messages are subject to the recipient service's storage and deletion controls. The author may see aggregate API project statistics supplied by Google, rather than the contents of your account through an author-operated data collection service.

## Protection of sensitive data

OAuth tokens and the saved channel title are stored in the application's local `youtube-account.bin` file, encrypted through Electron safeStorage using Windows protection. The application refuses to save account credentials when that encryption facility is unavailable; it does not fall back to a plaintext account file.

Authentication uses PKCE and a randomly generated state value. Its temporary callback listener is bound to the local computer at `127.0.0.1` and closed after authentication or timeout. Token, API and revocation requests use HTTPS. YouTube media upload uses RTMPS (TLS). Tokens are handled by the application's main process rather than exposed through its account-status interface.

Private stream keys are used by the local encoder during streaming and are not saved in the encrypted account file. Technical API error logging records the operation, HTTP status and a filtered error reason rather than the complete API response. These protections do not make a compromised computer secure: other software with sufficient access to your Windows session or processes may access sensitive information. Protect your computer and do not share its application-data files.

## Retention and deletion of Google user data

- **Saved account credentials and channel title:** retained locally so the connection can be reused, until you disconnect the YouTube account in the application or remove the local application data. Access tokens have an expiry time, but the saved account file is not automatically deleted on that expiry; the refresh token is used to renew access.
- **Disconnecting:** the application removes its local account file and temporary account file and attempts to revoke the refresh token with Google. If revocation fails, remove VRStreamContent access in [Google account permissions](https://myaccount.google.com/permissions). Revoking permission on Google's website prevents further authorized access but does not itself erase files already on your computer; also disconnect in the application.
- **Broadcast information and private stream key:** used in memory by the application/encoder during the streaming session, not deliberately retained in the account file. Closing the application ends those processes; this is not a guarantee of secure erasure from operating-system memory or crash records.
- **YouTube broadcasts and recordings:** stopping a live stream attempts to complete the broadcast and remove the upload-stream resource. A broadcast that has not started may be deleted during cleanup. Completed broadcasts/recordings can remain on YouTube, and failed cleanup or a crash may leave resources there. Disconnecting the account does not delete those videos. Review, end or delete broadcasts and recordings in [YouTube Studio](https://studio.youtube.com/); Google controls retention on its services.
- **Local diagnostics:** the application's diagnostic buffer is kept in memory and contains up to 160 recent entries. Copying a report places it in the system clipboard; clipboard history or messages you send can retain that copy independently of the application. Windows/Electron may also retain caches or logs. Removing the app alone may leave its local data; remove the application's user-data folder if you want that local data deleted.

The author has no remote access to delete account files on your computer or videos in your YouTube account. For help with these steps or a request concerning information you voluntarily sent to support, contact [hawierowsky@gmail.com](mailto:hawierowsky@gmail.com). Do not include credentials in your request.

## YouTube service terms

The integration uses YouTube API Services. With your permission it reads your channel and manages broadcasts on your account: creates unlisted lives, binds streams and ends broadcasts. Titles, settings and content go to Google/YouTube. Recordings may remain on YouTube after streaming stops. Disconnect account removes local tokens and attempts to revoke Google access; if this fails, remove access in your [Google account settings](https://myaccount.google.com/permissions). This does not delete YouTube recordings; manage them in [YouTube Studio](https://studio.youtube.com/). After a crash or stop error, check that the broadcast has ended there. Using the integration subjects you to [YouTube’s Terms of Service](https://www.youtube.com/t/terms) and [Google’s Privacy Policy](https://policies.google.com/privacy).

## Author access and support

This version has no author-operated server collecting user accounts, tokens or streams, and does not automatically send diagnostics to the author. The author may see aggregate API project usage statistics provided by Google. If you share a report or link on Discord, recipients receive that information and Discord processes it under its own policies. The support button only opens Discord; it sends nothing automatically. Author contact: [hawierowsky@gmail.com](mailto:hawierowsky@gmail.com).

## Settings and safety

Screen sharing may expose all visible windows and PC audio; a browser window may include audio from other tabs. Audio routing is restored after live, but an error may require manual correction in Windows Volume Mixer. Flashing themes can trigger seizures or discomfort; avoid them if sensitive. Escape stops the effect. You can reopen these terms in the app.

## Updates

Optional update checks contact the public GitHub API for the entered repository. GitHub receives connection data such as IP; no YouTube tokens or diagnostics are sent. Automatic checks are off by default.

## This documentation website

This documentation is hosted by GitHub Pages. GitHub may receive connection data when you visit it; see [GitHub’s privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).

## Other service policies

[localhost.run security](https://localhost.run/docs/security/) · [Cloudflare privacy](https://www.cloudflare.com/privacypolicy/)
