
import React from 'react';
import { render, waitFor } from '../utils/test-utils';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useMapData } from '@/hooks/useMapData';
import MapView from '@/components/map/MapView';
import { performance } from 'perf_hooks';

jest.mock('@/hooks/useGeolocation');
jest.mock('@/hooks/useMapData');
jest.mock('@/services/weatherService');

const mockUseGeolocation = useGeolocation as jest.MockedFunction<typeof useGeolocation>;
const mockUseMapData = useMapData as jest.MockedFunction<typeof useMapData>;

describe('Testes de Performance', () => {
  beforeEach(() => {
    mockUseGeolocation.mockReturnValue({
      latitude: -23.5505,
      longitude: -46.6333,
      loading: false,
      error: undefined,
    });

    mockUseMapData.mockReturnValue({
      pontos: [],
      loading: false,
      error: null,
      refetchData: jest.fn(),
    });
  });

  it('deve carregar o dashboard em menos de 2 segundos', async () => {
    const startTime = performance.now();

    render(<MapView />);

    await waitFor(() => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      // Considera tempo de renderização do componente
      expect(loadTime).toBeLessThan(2000);
    });
  });

  it('deve renderizar múltiplos pontos rapidamente', async () => {
    const manyPoints = Array.from({ length: 100 }, (_, i) => ({
      id: `point-${i}`,
      nome: `Ponto ${i}`,
      tipo: 'parque' as const,
      latitude: -23.5505 + (Math.random() - 0.5) * 0.1,
      longitude: -46.6333 + (Math.random() - 0.5) * 0.1,
      descricao: `Descrição do ponto ${i}`,
      horario_funcionamento: '24h',
      endereco: `Endereço ${i}`,
      contato: '(11) 0000-0000'
    }));

    mockUseMapData.mockReturnValue({
      pontos: manyPoints,
      loading: false,
      error: null,
      refetchData: jest.fn(),
    });

    const startTime = performance.now();

    render(<MapView />);

    await waitFor(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Deve renderizar 100 pontos em menos de 1 segundo
      expect(renderTime).toBeLessThan(1000);
    });
  });
});
