
import React from 'react';
import { PontoResfriamento } from '@/services/supabaseService';

interface MapMarkersProps {
  pontos: PontoResfriamento[];
  onPointSelect: (p: PontoResfriamento) => void;
  userLat?: number;
  userLon?: number;
}

const MapMarkers: React.FC<MapMarkersProps> = ({ pontos, onPointSelect }) => {
  // This component is now simplified since we removed the actual map
  return (
    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
      <h4 className="font-semibold text-sm mb-2">Pontos Disponíveis</h4>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {pontos.map((point) => (
          <button
            key={point.id}
            onClick={() => onPointSelect(point)}
            className="block w-full text-left text-xs p-2 hover:bg-gray-100 rounded"
          >
            {point.nome}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MapMarkers;
