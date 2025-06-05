
import React, { useState } from 'react';
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
      return 'bg-green-500 border-green-600';
    case 'fonte':
      return 'bg-blue-500 border-blue-600';
    case 'abrigo':
      return 'bg-fiap-red border-red-600';
    default:
      return 'bg-gray-500 border-gray-600';
  }
};

const InteractiveMapArea: React.FC<InteractiveMapAreaProps> = ({ 
  pontos, 
  onPointSelect, 
  selectedPoint 
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<PontoResfriamento | null>(null);

  // Simular posições no mapa baseadas nas coordenadas reais
  const getMapPosition = (lat: number, lon: number) => {
    // Converter coordenadas reais para posições relativas no container
    // São Paulo bounds aproximados: lat: -24 to -23.2, lon: -46.9 to -46.3
    const minLat = -24;
    const maxLat = -23.2;
    const minLon = -46.9;
    const maxLon = -46.3;
    
    const x = ((lon - minLon) / (maxLon - minLon)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    
    return {
      left: `${Math.max(5, Math.min(95, x))}%`,
      top: `${Math.max(5, Math.min(95, y))}%`
    };
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-green-50 via-blue-50 to-green-100 rounded-lg overflow-hidden">
      {/* Fundo do mapa com padrão visual */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Título da região */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
        <h3 className="font-bold text-gray-800">Grande São Paulo</h3>
        <p className="text-sm text-gray-600">{pontos.length} pontos de resfriamento</p>
      </div>

      {/* Pontos no mapa */}
      {pontos.map((ponto) => {
        const position = getMapPosition(ponto.latitude, ponto.longitude);
        const isSelected = selectedPoint?.id === ponto.id;
        const isHovered = hoveredPoint?.id === ponto.id;
        
        return (
          <div
            key={ponto.id}
            className="absolute z-10 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
            style={position}
            onMouseEnter={() => setHoveredPoint(ponto)}
            onMouseLeave={() => setHoveredPoint(null)}
            onClick={() => onPointSelect(ponto)}
          >
            {/* Ícone do ponto */}
            <div
              className={`
                w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm
                transition-all duration-200 shadow-lg
                ${getPointColor(ponto.tipo)}
                ${isSelected ? 'scale-125 ring-4 ring-fiap-red/50' : ''}
                ${isHovered ? 'scale-110' : ''}
                hover:scale-110
              `}
            >
              {getPointIcon(ponto.tipo)}
            </div>

            {/* Tooltip ao passar o mouse */}
            {isHovered && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-20">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{getPointIcon(ponto.tipo)}</span>
                  <h4 className="font-semibold text-gray-800 text-sm">{ponto.nome}</h4>
                </div>
                <p className="text-xs text-gray-600 mb-2">{ponto.descricao}</p>
                <div className="space-y-1 text-xs text-gray-500">
                  <p><strong>Horário:</strong> {ponto.horario_funcionamento}</p>
                  <p><strong>Local:</strong> {ponto.cidade}, {ponto.uf}</p>
                </div>
                {/* Seta do tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white"></div>
              </div>
            )}
          </div>
        );
      })}

      {/* Legenda */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
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
