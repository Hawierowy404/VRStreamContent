# Weryfikacja 1.0.0

- 17 testów automatycznych: kodeki, synchronizacja, ustawienia, HLS, awarie i odzyskiwanie publicznego dostępu, DNS, przeglądarkowy podgląd.
- Rzeczywisty tunel Cloudflare z kontrolowanym obrazem i tonem testowym: publiczna playlista oraz fragment MPEG-TS pobrane przez HTTPS.
- Rzeczywiste odtwarzanie przez publiczny adres w Chromium: 854×480, currentTime 7,06 s, 37 zdekodowanych klatek, readyState 4.
- Lokalny DNS w środowisku testowym zwracał ENOTFOUND. Weryfikacja użyła DNS-over-HTTPS, zachowując oryginalną domenę i weryfikację certyfikatu TLS. Test przeglądarkowy użył mapowania DNS tylko w swoim procesie; ustawienia Windows nie były zmieniane. To nie potwierdza działania DNS każdego odbiorcy.
- Po zamknięciu testowej transmisji ten sam publiczny adres zwrócił HTTP 530, zgodnie z oczekiwaniem.
- Nie uruchamiano konkretnego świata VRChat. Zgodność wymaga odtwarzacza AVPro obsługującego live i zaakceptowania domeny przez świat.

# Poprawka audio 0.5.1

Odtworzono błąd starej ścieżki: get-output dla procesu okna kończył się HRESULT 0x80070057. Nowa ścieżka wybiera proces faktycznej sesji audio. W środowisku testowym Windows odrzucił zapis wyjścia kodem 0x80070005; aplikacja poprawnie kontynuowała dźwięk wybranego procesu, wyświetliła ostrzeżenie i usunęła zakończony dziennik przywracania.

Sprawdzono pełne uruchomienie pomocnika dla rzeczywistego okna Chromium: stan ready, przesyłanie próbek i zamknięcie z przywracaniem. Ponowiono test izolacji dwóch procesów 440/880 Hz: 5,03 s próbek, amplituda wybranego 440 Hz 0,05; drugi sygnał niewykrywalny. Testy przywracania ustawień przechodzą. Nie testowano rzeczywistej sesji użytkownika w Operze ani odbioru VRChat. Przezroczystość PNG potwierdzono odczytem kanału alfa; zmiana tła dotyczy wyłącznie CSS.

# Wydanie 1.4.0

Suwak trybu opóźnienia YouTube: ultraLow / low / normal, zapamiętywany lokalnie, zablokowany podczas live. Testy sprawdzają wszystkie dozwolone kombinacje, odrzucanie niezgodnych ustawień przed utworzeniem transmisji i dokładne przekazanie wybranego trybu do API. Sprawdzono również 8 języków. Łącznie 19 testów dotyczących YouTube, zgody i nowych trybów zaliczonych w tej zmianie. W makiecie przeglądarkowej potwierdzono etykiety bardzo niskie/niskie i przejście do normalnego przy 4K. Brak nowego pomiaru opóźnienia rzeczywistej transmisji.

8 września 2026: odczyt konsoli Google potwierdził status Testowanie, niekompletną konfigurację i zablokowany przycisk publikacji. Publiczna strona aplikacji, polityka prywatności i domeny są niewypełnione. Nie przełączano OAuth do produkcji, nie wykonywano płatności ani publicznego wdrożenia. Paczka nie usuwa ograniczenia do testerów Google.

# Wydanie 1.3.1

Podgląd bez rozciągania do wysokości ustawień. Oddzielny dolny panel audio i przyciski Zastosuj dźwięk / Zastosuj wideo. Głośność jest robocza do kliknięcia zastosowania; przełączanie źródła zachowuje zastosowany stan dźwięku. Test sprawdza brak zmiany głośności przed kliknięciem, zastosowanie bez restartu źródła oraz osobne włączenie/wyłączenie audio. Sprawdzono osiem języków i regresję zmiany źródła. W makiecie przeglądarkowej sprawdzono aktywowanie przycisku po zmianie suwaka i potwierdzenie zastosowania. Końcowy live w VRChat nie był wykonywany.

# Wydanie 1.3.0

Zmiana okna podczas live zachowuje istniejącą transmisję; testy sprawdzają przełączenie i odmowę nowego źródła bez utraty starego. Suwak 0–100% oraz zachowanie poziomu po wyciszeniu sprawdzono na rzeczywistym sygnale WebAudio w lokalnej makiecie, bez lokalnego odsłuchu. Odczyt urządzeń Windows i wywołanie zmiany domyślnego wyjścia z przywróceniem wszystkich trzech ról przeszły rzeczywisty test na tym komputerze. Test nie zmieniał urządzenia multimedialnego na inne. Przywracanie wielu ręcznych zmian aplikacji sprawdzono z atrapą miksera.

YouTube: do 1080p ultraLow, 1440p low, 4K normal; ograniczenia zmian w trakcie live sprawdzają testy. Nie zmierzono jeszcze rzeczywistego opóźnienia po tej zmianie ani nie wykonano końcowego odsłuchu po przełączeniu Opery/Discorda w VRChat. Zmniejszenie bufora po stronie świata VRChat nie jest funkcją tej aplikacji.

# Interfejs 0.5.0

Sprawdzono cztery języki, wybór źródła, siedem tematów tutorialu, przewijanie, zamykanie Escape i przywracanie fokusu. Otwarcie Info zachowuje stan live. Układ sprawdzono przy szerokości 1180 i 900 pikseli. Zrzuty interfejsu używały kontrolowanych miniatur testowych, bez przechwytywania prywatnych okien. Przesłane ICO i PNG zachowano bez zmian.

# Weryfikacja wydania 0.4.0

Przeprowadzone 5 września 2026:
- 14 testów automatycznych: kodowanie H264/AAC, synchronizacja, wszystkie 12 kombinacji rozdzielczości/FPS, serwer HLS, zmiana generacji kodowania bez zmiany adresu, numeracja segmentów i nieciągłości, komunikaty i cztery języki.
- Rzeczywisty test Electron: przejście SD/15 FPS → HD/60 FPS, restart MediaRecorder, ciągłość HLS i aktywny dźwięk przez AudioWorklet; 548 wygenerowanych klatek. Źródłem był kontrolowany obraz testowy, a okno testu pozostawało ukryte.
- Rzeczywisty test Windows process-loopback: dwa oddzielne procesy nadawały 440 Hz i 880 Hz do wyjścia wirtualnego. Przechwytywanie pierwszego odebrało 440 Hz (amplituda 0,05), bez wykrywalnego 880 Hz (poniżej 0,000001); 5,02 s próbek. Dodatkowy wirtualny kabel służył wyłącznie temu testowi, nie jest wymagany przez aplikację.
- Moduł przywracania wyjść: testy z atrapą miksera sprawdziły dokładne przywracanie, ustawienie domyślne, zachowanie ręcznych zmian, częściowy błąd zapisu i odzyskiwanie po restarcie.
- Odczyt rzeczywistych aktywnych wyjść Windows i bieżącego przypisania wyjścia przez AudioPolicy.
- Sprawdzenie interfejsu: polski, angielski, rosyjski, japoński, logo, tytuł, zapamiętanie języka, brak poziomego przewijania.
- Samodzielny moduł Windows skompilowany z dołączonym środowiskiem .NET.

Granice weryfikacji:
Nie przeprowadzono tutaj końcowego odsłuchu i oglądania w VRChat ani zmiany miksera rzeczywistego Discorda/Opery. Przywracanie miksera sprawdzono automatycznie na atrapach; rzeczywisty odczyt API Windows działa. Dźwięk pojedynczej aplikacji wymaga Windows 11 lub Windows Server od kompilacji 20348. Aplikacje z ochroną treści mogą blokować obraz lub dźwięk. Nie omijamy zabezpieczeń treści.

Uruchomienie testów z kodu:
npm test
npm run test:live
bin/audio/VRStreamAudio.exe selftest native-test

W tym środowisku izolowane testy Electron wymagały --no-sandbox --disable-gpu. Zwykłe wydanie zachowuje sandbox i nie używa tych przełączników.


1.1.3: 31 testów Node zaliczonych. Dodatkowo sprawdzono lokalną makietę przeglądarkową: pierwsze uruchomienie, brak domyślnej zgody, zmiana języka w regulaminie, flagi, cztery nowe języki, jasne/ciemne menu. Zgoda w makiecie dotyczy tylko testowej pamięci przeglądarki. Test rzeczywistego logowania YouTube i live na VRChat PC/Quest pozostaje niewykonany.

1.1.5: nowe testy adresów RTMPS i bezpiecznej diagnostyki; 33 testy łącznie. Lokalna makieta sprawdzona: czerwony Połącz z YouTube -> zielony Podłączone -> czerwony po odłączeniu, nowa sekcja Info. Rzeczywisty live na kanale użytkownika po poprawce wymaga sprawdzenia; stare logi ERR_YT_API nie zawierały dokładnej przyczyny.

## 1.2.0 — 7 września 2026
37 testów automatycznych zaliczonych: 15 kombinacji rozdzielczości/FPS (w tym 4K), dekodowanie H264, odtwarzanie HLS, synchronizacja, YouTube/OAuth, ponawianie tego samego live, zgoda, osiem języków, bezpieczne sprawdzanie aktualizacji i telemetria. Dodatkowo rzeczywisty FFmpeg przekodował testowy obraz i dźwięk WebM do FLV H264/AAC; wynik pomyślnie zdekodowano lokalnie.
W lokalnej makiecie przeglądarkowej sprawdzono wybór profilu 4K/60 i informację o opóźnieniu. Rzeczywisty WebAudio z testowym sygnałem potwierdził działanie miernika, wyciszenia i ponownego włączenia dźwięku, bez lokalnego odsłuchu. Nie uruchamiano stroboskopu.
Nie wykonano końcowego live na YouTube/VRChat PC/Quest ani testu globalnych skrótów w zainstalowanej aplikacji. Konto użytkownika wymagało aktywacji live. 4K w YouTube używa normalnego opóźnienia. Repozytorium GitHub jeszcze nie istnieje; adres aktualizacji pozostaje do wpisania w ustawieniach. Ta paczka nadal jest wydaniem testowym.
