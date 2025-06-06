
import { ForecastData } from '@/services/weatherService';

export const mockWeatherData: ForecastData = {
  temperature: 25,
  condition: 'Ensolarado',
  icon: '☀️',
  humidity: 65,
  uv: 5,
  windSpeed: 10,
  visibility: 8,
  alerts: []
};

export const mockHighTemperatureWeather: ForecastData = {
  temperature: 35,
  condition: 'Muito Quente',
  icon: '🌡️',
  humidity: 30,
  uv: 9,
  windSpeed: 5,
  visibility: 6,
  alerts: [
    'Temperatura elevada - busque pontos de resfriamento',
    'Índice UV alto - use protetor solar'
  ]
};

export const mockWeatherError = new Error('Erro na API de clima');
