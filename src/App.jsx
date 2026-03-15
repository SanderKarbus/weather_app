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
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState(null)
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

  // Asukoha valimine linnast
  const selectLocationByCity = async (cityName) => {
    if (!cityName.trim()) {
      setLocationError('Sisesta asukoha nimi')
      return
    }

    setLocationLoading(true)
    setLocationError(null)

    try {
      console.log('Otsitakse asukohta:', cityName)
      
      // Open-Meteo geocoding API - otsi linna nime järgi
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=et`
      )
      
      if (!response.ok) {
        throw new Error(`API viga: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('API vastus:', data)

      if (!data.results || data.results.length === 0) {
        setLocationError(`Asukohta "${cityName}" ei leitud`)
        setLocationLoading(false)
        return
      }

      const result = data.results[0]
      const lat = result.latitude
      const lon = result.longitude
      const displayName = result.name + (result.admin1 ? `, ${result.admin1}` : '')

      console.log('Leitud asukoht:', displayName, lat, lon)

      // Laadi ilmaandmed
      const weatherData = await fetchWeather(lat, lon)
      console.log('Ilmaandmed laaditud:', weatherData)
      
      setCurrentLocation({
        code: 'LOC',
        name: displayName,
        lat: lat,
        lon: lon,
        weather: weatherData
      })
      
      setLocationInput('')
      setShowLocationInput(false)
      setLocationError(null)
      setLocationLoading(false)
    } catch (err) {
      console.error('OTSINGUVIGA:', err)
      setLocationError('Otsing ebaõnnestus: ' + err.message)
      setLocationLoading(false)
    }
  }

  const resetLocation = () => {
    setCurrentLocation(null)
    setLocationInput('')
    setShowLocationInput(false)
    setLocationError(null)
    setLocationLoading(false)
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
                  🔍 Otsi linna
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

      {loading && <div className="loading">Laadime ilmaandmeid...</div>}
      {error && <div className="error">{error}</div>}

      {showLocationInput && (
        <div className="location-input-section">
          <form onSubmit={(e) => {
            e.preventDefault()
            selectLocationByCity(locationInput)
          }}>
            <input
              type="text"
              placeholder="Sisesta asukoha nimi"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              className="location-input"
              disabled={locationLoading}
              autoFocus
            />
            <button type="submit" className="location-submit-btn" disabled={locationLoading}>
              {locationLoading ? '⏳ Otsin...' : '🔍 Otsi'}
            </button>
          </form>
        </div>
      )}

      {locationError && (
        <div className="location-error">
          {locationError}
        </div>
      )}

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
