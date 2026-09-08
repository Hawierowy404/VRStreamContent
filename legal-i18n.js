const legalDocuments={
  "pl": [
    [
      "Odpowiedzialność użytkownika",
      "VRStreamConrtent służy do udostępniania obrazu i dźwięku. Odpowiadasz za wybór treści, zgodę osób, których dane lub głos udostępniasz, posiadanie wymaganych praw oraz przestrzeganie prawa i zasad usług, w tym YouTube i VRChat. Nie używaj aplikacji do naruszania cudzych praw."
    ],
    [
      "Ograniczenia odpowiedzialności autora",
      "Korzystasz z aplikacji na własne ryzyko. W zakresie dozwolonym przez obowiązujące prawo autor nie odpowiada za bezprawne działania użytkowników ani za szkody wynikające z niewłaściwego użycia aplikacji. Aplikacja jest udostępniana bez gwarancji nieprzerwanego działania, dostępności usług zewnętrznych ani określonego opóźnienia. Ten zapis nie wyłącza odpowiedzialności, której prawo nie pozwala wyłączyć, ani ustawowych praw użytkownika."
    ],
    [
      "Co pozostaje na komputerze",
      "Ustawienia, wersja zaakceptowanego regulaminu i data akceptacji są zapisywane lokalnie. Dane logowania YouTube (tokeny i nazwa kanału) są przechowywane lokalnie w postaci szyfrowanej przez Windows. Aplikacja nie zapisuje hasła Google. Raport diagnostyczny jest utrzymywany w pamięci i trafia do schowka dopiero po kliknięciu „Kopiuj diagnostykę”. Może zawierać czasy, parametry techniczne, błędy i nazwy urządzeń; sprawdź go przed wysłaniem. Windows/Electron może tworzyć lokalne pliki pamięci podręcznej i dzienniki."
    ],
    [
      "Transmisja korzysta z internetu",
      "Nie wszystkie dane pozostają lokalne: obraz i dźwięk są przesyłane do YouTube albo przez localhost.run / Cloudflare do widzów. Usługi te otrzymują również dane połączenia, np. adres IP, i przetwarzają je według własnych zasad. W trybie tunelu tymczasowe fragmenty obrazu i dźwięku powstają na komputerze i są usuwane przy normalnym zakończeniu; po awarii mogą pozostać. Każdy, kto posiada link, może oglądać, nagrywać i przekazać go dalej. Link nie jest hasłem ani kontrolą dostępu."
    ],
    [
      "Konto YouTube i usuwanie danych",
      "Integracja korzysta z YouTube API Services. Po Twojej zgodzie aplikacja odczytuje kanał i zarządza transmisjami na Twoim koncie: tworzy niepubliczny live, wiąże strumień i kończy transmisję. Tytuł, ustawienia i treść trafiają do Google/YouTube. Zapis transmisji może pozostać na YouTube po zakończeniu live. Przycisk „Odłącz konto” usuwa lokalne tokeny i próbuje cofnąć zgodę Google; w razie błędu usuń dostęp w ustawieniach konta Google. Nie usuwa to nagrań na YouTube — zarządzaj nimi w YouTube Studio. Po awarii lub błędzie zakończenia sprawdź tam, czy live został zakończony. Używając integracji, podlegasz Warunkom korzystania z YouTube i Polityce prywatności Google (linki poniżej)."
    ],
    [
      "Dostęp autora i kontakt",
      "Ta wersja nie ma serwera autora zbierającego konta, tokeny ani transmisje użytkowników i nie wysyła autorowi automatycznie diagnostyki. Autor może widzieć zbiorcze statystyki użycia projektu API udostępniane przez Google. Jeśli sam prześlesz link lub raport na Discordzie, odbiorcy otrzymają te informacje, a Discord przetwarza je według własnych zasad. Przycisk pomocy tylko otwiera Discord — niczego sam nie wysyła. Kontakt autora: hawierowsky@gmail.com."
    ],
    [
      "Ustawienia i bezpieczeństwo",
      "Pełny ekran może ujawnić wszystkie widoczne okna i dźwięki PC; okno przeglądarki może obejmować dźwięk innych kart. Zmiana wyjścia audio jest przywracana po live, ale po błędzie może wymagać korekty w mikserze Windows. Migające motywy mogą wywołać napad padaczkowy lub dyskomfort — nie włączaj ich przy nadwrażliwości. Escape wyłącza efekt. Regulamin można ponownie otworzyć w aplikacji."
    ]
  ],
  "en": [
    [
      "Your responsibility",
      "VRStreamConrtent shares video and audio. You are responsible for your content, necessary rights, consent from people whose data or voice you share, and compliance with law and service rules, including YouTube and VRChat. Do not use the app to violate other people’s rights."
    ],
    [
      "Author’s liability",
      "Use the app at your own risk. To the extent permitted by applicable law, the author is not liable for unlawful user actions or damage caused by misuse. The app is provided without a guarantee of uninterrupted operation, third-party service availability or specific latency. This does not exclude liability that cannot legally be excluded or your statutory rights."
    ],
    [
      "Local storage",
      "Settings, accepted terms version and acceptance date are stored locally. YouTube credentials (tokens and channel name) are stored locally with Windows encryption; the app does not store your Google password. Diagnostics stay in memory and are copied to the clipboard only when you click Copy diagnostics. They may include timestamps, technical settings, errors and device names; review before sharing. Windows/Electron may also create local caches and logs."
    ],
    [
      "Streaming uses the internet",
      "Not all data stays local: video and audio are sent to YouTube or through localhost.run / Cloudflare to viewers. These services also receive connection data such as your IP address and process it under their own policies. Tunnel mode writes temporary media segments locally and removes them on normal shutdown; they may remain after a crash. Anyone with the link can watch, record or share it. A link is not a password or access control."
    ],
    [
      "YouTube account and deletion",
      "The integration uses YouTube API Services. With your permission it reads your channel and manages broadcasts on your account: creates unlisted lives, binds streams and ends broadcasts. Titles, settings and content go to Google/YouTube. Recordings may remain on YouTube after streaming stops. Disconnect account removes local tokens and attempts to revoke Google access; if this fails, remove access in your Google account settings. This does not delete YouTube recordings; manage them in YouTube Studio. After a crash or stop error, check that the broadcast has ended there. Using the integration subjects you to YouTube’s Terms of Service and Google’s Privacy Policy, linked below."
    ],
    [
      "Author access and support",
      "This version has no author-operated server collecting user accounts, tokens or streams, and does not automatically send diagnostics to the author. The author may see aggregate API project usage statistics provided by Google. If you share a report or link on Discord, recipients receive that information and Discord processes it under its own policies. The support button only opens Discord; it sends nothing automatically. Author contact: hawierowsky@gmail.com."
    ],
    [
      "Settings and safety",
      "Screen sharing may expose all visible windows and PC audio; a browser window may include audio from other tabs. Audio routing is restored after live, but an error may require manual correction in Windows Volume Mixer. Flashing themes can trigger seizures or discomfort; avoid them if sensitive. Escape stops the effect. You can reopen these terms in the app."
    ]
  ],
  "ru": [
    [
      "Ваша ответственность",
      "VRStreamConrtent передаёт изображение и звук. Вы отвечаете за контент, необходимые права, согласие людей, чьи данные или голос передаёте, соблюдение закона и правил YouTube и VRChat. Не нарушайте чужие права."
    ],
    [
      "Ответственность автора",
      "Вы используете приложение на свой риск. В пределах, разрешённых законом, автор не отвечает за незаконные действия пользователей и ущерб от неправильного использования. Непрерывная работа, доступность сторонних сервисов и определённая задержка не гарантируются. Это не исключает ответственность, которую нельзя исключить по закону, и ваши законные права."
    ],
    [
      "Локальные данные",
      "Настройки, версия условий и дата согласия сохраняются локально. Токены YouTube и имя канала хранятся локально с шифрованием Windows. Пароль Google не сохраняется. Диагностика хранится в памяти и копируется в буфер только по нажатию кнопки; она может содержать время, технические параметры, ошибки и имена устройств. Проверьте отчёт перед отправкой. Windows/Electron также могут создавать локальные журналы и кэш."
    ],
    [
      "Данные в интернете",
      "Изображение и звук передаются в YouTube либо через localhost.run / Cloudflare зрителям. Эти сервисы получают данные соединения, например IP-адрес, согласно своим политикам. В режиме туннеля временные медиафрагменты сохраняются локально и удаляются при нормальном завершении; после сбоя они могут остаться. Любой обладатель ссылки может смотреть, записывать и пересылать её. Ссылка не является паролем."
    ],
    [
      "YouTube и удаление данных",
      "Интеграция использует YouTube API Services. С вашего разрешения она читает канал, создаёт трансляции по ссылке, связывает потоки и завершает эфиры. Название, настройки и контент передаются Google/YouTube. Запись может остаться на YouTube. Отключение аккаунта удаляет локальные токены и пытается отозвать доступ Google; при ошибке удалите доступ в настройках Google. Записи YouTube этим не удаляются: управляйте ими в YouTube Studio. После сбоя проверьте завершение эфира там. Действуют Условия YouTube и Политика конфиденциальности Google по ссылкам ниже."
    ],
    [
      "Автор и поддержка",
      "В этой версии нет сервера автора для сбора аккаунтов, токенов или трансляций. Отчёты не отправляются автору автоматически. Google может показывать автору сводную статистику проекта API. Отправив ссылку или отчёт в Discord, вы передаёте их получателям и Discord согласно его правилам. Кнопка поддержки только открывает Discord и ничего не отправляет. Контакт: hawierowsky@gmail.com."
    ],
    [
      "Настройки и безопасность",
      "Весь экран может раскрыть другие окна и все звуки ПК; браузер — звук других вкладок. После эфира аудиовыход восстанавливается, но при ошибке настройте микшер Windows вручную. Мигающие темы могут вызвать приступ или дискомфорт; не включайте их при чувствительности. Escape выключает эффект. Условия можно открыть повторно."
    ]
  ],
  "ja": [
    [
      "利用者の責任",
      "VRStreamConrtentは映像と音声を共有します。配信内容、必要な権利、個人情報や音声を共有する相手の同意、法律およびYouTube・VRChatの規則の遵守は利用者の責任です。他者の権利を侵害しないでください。"
    ],
    [
      "作者の責任の制限",
      "自己の責任で利用してください。適用法で認められる範囲で、作者は利用者の違法行為や誤用による損害の責任を負いません。連続稼働、外部サービスの可用性、特定の遅延は保証しません。法律で免除できない責任や利用者の法的権利を排除するものではありません。"
    ],
    [
      "ローカル保存",
      "設定、同意した規約の版と日時は端末に保存します。YouTubeのトークンとチャンネル名はWindowsで暗号化してローカル保存します。Googleのパスワードは保存しません。診断情報はメモリに保持し、コピー操作時だけクリップボードに入れます。時刻、技術情報、エラー、機器名を含む場合があるので送信前に確認してください。Windows/Electronもローカルのログやキャッシュを作成する場合があります。"
    ],
    [
      "インターネットへの送信",
      "すべてが端末内に留まるわけではありません。映像と音声はYouTube、またはlocalhost.run / Cloudflare経由で視聴者に送信されます。各サービスはIPアドレスなどの接続情報も独自の方針で処理します。トンネルでは一時的なメディア断片を端末に保存し、正常終了時に削除しますが、異常終了後は残る場合があります。リンクを知る人は視聴、録画、再共有できます。リンクはパスワードではありません。"
    ],
    [
      "YouTubeとデータ削除",
      "YouTube API Servicesを使用します。許可後にチャンネルを読み取り、限定公開配信の作成、ストリームの関連付け、配信終了を行います。タイトル、設定、映像・音声はGoogle/YouTubeに送られます。終了後もYouTubeに録画が残る場合があります。接続解除はローカルトークンを削除しGoogleの許可取消を試みます。失敗時はGoogleアカウント設定で解除してください。YouTube上の録画は削除されません。YouTube Studioで管理し、異常終了時は配信が終了したか確認してください。連携には下記のYouTube利用規約とGoogleプライバシーポリシーが適用されます。"
    ],
    [
      "作者への情報と問い合わせ",
      "本バージョンにアカウント、トークン、配信を収集する作者のサーバーはなく、診断情報を作者に自動送信しません。作者はGoogleが提供するAPIプロジェクトの集計利用統計を確認できる場合があります。Discordにリンクや報告を送ると、受信者とDiscordに情報が渡ります。サポートボタンはDiscordを開くだけで、自動送信しません。連絡先：hawierowsky@gmail.com。"
    ],
    [
      "設定と安全",
      "画面共有は他のウィンドウやPC全体の音声を含み、ブラウザーは他のタブの音声を含む場合があります。配信後に音声出力を戻しますが、失敗時はWindowsミキサーで修正してください。点滅は発作や不快感を起こす可能性があり、敏感な方は使わないでください。Escapeで停止できます。規約はアプリから再表示できます。"
    ]
  ],
  "de": [
    [
      "Deine Verantwortung",
      "VRStreamConrtent überträgt Bild und Ton. Du bist für Inhalte, erforderliche Rechte, die Zustimmung betroffener Personen sowie die Einhaltung von Gesetzen und Dienstregeln einschließlich YouTube und VRChat verantwortlich. Verletze keine Rechte anderer."
    ],
    [
      "Haftung des Autors",
      "Die Nutzung erfolgt auf eigenes Risiko. Soweit gesetzlich zulässig, haftet der Autor nicht für rechtswidrige Handlungen der Nutzer oder Schäden durch missbräuchliche Nutzung. Unterbrechungsfreier Betrieb, Verfügbarkeit fremder Dienste und eine bestimmte Verzögerung werden nicht garantiert. Gesetzlich zwingende Haftung und deine gesetzlichen Rechte bleiben unberührt."
    ],
    [
      "Lokale Speicherung",
      "Einstellungen, akzeptierte Regelversion und Zeitpunkt werden lokal gespeichert. YouTube-Token und Kanalname werden lokal mit Windows verschlüsselt; dein Google-Passwort wird nicht gespeichert. Diagnoseberichte bleiben im Arbeitsspeicher und werden erst auf Knopfdruck in die Zwischenablage kopiert. Sie können Zeitangaben, technische Einstellungen, Fehler und Gerätenamen enthalten. Prüfe sie vor dem Versenden. Windows/Electron kann lokale Protokolle und Caches erzeugen."
    ],
    [
      "Übertragung im Internet",
      "Bild und Ton werden an YouTube oder über localhost.run / Cloudflare an Zuschauer gesendet. Diese Dienste verarbeiten auch Verbindungsdaten wie die IP-Adresse nach ihren eigenen Regeln. Im Tunnelmodus werden temporäre Mediensegmente lokal gespeichert und bei regulärem Beenden gelöscht; nach Abstürzen können sie bleiben. Jeder mit dem Link kann ansehen, aufzeichnen und weitergeben. Der Link ist kein Passwort."
    ],
    [
      "YouTube und Löschung",
      "Die Integration nutzt YouTube API Services. Mit deiner Erlaubnis liest sie deinen Kanal, erstellt nicht gelistete Übertragungen, verknüpft Streams und beendet Übertragungen. Titel, Einstellungen und Inhalte gehen an Google/YouTube. Aufzeichnungen können nach dem Ende auf YouTube bleiben. Konto trennen löscht lokale Token und versucht, die Google-Freigabe zu widerrufen. Bei Fehlern entferne den Zugriff im Google-Konto. YouTube-Aufzeichnungen werden dadurch nicht gelöscht; verwalte sie in YouTube Studio. Prüfe dort nach einem Absturz das Ende der Übertragung. Es gelten die unten verlinkten YouTube-Bedingungen und die Google-Datenschutzerklärung."
    ],
    [
      "Autor und Hilfe",
      "Diese Version hat keinen Server des Autors zum Sammeln von Konten, Token oder Streams und versendet keine Diagnoseberichte automatisch. Google kann dem Autor zusammengefasste API-Nutzungsstatistiken zeigen. Sendest du einen Bericht oder Link über Discord, erhalten die Empfänger diese Daten; Discord verarbeitet sie nach eigenen Regeln. Der Hilfeknopf öffnet nur Discord und sendet nichts. Kontakt: hawierowsky@gmail.com."
    ],
    [
      "Einstellungen und Sicherheit",
      "Der ganze Bildschirm kann andere Fenster und alle PC-Töne offenlegen; ein Browser kann Ton anderer Tabs enthalten. Die Audioausgabe wird nach dem Stream wiederhergestellt, bei Fehlern eventuell manuell im Windows-Mixer. Blinkende Designs können Anfälle oder Unwohlsein auslösen; bei Empfindlichkeit nicht aktivieren. Escape beendet den Effekt. Die Bedingungen bleiben in der App abrufbar."
    ]
  ],
  "fr": [
    [
      "Votre responsabilité",
      "VRStreamConrtent partage l’image et le son. Vous êtes responsable du contenu, des droits nécessaires, du consentement des personnes dont vous partagez les données ou la voix, et du respect des lois et des règles de YouTube et VRChat. Ne portez pas atteinte aux droits d’autrui."
    ],
    [
      "Responsabilité de l’auteur",
      "Vous utilisez l’application à vos risques. Dans les limites autorisées par la loi, l’auteur ne répond pas des actes illégaux des utilisateurs ni des dommages liés à une mauvaise utilisation. Le fonctionnement continu, la disponibilité des services tiers et une latence précise ne sont pas garantis. Ceci n’exclut aucune responsabilité légalement obligatoire ni vos droits légaux."
    ],
    [
      "Stockage local",
      "Les réglages, la version des conditions acceptées et la date sont conservés localement. Les jetons YouTube et le nom de chaîne sont chiffrés par Windows et stockés sur le PC ; le mot de passe Google n’est pas enregistré. Les diagnostics restent en mémoire et ne sont copiés dans le presse-papiers que sur demande. Ils peuvent inclure horaires, paramètres techniques, erreurs et noms d’appareils. Vérifiez-les avant envoi. Windows/Electron peut créer des journaux et caches locaux."
    ],
    [
      "Transmission sur internet",
      "L’image et le son sont transmis à YouTube ou aux spectateurs via localhost.run / Cloudflare. Ces services reçoivent aussi des données de connexion, dont l’adresse IP, selon leurs propres politiques. Le tunnel écrit des fragments temporaires sur le PC, supprimés à la fermeture normale mais pouvant subsister après un incident. Toute personne disposant du lien peut regarder, enregistrer et le partager. Le lien n’est pas un mot de passe."
    ],
    [
      "YouTube et suppression",
      "L’intégration utilise YouTube API Services. Avec votre autorisation, elle consulte la chaîne, crée des directs non répertoriés, associe les flux et termine les directs. Titres, réglages et contenu sont transmis à Google/YouTube. Les enregistrements peuvent rester sur YouTube. Déconnecter le compte supprime les jetons locaux et tente de révoquer l’accès Google ; en cas d’échec, retirez l’accès dans votre compte Google. Cela ne supprime pas les vidéos YouTube : gérez-les dans YouTube Studio. Après un incident, vérifiez-y que le direct est terminé. Les Conditions YouTube et la Politique de confidentialité Google ci-dessous s’appliquent."
    ],
    [
      "Auteur et assistance",
      "Cette version n’a pas de serveur de l’auteur collectant comptes, jetons ou directs et n’envoie pas automatiquement de diagnostics. Google peut fournir à l’auteur des statistiques agrégées du projet API. Si vous envoyez un rapport ou un lien sur Discord, les destinataires reçoivent ces informations et Discord les traite selon ses règles. Le bouton d’aide ouvre seulement Discord, sans rien envoyer. Contact : hawierowsky@gmail.com."
    ],
    [
      "Réglages et sécurité",
      "Le partage d’écran peut révéler toutes les fenêtres et tous les sons du PC ; un navigateur peut inclure d’autres onglets audio. La sortie audio est rétablie après le direct, mais une erreur peut nécessiter une correction dans le mélangeur Windows. Les thèmes clignotants peuvent provoquer crises ou inconfort : évitez-les si vous y êtes sensible. Échap arrête l’effet. Ces conditions restent consultables dans l’application."
    ]
  ],
  "ko": [
    [
      "사용자 책임",
      "VRStreamConrtent는 영상과 소리를 공유합니다. 콘텐츠, 필요한 권리, 개인정보나 음성을 공유하는 사람의 동의, 법률 및 YouTube·VRChat 규칙 준수는 사용자의 책임입니다. 타인의 권리를 침해하지 마세요."
    ],
    [
      "개발자 책임의 제한",
      "사용은 본인의 책임하에 이루어집니다. 관련 법률이 허용하는 범위에서 개발자는 사용자의 불법 행위나 오용으로 인한 손해에 책임을 지지 않습니다. 중단 없는 작동, 외부 서비스 가용성 또는 특정 지연 시간을 보장하지 않습니다. 법적으로 배제할 수 없는 책임이나 사용자의 법적 권리는 제한하지 않습니다."
    ],
    [
      "로컬 저장",
      "설정, 동의한 약관 버전과 날짜는 로컬에 저장됩니다. YouTube 토큰과 채널 이름은 Windows로 암호화하여 PC에 저장하며 Google 비밀번호는 저장하지 않습니다. 진단은 메모리에 보관하고 복사 버튼을 눌렀을 때만 클립보드에 넣습니다. 시간, 기술 설정, 오류, 장치 이름이 포함될 수 있으므로 전송 전에 확인하세요. Windows/Electron도 로컬 로그와 캐시를 만들 수 있습니다."
    ],
    [
      "인터넷 전송",
      "모든 데이터가 PC에만 남는 것은 아닙니다. 영상과 소리는 YouTube 또는 localhost.run / Cloudflare를 통해 시청자에게 전송됩니다. 이 서비스는 IP 주소 등 연결 정보를 각자의 정책에 따라 처리합니다. 터널 모드는 임시 미디어 파일을 PC에 저장하고 정상 종료 시 삭제하지만 충돌 후 남을 수 있습니다. 링크를 가진 사람은 시청·녹화·재공유할 수 있습니다. 링크는 비밀번호가 아닙니다."
    ],
    [
      "YouTube 및 삭제",
      "YouTube API Services를 사용합니다. 허용하면 채널 정보를 읽고 일부 공개 방송 생성, 스트림 연결, 방송 종료를 수행합니다. 제목, 설정, 콘텐츠가 Google/YouTube로 전송됩니다. 종료 후에도 녹화본이 YouTube에 남을 수 있습니다. 계정 연결 해제는 로컬 토큰을 삭제하고 Google 권한 철회를 시도합니다. 실패하면 Google 계정 설정에서 접근을 해제하세요. YouTube 녹화본은 삭제되지 않으므로 YouTube Studio에서 관리하세요. 충돌 후에는 방송이 종료됐는지 확인하세요. 아래 YouTube 약관 및 Google 개인정보처리방침이 적용됩니다."
    ],
    [
      "개발자 및 지원",
      "이 버전에는 계정·토큰·방송을 수집하는 개발자 서버가 없고 진단을 자동 전송하지 않습니다. 개발자는 Google이 제공하는 API 프로젝트의 집계 사용 통계를 볼 수 있습니다. Discord에 보고서나 링크를 직접 보내면 수신자에게 전달되며 Discord 정책에 따라 처리됩니다. 지원 버튼은 Discord만 열고 자동 전송하지 않습니다. 연락처: hawierowsky@gmail.com."
    ],
    [
      "설정 및 안전",
      "화면 공유는 다른 창과 PC 전체 소리를 포함할 수 있고 브라우저는 다른 탭 소리를 포함할 수 있습니다. 방송 후 오디오 출력을 복구하지만 오류 시 Windows 믹서에서 수동 변경이 필요할 수 있습니다. 깜박이는 테마는 발작이나 불편을 유발할 수 있으니 민감하면 사용하지 마세요. Escape로 중지합니다. 약관은 앱에서 다시 열 수 있습니다."
    ]
  ],
  "zh": [
    [
      "用户责任",
      "VRStreamConrtent用于分享画面和声音。您负责内容、必要授权、被分享个人信息或声音的相关人员同意，以及遵守法律和YouTube、VRChat规则。请勿侵犯他人权利。"
    ],
    [
      "作者责任限制",
      "使用风险由您自行承担。在法律允许范围内，作者不对用户违法行为或不当使用造成的损害负责。不保证持续运行、第三方服务可用性或特定延迟。本条款不排除依法不得排除的责任，也不限制您的法定权利。"
    ],
    [
      "本地存储",
      "设置、已接受的条款版本和日期保存在本地。YouTube令牌和频道名称经Windows加密后保存在电脑上，不保存Google密码。诊断信息保留在内存中，仅点击复制按钮时写入剪贴板。报告可能包含时间、技术参数、错误和设备名称，发送前请检查。Windows/Electron也可能创建本地日志和缓存。"
    ],
    [
      "互联网传输",
      "并非所有数据都仅留在电脑上。画面和声音发送到YouTube，或通过localhost.run / Cloudflare传给观众。这些服务还按照各自政策处理IP地址等连接信息。隧道模式会在电脑上生成临时媒体片段，正常结束时删除，但崩溃后可能残留。任何持有链接的人都能观看、录制和转发。链接不是密码或访问控制。"
    ],
    [
      "YouTube与数据删除",
      "本集成使用YouTube API Services。经您授权后读取频道，创建不公开直播、绑定流并结束直播。标题、设置和内容会发送给Google/YouTube。结束后录像可能仍保留在YouTube。断开账号会删除本地令牌并尝试撤销Google权限；若失败，请在Google账号设置中移除访问权限。这不会删除YouTube录像，请在YouTube Studio中管理。崩溃后请在那里确认直播已结束。使用集成须遵守下方链接中的YouTube服务条款和Google隐私政策。"
    ],
    [
      "作者与支持",
      "此版本没有收集用户账号、令牌或直播的作者服务器，也不会自动向作者发送诊断信息。作者可能看到Google提供的API项目汇总使用统计。如果您主动在Discord发送报告或链接，接收人会获得这些信息，Discord按其政策处理。支持按钮仅打开Discord，不会自动发送信息。联系方式：hawierowsky@gmail.com。"
    ],
    [
      "设置与安全",
      "共享整个屏幕可能暴露其他窗口和电脑全部声音；浏览器可能包含其他标签页的声音。直播后会恢复音频输出，但发生错误时可能需要在Windows混音器中手动修改。闪烁主题可能引起癫痫发作或不适，敏感者请勿启用。按Escape停止效果。可在应用内重新打开本条款。"
    ]
  ]
};
Object.assign(translations.pl,{"termsTitle":"Regulamin i prywatność","termsAgree":"Przeczytałem regulamin i akceptuję go, w tym Warunki korzystania z YouTube, jeśli używam integracji YouTube.","termsAccept":"Akceptuję i kontynuuję","termsDecline":"Nie akceptuję — zamknij","supportDiscord":"Pomoc na Discordzie ↗","ERR_SUPPORT":"Link pomocy nie został jeszcze ustawiony.","ERR_TERMS":"Najpierw zaakceptuj regulamin.","ERR_TERMS_SAVE":"Nie udało się zapisać akceptacji na komputerze. Spróbuj ponownie."});
Object.assign(translations.en,{"termsTitle":"Terms and privacy","termsAgree":"I have read and accept these terms, including the YouTube Terms of Service when using the YouTube integration.","termsAccept":"Accept and continue","termsDecline":"Decline — exit","supportDiscord":"Discord support ↗","ERR_SUPPORT":"The support link has not been configured yet.","ERR_TERMS":"Accept the terms first.","ERR_TERMS_SAVE":"Could not save acceptance on this computer. Try again."});
Object.assign(translations.ru,{"termsTitle":"Условия и конфиденциальность","termsAgree":"Я прочитал и принимаю условия, включая Условия использования YouTube при использовании интеграции.","termsAccept":"Принять и продолжить","termsDecline":"Отказаться — выйти","supportDiscord":"Помощь в Discord ↗","ERR_SUPPORT":"Ссылка помощи ещё не настроена.","ERR_TERMS":"Сначала примите условия.","ERR_TERMS_SAVE":"Не удалось сохранить согласие на компьютере. Повторите попытку."});
Object.assign(translations.ja,{"termsTitle":"利用規約とプライバシー","termsAgree":"本規約を読み、同意します。YouTube連携を使う場合はYouTube利用規約にも同意します。","termsAccept":"同意して続ける","termsDecline":"同意せず終了","supportDiscord":"Discordサポート ↗","ERR_SUPPORT":"サポートリンクは未設定です。","ERR_TERMS":"先に利用規約に同意してください。","ERR_TERMS_SAVE":"同意を保存できませんでした。再試行してください。"});
Object.assign(translations.de,{"termsTitle":"Nutzungsbedingungen und Datenschutz","termsAgree":"Ich habe die Bedingungen gelesen und akzeptiere sie, einschließlich der YouTube-Nutzungsbedingungen bei Nutzung der Integration.","termsAccept":"Akzeptieren und fortfahren","termsDecline":"Ablehnen — beenden","supportDiscord":"Discord-Hilfe ↗","ERR_SUPPORT":"Der Hilfelink ist noch nicht eingerichtet.","ERR_TERMS":"Akzeptiere zuerst die Bedingungen.","ERR_TERMS_SAVE":"Die Zustimmung konnte nicht gespeichert werden. Versuche es erneut."});
Object.assign(translations.fr,{"termsTitle":"Conditions et confidentialité","termsAgree":"J’ai lu et j’accepte ces conditions, y compris celles de YouTube si j’utilise son intégration.","termsAccept":"Accepter et continuer","termsDecline":"Refuser — quitter","supportDiscord":"Aide sur Discord ↗","ERR_SUPPORT":"Le lien d’assistance n’est pas encore configuré.","ERR_TERMS":"Acceptez d’abord les conditions.","ERR_TERMS_SAVE":"Impossible d’enregistrer votre accord. Réessayez."});
Object.assign(translations.ko,{"termsTitle":"이용약관 및 개인정보","termsAgree":"약관을 읽었으며 동의합니다. YouTube 연동 사용 시 YouTube 서비스 약관에도 동의합니다.","termsAccept":"동의하고 계속","termsDecline":"거부하고 종료","supportDiscord":"Discord 지원 ↗","ERR_SUPPORT":"지원 링크가 아직 설정되지 않았습니다.","ERR_TERMS":"먼저 약관에 동의하세요.","ERR_TERMS_SAVE":"동의를 저장하지 못했습니다. 다시 시도하세요."});
Object.assign(translations.zh,{"termsTitle":"使用条款与隐私","termsAgree":"我已阅读并接受本条款；使用YouTube集成时也接受YouTube服务条款。","termsAccept":"同意并继续","termsDecline":"拒绝并退出","supportDiscord":"Discord支持 ↗","ERR_SUPPORT":"尚未设置支持链接。","ERR_TERMS":"请先接受使用条款。","ERR_TERMS_SAVE":"无法在电脑上保存同意记录，请重试。"});
// Keep the older help panel consistent with both streaming providers.
for(const code of Object.keys(legalDocuments))translations[code].helpPrivacy=legalDocuments[code][3][1]+'\n\n'+legalDocuments[code][4][1];
Object.assign(translations.pl,{ended:'Transmisja zakończona. Zapis na YouTube może pozostać dostępny.',preparing:'Przygotowywanie transmisji…'});
Object.assign(translations.en,{ended:'Stream ended. A YouTube recording may remain available.',preparing:'Preparing your stream…'});
Object.assign(translations.ru,{ended:'Трансляция завершена. Запись на YouTube может остаться доступной.',preparing:'Подготовка трансляции…'});
Object.assign(translations.ja,{ended:'配信が終了しました。YouTubeの録画は残る場合があります。',preparing:'配信を準備中…'});

