
import React, { useState, useCallback } from 'react';
import Map, { Popup, NavigationControl } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { useToast } from '@/hooks/use-toast';
import { useGeolocation } from '@/hooks/useGeolocation';
import { PontoResfriamento } from '@/services/supabaseService';
import { findNearestPoint } from '@/utils/distance';
import { useMapData } from '@/hooks/useMapData';
import MapMarkers from './MapMarkers';
import MapControls from './MapControls';
import TemperatureDisplay from './TemperatureDisplay';
import MapLegend from './MapLegend';
import PointDetailsPanel from './PointDetailsPanel';

const MapView = () => {
  const [selectedPoint, setSelectedPoint] = useState<PontoResfriamento | null>(null);
  const [viewState, setViewState] = useState({
    longitude: -46.6333,
    latitude: -23.5505,
    zoom: 12,
  });

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
      setViewState({ 
        longitude: point.longitude, 
        latitude: point.latitude, 
        zoom: 15 
      });
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

  return (
    <div className="h-full flex flex-col lg:flex-row">
      <div className="flex-1 relative">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          style={{ width: '100%', height: '100%' }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        >
          <NavigationControl position="top-right" />
          
          <MapMarkers 
            pontos={pontos}
            onPointSelect={setSelectedPoint}
            userLat={userLat}
            userLon={userLon}
          />
          
          {selectedPoint && (
            <Popup
              longitude={selectedPoint.longitude}
              latitude={selectedPoint.latitude}
              anchor="top"
              onClose={() => setSelectedPoint(null)}
              closeButton
              closeOnClick={false}
            >
              <div className="p-2 max-w-xs">
                <h3 className="font-semibold text-sm">{selectedPoint.nome}</h3>
                <p className="text-xs text-gray-600 mt-1">{selectedPoint.descricao}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Horário: {selectedPoint.horario_funcionamento}
                </p>
              </div>
            </Popup>
          )}
        </Map>

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
