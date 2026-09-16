# VRStreamContent 1.0.0

Rozpakuj cały ZIP i uruchom VRStreamContent.exe. Nie trzeba instalować Node.js, .NET, FFmpeg ani OBS.

Wybierz język w prawym górnym rogu, ekran lub okno, jakość i dźwięk. Rozpocznij transmisję, poczekaj na link i wklej go do odtwarzacza VRChat obsługującego AVPro / Live. W razie potrzeby włącz Allow Untrusted URLs. Światy publiczne mogą blokować domeny tunelu.

## Korekta dźwięku

Najpierw przetestuj 0 ms. Jeżeli dźwięk wyprzedza obraz o 2 sekundy, ustaw +2000 ms. Jeżeli spóźnia się o 2 sekundy, ustaw −2000 ms.

Zatrzymaj i ponownie rozpocznij transmisję po zmianie. Podgląd pokazuje obraz przed korektą. Zakres: od −10 do +10 sekund. Język i korekta są zapamiętywane.

Przy udostępnianiu całego ekranu słychać cały komputer — w tym własny odtwarzacz VRChat. Przy udostępnianiu okna słychać wybraną aplikację i jej procesy podrzędne; przeglądarka może obejmować także inne karty. Dźwięk pojedynczej aplikacji wymaga Windows 11 lub Windows Server od kompilacji 20348. W starszym Windows wyłącz dźwięk lub udostępnij cały ekran.

W trybie okna z dźwiękiem aplikacja losuje dodatkowe aktywne wyjście inne niż główne i przywraca poprzednie wyjście po live. Fizyczny dodatkowy głośnik nadal może być słyszalny. Jeśli nie ma dodatkowego urządzenia, przechwytywany jest tylko dźwięk aplikacji, ale lokalny odsłuch pozostaje. Niektóre aplikacje przyjmą nowe wyjście dopiero po ponownym rozpoczęciu odtwarzania.

Jeżeli przywrócenie wyjścia nie powiedzie się lub źródłowa aplikacja została zamknięta, program zachowa zapis do odzyskania i pokaże komunikat. Otwórz źródłową aplikację i VRStreamContent ponownie albo przywróć wyjście w mikserze Windows. Ręczne zmiany miksera podczas live nie są nadpisywane.

## GitHub

Wgraj zawartość paczki źródłowej do katalogu głównego repozytorium, razem z ukrytym folderem .github i plikiem .gitignore.

Workflow Windows build uruchomi testy i utworzy paczkę w Actions → wybrane uruchomienie → Artifacts. Gotowy ZIP możesz ręcznie dodać do GitHub Releases.

Program jest dla Windows x64. Nie ma danych przypisanych do jednego użytkownika ani wymaganych tajnych kluczy. Zgodność zależy od komputera, sieci i odtwarzacza VRChat. Cloudflare Quick Tunnel jest usługą testową; aplikacja nie ma podpisu cyfrowego.

Przed publicznym wydaniem sprawdź nową synchronizację na realnej transmisji w VRChat.


## Nowości 0.3.0

Aplikacja działa samodzielnie — ChatGPT i Codex nie muszą być uruchomione ani zainstalowane. Wymagany jest internet do tunelu.

Rozdzielczość: SD 480p, HD 720p, Full HD 1080p lub 2K/QHD 1440p. Osobno wybierasz 15, 30 lub 60 FPS. Wysokie ustawienia wymagają wydajnego komputera. Język, rozdzielczość, FPS i korekta są zapamiętywane.

Adres pojawia się podczas uruchamiania. Kopiowanie jest dostępne po pobraniu przez publiczny tunel prawidłowej playlisty i fragmentu wideo. Przy błędzie sprawdzanie jest ponawiane bez przerywania nagrywania. Czas zależy także od Cloudflare i sieci.

Program utrzymuje klatki również dla statycznego okna i może pracować zminimalizowany. Samego udostępnianego okna najlepiej nie minimalizować — niektóre programy przestają wtedy odświeżać obraz.

Jeśli live znów się zatrzyma, kliknij **Kopiuj diagnostykę** i prześlij skopiowany tekst. Log pomaga odróżnić brak obrazu, zatrzymanie kodowania i problem z tunelem.

## Nowości 0.5.0

Podczas live możesz zmienić rozdzielczość i FPS, a następnie kliknąć **Zastosuj jakość podczas live**. Link pozostaje ten sam. Odtwarzacz może na chwilę buforować.

Gotowy ZIP Windows działa bez ChatGPT i bez instalowania .NET. Do samodzielnego budowania kodu z GitHuba potrzebne są Node.js 24 i .NET 10 SDK.

## Nowy interfejs i Info

Trzy kroki: wybierz obraz, ustaw jakość i udostępnij link. Przycisk Info obok języka otwiera instrukcję bez internetu, dostępną po polsku, angielsku, rosyjsku i japońsku. Zawiera szybki start i siedem tematów. Korekta synchronizacji oraz diagnostyka są w rozwijanych ustawieniach dodatkowych. Otwieranie Info nie przerywa live. W programie i w Windows zastosowano nowe logo oraz ikonę dostarczone przez właściciela.

## Poprawka 0.5.1

Błąd zmiany głośnika nie zatrzymuje już dźwięku ani obrazu. Live kontynuuje przechwytywanie wybranej aplikacji, a program wyświetla ostrzeżenie o lokalnym odsłuchu. Zmiana wyjścia korzysta z właściwej sesji dźwiękowej, co ma znaczenie np. w Operze. Raport diagnostyczny zawiera etap i kod błędu Windows. Logo PNG jest przezroczyste; usunięto czarne tło ustawiane przez interfejs.

## Oglądanie w wersji 1.0.0

1. Zostaw aplikację otwartą i rozpocznij live.
2. Poczekaj na potwierdzenie publicznego dostępu.
3. W przeglądarce użyj przycisku **Podgląd online**, a następnie odtwarzania.
4. Do zgodnego odtwarzacza VRChat wklej adres z **Kopiuj link**. To osobny adres .m3u8, nie strona podglądu.
5. Zamknięcie aplikacji lub zakończenie live unieważnia link. Kolejny live dostaje nowy adres.

Jeśli program zgłasza problem lokalnego DNS, strumień może być dostępny online, ale ten komputer nie rozpoznaje domeny. Sprawdź DNS, VPN i filtry sieci. Program nie zmienia ustawień sieci Windows. Takiego problemu nie naprawi zmiana rozdzielczości.
