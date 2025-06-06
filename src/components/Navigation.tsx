
import React from 'react';
import { MapPin, Route, AlertTriangle, MessageCircle, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  currentTab: 'map' | 'routes' | 'alerts' | 'feedback';
  onChangeTab: (tab: 'map' | 'routes' | 'alerts' | 'feedback') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, onChangeTab }) => {
  const { signOut, user } = useAuth();

  const tabs = [
    { id: 'map' as const, label: 'Mapa', icon: MapPin },
    { id: 'routes' as const, label: 'Rotas', icon: Route },
    { id: 'alerts' as const, label: 'Alertas', icon: AlertTriangle },
    { id: 'feedback' as const, label: 'Feedback', icon: MessageCircle },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-fiap-pink text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8" />
            <h1 className="text-xl font-bold">Clima Safe</h1>
            <span className="text-sm opacity-75">FIAP Climate</span>
          </div>
          
          <div className="flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onChangeTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    currentTab === tab.id
                      ? 'bg-white text-fiap-pink'
                      : 'hover:bg-fiap-pink/80'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
            
            <div className="ml-4 flex items-center space-x-2">
              {user ? (
                <>
                  <span className="text-sm opacity-75 hidden sm:inline">
                    Olá, {user.email?.split('@')[0]}
                  </span>
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">Sair</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 border border-white/30"
                    >
                      <LogIn className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">Login</span>
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button
                      size="sm"
                      className="bg-white text-fiap-pink hover:bg-white/90"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">Criar Conta</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
