
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import MapView from '@/components/map/MapView';
import RoutePlanner from '@/components/RoutePlanner';
import ClimateAlerts from '@/components/ClimateAlerts';
import UserFeedback from '@/components/UserFeedback';
import DevTools from '@/components/DevTools';

const Index: React.FC = () => {
  const [tab, setTab] = useState<'map' | 'routes' | 'alerts' | 'feedback'>('map');

  // Mostrar DevTools em desenvolvimento, preview e staging (apenas ocultar em produção real)
  const showDevTools = import.meta.env.DEV || 
                       window.location.hostname.includes('lovable.app') ||
                       window.location.hostname.includes('vercel.app') ||
                       import.meta.env.MODE !== 'production';

  return (
    <div className="h-screen flex flex-col bg-fiap-gray-light">
      <Navigation currentTab={tab} onChangeTab={setTab} />
      <div className="flex-1 overflow-hidden">
        {tab === 'map' && <MapView />}
        {tab === 'routes' && <RoutePlanner />}
        {tab === 'alerts' && <ClimateAlerts />}
        {tab === 'feedback' && <UserFeedback />}
      </div>
      
      {/* DevTools - aparece em desenvolvimento, preview e staging */}
      {showDevTools && <DevTools />}
    </div>
  );
};

export default Index;
