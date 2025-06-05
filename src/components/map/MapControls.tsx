
import React from 'react';
import { MapPin, Route, Loader2 } from 'lucide-react';

interface MapControlsProps {
  onFindNearest: () => void;
  onCalculateRoute?: () => void;
  disabled: boolean;
  isCalculatingRoute?: boolean;
  hasSelectedPoint?: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({ 
  onFindNearest, 
  onCalculateRoute, 
  disabled, 
  isCalculatingRoute = false,
  hasSelectedPoint = false
}) => {
  return (
    <div className="absolute top-4 left-4 z-10 space-y-2">
      <button
        onClick={onFindNearest}
        disabled={disabled}
        className="bg-fiap-red text-white py-2 px-4 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-fiap-red/90 transition-colors flex items-center space-x-2 w-full"
      >
        <MapPin className="h-4 w-4" />
        <span className="hidden sm:inline">Encontrar mais próximo</span>
        <span className="sm:hidden">Próximo</span>
      </button>
      
      {onCalculateRoute && (
        <button
          onClick={onCalculateRoute}
          disabled={disabled || !hasSelectedPoint || isCalculatingRoute}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center space-x-2 w-full"
        >
          {isCalculatingRoute ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Route className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {isCalculatingRoute ? 'Calculando...' : 'Rota térmica'}
          </span>
          <span className="sm:hidden">
            {isCalculatingRoute ? 'Calc...' : 'Rota'}
          </span>
        </button>
      )}
    </div>
  );
};

export default MapControls;
