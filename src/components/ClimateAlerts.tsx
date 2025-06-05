
import React, { useEffect, useState } from 'react';
import { AlertTriangle, Thermometer, Sun, CloudRain } from 'lucide-react';
import { getForecastByCoordinates } from '@/services/weatherService';
import { useGeolocation } from '@/hooks/useGeolocation';

interface Alert {
  id: string;
  type: 'temperature' | 'uv' | 'humidity' | 'general';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
}

const ClimateAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { latitude, longitude } = useGeolocation();

  useEffect(() => {
    async function generateAlerts() {
      if (!latitude || !longitude) return;

      const forecast = await getForecastByCoordinates(latitude, longitude);
      if (!forecast) return;

      const newAlerts: Alert[] = [];

      // Alerta de temperatura alta
      if (forecast.temperature > 30) {
        newAlerts.push({
          id: 'temp-high',
          type: 'temperature',
          title: 'Temperatura Elevada',
          description: `Temperatura atual de ${forecast.temperature}°C. Busque pontos de resfriamento e mantenha-se hidratado.`,
          severity: forecast.temperature > 35 ? 'high' : 'medium',
          timestamp: new Date()
        });
      }

      // Alerta de UV alto
      if (forecast.uv > 6) {
        newAlerts.push({
          id: 'uv-high',
          type: 'uv',
          title: 'Índice UV Elevado',
          description: `Índice UV de ${forecast.uv}. Use protetor solar e evite exposição prolongada ao sol.`,
          severity: forecast.uv > 8 ? 'high' : 'medium',
          timestamp: new Date()
        });
      }

      // Alerta de umidade baixa
      if (forecast.humidity < 30) {
        newAlerts.push({
          id: 'humidity-low',
          type: 'humidity',
          title: 'Umidade Baixa',
          description: `Umidade relativa de ${forecast.humidity}%. Hidrate-se frequentemente e use umidificador se possível.`,
          severity: 'medium',
          timestamp: new Date()
        });
      }

      // Alertas da API
      forecast.alerts.forEach((alert, index) => {
        newAlerts.push({
          id: `api-alert-${index}`,
          type: 'general',
          title: 'Alerta Meteorológico',
          description: alert,
          severity: 'high',
          timestamp: new Date()
        });
      });

      setAlerts(newAlerts);
    }

    generateAlerts();
  }, [latitude, longitude]);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'temperature':
        return <Thermometer className="h-5 w-5" />;
      case 'uv':
        return <Sun className="h-5 w-5" />;
      case 'humidity':
        return <CloudRain className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 border-red-400 text-red-700';
      case 'medium':
        return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      case 'low':
        return 'bg-blue-100 border-blue-400 text-blue-700';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <AlertTriangle className="h-6 w-6 text-fiap-red" />
          <h2 className="text-2xl font-bold text-fiap-gray-dark">Alertas Climáticos</h2>
        </div>

        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-green-600 mb-2">
              <AlertTriangle className="h-12 w-12 mx-auto opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum alerta ativo</h3>
            <p className="text-gray-500">As condições climáticas estão dentro dos parâmetros normais.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 border-l-4 rounded-r-lg ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{alert.title}</h3>
                    <p className="mt-1 text-sm">{alert.description}</p>
                    <p className="mt-2 text-xs opacity-75">
                      {alert.timestamp.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      alert.severity === 'high' ? 'bg-red-200 text-red-800' :
                      alert.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {alert.severity === 'high' ? 'Alto' : alert.severity === 'medium' ? 'Médio' : 'Baixo'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-fiap-gray-light rounded-lg">
          <h3 className="font-semibold text-fiap-gray-dark mb-2">Dicas de Segurança</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• Mantenha-se hidratado, especialmente em dias quentes</li>
            <li>• Use protetor solar com FPS 30+ em horários de pico de UV</li>
            <li>• Procure pontos de resfriamento durante temperaturas extremas</li>
            <li>• Evite atividades físicas intensas entre 10h e 16h</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClimateAlerts;
