
import React from 'react';
import { MapPin } from 'lucide-react';

interface MapControlsProps {
  onFindNearest: () => void;
  disabled: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({ onFindNearest, disabled }) => {
  return (
    <div className="absolute top-4 left-4 z-10">
      <button
        onClick={onFindNearest}
        disabled={disabled}
        className="bg-fiap-red text-white py-2 px-4 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-fiap-red/90 transition-colors flex items-center space-x-2"
      >
        <MapPin className="h-4 w-4" />
        <span className="hidden sm:inline">Encontrar mais próximo</span>
        <span className="sm:hidden">Próximo</span>
      </button>
    </div>
  );
};

export default MapControls;
