
import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHERAPI_KEY as string;
const BASE_URL = 'https://api.weatherapi.com/v1/forecast.json';

export interface ForecastData {
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  uv: number;
  alerts: string[];
}

interface WeatherApiResponse {
  current: {
    temp_c: number;
    humidity: number;
    uv: number;
    condition: {
      text: string;
      icon: string;
    };
  };
  alerts?: {
    alert: Array<{
      headline: string;
    }>;
  };
}

export async function getForecastByCoordinates(
  lat: number,
  lon: number
): Promise<ForecastData | null> {
  try {
    const response = await axios.get<WeatherApiResponse>(BASE_URL, {
      params: {
        key: API_KEY,
        q: `${lat},${lon}`,
        days: 1,
        aqi: 'no',
        alerts: 'yes',
      },
    });
    
    const data = response.data;
    const alerts = data.alerts?.alert.map((a) => a.headline) || [];
    
    return {
      temperature: data.current.temp_c,
      condition: data.current.condition.text,
      icon: data.current.condition.icon,
      humidity: data.current.humidity,
      uv: data.current.uv,
      alerts,
    };
  } catch (error) {
    console.error('Erro ao buscar dados climáticos:', error);
    return null;
  }
}
