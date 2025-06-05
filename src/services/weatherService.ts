
import axios from 'axios';

// Using a free weather API that doesn't require API key for testing
const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export interface ForecastData {
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  uv: number;
  alerts: string[];
  windSpeed: number;
  visibility: number;
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  hourly: {
    uv_index: number[];
  };
}

const getWeatherCondition = (weatherCode: number): { condition: string; icon: string } => {
  // Weather codes from Open-Meteo API
  if (weatherCode <= 3) return { condition: 'Ensolarado', icon: '☀️' };
  if (weatherCode <= 48) return { condition: 'Nublado', icon: '☁️' };
  if (weatherCode <= 67) return { condition: 'Chuvoso', icon: '🌧️' };
  if (weatherCode <= 77) return { condition: 'Neve', icon: '❄️' };
  if (weatherCode <= 82) return { condition: 'Chuviscos', icon: '🌦️' };
  return { condition: 'Tempestade', icon: '⛈️' };
};

export async function getForecastByCoordinates(
  lat: number,
  lon: number
): Promise<ForecastData | null> {
  try {
    console.log(`Buscando dados climáticos para ${lat}, ${lon}`);
    
    const response = await axios.get<OpenMeteoResponse>(BASE_URL, {
      params: {
        latitude: lat.toFixed(4),
        longitude: lon.toFixed(4),
        current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
        hourly: 'uv_index',
        timezone: 'America/Sao_Paulo',
        forecast_days: 1
      },
    });
    
    const data = response.data;
    const weatherInfo = getWeatherCondition(data.current.weather_code);
    
    // Generate alerts based on weather conditions
    const alerts: string[] = [];
    
    if (data.current.temperature_2m > 30) {
      alerts.push('Temperatura elevada - busque pontos de resfriamento');
    }
    
    if (data.current.wind_speed_10m > 20) {
      alerts.push('Ventos fortes - cuidado com objetos soltos');
    }
    
    if (data.current.relative_humidity_2m < 30) {
      alerts.push('Umidade muito baixa - hidrate-se frequentemente');
    }
    
    const uvIndex = data.hourly.uv_index[new Date().getHours()] || 0;
    if (uvIndex > 6) {
      alerts.push('Índice UV alto - use protetor solar');
    }
    
    const forecastData: ForecastData = {
      temperature: Math.round(data.current.temperature_2m),
      condition: weatherInfo.condition,
      icon: weatherInfo.icon,
      humidity: Math.round(data.current.relative_humidity_2m),
      uv: uvIndex,
      windSpeed: Math.round(data.current.wind_speed_10m),
      visibility: 10, // Default value since Open-Meteo doesn't provide this
      alerts,
    };
    
    console.log('Dados climáticos obtidos:', forecastData);
    return forecastData;
  } catch (error) {
    console.error('Erro ao buscar dados climáticos:', error);
    
    // Return mock data for Greater São Paulo if API fails
    return {
      temperature: 25,
      condition: 'Parcialmente nublado',
      icon: '⛅',
      humidity: 65,
      uv: 5,
      windSpeed: 10,
      visibility: 8,
      alerts: ['Dados climáticos indisponíveis - usando valores estimados'],
    };
  }
}

export async function getRouteWeatherData(
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number
): Promise<{ start: ForecastData | null; end: ForecastData | null }> {
  try {
    console.log('Obtendo dados climáticos para a rota...');
    
    const [startWeather, endWeather] = await Promise.all([
      getForecastByCoordinates(startLat, startLon),
      getForecastByCoordinates(endLat, endLon)
    ]);
    
    return {
      start: startWeather,
      end: endWeather
    };
  } catch (error) {
    console.error('Erro ao obter dados climáticos da rota:', error);
    return { start: null, end: null };
  }
}
