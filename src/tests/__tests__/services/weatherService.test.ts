
import axios from 'axios';
import { getForecastByCoordinates, getRouteWeatherData } from '@/services/weatherService';
import { mockWeatherData, mockWeatherError } from '../../mocks/weatherMocks';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WeatherService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getForecastByCoordinates', () => {
    it('deve retornar dados climáticos válidos', async () => {
      const mockResponse = {
        data: {
          current: {
            temperature_2m: 25,
            relative_humidity_2m: 65,
            wind_speed_10m: 10,
            weather_code: 1
          },
          hourly: {
            uv_index: [5]
          }
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await getForecastByCoordinates(-23.5505, -46.6333);

      expect(result).toEqual(
        expect.objectContaining({
          temperature: 25,
          humidity: 65,
          windSpeed: 10,
          uv: 5
        })
      );
    });

    it('deve retornar dados mockados em caso de erro da API', async () => {
      mockedAxios.get.mockRejectedValueOnce(mockWeatherError);

      const result = await getForecastByCoordinates(-23.5505, -46.6333);

      expect(result).toEqual(
        expect.objectContaining({
          temperature: 25,
          condition: 'Parcialmente nublado',
          alerts: ['Dados climáticos indisponíveis - usando valores estimados']
        })
      );
    });

    it('deve gerar alertas para temperatura alta', async () => {
      const mockResponse = {
        data: {
          current: {
            temperature_2m: 35,
            relative_humidity_2m: 30,
            wind_speed_10m: 5,
            weather_code: 1
          },
          hourly: {
            uv_index: [9]
          }
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await getForecastByCoordinates(-23.5505, -46.6333);

      expect(result?.alerts).toContain('Temperatura elevada - busque pontos de resfriamento');
      expect(result?.alerts).toContain('Índice UV alto - use protetor solar');
    });
  });

  describe('getRouteWeatherData', () => {
    it('deve retornar dados climáticos para início e fim da rota', async () => {
      const mockResponse = {
        data: {
          current: {
            temperature_2m: 25,
            relative_humidity_2m: 65,
            wind_speed_10m: 10,
            weather_code: 1
          },
          hourly: {
            uv_index: [5]
          }
        }
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getRouteWeatherData(-23.5505, -46.6333, -23.5489, -46.6388);

      expect(result.start).toBeDefined();
      expect(result.end).toBeDefined();
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });
  });
});
