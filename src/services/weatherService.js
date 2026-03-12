// Using Open-Meteo API (free, no API key required)
export async function fetchWeather(lat, lon) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,cloud_cover&hourly=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,cloud_cover&timezone=auto`
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
    
    // Praegune ilm
    const currentWeather = {
      main: {
        temp: current.temperature_2m,
        feels_like: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
      },
      weather: [
        {
          main: getWeatherDescription(current.weather_code).main,
          description: getWeatherDescription(current.weather_code).description,
        },
      ],
      wind: {
        speed: current.wind_speed_10m,
      },
      clouds: {
        all: current.cloud_cover,
      },
    }
    
    // Homse ilma ennustus - kindlatel kellaaegadel
    const hours = data.hourly
    const forecastHours = [0, 3, 6, 9, 12, 15, 18, 21]
    
    // Leiame homse päeva andmeid
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowDateStr = tomorrow.toISOString().split('T')[0]
    
    const forecast = forecastHours.map(hour => {
      // Leida vastaval kellaaegadel andmeid järgmisest päevast
      const timeStr = `${tomorrowDateStr}T${String(hour).padStart(2, '0')}:00`
      const index = hours.time.findIndex(t => t.startsWith(timeStr))
      
      if (index === -1) {
        return null
      }
      
      const temp = hours.temperature_2m[index]
      const code = hours.weather_code[index]
      const wind = hours.wind_speed_10m[index]
      const humidity = hours.relative_humidity_2m[index]
      const cloud = hours.cloud_cover[index]
      
      return {
        time: `${String(hour).padStart(2, '0')}:00`,
        main: {
          temp,
          humidity,
        },
        weather: [
          {
            main: getWeatherDescription(code).main,
            description: getWeatherDescription(code).description,
          },
        ],
        wind: {
          speed: wind,
        },
        clouds: {
          all: cloud,
        },
      }
    }).filter(f => f !== null)
    
    return {
      current: currentWeather,
      forecast: forecast,
    }
  } catch (error) {
    console.error('Weather fetch error:', error)
    throw error
  }
}
