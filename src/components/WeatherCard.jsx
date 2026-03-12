function WeatherCard({ county }) {
  if (!county.weather && county.error) {
    return (
      <div className="weather-card error">
        <h3>{county.name}</h3>
        <p className="error-text">Viga: {county.error}</p>
      </div>
    )
  }

  if (!county.weather) {
    return (
      <div className="weather-card loading-card">
        <h3>{county.name}</h3>
        <p>Laadime...</p>
      </div>
    )
  }

  const { main, weather, wind, clouds } = county.weather.current

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain?.toLowerCase()) {
      case 'clear':
        return '☀️'
      case 'clouds':
        return '☁️'
      case 'rain':
        return '🌧️'
      case 'drizzle':
        return '🌦️'
      case 'thunderstorm':
        return '⛈️'
      case 'snow':
        return '❄️'
      case 'mist':
      case 'smoke':
      case 'haze':
      case 'dust':
      case 'fog':
      case 'sand':
      case 'ash':
      case 'squall':
      case 'tornado':
        return '🌫️'
      default:
        return '🌤️'
    }
  }

  return (
    <div className="weather-card">
      <div className="card-header">
        <h3>{county.name}</h3>
      </div>
      
      <div className="weather-main">
        <span className="weather-icon">
          {getWeatherIcon(weather[0]?.main)}
        </span>
        <span className="temperature">{Math.round(main?.temp)}°C</span>
      </div>

      <div className="weather-description">
        <p>{weather[0]?.description}</p>
      </div>

      <div className="weather-details">
        <div className="detail">
          <span className="label">Tundub:</span>
          <span className="value">{Math.round(main?.feels_like)}°C</span>
        </div>
        <div className="detail">
          <span className="label">Niiskus:</span>
          <span className="value">{main?.humidity}%</span>
        </div>
        <div className="detail">
          <span className="label">Tuul:</span>
          <span className="value">{Math.round(wind?.speed)} m/s</span>
        </div>
        <div className="detail">
          <span className="label">Pilved:</span>
          <span className="value">{clouds?.all}%</span>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard
