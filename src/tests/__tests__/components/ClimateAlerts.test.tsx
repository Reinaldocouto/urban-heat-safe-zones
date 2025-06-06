
import React from 'react';
import { render, screen, waitFor } from '../utils/test-utils';
import { useGeolocation } from '@/hooks/useGeolocation';
import { getForecastByCoordinates } from '@/services/weatherService';
import ClimateAlerts from '@/components/ClimateAlerts';
import { mockHighTemperatureWeather } from '../mocks/weatherMocks';

jest.mock('@/hooks/useGeolocation');
jest.mock('@/services/weatherService');

const mockUseGeolocation = useGeolocation as jest.MockedFunction<typeof useGeolocation>;
const mockGetForecast = getForecastByCoordinates as jest.MockedFunction<typeof getForecastByCoordinates>;

describe('ClimateAlerts Component', () => {
  beforeEach(() => {
    mockUseGeolocation.mockReturnValue({
      latitude: -23.5505,
      longitude: -46.6333,
      loading: false,
      error: undefined,
    });
  });

  it('deve mostrar alertas quando temperatura está alta', async () => {
    mockGetForecast.mockResolvedValueOnce(mockHighTemperatureWeather);

    render(<ClimateAlerts />);

    await waitFor(() => {
      expect(screen.getByText('Temperatura Elevada')).toBeInTheDocument();
      expect(screen.getByText('Índice UV Elevado')).toBeInTheDocument();
    });
  });

  it('deve mostrar mensagem quando não há alertas', async () => {
    mockGetForecast.mockResolvedValueOnce({
      temperature: 22,
      condition: 'Agradável',
      icon: '☀️',
      humidity: 60,
      uv: 3,
      windSpeed: 8,
      visibility: 10,
      alerts: []
    });

    render(<ClimateAlerts />);

    await waitFor(() => {
      expect(screen.getByText('Nenhum alerta ativo')).toBeInTheDocument();
      expect(screen.getByText('As condições climáticas estão dentro dos parâmetros normais.')).toBeInTheDocument();
    });
  });

  it('deve exibir dicas de segurança', () => {
    render(<ClimateAlerts />);

    expect(screen.getByText('Dicas de Segurança')).toBeInTheDocument();
    expect(screen.getByText(/Mantenha-se hidratado/)).toBeInTheDocument();
    expect(screen.getByText(/Use protetor solar/)).toBeInTheDocument();
  });
});
