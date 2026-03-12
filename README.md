# Eesti Ilmaennustus Rakendus

Lihtne React + Vite veebirakendus Eesti suuremate linnade ilmaennustuse jaoks.

## Omadused

- 🌤️ Reaalajas ilmaennustus 7 suurema linna jaoks (Tallinn, Tartu, Pärnu, Narva, Viljandi, Kuressaare, Kärdla)
- 🎨 Ilusas ja reageeriva kasutajaliidese
- 🔄 Automaatne ilmaandmete uuendamine (iga 5 minuti järel)
- 📱 Mobiili tvõrgus toetatud (responsive)
- ⚡ Kiire ja lihtne lahendus
- 🕐 Reaalajasel kellaaeg ja uuendamise ajakaitsmine

## Tehnoloogiad

- **React 19** - Kasutajaliidese raamistik
- **Vite 8** - Kiire ehitamise tööriist
- **Open-Meteo API** - Tasuta ilmaandmete allikas (ei vaja API võtit)

## Alustamine

### Eeltingimused

- Node.js (v16+)
- npm või yarn

### Paigaldus

```bash
# Installige dependentsid
npm install

# Käivitage arenduskeskonda
npm run dev
```

Rakendus käivitub aadressil `http://localhost:5173`

## Ehitus

Tootmiseks:

```bash
npm run build
```

Ehitatud failid leiab kaustas `dist/`.

## Struktuur

```
src/
├── App.jsx           # Peakomponent
├── App.css           # Peapealt stiilid
├── components/
│   └── WeatherCard.jsx  # Ilmakardi komponent
├── services/
│   └── weatherService.js # Ilmaandmete teenus
└── index.css         # Globaalse CSS stiilid
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
