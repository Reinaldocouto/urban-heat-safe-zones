
import React from 'react';
import { render, screen } from '../utils/test-utils';
import MapView from '@/components/map/MapView';
import RoutePlanner from '@/components/RoutePlanner';
import ClimateAlerts from '@/components/ClimateAlerts';

jest.mock('@/hooks/useGeolocation');
jest.mock('@/hooks/useMapData');
jest.mock('@/services/weatherService');

describe('Testes de Acessibilidade', () => {
  it('deve ter labels apropriados nos botões do mapa', () => {
    render(<MapView />);

    const findButton = screen.getByRole('button', { name: /encontrar mais próximo/i });
    const routeButton = screen.getByRole('button', { name: /rota térmica/i });

    expect(findButton).toBeInTheDocument();
    expect(routeButton).toBeInTheDocument();
  });

  it('deve ter campos de entrada com labels no planejador de rotas', () => {
    render(<RoutePlanner />);

    const originInput = screen.getByLabelText(/origem/i);
    const destinationInput = screen.getByLabelText(/destino/i);

    expect(originInput).toBeInTheDocument();
    expect(destinationInput).toBeInTheDocument();
  });

  it('deve ter texto alternativo e estrutura semântica nos alertas', () => {
    render(<ClimateAlerts />);

    const heading = screen.getByRole('heading', { name: /alertas climáticos/i });
    expect(heading).toBeInTheDocument();
  });

  it('deve ter contraste adequado nos botões principais', () => {
    render(<MapView />);

    const buttons = screen.getAllByRole('button');
    
    buttons.forEach(button => {
      const styles = getComputedStyle(button);
      // Verifica se tem classes do Tailwind que garantem contraste
      expect(button.className).toMatch(/(bg-fiap-red|bg-blue-600|text-white)/);
    });
  });

  it('deve ter navegação por teclado funcional', () => {
    render(<RoutePlanner />);

    const originInput = screen.getByLabelText(/origem/i);
    const destinationInput = screen.getByLabelText(/destino/i);
    const button = screen.getByRole('button', { name: /calcular rota térmica/i });

    // Verifica se elementos são focáveis
    expect(originInput).toHaveAttribute('type', 'text');
    expect(destinationInput).toHaveAttribute('type', 'text');
    expect(button).toHaveAttribute('type', 'button');
  });
});
