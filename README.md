# Eesti Ilmaennustuse Rakendus

Ilus React + Vite veebirakendus Eesti ilmaennustuste jaoks. Näitab reaalajases ilmateadet 7 suuremast linnast ja võimaldab otsida mistahes asukoha ilmaennustust maailmas!

**Avalik link:** https://SanderKarbus.github.io/weather_app/

## Funktionaalsus

- Reaalajane ilmateade - 7 Eesti suurema linna ilm
- Asukoha otsing - Sisestada mistahes linna nimi ja näha selle ilmateadet
- Tunniennustus - 8 tunni ennustus (00:00, 03:00, ..., 21:00)
- Interaktiivne kaart - OpenStreetMap kaart otsitud asukoha kohta
- Reaalajane kell - Jooksev kell ja kuupäev küljekanalis
- Automaatne uuendus - Andmete uuendus iga 5 minuti järel
- Responsive disain - Töötab kõigil seadmetel

## Tehnoloogiad

- React 19 - Kasutajaliidese raamistik
- Vite 8 - Kiire ehitamise tööriist
- Leaflet + React-Leaflet - Interaktiivne kaardistamine
- Open-Meteo API - Tasuta ilmaandmed (geocoding + ilm)
- CSS3 Grid - Paika pandud kaardi paigutus

## Käivitamine

### Eeltingimused
- Node.js (v16+)
- npm

### Arenduskeskond

```bash
# Installige dependentsid
npm install

# Käivitage arenduskeskonda
npm run dev
```

Avaneb aadressil: `http://localhost:5173`

### Tootmiseks

```bash
# Ehitus
npm run build

# GitHub Pages'i juurutus
npm run deploy
```

## Projekti struktuur

```
src/
├── App.jsx                    # Peakomponent (ilmaennustus)
├── App.css                    # Peapealt stiilid
├── components/
│   ├── WeatherCard.jsx        # Ilmakardi komponent
│   ├── ForecastCard.jsx       # Tunniennustuse komponent
│   └── LeafletMap.jsx         # Kaardi komponent
├── services/
│   └── weatherService.js      # Open-Meteo API integratsioon
└── index.css                  # Globaalse CSS
```

## Kasutatavad API'd

1. Open-Meteo Weather API
   - Ilmaennustus: `https://api.open-meteo.com/v1/forecast`
   - Asukoha otsing: `https://geocoding-api.open-meteo.com/v1/search`

## Kasutatavad ressursid

- OpenStreetMap - Kaardi andmed
- Leaflet - Kaardi raamistik
- OpenWeather WMO koodid - Ilmakoodide käsitlus

## Märkused

- Rakendus laadib andmeid tasuta API'dest
- Geolokatsiooni ei kasutata - kasutaja sisestab linna nime
- Kood rakenduses on puhas ja ilma jäljedeta
- Ehitatud TAK25 projekti jaoks
```

## Funktsionaalsus

- **Ilmaandmete hankimine**: Open-Meteo API-st reaalajas
- **Kaardiga kuvamine**: Iga linn omakardi kaardis
- **Kuvaandmed**: Temperatuur, "tundub", niiskus, tuul, pilved
- **Automaatne uuendamine**: Andmed uuendatakse iga 5 minuti järel
- **Kellaaeg**: Reaalajasel kellaaeg ja uuendamise timestamp

## Kriteeriumid

✅ Rakendus on kättesaadav avalikul URL-il (GitHub Pages või muu hosting)
✅ Rakendusel on minimaalselt funktsionaalsust (ilmaandmete kuva ja automaatne uuendamine)

## Paljundamine GitHub Pages-is

1. Ehitage projekt:
```bash
npm run build
```

2. Kopeerige `dist/` kausta sisu GitHub Pages hoiule
3. Seadete GitHub Pages repository seadetes

## Autorlus

TAK25 projekt | 2026
