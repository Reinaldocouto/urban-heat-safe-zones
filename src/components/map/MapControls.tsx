
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
    <div className="space-y-3 w-64">
      <button
        onClick={onFindNearest}
        disabled={disabled}
        className="fiap-button text-white py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 w-full font-medium"
      >
        <MapPin className="h-4 w-4" />
        <span>Encontrar mais próximo</span>
      </button>
      
      {onCalculateRoute && (
        <button
          onClick={onCalculateRoute}
          disabled={disabled || !hasSelectedPoint || isCalculatingRoute}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-xl flex items-center space-x-2 w-full font-medium border-2 border-white/20"
        >
          {isCalculatingRoute ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Route className="h-4 w-4" />
          )}
          <span>
            {isCalculatingRoute ? 'Calculando rota...' : 'Rota térmica'}
          </span>
        </button>
      )}
    </div>
  );
};

export default MapControls;
