
import React, { useState, useCallback } from 'react';

import { useToast } from '@/hooks/use-toast';
import { useGeolocation } from '@/hooks/useGeolocation';
import { PontoResfriamento } from '@/services/supabaseService';
import { findNearestPoint } from '@/utils/distance';
import { useMapData } from '@/hooks/useMapData';
import MapControls from './MapControls';
import TemperatureDisplay from './TemperatureDisplay';
import MapLegend from './MapLegend';
import PointDetailsPanel from './PointDetailsPanel';

const MapView = () => {
  const [selectedPoint, setSelectedPoint] = useState<PontoResfriamento | null>(null);

  const { latitude: userLat, longitude: userLon, loading: geoLoading, error: geoError } = useGeolocation();
  const { pontos, loading: dataLoading, error: dataError } = useMapData();
  const { toast } = useToast();

  const handleFindNearest = useCallback(() => {
    if (!userLat || !userLon) {
      toast({ 
        title: 'Localização não disponível', 
        description: geoError || 'Permita o acesso à localização para encontrar o ponto mais próximo.', 
        variant: 'destructive' 
      });
      return;
    }
    
    if (pontos.length === 0) {
      toast({ 
        title: 'Nenhum ponto encontrado', 
        description: 'Não há pontos de resfriamento disponíveis no momento.', 
        variant: 'destructive' 
      });
      return;
    }
    
    try {
      const { point, distance } = findNearestPoint(userLat, userLon, pontos);
      setSelectedPoint(point);
      toast({ 
        title: 'Ponto mais próximo encontrado!', 
        description: `${point.nome} está a ${distance.toFixed(1)} km de você.` 
      });
    } catch (error) {
      toast({ 
        title: 'Erro ao encontrar ponto', 
        description: 'Não foi possível calcular o ponto mais próximo.', 
        variant: 'destructive' 
      });
    }
  }, [userLat, userLon, pontos, toast, geoError]);

  const handlePointSelect = (point: PontoResfriamento) => {
    setSelectedPoint(point);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row">
      <div className="flex-1 relative">
        {/* Map Placeholder */}
        <div className="w-full h-full bg-gray-100 relative flex items-center justify-center">
          <div className="text-center p-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Mapa de Pontos de Resfriamento</h3>
            <p className="text-gray-600 mb-4">São Paulo - SP</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
              {pontos.map((point) => (
                <div 
                  key={point.id} 
                  className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handlePointSelect(point)}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">
                      {point.tipo === 'parque' ? '🌳' : point.tipo === 'fonte' ? '💧' : '🏠'}
                    </span>
                    <h4 className="font-semibold text-sm">{point.nome}</h4>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{point.descricao}</p>
                  <p className="text-xs text-gray-500">{point.horario_funcionamento}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <MapControls 
          onFindNearest={handleFindNearest}
          disabled={!userLat || !userLon || geoLoading}
        />

        <TemperatureDisplay />
        <MapLegend />
      </div>

      {selectedPoint && (
        <PointDetailsPanel 
          point={selectedPoint} 
          onClose={() => setSelectedPoint(null)} 
        />
      )}

      {(dataLoading || geoLoading) && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fiap-red mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">
              {geoLoading ? 'Obtendo localização...' : 'Carregando pontos...'}
            </p>
          </div>
        </div>
      )}

      {(dataError || geoError) && (
        <div className="absolute top-20 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <strong>Aviso:</strong> {dataError || geoError}
        </div>
      )}
    </div>
  );
};

export default MapView;
