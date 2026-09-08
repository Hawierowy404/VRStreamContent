# Przygotowanie wydania 1.1.2

## Co dostaje użytkownik

Cały plik ZIP Windows należy rozpakować do jednego folderu. Uruchamia się VRStreamConrtent.exe. Nie należy kopiować samego pliku EXE: obok znajdują się wymagane biblioteki. Pakiet zawiera Electron, FFmpeg i moduł dźwięku Windows. Jest przeznaczony dla Windows x64; nie jest aplikacją instalowaną na goglach Quest, macOS ani Linux.

Nadawca wybiera Ustawienia > YouTube > Połącz z YouTube i loguje się na własne konto w przeglądarce. Hasło Google nie jest wpisywane do naszej aplikacji. Każdy użytkownik ma własny kanał i lokalnie zaszyfrowane dane logowania. Następnie wybiera tytuł i ustawienie odbiorców, źródło obrazu oraz jakość. Rozpocznij live tworzy transmisję niepubliczną, a po potwierdzeniu jej uruchomienia przycisk Kopiuj link podaje adres oglądania na YouTube.

## Stan przygotowania

Kod i paczka są przygotowane do testów. Nie wykonano jeszcze rzeczywistego logowania Google, transmisji YouTube ani odbioru na PC i samodzielnym Queście. Nie publikować tej wersji jako gotowej integracji YouTube.

Przed wydaniem autor musi:

1. Wybrać adres kontaktowy, który Google pokaże użytkownikom. Nadawcy nadal korzystają z własnych kont.
2. Skonfigurować ekran zgody i klienta OAuth typu Desktop app, dodać konta testowe i przetestować logowanie. Nie jest potrzebny płatny serwer Google Cloud.
3. Przygotować i opublikować zgodną z rzeczywistym działaniem politykę prywatności oraz uzupełnić informacje wymagane przez Google. Adres ksawerak11@gmail.com został zatwierdzony. Regulamin i opis prywatności są w aplikacji i TERMS-AND-PRIVACY.md; nie opublikowano jeszcze strony wymaganej do weryfikacji Google.
4. Przejść procedury Google wymagane przed udostępnieniem logowania osobom spoza listy testerów. Samo zbudowanie programu nie znosi ograniczeń trybu testowego, limitów API ani wymagań kanału YouTube.
5. Wykonać test z rzeczywistym kanałem: logowanie, odłączenie, ponowne logowanie, brak uprawnień do live, rozpoczęcie, zmiana jakości, utrata połączenia i zatrzymanie. Sprawdzić link na PC i samodzielnym Queście w docelowym świecie; zmierzyć opóźnienie i stabilność dłuższej transmisji.

## Budowanie dla innych

`npm run build` buduje wersję rozwojową, która może nie mieć logowania YouTube. `npm run build:youtube` wymaga pliku `youtube-client.json` z konfiguracją klienta desktopowego autora i sprawdza składniki aplikacji. `npm run check:release` wykonuje tę kontrolę bez budowania. To kontrola plików, nie potwierdzenie weryfikacji Google ani test działania transmisji.

W GitHub Actions można uruchomić workflow ręcznie z opcją `youtube` i dodać do repozytorium sekret `YOUTUBE_DESKTOP_CLIENT_JSON`. Zawiera on wyłącznie konfigurację klienta Desktop pobraną z Google. Te metadane trafiają do aplikacji desktopowej; nie są tajnym kluczem serwerowym. Nie wpisywać tam tokenów użytkowników, hasła Google, klucza transmisji ani danych klienta typu Web.

Do GitHuba należy przekazać paczkę źródłową, a użytkownikom paczkę Windows. Prywatne dane z AppData nie mogą trafić do żadnej z nich. Publicznej publikacji na GitHubie nie wykonano.


## Regulamin i pomoc — 1.1.3

Tekst aplikacji opisuje aktualne przepływy danych, usługi zewnętrzne i lokalne dane, a nie obietnicę, że nic nie opuszcza PC. Klauzula odpowiedzialności zawiera ograniczenie do zakresu dozwolonego prawem i nie jest gwarancją ochrony przed roszczeniami. Przed publiczną publikacją autor powinien sprawdzić tekst pod kątem właściwego prawa i danych wydawcy; nie ustalono tutaj jego pełnej tożsamości prawnej ani jurysdykcji. Zmiana treści wymagająca ponownej zgody wymaga nowej VERSION w policy.cjs.

Discord: support.json zawiera zatwierdzone zaproszenie. Przycisk nie przesyła diagnostyki. Nowe języki: de, fr, ko, zh (chiński uproszczony), z grafikami flag działającymi w Windows.

Podstawa informacji: https://developers.google.com/terms/api-services-user-data-policy oraz https://developers.google.com/youtube/terms/developer-policies . Ograniczenia klauzul wyłączających odpowiedzialność zależą od prawa; przykładowe orzeczenie: https://decisions.scc-csc.ca/scc-csc/scc-csc/en/item/7843/index.do .
