
import React, { useState } from 'react';
import { MapPin, Route, Clock, Thermometer, Navigation } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useToast } from '@/hooks/use-toast';

const RoutePlanner: React.FC = () => {
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const { latitude, longitude } = useGeolocation();
  const { toast } = useToast();

  const validateCoordinates = (coords: string): boolean => {
    const regex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
    return regex.test(coords.trim());
  };

  const useCurrentLocation = () => {
    if (latitude && longitude) {
      setOrigem(`${latitude}, ${longitude}`);
      toast({
        title: 'Localização atual definida',
        description: 'Sua localização atual foi definida como origem.'
      });
    } else {
      toast({
        title: 'Localização não disponível',
        description: 'Não foi possível obter sua localização atual.',
        variant: 'destructive'
      });
    }
  };

  const handleCalculateRoute = () => {
    if (!origem.trim() || !destino.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha tanto a origem quanto o destino.',
        variant: 'destructive'
      });
      return;
    }

    if (!validateCoordinates(origem) || !validateCoordinates(destino)) {
      toast({
        title: 'Coordenadas inválidas',
        description: 'Use o formato: latitude, longitude (ex: -23.5617, -46.6558)',
        variant: 'destructive'
      });
      return;
    }

    const origemClean = origem.trim().replace(/\s+/g, '');
    const destinoClean = destino.trim().replace(/\s+/g, '');
    
    const googleMapsUrl = `https://www.google.com/maps/dir/${origemClean}/${destinoClean}`;
    
    window.open(googleMapsUrl, '_blank');
    
    toast({
      title: 'Redirecionando para Google Maps',
      description: 'Sua rota térmica está sendo calculada no Google Maps.'
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Route className="h-6 w-6 text-fiap-red" />
          <h2 className="text-2xl font-bold text-fiap-gray-dark">Planeje sua Rota Térmica</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Origem (Coordenadas)
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={origem}
                  onChange={(e) => setOrigem(e.target.value)}
                  placeholder="Ex: -23.5617, -46.6558"
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-fiap-red focus:border-fiap-red"
                />
                <button
                  onClick={useCurrentLocation}
                  className="px-3 py-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  title="Usar localização atual"
                >
                  <Navigation className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Destino (Coordenadas)
              </label>
              <input
                type="text"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                placeholder="Ex: -23.5505, -46.6333"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-fiap-red focus:border-fiap-red"
              />
            </div>
            
            <button 
              onClick={handleCalculateRoute}
              className="w-full bg-fiap-red text-white py-3 px-4 rounded-md hover:bg-fiap-red/90 transition-colors"
            >
              Calcular Rota Térmica
            </button>
          </div>
          
          <div className="bg-fiap-gray-light rounded-lg p-4">
            <h3 className="font-semibold text-fiap-gray-dark mb-3">Funcionalidades da Rota Térmica</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Thermometer className="h-5 w-5 text-fiap-red mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Evita Ilhas de Calor</p>
                  <p className="text-xs text-gray-600">Rota otimizada para áreas mais frescas</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-fiap-red mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Pontos de Resfriamento</p>
                  <p className="text-xs text-gray-600">Inclui paradas estratégicas para descanso</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Clock className="h-5 w-5 text-fiap-red mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Horário Otimizado</p>
                  <p className="text-xs text-gray-600">Sugestões de melhor horário para o trajeto</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            <strong>Funcionalidade disponível para todos:</strong> Agora qualquer usuário pode planejar rotas térmicas 
            inteligentes. A funcionalidade completa será implementada em breve, integrando dados meteorológicos 
            em tempo real com algoritmos de otimização de rotas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoutePlanner;
