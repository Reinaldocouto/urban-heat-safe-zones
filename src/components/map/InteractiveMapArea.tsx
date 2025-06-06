
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
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Initialize MapLibre map with OpenStreetMap tiles (free and reliable)
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm'
            }
          ]
        },
        center: [-46.6333, -23.5505], // São Paulo center
        zoom: 10,
        pitch: 0,
        bearing: 0
      });

      map.current.on('load', () => {
        console.log('MapLibre carregado com sucesso');
        setIsMapLoaded(true);
      });

      map.current.on('error', (e) => {
        console.error('Erro no MapLibre:', e);
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

    } catch (error) {
      console.error('Erro ao inicializar MapLibre:', error);
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        setIsMapLoaded(false);
      }
    };
  }, []);

  // Update markers when pontos change
  useEffect(() => {
    if (!map.current || !isMapLoaded || pontos.length === 0) return;

    console.log('Adicionando marcadores para', pontos.length, 'pontos');

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers with FIXED positioning and stable hover
    pontos.forEach((ponto, index) => {
      // Handle different data types for coordinates
      let lat: number;
      let lng: number;
      
      if (typeof ponto.latitude === 'string') {
        lat = parseFloat(ponto.latitude);
      } else {
        lat = Number(ponto.latitude);
      }
      
      if (typeof ponto.longitude === 'string') {
        lng = parseFloat(ponto.longitude);
      } else {
        lng = Number(ponto.longitude);
      }
      
      // Validate coordinates
      if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
        console.error(`Coordenadas inválidas para ${ponto.nome}: lat=${lat}, lng=${lng}`);
        return;
      }
      
      if (lat < -24 || lat > -23 || lng < -47 || lng > -46) {
        console.warn(`Coordenadas fora dos limites de São Paulo para ${ponto.nome}: [${lng}, ${lat}]`);
      }

      console.log(`Criando marcador ${index + 1}/${pontos.length} para ${ponto.nome} em coordenadas: [${lng}, ${lat}]`);
      
      // Create marker element with STATIC styling
      const el = document.createElement('div');
      el.className = 'cooling-point-marker';
      el.setAttribute('data-marker-id', ponto.id);
      
      // STATIC styling - sem position absolute ou transform manual
      el.style.cssText = `
        width: 32px;
        height: 32px;
        background-color: ${getPointColor(ponto.tipo)};
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        user-select: none;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        z-index: 100;
      `;
      el.innerHTML = getPointIcon(ponto.tipo);

      // Create persistent popup (não remove automaticamente)
      const popup = new maplibregl.Popup({ 
        offset: 25,
        closeButton: false,
        closeOnClick: false,
        anchor: 'bottom',
        className: 'marker-popup'
      }).setHTML(`
        <div class="p-3 min-w-48">
          <div class="flex items-center space-x-2 mb-2">
            <span class="text-lg">${getPointIcon(ponto.tipo)}</span>
            <h4 class="font-semibold text-sm text-gray-800">${ponto.nome}</h4>
          </div>
          <p class="text-xs text-gray-600 mb-2">${ponto.descricao}</p>
          <p class="text-xs text-gray-500">
            <strong>Horário:</strong> ${ponto.horario_funcionamento}
          </p>
          <p class="text-xs text-blue-600 font-medium mt-1">
            👆 Clique para ver detalhes
          </p>
        </div>
      `);

      // Event listeners com debounce para evitar conflitos
      let hoverTimeout: NodeJS.Timeout;
      let isHovering = false;

      const handleMouseEnter = () => {
        if (hoverTimeout) clearTimeout(hoverTimeout);
        if (!isHovering) {
          isHovering = true;
          setHoveredMarkerId(ponto.id);
          
          // Scale up effect
          el.style.transform = 'scale(1.2)';
          el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
          el.style.zIndex = '1001';
          
          // Show popup
          popup.setLngLat([lng, lat]).addTo(map.current!);
        }
      };

      const handleMouseLeave = () => {
        hoverTimeout = setTimeout(() => {
          if (isHovering) {
            isHovering = false;
            setHoveredMarkerId(null);
            
            // Reset scale
            el.style.transform = 'scale(1)';
            el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
            el.style.zIndex = '100';
            
            // Hide popup
            popup.remove();
          }
        }, 100); // Small delay to prevent flickering
      };

      const handleClick = (e: Event) => {
        e.stopPropagation();
        console.log('Marker clicked:', ponto.nome);
        onPointSelect(ponto);
        popup.remove();
      };

      // Add event listeners
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
      el.addEventListener('click', handleClick);

      // Create MapLibre marker with center anchor
      try {
        const marker = new maplibregl.Marker({ 
          element: el,
          anchor: 'center' // MapLibre handles positioning automatically
        })
          .setLngLat([lng, lat])
          .addTo(map.current!);

        markersRef.current.push(marker);
        console.log(`Marcador ${index + 1} criado com sucesso para ${ponto.nome}`);
      } catch (error) {
        console.error(`Erro ao criar marcador para ${ponto.nome}:`, error);
      }
    });

    console.log(`Total de marcadores criados: ${markersRef.current.length}`);

    // Fit map to show all points
    if (markersRef.current.length > 0 && pontos.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      pontos.forEach(ponto => {
        const lat = typeof ponto.latitude === 'string' ? parseFloat(ponto.latitude) : Number(ponto.latitude);
        const lng = typeof ponto.longitude === 'string' ? parseFloat(ponto.longitude) : Number(ponto.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          bounds.extend([lng, lat]);
        }
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [pontos, onPointSelect, isMapLoaded]);

  // Highlight selected point
  useEffect(() => {
    if (!map.current || !selectedPoint || !isMapLoaded) return;

    const lat = typeof selectedPoint.latitude === 'string' ? parseFloat(selectedPoint.latitude) : Number(selectedPoint.latitude);
    const lng = typeof selectedPoint.longitude === 'string' ? parseFloat(selectedPoint.longitude) : Number(selectedPoint.longitude);

    if (isNaN(lat) || isNaN(lng)) return;

    // Center map on selected point
    map.current.flyTo({
      center: [lng, lat],
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
      } else if (hoveredMarkerId !== ponto?.id) {
        element.style.transform = 'scale(1)';
        element.style.border = '2px solid white';
        element.style.zIndex = '100';
      }
    });
  }, [selectedPoint, pontos, isMapLoaded, hoveredMarkerId]);

  return (
    <div className="relative w-full h-full">
      {/* MapLibre container */}
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />

      {/* Loading overlay */}
      {(!isMapLoaded || pontos.length === 0) && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fiap-red mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">
              {!isMapLoaded ? 'Carregando mapa...' : 'Carregando pontos no mapa...'}
            </p>
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
        <p className="text-xs text-gray-500 mt-2 border-t pt-2">
          👆 Clique nos ícones para ver detalhes
        </p>
      </div>
    </div>
  );
};

export default InteractiveMapArea;
