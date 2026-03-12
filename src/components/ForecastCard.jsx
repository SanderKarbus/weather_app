function ForecastCard({ city }) {
  if (!city.weather) {
    return (
      <div className="weather-card error">
        <h3>{city.name}</h3>
        <p className="error-text">Andmeid ei ole saadaval</p>
      </div>
    )
  }

  const forecast = city.weather.forecast

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
        <h3>{city.name}</h3>
      </div>

      <div className="forecast-container">
        {forecast.map((item, index) => (
          <div key={index} className="forecast-item">
            <div className="forecast-time">{item.time}</div>
            <div className="forecast-icon">
              {getWeatherIcon(item.weather[0]?.main)}
            </div>
            <div className="forecast-temp">{Math.round(item.main?.temp)}°C</div>
            <div className="forecast-desc">{item.weather[0]?.description}</div>
            <div className="forecast-details">
              <span title="Tuul">{Math.round(item.wind?.speed)} m/s</span>
              <span title="Niiskus">{item.main?.humidity}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ForecastCard