translations.pl.ytUnlisted="YouTube · Niepubliczny";
translations.en.ytUnlisted="YouTube · Unlisted";
translations.ru.ytUnlisted="YouTube · По ссылке";
translations.ja.ytUnlisted="YouTube · 限定公開";
translations.de.ytUnlisted="YouTube · Nicht gelistet";
translations.fr.ytUnlisted="YouTube · Non répertorié";
translations.ko.ytUnlisted="YouTube · 일부 공개";
translations.zh.ytUnlisted="YouTube · 不公开";
translations.pl.helpLink="Poczekaj na status „Na żywo” i skopiuj link do zgodnego odtwarzacza VRChat, zwykle AVPro w trybie Live. Obsługa zależy od świata i platformy; może być potrzebne Allow Untrusted URLs. Tunel działa tylko podczas transmisji i może zmienić adres po ponownym połączeniu. Zapis transmisji YouTube może pozostać dostępny po zakończeniu. Aplikacja musi działać podczas live.";
translations.en.helpLink="Wait for Live and copy the link to a compatible VRChat player, usually AVPro in Live mode. Support depends on the world and platform; Allow Untrusted URLs may be needed. Tunnel links work only while streaming and may change after reconnection. YouTube recordings may remain available after streaming ends. Keep the app running during live.";
translations.ru.helpLink="Дождитесь статуса «В эфире» и вставьте ссылку в совместимый плеер VRChat, обычно AVPro/Live. Поддержка зависит от мира и платформы; может потребоваться Allow Untrusted URLs. Ссылка туннеля действует во время эфира и может измениться при переподключении. Запись YouTube может остаться после эфира. Не закрывайте приложение во время трансляции.";
translations.ja.helpLink="配信中になるまで待ち、VRChatの対応プレイヤー（通常AVPro/Live）にリンクを貼り付けます。対応状況はワールドやプラットフォームによって異なり、Allow Untrusted URLsが必要な場合があります。トンネルのリンクは配信中のみ有効で、再接続時に変わる場合があります。YouTubeの録画は終了後も残る場合があります。配信中はアプリを起動したままにしてください。";
Object.assign(translations.pl,{"ytConnected":"Podłączone","ERR_YT_INGEST":"YouTube zwrócił nieprawidłowy adres nadawania. Skopiuj raport.","ERR_YT_LIMIT":"Limit transmisji lub żądań YouTube. Sprawdź zaplanowane live w Studio i spróbuj później.","ERR_YT_LATENCY":"YouTube odrzucił ustawienia opóźnienia. Skopiuj raport.","ERR_YT_DISABLED":"API YouTube jest wyłączone w projekcie aplikacji. Skontaktuj się z autorem."});
Object.assign(translations.en,{"ytConnected":"Connected","ERR_YT_INGEST":"YouTube returned an invalid ingestion address. Copy diagnostics.","ERR_YT_LIMIT":"YouTube broadcast or request limit reached. Check scheduled lives in Studio and try later.","ERR_YT_LATENCY":"YouTube rejected the latency settings. Copy diagnostics.","ERR_YT_DISABLED":"YouTube API is disabled for this app project. Contact the author."});
Object.assign(translations.ru,{"ytConnected":"Подключено","ERR_YT_INGEST":"YouTube вернул неверный адрес передачи. Скопируйте отчёт.","ERR_YT_LIMIT":"Лимит трансляций или запросов YouTube. Проверьте эфиры в Studio и попробуйте позже.","ERR_YT_LATENCY":"YouTube отклонил настройки задержки. Скопируйте отчёт.","ERR_YT_DISABLED":"API YouTube отключён в проекте приложения. Свяжитесь с автором."});
Object.assign(translations.ja,{"ytConnected":"接続済み","ERR_YT_INGEST":"YouTubeの送信先アドレスが無効です。診断をコピーしてください。","ERR_YT_LIMIT":"YouTubeの配信数またはリクエスト制限です。Studioを確認して後で再試行してください。","ERR_YT_LATENCY":"YouTubeが遅延設定を拒否しました。診断をコピーしてください。","ERR_YT_DISABLED":"アプリのYouTube APIが無効です。作者に連絡してください。"});
Object.assign(translations.de,{"ytConnected":"Verbunden","ERR_YT_INGEST":"YouTube lieferte eine ungültige Sendeadresse. Kopiere den Bericht.","ERR_YT_LIMIT":"YouTube-Limit erreicht. Prüfe geplante Streams in Studio und versuche es später.","ERR_YT_LATENCY":"YouTube lehnte die Latenzeinstellungen ab. Kopiere den Bericht.","ERR_YT_DISABLED":"YouTube API ist für dieses Projekt deaktiviert. Kontaktiere den Autor."});
Object.assign(translations.fr,{"ytConnected":"Connecté","ERR_YT_INGEST":"Adresse de diffusion YouTube invalide. Copiez le rapport.","ERR_YT_LIMIT":"Limite YouTube atteinte. Vérifiez les directs prévus dans Studio et réessayez plus tard.","ERR_YT_LATENCY":"YouTube a refusé les réglages de latence. Copiez le rapport.","ERR_YT_DISABLED":"API YouTube désactivée pour ce projet. Contactez l’auteur."});
Object.assign(translations.ko,{"ytConnected":"연결됨","ERR_YT_INGEST":"YouTube 전송 주소가 잘못됐습니다. 진단을 복사하세요.","ERR_YT_LIMIT":"YouTube 방송 또는 요청 한도입니다. Studio에서 예약 방송을 확인하고 나중에 시도하세요.","ERR_YT_LATENCY":"YouTube가 지연 설정을 거부했습니다. 진단을 복사하세요.","ERR_YT_DISABLED":"프로젝트의 YouTube API가 꺼져 있습니다. 개발자에게 문의하세요."});
Object.assign(translations.zh,{"ytConnected":"已连接","ERR_YT_INGEST":"YouTube返回的推流地址无效，请复制诊断报告。","ERR_YT_LIMIT":"达到YouTube直播或请求上限，请检查Studio中的预定直播并稍后重试。","ERR_YT_LATENCY":"YouTube拒绝延迟设置，请复制诊断报告。","ERR_YT_DISABLED":"此项目的YouTube API已停用，请联系作者。"});
// Current end-user tutorial.
Object.assign(translations.pl,{"helpTitle":"Jak uruchomić transmisję","helpStep1Title":"Podłącz własny kanał YouTube","helpStep1":"Otwórz Ustawienia → YouTube i kliknij czerwone „Połącz z YouTube”. Zaloguj się na konto z kanałem, z którego chcesz nadawać, i zatwierdź dostęp. Zielone „Podłączone” potwierdza połączenie konta — nie oznacza jeszcze trwającego live. Wybierz YouTube jako sposób transmisji, wpisz tytuł i określ, czy materiał jest przeznaczony dla dzieci. Kanał musi mieć włączone transmisje na żywo.","helpStep2Title":"Wybierz obraz i rozpocznij live","helpStep2":"Na ekranie głównym wybierz miniaturę ekranu lub okna aplikacji. Ekran udostępnia wszystkie dźwięki komputera; okno — dźwięk wybranej aplikacji, jeśli włączysz udostępnianie dźwięku. Na początek wybierz HD 720p i 30 FPS. Kliknij „Rozpocznij live”. Aplikacja przygotuje niepubliczną transmisję na Twoim kanale.","helpStep3Title":"Udostępnij link i zakończ transmisję","helpStep3":"Poczekaj na status „Na żywo” i aktywny przycisk „Kopiuj link”. Wklej link do zgodnego odtwarzacza VRChat; w przeglądarce użyj „Podgląd online”. Zostaw aplikację uruchomioną. Aby skończyć, kliknij „Zakończ live”. Zapis na YouTube może pozostać dostępny — zarządzaj nim w YouTube Studio.","helpProblems":"Jeśli live nie startuje, przeczytaj komunikat pod podglądem. Zielone „Podłączone” oznacza tylko połączenie konta; kanał nadal musi mieć uprawnienia do nadawania. Sprawdź aktywację live w YouTube Studio. Przy komunikacie o logowaniu odłącz konto i połącz je ponownie. Przy limicie spróbuj później.\nCzarny lub zatrzymany obraz: przywróć udostępniane okno i wybierz je ponownie. Chronione treści mogą blokować przechwytywanie. Jeśli komputer nie nadąża, obniż rozdzielczość lub FPS.\nJeżeli błąd wraca, w ustawieniach dodatkowych skopiuj diagnostykę i sprawdź raport przed wysłaniem. Przycisk „Pomoc na Discordzie” otwiera serwer pomocy; raport i opis wysyłasz sam.","helpSync":"Korekta dźwięku służy do wyrównania głosu z obrazem, nie do skrócenia opóźnienia całej transmisji. Zacznij od 0 ms. Dźwięk za wcześnie: wartość dodatnia, np. +2000 ms. Za późno: ujemna. Korekta obowiązuje od następnego live.\nOpóźnienie między Twoim ekranem a widzem zależy od kodowania, łącza, YouTube lub tunelu i odtwarzacza VRChat. Niższa jakość może pomóc przy przeciążeniu, ale nie gwarantuje konkretnego opóźnienia."});
Object.assign(translations.en,{"helpTitle":"How to start streaming","helpStep1Title":"Connect your own YouTube channel","helpStep1":"Open Settings → YouTube and click the red Connect YouTube button. Sign in to the account containing your channel and grant access. Green Connected confirms the account connection, not an active broadcast. Choose YouTube as the destination, enter a title and select whether the stream is made for kids. Your channel must have live streaming enabled.","helpStep2Title":"Choose a source and go live","helpStep2":"Select a screen or app window. Screen audio includes all PC sounds; window audio captures the selected app when enabled. Start with HD 720p and 30 FPS. Click Go live. The app prepares an unlisted broadcast on your channel.","helpStep3Title":"Share the link and end the live","helpStep3":"Wait for Live and an enabled Copy link button. Paste the link into a compatible VRChat player, or use Online preview in a browser. Keep the app running. Click End live to finish. YouTube may keep a recording; manage it in YouTube Studio.","helpProblems":"If live will not start, read the message below the preview. Green Connected only confirms the account connection; your channel still needs live permissions. Check activation in YouTube Studio. For login errors, disconnect and reconnect. For limits, try later.\nFor black or frozen video, restore and reselect the window. Protected content can block capture. Reduce resolution or FPS if the PC is overloaded.\nIf the problem persists, copy diagnostics in advanced settings, review the report and open Discord support. Send the report and description yourself; nothing is sent automatically.","helpSync":"Audio correction aligns sound with video; it does not reduce overall live delay. Start at 0 ms. Sound too early: positive value, such as +2000 ms. Too late: negative value. Applies to the next live.\nEnd-to-end delay depends on encoding, your connection, YouTube or the tunnel, and the VRChat player. Lower quality may help with overload but cannot guarantee a specific delay."});
Object.assign(translations.ru,{"helpTitle":"Как начать трансляцию","helpStep1Title":"Подключите свой канал YouTube","helpStep1":"Откройте Настройки → YouTube и нажмите красную кнопку подключения. Войдите в аккаунт своего канала и разрешите доступ. Зелёное «Подключено» подтверждает связь с аккаунтом, а не начало эфира. Выберите YouTube, задайте название и укажите, предназначен ли контент для детей. На канале должны быть включены прямые эфиры.","helpStep2Title":"Выберите источник и начните эфир","helpStep2":"Выберите экран или окно. Экран передаёт все звуки ПК; окно — звук приложения, если он включён. Начните с 720p и 30 FPS. Нажмите «Начать эфир»: приложение подготовит трансляцию по ссылке на вашем канале.","helpStep3Title":"Поделитесь ссылкой и завершите эфир","helpStep3":"Дождитесь статуса эфира и доступной кнопки копирования. Вставьте ссылку в совместимый плеер VRChat или откройте онлайн-просмотр. Не закрывайте приложение. Нажмите завершение эфира, когда закончите. Запись может остаться на YouTube; управляйте ей в Studio.","helpProblems":"Читайте сообщение под просмотром. Подключённый аккаунт не гарантирует права на эфир — проверьте активацию в YouTube Studio. При ошибке входа отключите и подключите аккаунт. При лимите попробуйте позже.\nЕсли изображение чёрное или зависло, восстановите окно. Защищённый контент может блокировать захват. При перегрузке снизьте качество или FPS.\nЕсли проблема повторяется, скопируйте и проверьте отчёт, затем откройте помощь Discord. Отправьте описание и отчёт самостоятельно.","helpSync":"Коррекция выравнивает звук и видео, но не сокращает общую задержку эфира. Начните с 0 мс: звук раньше — положительное значение, позже — отрицательное. Применяется к следующему эфиру. Общая задержка зависит от кодирования, сети, сервиса и плеера VRChat. Снижение качества может помочь при перегрузке, но не гарантирует определённую задержку."});
Object.assign(translations.ja,{"helpTitle":"配信の始め方","helpStep1Title":"自分のYouTubeチャンネルを接続","helpStep1":"設定 → YouTubeで赤い接続ボタンを押し、自分のチャンネルのアカウントにログインして許可します。緑の「接続済み」はアカウント接続を示し、配信開始の意味ではありません。配信先をYouTubeにしてタイトルと子ども向けかを設定します。チャンネルでライブ配信が有効になっている必要があります。","helpStep2Title":"共有元を選んで配信開始","helpStep2":"画面またはアプリのウィンドウを選びます。音声を有効にすると、画面ではPC全体、ウィンドウでは対象アプリの音声を共有します。最初は720p・30 FPSを選び、配信開始を押します。自分のチャンネルに限定公開ライブを準備します。","helpStep3Title":"リンクを共有して終了","helpStep3":"配信中の表示とリンクコピーボタンの有効化を待ちます。対応VRChatプレイヤーに貼り付けるか、オンラインプレビューを使います。アプリは起動したままにします。終了ボタンで停止します。YouTubeに残る録画はStudioで管理してください。","helpProblems":"プレビュー下のエラーを確認します。接続済みでも配信権限が必要です。Studioで有効化を確認し、ログインエラーなら切断して再接続、制限なら後で再試行してください。\n黒い・停止した画面はウィンドウを復元して選び直します。保護されたコンテンツはキャプチャできない場合があります。負荷が高ければ画質やFPSを下げます。\n解決しなければ詳細設定で診断をコピーし、内容を確認してDiscordサポートへ自分で送信します。自動送信はありません。","helpSync":"音声補正は映像とのずれを調整するもので、ライブ全体の遅延は短縮しません。0 msから始め、音が早ければ正、遅ければ負の値にします。次の配信から適用します。全体の遅延はエンコード、回線、サービス、VRChatプレイヤー次第です。画質を下げると過負荷を軽減できますが、特定の遅延は保証しません。"});
Object.assign(translations.de,{"helpTitle":"So startest du einen Live","helpStep1Title":"Eigenen YouTube-Kanal verbinden","helpStep1":"Öffne Einstellungen → YouTube und klicke auf den roten Verbindungsknopf. Melde dich mit deinem Kanal an und erlaube den Zugriff. Grün Verbunden bestätigt nur das Konto, keinen laufenden Live. Wähle YouTube, Titel und Zielgruppe. Live muss für deinen Kanal aktiviert sein.","helpStep2Title":"Quelle wählen und starten","helpStep2":"Wähle Bildschirm oder App-Fenster. Bildschirmton umfasst alle PC-Töne; Fensterton die gewählte App, wenn aktiviert. Beginne mit 720p/30 FPS. Live starten bereitet einen nicht gelisteten Live auf deinem Kanal vor.","helpStep3Title":"Link teilen und beenden","helpStep3":"Warte auf Live und den aktiven Kopierknopf. Füge den Link in einen kompatiblen VRChat-Player ein oder öffne die Online-Vorschau. Lass die App laufen. Live beenden stoppt die Übertragung; Aufzeichnungen verwaltest du in YouTube Studio.","helpProblems":"Lies den Fehler unter der Vorschau. Verbunden bestätigt nicht die Live-Berechtigung: prüfe sie in Studio. Bei Anmeldefehlern neu verbinden, bei Limits später versuchen.\nBei schwarzem oder stehendem Bild das Fenster wiederherstellen. Geschützte Inhalte können die Aufnahme sperren. Bei Überlastung Qualität oder FPS senken.\nFalls nötig, Diagnosebericht kopieren und prüfen. Discord-Hilfe öffnen und Bericht mit Beschreibung selbst senden. Es erfolgt kein automatischer Versand.","helpSync":"Audiokorrektur gleicht Ton und Bild an, verkürzt aber nicht den gesamten Live-Verzug. Beginne bei 0 ms. Ton zu früh: positiver Wert; zu spät: negativer Wert. Gilt ab dem nächsten Live. Gesamtverzögerung hängt von Encoder, Netz, Dienst und VRChat-Player ab. Niedrigere Qualität hilft eventuell bei Überlastung, garantiert aber keine bestimmte Latenz."});
Object.assign(translations.fr,{"helpTitle":"Comment lancer un direct","helpStep1Title":"Connecter votre chaîne YouTube","helpStep1":"Ouvrez Paramètres → YouTube et cliquez sur le bouton rouge de connexion. Connectez votre propre chaîne et autorisez l’accès. Connecté en vert confirme le compte, pas un direct en cours. Choisissez YouTube, un titre et le public enfant ou non. Les directs doivent être activés sur la chaîne.","helpStep2Title":"Choisir la source et lancer","helpStep2":"Choisissez un écran ou une fenêtre. Le son de l’écran inclut tout le PC ; celui d’une fenêtre correspond à l’application si activé. Commencez en 720p/30 FPS. Lancer le direct prépare une diffusion non répertoriée sur votre chaîne.","helpStep3Title":"Partager le lien et terminer","helpStep3":"Attendez En direct et le bouton de copie actif. Collez le lien dans un lecteur VRChat compatible ou ouvrez l’aperçu en ligne. Gardez l’application ouverte. Terminer le direct arrête l’envoi ; gérez les enregistrements dans YouTube Studio.","helpProblems":"Lisez le message sous l’aperçu. Connecté ne garantit pas les droits de diffusion : vérifiez Studio. Pour une erreur de connexion, déconnectez et reconnectez ; pour une limite, réessayez plus tard.\nRestaurez la fenêtre si l’image est noire ou figée. Les contenus protégés peuvent bloquer la capture. Baissez qualité ou FPS en cas de surcharge.\nCopiez et vérifiez le rapport, ouvrez l’aide Discord, puis envoyez vous-même le rapport et la description. Rien n’est envoyé automatiquement.","helpSync":"La correction audio aligne le son et l’image, sans réduire la latence globale. Commencez à 0 ms. Son trop tôt : valeur positive ; trop tard : négative. Valable au prochain direct. La latence globale dépend de l’encodage, du réseau, du service et du lecteur VRChat. Baisser la qualité peut aider en surcharge sans garantir un délai précis."});
Object.assign(translations.ko,{"helpTitle":"방송 시작 방법","helpStep1Title":"내 YouTube 채널 연결","helpStep1":"설정 → YouTube에서 빨간 연결 버튼을 누르세요. 내 채널 계정으로 로그인하고 권한을 허용하세요. 초록색 연결됨은 계정 연결이며 방송 시작을 뜻하지 않습니다. YouTube, 제목, 아동용 여부를 선택하세요. 채널에서 라이브 기능이 활성화되어야 합니다.","helpStep2Title":"화면 선택 후 방송 시작","helpStep2":"화면 또는 앱 창을 선택하세요. 소리를 켜면 화면 모드는 PC 전체 소리, 창 모드는 해당 앱 소리를 공유합니다. 720p/30 FPS로 시작하세요. 방송 시작을 누르면 내 채널에 일부 공개 라이브를 준비합니다.","helpStep3Title":"링크 공유 및 종료","helpStep3":"방송 중 상태와 활성화된 복사 버튼을 기다리세요. 호환 VRChat 플레이어에 링크를 붙이거나 온라인 미리보기를 여세요. 앱을 켜두세요. 방송 종료로 전송을 멈추고 녹화본은 YouTube Studio에서 관리하세요.","helpProblems":"미리보기 아래 오류를 확인하세요. 연결됨이어도 방송 권한은 별도입니다. Studio에서 활성화를 확인하세요. 로그인 오류는 재연결하고 한도 오류는 나중에 시도하세요.\n검거나 멈춘 화면은 창을 복원하세요. 보호 콘텐츠는 캡처를 막을 수 있습니다. 과부하 시 화질이나 FPS를 낮추세요.\n진단 보고서를 복사·검토한 뒤 Discord 지원을 열고 설명과 함께 직접 보내세요. 자동 전송하지 않습니다.","helpSync":"오디오 조정은 소리와 영상을 맞추며 전체 방송 지연을 줄이지 않습니다. 0 ms로 시작해 소리가 빠르면 양수, 늦으면 음수로 설정합니다. 다음 방송에 적용됩니다. 전체 지연은 인코딩, 네트워크, 서비스, VRChat 플레이어에 따라 달라집니다. 화질을 낮추면 과부하에 도움이 되지만 특정 지연을 보장하지 않습니다."});
Object.assign(translations.zh,{"helpTitle":"如何开始直播","helpStep1Title":"连接自己的YouTube频道","helpStep1":"打开设置 → YouTube，点击红色连接按钮。登录自己的频道账号并授权。绿色已连接仅表示账号连接，不表示直播已开始。选择YouTube、填写标题并选择是否面向儿童。频道必须已启用直播功能。","helpStep2Title":"选择来源并开始直播","helpStep2":"选择屏幕或应用窗口。开启声音后，屏幕模式分享电脑全部声音，窗口模式分享所选应用声音。建议先用720p/30 FPS。点击开始直播，应用将在您的频道准备不公开直播。","helpStep3Title":"分享链接并结束","helpStep3":"等待直播中状态及复制按钮启用。将链接粘贴到兼容VRChat播放器，或打开在线预览。保持应用运行。结束直播会停止传输，录像请在YouTube Studio管理。","helpProblems":"请查看预览下方错误。已连接不代表已获直播权限，请在Studio确认。登录错误可断开再连接，达到上限请稍后重试。\n黑屏或画面停止时请恢复窗口。受保护内容可能阻止捕获，电脑过载时降低画质或FPS。\n复制并检查诊断报告，打开Discord支持后自己发送报告与问题描述，不会自动发送。","helpSync":"音频调整用于对齐声音与画面，不会缩短整体直播延迟。从0 ms开始，声音提前用正值，滞后用负值，下次直播生效。整体延迟取决于编码、网络、服务和VRChat播放器。降低画质可能减轻过载，但无法保证特定延迟。"});
Object.assign(translations.pl,{"ytActivationTitle":"Pierwszy live na YouTube? Najpierw aktywuj kanał","ytActivationHelp":"Jeśli wcześniej nie nadawałeś na tym kanale, otwórz YouTube Studio → Utwórz → Transmituj na żywo i wykonaj wymaganą weryfikację. Pierwsza aktywacja może potrwać do 24 godzin. Jeśli YouTube pokazuje odliczanie, poczekaj do jego zakończenia i dopiero wtedy rozpocznij live w aplikacji. Każdy nadawca wykonuje to na własnym kanale. Zielone „Podłączone” oznacza połączenie konta, a nie gotowość kanału do nadawania.","ERR_YT_CHANNEL":"YouTube nie zezwolił na live na tym kanale. Otwórz YouTube Studio → Utwórz → Transmituj na żywo. Przy pierwszej aktywacji wykonaj weryfikację i poczekaj do 24 godzin lub do końca widocznego odliczania. Jeśli kanał był już aktywny, sprawdź jego ograniczenia w Studio."});
Object.assign(translations.en,{"ytActivationTitle":"First YouTube live? Activate your channel first","ytActivationHelp":"If you have never streamed on this channel, open YouTube Studio → Create → Go live and complete the required verification. First activation can take up to 24 hours. If YouTube shows a countdown, wait until it ends before starting in this app. Each broadcaster must do this on their own channel. Green Connected confirms the account connection, not that the channel is ready to broadcast.","ERR_YT_CHANNEL":"YouTube has not allowed live streaming on this channel. Open YouTube Studio → Create → Go live. For first activation, complete verification and wait up to 24 hours or until the countdown ends. If the channel was already active, check its restrictions in Studio."});
Object.assign(translations.ru,{"ytActivationTitle":"Первый эфир на YouTube? Сначала активируйте канал","ytActivationHelp":"Если вы ещё не проводили эфиры на этом канале, откройте YouTube Studio → Создать → Начать трансляцию и пройдите проверку. Первая активация может занять до 24 часов. Если есть обратный отсчёт, дождитесь его окончания перед запуском в приложении. Каждый автор делает это на своём канале. Зелёное «Подключено» означает связь с аккаунтом, а не готовность канала к эфиру.","ERR_YT_CHANNEL":"YouTube не разрешил эфир на этом канале. Откройте Studio → Создать → Начать трансляцию. При первой активации пройдите проверку и подождите до 24 часов или окончания отсчёта. Для ранее активного канала проверьте ограничения в Studio."});
Object.assign(translations.ja,{"ytActivationTitle":"初めてのYouTubeライブはチャンネルの有効化から","ytActivationHelp":"このチャンネルで初めて配信する場合、YouTube Studio → 作成 → ライブ配信を開始を開き、必要な確認を行ってください。初回有効化には最大24時間かかる場合があります。カウントダウンが表示されたら、終了してからアプリで配信を始めてください。各配信者が自分のチャンネルで行う必要があります。緑の接続済みはアカウントの接続を示し、配信機能の有効化とは異なります。","ERR_YT_CHANNEL":"YouTubeがこのチャンネルのライブ配信を許可していません。Studio → 作成 → ライブ配信を開始を開いてください。初回は確認を完了し、最大24時間またはカウントダウン終了まで待ってください。有効化済みならStudioで制限を確認してください。"});
Object.assign(translations.de,{"ytActivationTitle":"Erster YouTube-Live? Kanal zuerst aktivieren","ytActivationHelp":"Wenn du mit diesem Kanal noch nie live warst, öffne YouTube Studio → Erstellen → Livestream starten und führe die erforderliche Bestätigung durch. Die erste Aktivierung kann bis zu 24 Stunden dauern. Warte einen angezeigten Countdown ab, bevor du in der App startest. Jeder Sender muss den eigenen Kanal aktivieren. Grün Verbunden bestätigt das Konto, nicht die Live-Berechtigung.","ERR_YT_CHANNEL":"YouTube erlaubt diesem Kanal noch keinen Live. Öffne Studio → Erstellen → Livestream starten. Bestätige den Kanal bei der ersten Aktivierung und warte bis zu 24 Stunden oder bis zum Ende des Countdowns. Bei bereits aktiviertem Kanal prüfe Einschränkungen in Studio."});
Object.assign(translations.fr,{"ytActivationTitle":"Premier direct YouTube ? Activez d’abord la chaîne","ytActivationHelp":"Si vous n’avez jamais diffusé sur cette chaîne, ouvrez YouTube Studio → Créer → Passer au direct et effectuez la vérification demandée. La première activation peut prendre jusqu’à 24 heures. Si un compte à rebours apparaît, attendez sa fin avant de lancer dans l’application. Chaque diffuseur doit activer sa propre chaîne. Connecté en vert confirme le compte, pas l’autorisation de diffuser.","ERR_YT_CHANNEL":"YouTube n’autorise pas le direct sur cette chaîne. Ouvrez Studio → Créer → Passer au direct. À la première activation, vérifiez la chaîne et attendez jusqu’à 24 heures ou la fin du compte à rebours. Si elle était déjà activée, vérifiez ses restrictions dans Studio."});
Object.assign(translations.ko,{"ytActivationTitle":"첫 YouTube 방송인가요? 먼저 채널을 활성화하세요","ytActivationHelp":"이 채널에서 방송한 적이 없다면 YouTube Studio → 만들기 → 라이브 스트리밍 시작에서 필요한 인증을 완료하세요. 첫 활성화에는 최대 24시간이 걸릴 수 있습니다. 카운트다운이 표시되면 끝날 때까지 기다린 후 앱에서 방송을 시작하세요. 모든 방송자는 자신의 채널에서 이 절차를 거쳐야 합니다. 초록색 연결됨은 계정 연결이며 방송 권한을 의미하지 않습니다.","ERR_YT_CHANNEL":"YouTube가 이 채널의 방송을 허용하지 않았습니다. Studio → 만들기 → 라이브 스트리밍 시작을 여세요. 처음에는 인증을 완료한 뒤 최대 24시간 또는 카운트다운 종료까지 기다리세요. 이미 활성화했다면 Studio에서 제한을 확인하세요."});
Object.assign(translations.zh,{"ytActivationTitle":"首次YouTube直播？请先激活频道","ytActivationHelp":"如果此频道从未直播，请打开YouTube Studio → 创建 → 开始直播并完成所需验证。首次激活可能需要最多24小时。如果显示倒计时，请等其结束后再在应用中开始直播。每位主播都需要在自己的频道完成此操作。绿色已连接仅代表账号连接，不代表频道已有直播权限。","ERR_YT_CHANNEL":"YouTube尚未允许此频道直播。请打开Studio → 创建 → 开始直播。首次激活需验证并等待最多24小时或倒计时结束。若之前已激活，请在Studio检查频道限制。"});
Object.assign(translations.pl,{"themeRgb":"RGB · świecące obramowania","themeRainbow":"Stroboskop"});
Object.assign(translations.en,{"themeRgb":"RGB · glowing borders","themeRainbow":"Strobe"});
Object.assign(translations.ru,{"themeRgb":"RGB · светящиеся рамки","themeRainbow":"Стробоскоп"});
Object.assign(translations.ja,{"themeRgb":"RGB · 光る枠線","themeRainbow":"ストロボ"});
Object.assign(translations.de,{"themeRgb":"RGB · leuchtende Rahmen","themeRainbow":"Stroboskop"});
Object.assign(translations.fr,{"themeRgb":"RGB · bordures lumineuses","themeRainbow":"Stroboscope"});
Object.assign(translations.ko,{"themeRgb":"RGB · 빛나는 테두리","themeRainbow":"스트로브"});
Object.assign(translations.zh,{"themeRgb":"RGB · 发光边框","themeRainbow":"频闪"});