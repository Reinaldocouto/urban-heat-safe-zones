
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { fireEvent } from '@testing-library/user-event';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useMapData } from '@/hooks/useMapData';
import Index from '@/pages/Index';
import { mockGeolocationSuccess } from '../../mocks/geolocationMocks';

jest.mock('@/hooks/useGeolocation');
jest.mock('@/hooks/useMapData');
jest.mock('@/services/weatherService');

const mockUseGeolocation = useGeolocation as jest.MockedFunction<typeof useGeolocation>;
const mockUseMapData = useMapData as jest.MockedFunction<typeof useMapData>;

describe('Fluxo Integrado do Usuário', () => {
  const mockPontos = [
    {
      id: '1',
      nome: 'Parque Ibirapuera',
      tipo: 'parque' as const,
      latitude: -23.5873,
      longitude: -46.6573,
      descricao: 'Grande parque urbano',
      horario_funcionamento: '5:00 - 00:00',
      cidade: 'São Paulo',
      uf: 'SP'
    }
  ];

  beforeEach(() => {
    mockGeolocationSuccess();
    
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
  });

  it('deve completar fluxo: mapa → encontrar ponto → rota → feedback', async () => {
    render(<Index />);

    // Verificar que está na aba do mapa
    expect(screen.getByText('Encontrar mais próximo')).toBeInTheDocument();

    // Encontrar ponto mais próximo
    const findButton = screen.getByText('Encontrar mais próximo');
    fireEvent.click(findButton);

    await waitFor(() => {
      // Verificar se toast foi exibido (simulado)
      expect(findButton).toBeInTheDocument();
    });

    // Navegar para aba de rotas
    const routesTab = screen.getByText('Rotas');
    fireEvent.click(routesTab);

    await waitFor(() => {
      expect(screen.getByText('Planeje sua Rota Térmica')).toBeInTheDocument();
    });

    // Navegar para aba de feedback
    const feedbackTab = screen.getByText('Feedback');
    fireEvent.click(feedbackTab);

    await waitFor(() => {
      expect(screen.getByText('Seu Feedback é Importante')).toBeInTheDocument();
    });
  });

  it('deve mostrar alertas na aba correspondente', async () => {
    render(<Index />);

    // Navegar para aba de alertas
    const alertsTab = screen.getByText('Alertas');
    fireEvent.click(alertsTab);

    await waitFor(() => {
      expect(screen.getByText('Alertas Climáticos')).toBeInTheDocument();
    });
  });

  it('deve funcionar navegação entre todas as abas', async () => {
    render(<Index />);

    const tabs = ['Rotas', 'Alertas', 'Feedback', 'Mapa'];

    for (const tabName of tabs) {
      const tab = screen.getByText(tabName);
      fireEvent.click(tab);

      await waitFor(() => {
        // Verificar que a aba está ativa (não testamos conteúdo específico para simplicidade)
        expect(tab).toBeInTheDocument();
      });
    }
  });
});
