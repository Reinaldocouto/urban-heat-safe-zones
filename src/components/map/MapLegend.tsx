
import React from 'react';

const MapLegend: React.FC = () => (
  <div className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
    <h4 className="font-semibold text-sm mb-2 text-fiap-gray-dark">Legenda</h4>
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-sm">
        <div className="w-3 h-3 bg-green-500 rounded-full border border-white shadow-sm"></div>
        <span>Parques</span>
      </div>
      <div className="flex items-center space-x-2 text-sm">
        <div className="w-3 h-3 bg-blue-500 rounded-full border border-white shadow-sm"></div>
        <span>Fontes</span>
      </div>
      <div className="flex items-center space-x-2 text-sm">
        <div className="w-3 h-3 bg-gray-500 rounded-full border border-white shadow-sm"></div>
        <span>Abrigos</span>
      </div>
      <div className="flex items-center space-x-2 text-sm mt-3 pt-2 border-t border-gray-200">
        <div className="w-3 h-3 bg-blue-600 rounded-full border border-white shadow-sm animate-pulse"></div>
        <span>Você</span>
      </div>
    </div>
  </div>
);

export default MapLegend;
