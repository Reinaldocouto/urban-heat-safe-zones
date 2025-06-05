
import React from 'react';
import { Marker } from 'react-map-gl';
import { PontoResfriamento } from '@/services/supabaseService';

interface MapMarkersProps {
  pontos: PontoResfriamento[];
  onPointSelect: (p: PontoResfriamento) => void;
  userLat?: number;
  userLon?: number;
}

const getMarkerColor = (tipo: PontoResfriamento['tipo']) => {
  switch (tipo) {
    case 'parque':
      return 'bg-green-500';
    case 'fonte':
      return 'bg-blue-500';
    case 'abrigo':
      return 'bg-gray-500';
    default:
      return 'bg-fiap-red';
  }
};

const MapMarkers: React.FC<MapMarkersProps> = ({ pontos, onPointSelect, userLat, userLon }) => {
  return (
    <>
      {pontos.map((p) => (
        <Marker 
          key={p.id} 
          longitude={p.longitude} 
          latitude={p.latitude}
          anchor="bottom"
        >
          <button
            onClick={() => onPointSelect(p)}
            className={`w-6 h-6 rounded-full ${getMarkerColor(p.tipo)} border-2 border-white shadow-lg hover:scale-110 transition-transform`}
            title={p.nome}
          />
        </Marker>
      ))}
      
      {userLat && userLon && (
        <Marker longitude={userLon} latitude={userLat} anchor="bottom">
          <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse" 
               title="Sua localização" />
        </Marker>
      )}
    </>
  );
};

export default MapMarkers;
