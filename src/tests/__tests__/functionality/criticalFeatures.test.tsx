import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useMapData } from '@/hooks/useMapData';
import { getForecastByCoordinates } from '@/services/weatherService';
import MapView from '@/components/map/MapView';
import WeatherNotification from '@/components/map/WeatherNotification';
import { mockWeatherData } from '../../mocks/weatherMocks';

jest.mock('@/hooks/useGeolocation');
jest.mock('@/hooks/useMapData');
jest.mock('@/services/weatherService');

const mockUseGeolocation = useGeolocation as jest.MockedFunction<typeof useGeolocation>;
const mockUseMapData = useMapData as jest.MockedFunction<typeof useMapData>;
const mockGetForecast = getForecastByCoordinates as jest.MockedFunction<typeof getForecastByCoordinates>;

describe('Funcionalidades Críticas', () => {
  const mockPontos = [
    {
      id: '1',
      nome: 'Parque Próximo',
      tipo: 'parque' as const,
      latitude: -23.5505,
      longitude: -46.6333,
      descricao: 'Parque muito próximo',
      horario_funcionamento: '24h',
      cidade: 'São Paulo',
      uf: 'SP'
    },
    {
      id: '2',
      nome: 'Parque Distante',
      tipo: 'parque' as const,
      latitude: -23.6000,
      longitude: -46.7000,
      descricao: 'Parque distante',
      horario_funcionamento: '6:00 - 18:00',
      cidade: 'São Paulo',
      uf: 'SP'
    }
  ];

  beforeEach(() => {
    mockUseGeolocation.mockReturnValue({
      latitude: -23.5505,
      longitude: -46.6333,
      loading: false,
      error: undefined,
    });

    mockUseMapData.mockReturnValue({
      pontos: mockPontos,
      loading: false,
      error: null,
      refetchData: jest.fn(),
    });

    mockGetForecast.mockResolvedValue(mockWeatherData);
  });

  it('deve encontrar o ponto mais próximo baseado na geolocalização', async () => {
    render(<MapView />);

    const findButton = screen.getByText('Encontrar mais próximo');
    fireEvent.click(findButton);

    // Verifica se o sistema encontrou um ponto (pela presença do botão de rota)
    await waitFor(() => {
      const routeButton = screen.getByText('Rota térmica');
      expect(routeButton).not.toBeDisabled();
    });
  });

  it('deve atualizar dados climáticos quando solicitado', async () => {
    render(<WeatherNotification />);

    await waitFor(() => {
      expect(screen.getByText('Clima Atual')).toBeInTheDocument();
    });

    const refreshButton = screen.getByTitle('Atualizar dados do clima');
    fireEvent.click(refreshButton);

    // Verifica se a função foi chamada novamente
    await waitFor(() => {
      expect(mockGetForecast).toHaveBeenCalledTimes(2);
    });
  });

  it('deve exibir dados climáticos válidos', async () => {
    render(<WeatherNotification />);

    await waitFor(() => {
      expect(screen.getByText('25°C')).toBeInTheDocument();
      expect(screen.getByText('Ensolarado')).toBeInTheDocument();
      expect(screen.getByText('Umidade: 65%')).toBeInTheDocument();
      expect(screen.getByText('UV: 5')).toBeInTheDocument();
    });
  });

  it('deve calcular rota térmica quando ponto está selecionado', async () => {
    render(<MapView />);

    // Primeiro encontra o ponto mais próximo
    const findButton = screen.getByText('Encontrar mais próximo');
    fireEvent.click(findButton);

    // Depois tenta calcular a rota
    await waitFor(() => {
      const routeButton = screen.getByText('Rota térmica');
      fireEvent.click(routeButton);
      
      expect(screen.getByText('Calculando...')).toBeInTheDocument();
    });
  });

  it('deve lidar com erro na geolocalização graciosamente', () => {
    mockUseGeolocation.mockReturnValue({
      latitude: undefined,
      longitude: undefined,
      loading: false,
      error: 'Geolocalização negada pelo usuário',
    });

    render(<MapView />);

    const findButton = screen.getByText('Encontrar mais próximo');
    expect(findButton).toBeDisabled();
  });
});
