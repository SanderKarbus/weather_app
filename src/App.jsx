import { useState, useEffect } from 'react'
import './App.css'
import WeatherCard from './components/WeatherCard'
import { fetchWeather } from './services/weatherService'

function App() {
  const [counties, setCounties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [lastUpdate, setLastUpdate] = useState(null)

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
      </header>

      {loading && <div className="loading">Laadime ilmaandmeid...</div>}
      {error && <div className="error">{error}</div>}

      <div className="counties-grid">
        {counties.map(county => (
          <WeatherCard key={county.code} county={county} />
        ))}
      </div>

      <footer className="footer">
        <p>Ilmaandmed: OpenWeatherMap API | TAK25 Projekt</p>
      </footer>
    </div>
  )
}

export default App
