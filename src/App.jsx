import { useState, useEffect } from 'react'
import './App.css'
import WeatherCard from './components/WeatherCard'
import ForecastCard from './components/ForecastCard'
import { fetchWeather } from './services/weatherService'

function App() {
  const [counties, setCounties] = useState([])
  const [currentLocation, setCurrentLocation] = useState(null)
  const [locationInput, setLocationInput] = useState('')
  const [showLocationInput, setShowLocationInput] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [lastUpdate, setLastUpdate] = useState(null)
  const [viewMode, setViewMode] = useState('current') // 'current' või 'forecast'

  // Eesti suuremad linnud
  const estonianCities = [
    { code: 'TLL', name: 'Tallinn', lat: 59.4370, lon: 24.7536 },
    { code: 'TRT', name: 'Tartu', lat: 58.3766, lon: 26.7314 },
    { code: 'PRN', name: 'Pärnu', lat: 58.3852, lon: 24.5014 },
    { code: 'NRV', name: 'Narva', lat: 59.3667, lon: 28.1889 },
    { code: 'VLJ', name: 'Viljandi', lat: 58.3633, lon: 25.5893 },
    { code: 'KRS', name: 'Kuressaare', lat: 58.2518, lon: 22.4927 },
    { code: 'KRD', name: 'Kärdla', lat: 58.9873, lon: 22.9394 },
  ]

  // Ilmaandmete laadimine
  const loadWeatherData = async () => {
    try {
      const weatherData = await Promise.all(
        estonianCities.map(city =>
          fetchWeather(city.lat, city.lon)
            .then(data => ({ ...city, weather: data }))
            .catch(err => ({ ...city, weather: null, error: err.message }))
        )
      )
      setCounties(weatherData)
      setLastUpdate(new Date())
      setError(null)
    } catch (err) {
      setError('Ilmaandmete laadimine ebaõnnestus')
      console.error(err)
    }
  }

  // Praeguse asukoha hankimine koordinaatidelt
  const loadLocationByCoords = async (lat, lon) => {
    try {
      const weatherData = await fetchWeather(lat, lon)
      setCurrentLocation({
        code: 'LOC',
        name: 'Minu asukoht',
        lat: lat,
        lon: lon,
        weather: weatherData
      })
      setLocationInput('')
      setShowLocationInput(false)
    } catch (err) {
      console.error('Asukoha ilmaandmete viga:', err)
      alert('Ilmaandmete laadimine ebaõnnestus. Kontrolli koordinaate.')
    }
  }

  const handleLocationSubmit = (e) => {
    e.preventDefault()
    
    // Kontrolli kas on käigus "lat,lon" vorming
    const coords = locationInput.trim().split(',').map(c => parseFloat(c.trim()))
    
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      loadLocationByCoords(coords[0], coords[1])
    } else {
      alert('Sisesta koordinaadid formaadis: lat,lon (näit: 59.4370,24.7536)')
    }
  }

  const resetLocation = () => {
    setCurrentLocation(null)
    setLocationInput('')
    setShowLocationInput(false)
  }

  // Kellaja uuendamine
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Esimene laadimine ja perioodiline uuendamine
  useEffect(() => {
    setLoading(true)
    loadWeatherData().finally(() => setLoading(false))

    // Uuenda iga 5 minuti järel
    const refreshInterval = setInterval(() => {
      loadWeatherData()
    }, 5 * 60 * 1000) // 5 minutit

    return () => clearInterval(refreshInterval)
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>🌤️ Eesti Ilmaennustus</h1>
        <p>Suuremad linnad</p>
        <p className="time">{currentTime.toLocaleTimeString('et-EE')}</p>
        <p className="date">{currentTime.toLocaleDateString('et-EE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        {lastUpdate && (
          <p className="last-update">Viimati uuendatud: {lastUpdate.toLocaleTimeString('et-EE')}</p>
        )}
        
        <div className="view-tabs">
          <button 
            className={`tab-button ${viewMode === 'current' ? 'active' : ''}`}
            onClick={() => setViewMode('current')}
          >
            Praegune ilm
          </button>
          <button 
            className={`tab-button ${viewMode === 'forecast' ? 'active' : ''}`}
            onClick={() => setViewMode('forecast')}
          >
            Ennustus (Homme)
          </button>
          {viewMode === 'current' && (
            <>
              {!currentLocation ? (
                <button 
                  className="tab-button location-button"
                  onClick={() => setShowLocationInput(!showLocationInput)}
                >
                  📍 Sisesta asukoht
                </button>
              ) : (
                <button 
                  className="tab-button reset-button"
                  onClick={resetLocation}
                >
                  ✕ Eemalda asukoht
                </button>
              )}
            </>
          )}
        </div>
      </header>

      {showLocationInput && (
        <div className="location-input-section">
          <form onSubmit={handleLocationSubmit}>
            <input
              type="text"
              placeholder="Sisesta: lat,lon (näit: 59.4370,24.7536)"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              className="location-input"
            />
            <button type="submit" className="location-submit-btn">
              Laadi ilm
            </button>
          </form>
          <p className="location-hint">Näiteks: Tallinn = 59.4370,24.7536 | Tartu = 58.3766,26.7314</p>
        </div>
      )}

      {loading && <div className="loading">Laadime ilmaandmeid...</div>}
      {error && <div className="error">{error}</div>}

      {viewMode === 'current' && currentLocation && currentLocation.weather && (
        <div className="location-weather-section">
          <WeatherCard key={currentLocation.code} county={currentLocation} special={true} />
        </div>
      )}

      <div className="counties-grid">
        {viewMode === 'current' ? (
          counties.map(county => (
            <WeatherCard key={county.code} county={county} />
          ))
        ) : (
          counties.map(county => (
            <ForecastCard key={county.code} city={county} />
          ))
        )}
      </div>

      <footer className="footer">
        <p>Ilmaandmed: OpenWeatherMap API | TAK25 Projekt</p>
      </footer>
    </div>
  )
}

export default App
