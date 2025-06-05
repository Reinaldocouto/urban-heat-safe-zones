
import React from 'react';
import { PontoResfriamento } from '@/services/supabaseService';
import { X, Clock, MapPin, Building } from 'lucide-react';

interface PointDetailsPanelProps {
  point: PontoResfriamento;
  onClose: () => void;
}

const getTipoIcon = (tipo: PontoResfriamento['tipo']) => {
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

const getTipoLabel = (tipo: PontoResfriamento['tipo']) => {
  switch (tipo) {
    case 'parque':
      return 'Parque';
    case 'fonte':
      return 'Fonte de Água';
    case 'abrigo':
      return 'Abrigo Climatizado';
    default:
      return 'Ponto de Resfriamento';
  }
};

const PointDetailsPanel: React.FC<PointDetailsPanelProps> = ({ point, onClose }) => (
  <div className="w-full lg:w-96 bg-white shadow-xl border-l border-gray-200">
    <div className="p-4 bg-fiap-red text-white flex justify-between items-center">
      <h3 className="text-lg font-semibold truncate">{point.nome}</h3>
      <button 
        onClick={onClose} 
        className="text-white hover:text-gray-200 transition-colors p-1"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
    
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{getTipoIcon(point.tipo)}</span>
        <div>
          <p className="font-medium text-fiap-gray-dark">{getTipoLabel(point.tipo)}</p>
          <p className="text-sm text-gray-600">{point.descricao}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Clock className="h-4 w-4 text-fiap-red mt-0.5" />
          <div>
            <p className="text-sm font-medium text-fiap-gray-dark">Horário de Funcionamento</p>
            <p className="text-sm text-gray-600">{point.horario_funcionamento}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <MapPin className="h-4 w-4 text-fiap-red mt-0.5" />
          <div>
            <p className="text-sm font-medium text-fiap-gray-dark">Localização</p>
            <p className="text-sm text-gray-600">{point.cidade}, {point.uf}</p>
            <p className="text-xs text-gray-500">
              {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <button className="w-full bg-fiap-red text-white py-2 px-4 rounded-md hover:bg-fiap-red/90 transition-colors">
          Como chegar
        </button>
      </div>
    </div>
  </div>
);

export default PointDetailsPanel;
