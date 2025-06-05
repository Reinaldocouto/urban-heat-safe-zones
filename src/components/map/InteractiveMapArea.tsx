
import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { PontoResfriamento } from '@/services/supabaseService';

interface InteractiveMapAreaProps {
  pontos: PontoResfriamento[];
  onPointSelect: (point: PontoResfriamento) => void;
  selectedPoint?: PontoResfriamento | null;
}

const getPointIcon = (tipo: PontoResfriamento['tipo']) => {
  switch (tipo) {
    case 'parque':
      return '🌳';
    case 'fonte':
      return '💧';
    case 'abrigo':
      return '🏠';
    default:
      return '📍';
  }
};

const getPointColor = (tipo: PontoResfriamento['tipo']) => {
  switch (tipo) {
    case 'parque':
      return '#10b981'; // green-500
    case 'fonte':
      return '#3b82f6'; // blue-500
    case 'abrigo':
      return '#ed145b'; // fiap-red
    default:
      return '#6b7280'; // gray-500
  }
};

const InteractiveMapArea: React.FC<InteractiveMapAreaProps> = ({ 
  pontos, 
  onPointSelect, 
  selectedPoint 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize MapLibre map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=demo', // Using demo style
      center: [-46.6333, -23.5505], // São Paulo center
      zoom: 10,
      pitch: 0,
      bearing: 0
    });

    // Add navigation controls
    map.current.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
        showZoom: true,
        showCompass: true
      }),
      'top-right'
    );

    // Add scale control
    map.current.addControl(new maplibregl.ScaleControl(), 'bottom-left');

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when pontos change
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    pontos.forEach((ponto) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = getPointColor(ponto.tipo);
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontSize = '14px';
      el.style.cursor = 'pointer';
      el.style.transition = 'transform 0.2s';
      el.textContent = getPointIcon(ponto.tipo);

      // Add hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
        el.style.zIndex = '1000';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.zIndex = 'auto';
      });

      // Add click handler
      el.addEventListener('click', () => {
        onPointSelect(ponto);
      });

      // Create marker
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([ponto.longitude, ponto.latitude])
        .addTo(map.current!);

      // Create popup
      const popup = new maplibregl.Popup({ 
        offset: 25,
        closeButton: false,
        closeOnClick: false
      }).setHTML(`
        <div class="p-2">
          <div class="flex items-center space-x-2 mb-1">
            <span class="text-lg">${getPointIcon(ponto.tipo)}</span>
            <h4 class="font-semibold text-sm">${ponto.nome}</h4>
          </div>
          <p class="text-xs text-gray-600 mb-1">${ponto.descricao}</p>
          <p class="text-xs text-gray-500">
            <strong>Horário:</strong> ${ponto.horario_funcionamento}
          </p>
        </div>
      `);

      // Show popup on hover
      el.addEventListener('mouseenter', () => {
        popup.setLngLat([ponto.longitude, ponto.latitude]).addTo(map.current!);
      });

      el.addEventListener('mouseleave', () => {
        popup.remove();
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all points
    if (pontos.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      pontos.forEach(ponto => {
        bounds.extend([ponto.longitude, ponto.latitude]);
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [pontos, onPointSelect]);

  // Highlight selected point
  useEffect(() => {
    if (!map.current || !selectedPoint) return;

    // Center map on selected point
    map.current.flyTo({
      center: [selectedPoint.longitude, selectedPoint.latitude],
      zoom: 14,
      duration: 1000
    });

    // Update marker styles to highlight selected
    markersRef.current.forEach((marker, index) => {
      const ponto = pontos[index];
      const element = marker.getElement();
      
      if (ponto && ponto.id === selectedPoint.id) {
        element.style.transform = 'scale(1.3)';
        element.style.border = '3px solid #ed145b';
        element.style.zIndex = '1001';
      } else {
        element.style.transform = 'scale(1)';
        element.style.border = '2px solid white';
        element.style.zIndex = 'auto';
      }
    });
  }, [selectedPoint, pontos]);

  return (
    <div className="relative w-full h-full">
      {/* MapLibre container */}
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />

      {/* Loading overlay */}
      {pontos.length === 0 && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fiap-red mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Carregando pontos no mapa...</p>
          </div>
        </div>
      )}

      {/* Map info overlay */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md pointer-events-none">
        <h3 className="font-bold text-gray-800 text-sm">Grande São Paulo</h3>
        <p className="text-xs text-gray-600">{pontos.length} pontos de resfriamento</p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-md">
        <h4 className="font-semibold text-sm mb-2 text-gray-800">Legenda</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-xs">🌳</div>
            <span>Parques</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs">💧</div>
            <span>Fontes</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-fiap-red rounded-full flex items-center justify-center text-xs">🏠</div>
            <span>Abrigos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapArea;
