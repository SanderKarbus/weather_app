// Using Open-Meteo API (free, no API key required)
export async function fetchWeather(lat, lon) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,cloud_cover&timezone=auto`
    )
    
    if (!response.ok) {
      throw new Error('Ilmaandmete hankimine ebaõnnestus')
    }

    const data = await response.json()
    
    // Convert Open-Meteo format to OpenWeatherMap-like format
    const current = data.current
    
    // Map WMO weather codes to descriptions
    const getWeatherDescription = (code) => {
      const weatherCodes = {
        0: { main: 'Clear', description: 'Selge' },
        1: { main: 'Clouds', description: 'Peamiselt selge' },
        2: { main: 'Clouds', description: 'Osaliselt pilves' },
        3: { main: 'Clouds', description: 'Pilves' },
        45: { main: 'Mist', description: 'Udune' },
        48: { main: 'Mist', description: 'Külmaline udune' },
        51: { main: 'Drizzle', description: 'Kerged sademed' },
        53: { main: 'Drizzle', description: 'Sademed' },
        55: { main: 'Drizzle', description: 'Tihed sademed' },
        61: { main: 'Rain', description: 'Kerge vihm' },
        63: { main: 'Rain', description: 'Vihm' },
        65: { main: 'Rain', description: 'Tihe vihm' },
        71: { main: 'Snow', description: 'Kerge lumi' },
        73: { main: 'Snow', description: 'Lumi' },
        75: { main: 'Snow', description: 'Tihe lumi' },
        77: { main: 'Snow', description: 'Lumitera' },
        80: { main: 'Rain', description: 'Tugevad sademed' },
        81: { main: 'Rain', description: 'Väga tugevad sademed' },
        82: { main: 'Rain', description: 'Intensiivsed sademed' },
        85: { main: 'Snow', description: 'Kerge lumihood' },
        86: { main: 'Snow', description: 'Lumihood' },
        95: { main: 'Thunderstorm', description: 'Äikesetorm' },
        96: { main: 'Thunderstorm', description: 'Äikesetorm rahematega' },
        99: { main: 'Thunderstorm', description: 'Äikesetorm rahematega' },
      }
      
      return weatherCodes[code] || { main: 'Unknown', description: 'Teadmata' }
    }
    
    const weatherInfo = getWeatherDescription(current.weather_code)
    
    return {
      main: {
        temp: current.temperature_2m,
        feels_like: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
      },
      weather: [
        {
          main: weatherInfo.main,
          description: weatherInfo.description,
        },
      ],
      wind: {
        speed: current.wind_speed_10m,
      },
      clouds: {
        all: current.cloud_cover,
      },
    }
  } catch (error) {
    console.error('Weather fetch error:', error)
    throw error
  }
}
