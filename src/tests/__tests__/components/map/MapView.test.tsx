import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useMapData } from '@/hooks/useMapData';
import MapView from '@/components/map/MapView';
import { mockGeolocationSuccess } from '../../mocks/geolocationMocks';

// Mock dos hooks
jest.mock('@/hooks/useGeolocation');
jest.mock('@/hooks/useMapData');
jest.mock('@/services/weatherService');

const mockUseGeolocation = useGeolocation as jest.MockedFunction<typeof useGeolocation>;
const mockUseMapData = useMapData as jest.MockedFunction<typeof useMapData>;

describe('MapView Component', () => {
  beforeEach(() => {
    mockGeolocationSuccess();
    
    mockUseGeolocation.mockReturnValue({
      latitude: -23.5505,
      longitude: -46.6333,
      loading: false,
      error: undefined,
    });

    mockUseMapData.mockReturnValue({
      pontos: [
        {
          id: '1',
          nome: 'Parque Ibirapuera',
          tipo: 'parque',
          latitude: -23.5873,
          longitude: -46.6573,
          descricao: 'Grande parque urbano',
          horario_funcionamento: '5:00 - 00:00',
          cidade: 'São Paulo',
          uf: 'SP'
        }
      ],
      loading: false,
      error: null,
      refetchData: jest.fn(),
    });
  });

  it('deve renderizar o mapa e controles', async () => {
    render(<MapView />);

    await waitFor(() => {
      expect(screen.getByText('Encontrar mais próximo')).toBeInTheDocument();
      expect(screen.getByText('Rota térmica')).toBeInTheDocument();
    });
  });

  it('deve exibir botão de Clima Seguro quando geolocalização está disponível', async () => {
    render(<MapView />);

    await waitFor(() => {
      expect(screen.getByText('Clima Seguro')).toBeInTheDocument();
    });
  });

  it('deve abrir painel de clima quando botão é clicado', async () => {
    render(<MapView />);

    const climaButton = await screen.findByText('Clima Seguro');
    fireEvent.click(climaButton);

    await waitFor(() => {
      expect(screen.getByText('Painel Clima Seguro')).toBeInTheDocument();
    });
  });

  it('deve mostrar loading quando dados estão carregando', () => {
    mockUseMapData.mockReturnValue({
      pontos: [],
      loading: true,
      error: null,
      refetchData: jest.fn(),
    });

    render(<MapView />);

    expect(screen.getByText('Carregando pontos...')).toBeInTheDocument();
  });

  it('deve mostrar erro quando geolocalização falha', () => {
    mockUseGeolocation.mockReturnValue({
      latitude: undefined,
      longitude: undefined,
      loading: false,
      error: 'Erro ao obter localização',
    });

    render(<MapView />);

    expect(screen.getByText(/Erro ao obter localização/)).toBeInTheDocument();
  });
});
