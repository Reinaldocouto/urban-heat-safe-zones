
import React from 'react';
import { MapPin, Route, AlertTriangle, MessageCircle } from 'lucide-react';

interface NavigationProps {
  currentTab: 'map' | 'routes' | 'alerts' | 'feedback';
  onChangeTab: (tab: 'map' | 'routes' | 'alerts' | 'feedback') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, onChangeTab }) => {
  const tabs = [
    { id: 'map' as const, label: 'Mapa', icon: MapPin },
    { id: 'routes' as const, label: 'Rotas', icon: Route },
    { id: 'alerts' as const, label: 'Alertas', icon: AlertTriangle },
    { id: 'feedback' as const, label: 'Feedback', icon: MessageCircle },
  ];

  return (
    <nav className="bg-fiap-red text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8" />
            <h1 className="text-xl font-bold">Clima Safe</h1>
            <span className="text-sm opacity-75">FIAP Climate</span>
          </div>
          
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onChangeTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    currentTab === tab.id
                      ? 'bg-white text-fiap-red'
                      : 'hover:bg-fiap-red/80'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
