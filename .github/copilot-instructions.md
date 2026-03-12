# Eesti ilmaennustuse rakenduse juhendid

Selle projektiga seotud spetsiifilised juhendid Copilot AI-le.

## Produkti kirjeldus

Eesti Ilmaennustuse rakendus on lihtne React + Vite veebirakenend, mis kuvatab 7 suurema linna reaalajaset ilmaennustust (Tallinn, Tartu, Pärnu, Narva, Viljandi, Kuressaare, Kärdla). Rakendus kasutab tasuta Open-Meteo API-t ilmaandmete hankimiseks ja uuendab andmeid automaatselt iga 5 minuti järel.

## Projekti struktuuri

- `src/App.jsx` - Peakomponent, mis hallitseb olekut ja ilmaandmete laadimist
- `src/components/WeatherCard.jsx` - Ilmamao kaardi komponent iga maakonna jaoks
- `src/services/weatherService.js` - Open-Meteo API integratsioon
- `src/App.css` - Rakenduse stiilid
- `dist/` - Ehitatud failid paljundamiseks
- `package.json` - Projektis dependentsid ja skriptid

## Arenduskirjeldus

- **Arendus server**: `npm run dev` - Käivitub http://localhost:5173/
- **Ehitamine**: `npm run build` - Loob `dist/` kausta optimeeritud failid
- **Preview**: `npm run preview` - Kuvab ehitatud rakendus lokaalselt

## Kriteeriumid

1. ✅ Rakendus on kättesaadav avalikul URL-il (GitHub Pages / Netlify / muu hosting)
2. ✅ Rakendusel on minimaalselt funktsionaalsust:
   - Ilmaandmete hankimine ja kuva
   - Reaalajasel uuendamine
   - Kaardiga kasutajaliidese

## Paljundamine

### GitHub Pages

```bash
npm run build
# Kopeerige dist/ kausta sisu GitHub Pages hoiule
```

### Netlify

Seadete Netlify ja connect selle repositooriuga. Netlify ehitab ja juurutab automaatselt `main` branch'ist.

**Build käsk**: `npm run build`
**Publish directory**: `dist`

## Muudatuste juhised

- Uute komponentide lisamisel kasutage `src/components/` kausta
- API päringud peaksid olema `src/services/` kausta
- Nõuete muudatuste korral siis uuendage README.md ja see fail
