# VRStreamContent — Terms and privacy

Version: 2026-09-07.1

## Odpowiedzialność użytkownika

VRStreamContent służy do udostępniania obrazu i dźwięku. Odpowiadasz za wybór treści, zgodę osób, których dane lub głos udostępniasz, posiadanie wymaganych praw oraz przestrzeganie prawa i zasad usług, w tym YouTube i VRChat. Nie używaj aplikacji do naruszania cudzych praw.

## Ograniczenia odpowiedzialności autora

Korzystasz z aplikacji na własne ryzyko. W zakresie dozwolonym przez obowiązujące prawo autor nie odpowiada za bezprawne działania użytkowników ani za szkody wynikające z niewłaściwego użycia aplikacji. Aplikacja jest udostępniana bez gwarancji nieprzerwanego działania, dostępności usług zewnętrznych ani określonego opóźnienia. Ten zapis nie wyłącza odpowiedzialności, której prawo nie pozwala wyłączyć, ani ustawowych praw użytkownika.

## Co pozostaje na komputerze

Ustawienia, wersja zaakceptowanego regulaminu i data akceptacji są zapisywane lokalnie. Dane logowania YouTube (tokeny i nazwa kanału) są przechowywane lokalnie w postaci szyfrowanej przez Windows. Aplikacja nie zapisuje hasła Google. Raport diagnostyczny jest utrzymywany w pamięci i trafia do schowka dopiero po kliknięciu „Kopiuj diagnostykę”. Może zawierać czasy, parametry techniczne, błędy i nazwy urządzeń; sprawdź go przed wysłaniem. Windows/Electron może tworzyć lokalne pliki pamięci podręcznej i dzienniki.

## Transmisja korzysta z internetu

Nie wszystkie dane pozostają lokalne: obraz i dźwięk są przesyłane do YouTube albo przez localhost.run / Cloudflare do widzów. Usługi te otrzymują również dane połączenia, np. adres IP, i przetwarzają je według własnych zasad. W trybie tunelu tymczasowe fragmenty obrazu i dźwięku powstają na komputerze i są usuwane przy normalnym zakończeniu; po awarii mogą pozostać. Każdy, kto posiada link, może oglądać, nagrywać i przekazać go dalej. Link nie jest hasłem ani kontrolą dostępu.

## Konto YouTube i usuwanie danych

Integracja korzysta z YouTube API Services. Po Twojej zgodzie aplikacja odczytuje kanał i zarządza transmisjami na Twoim koncie: tworzy niepubliczny live, wiąże strumień i kończy transmisję. Tytuł, ustawienia i treść trafiają do Google/YouTube. Zapis transmisji może pozostać na YouTube po zakończeniu live. Przycisk „Odłącz konto” usuwa lokalne tokeny i próbuje cofnąć zgodę Google; w razie błędu usuń dostęp w ustawieniach konta Google. Nie usuwa to nagrań na YouTube — zarządzaj nimi w YouTube Studio. Po awarii lub błędzie zakończenia sprawdź tam, czy live został zakończony. Używając integracji, podlegasz Warunkom korzystania z YouTube i Polityce prywatności Google (linki poniżej).

## Dostęp autora i kontakt

Ta wersja nie ma serwera autora zbierającego konta, tokeny ani transmisje użytkowników i nie wysyła autorowi automatycznie diagnostyki. Autor może widzieć zbiorcze statystyki użycia projektu API udostępniane przez Google. Jeśli sam prześlesz link lub raport na Discordzie, odbiorcy otrzymają te informacje, a Discord przetwarza je według własnych zasad. Przycisk pomocy tylko otwiera Discord — niczego sam nie wysyła. Kontakt autora: hawierowsky@gmail.com.

## Ustawienia i bezpieczeństwo

Pełny ekran może ujawnić wszystkie widoczne okna i dźwięki PC; okno przeglądarki może obejmować dźwięk innych kart. Zmiana wyjścia audio jest przywracana po live, ale po błędzie może wymagać korekty w mikserze Windows. Migające motywy mogą wywołać napad padaczkowy lub dyskomfort — nie włączaj ich przy nadwrażliwości. Escape wyłącza efekt. Regulamin można ponownie otworzyć w aplikacji.

---

## Your responsibility

VRStreamContent shares video and audio. You are responsible for your content, necessary rights, consent from people whose data or voice you share, and compliance with law and service rules, including YouTube and VRChat. Do not use the app to violate other people’s rights.

## Author’s liability

Use the app at your own risk. To the extent permitted by applicable law, the author is not liable for unlawful user actions or damage caused by misuse. The app is provided without a guarantee of uninterrupted operation, third-party service availability or specific latency. This does not exclude liability that cannot legally be excluded or your statutory rights.

## Local storage

Settings, accepted terms version and acceptance date are stored locally. YouTube credentials (tokens and channel name) are stored locally with Windows encryption; the app does not store your Google password. Diagnostics stay in memory and are copied to the clipboard only when you click Copy diagnostics. They may include timestamps, technical settings, errors and device names; review before sharing. Windows/Electron may also create local caches and logs.

## Streaming uses the internet

Not all data stays local: video and audio are sent to YouTube or through localhost.run / Cloudflare to viewers. These services also receive connection data such as your IP address and process it under their own policies. Tunnel mode writes temporary media segments locally and removes them on normal shutdown; they may remain after a crash. Anyone with the link can watch, record or share it. A link is not a password or access control.

## YouTube account and deletion

The integration uses YouTube API Services. With your permission it reads your channel and manages broadcasts on your account: creates unlisted lives, binds streams and ends broadcasts. Titles, settings and content go to Google/YouTube. Recordings may remain on YouTube after streaming stops. Disconnect account removes local tokens and attempts to revoke Google access; if this fails, remove access in your Google account settings. This does not delete YouTube recordings; manage them in YouTube Studio. After a crash or stop error, check that the broadcast has ended there. Using the integration subjects you to YouTube’s Terms of Service and Google’s Privacy Policy, linked below.

## Author access and support

This version has no author-operated server collecting user accounts, tokens or streams, and does not automatically send diagnostics to the author. The author may see aggregate API project usage statistics provided by Google. If you share a report or link on Discord, recipients receive that information and Discord processes it under its own policies. The support button only opens Discord; it sends nothing automatically. Author contact: hawierowsky@gmail.com.

## Settings and safety

Screen sharing may expose all visible windows and PC audio; a browser window may include audio from other tabs. Audio routing is restored after live, but an error may require manual correction in Windows Volume Mixer. Flashing themes can trigger seizures or discomfort; avoid them if sensitive. Escape stops the effect. You can reopen these terms in the app.

Links: https://www.youtube.com/t/terms • https://policies.google.com/privacy • https://myaccount.google.com/permissions • https://studio.youtube.com/ • https://localhost.run/docs/security/ • https://www.cloudflare.com/privacypolicy/


## Aktualizacje / Updates (2026-09-07.1)

Opcjonalne sprawdzanie aktualizacji łączy się z publicznym API GitHub dla wpisanego repozytorium. GitHub otrzymuje dane połączenia, np. IP; aplikacja nie wysyła tam tokenów YouTube ani diagnostyki. Automatyczne sprawdzanie jest domyślnie wyłączone.

Optional update checks contact the public GitHub API for the entered repository. GitHub receives connection data such as IP; no YouTube tokens or diagnostics are sent. Automatic checks are off by default.

https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement
