
import React, { useState } from 'react';
import { MapPin, Route, Clock, Thermometer } from 'lucide-react';

const RoutePlanner: React.FC = () => {
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');

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
                Origem
              </label>
              <input
                type="text"
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                placeholder="Digite o endereço de origem"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-fiap-red focus:border-fiap-red"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Destino
              </label>
              <input
                type="text"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                placeholder="Digite o endereço de destino"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-fiap-red focus:border-fiap-red"
              />
            </div>
            
            <button className="w-full bg-fiap-red text-white py-3 px-4 rounded-md hover:bg-fiap-red/90 transition-colors">
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
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Em desenvolvimento:</strong> A funcionalidade de roteamento térmico inteligente será implementada em breve, 
            integrando dados meteorológicos em tempo real com algoritmos de otimização de rotas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoutePlanner;
