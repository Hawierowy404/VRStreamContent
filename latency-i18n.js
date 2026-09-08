(()=>{
 const keys=['latencySlider','latencyUltra','latencyLow','latencyNormal','latencySliderHint','ERR_YT_LATENCY'];
 const data={
 pl:['Opóźnienie YouTube','Bardzo niskie','Niskie','Normalne','Wybierz przed rozpoczęciem live. Do 1080p: wszystkie tryby; 1440p: niskie lub normalne; 4K: normalne. To tryb, nie dokładna liczba sekund. Dotyczy tylko YouTube.','Wybrany tryb opóźnienia nie obsługuje tej rozdzielczości.'],
 en:['YouTube latency','Ultra-low','Low','Normal','Choose before starting live. Up to 1080p: all modes; 1440p: low or normal; 4K: normal. This selects a mode, not an exact number of seconds. YouTube only.','This latency mode does not support the selected resolution.'],
 ru:['Задержка YouTube','Очень низкая','Низкая','Обычная','Выберите до начала эфира. До 1080p: все режимы; 1440p: низкая или обычная; 4K: обычная. Это режим, а не точное число секунд. Только YouTube.','Режим задержки не поддерживает выбранное разрешение.'],
 ja:['YouTubeの遅延','超低遅延','低遅延','通常','配信開始前に選択します。1080p以下は全モード、1440pは低遅延または通常、4Kは通常です。秒数の指定ではありません。YouTube専用です。','この遅延モードは選択した解像度に対応していません。'],
 de:['YouTube-Latenz','Ultraniedrig','Niedrig','Normal','Vor dem Start wählen. Bis 1080p: alle Modi; 1440p: niedrig oder normal; 4K: normal. Keine genaue Sekundenangabe. Nur YouTube.','Dieser Latenzmodus unterstützt die gewählte Auflösung nicht.'],
 fr:['Latence YouTube','Ultra-faible','Faible','Normale','Choisissez avant le direct. Jusqu’à 1080p : tous les modes ; 1440p : faible ou normale ; 4K : normale. Ce n’est pas un nombre exact de secondes. YouTube uniquement.','Ce mode de latence ne prend pas en charge cette résolution.'],
 ko:['YouTube 지연','초저지연','저지연','일반','방송 전에 선택하세요. 1080p 이하: 모든 모드, 1440p: 저지연 또는 일반, 4K: 일반. 정확한 초 단위 설정이 아닙니다. YouTube에만 적용됩니다.','이 지연 모드는 선택한 해상도를 지원하지 않습니다.'],
 zh:['YouTube延迟','超低','低','正常','直播前选择。1080p及以下：全部模式；1440p：低或正常；4K：正常。这是模式选择，不是精确秒数。仅适用于YouTube。','此延迟模式不支持所选分辨率。']};
 for(const [lang,items] of Object.entries(data)){const old=translations[lang].latencyHint;Object.assign(translations[lang],Object.fromEntries(keys.map((key,i)=>[key,items[i]])));translations[lang].latencyHint=items[4];translations[lang].helpQuality=translations[lang].helpQuality.replace(old,items[4]);}
})();
