
import React from 'react';
import { render, screen, fireEvent } from '../../utils/test-utils';
import MapControls from '@/components/map/MapControls';

describe('MapControls Component', () => {
  const defaultProps = {
    onFindNearest: jest.fn(),
    onCalculateRoute: jest.fn(),
    disabled: false,
    isCalculatingRoute: false,
    hasSelectedPoint: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar todos os botões', () => {
    render(<MapControls {...defaultProps} />);

    expect(screen.getByText('Encontrar mais próximo')).toBeInTheDocument();
    expect(screen.getByText('Rota térmica')).toBeInTheDocument();
  });

  it('deve chamar onFindNearest quando botão é clicado', () => {
    render(<MapControls {...defaultProps} />);

    const button = screen.getByText('Encontrar mais próximo');
    fireEvent.click(button);

    expect(defaultProps.onFindNearest).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onCalculateRoute quando botão de rota é clicado', () => {
    render(<MapControls {...defaultProps} hasSelectedPoint={true} />);

    const button = screen.getByText('Rota térmica');
    fireEvent.click(button);

    expect(defaultProps.onCalculateRoute).toHaveBeenCalledTimes(1);
  });

  it('deve desabilitar botões quando disabled=true', () => {
    render(<MapControls {...defaultProps} disabled={true} />);

    const findButton = screen.getByText('Encontrar mais próximo');
    const routeButton = screen.getByText('Rota térmica');

    expect(findButton).toBeDisabled();
    expect(routeButton).toBeDisabled();
  });

  it('deve mostrar estado de loading na rota', () => {
    render(<MapControls {...defaultProps} isCalculatingRoute={true} hasSelectedPoint={true} />);

    expect(screen.getByText('Calculando...')).toBeInTheDocument();
  });

  it('deve desabilitar rota quando não há ponto selecionado', () => {
    render(<MapControls {...defaultProps} hasSelectedPoint={false} />);

    const routeButton = screen.getByText('Rota térmica');
    expect(routeButton).toBeDisabled();
  });
});
