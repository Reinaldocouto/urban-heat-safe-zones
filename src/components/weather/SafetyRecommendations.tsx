
import React from 'react';
import { Shield, Clock, Sun, Droplets, Wind } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ForecastData } from '@/services/weatherService';

interface SafetyRecommendationsProps {
  weatherData: ForecastData | null;
}

const SafetyRecommendations: React.FC<SafetyRecommendationsProps> = ({ weatherData }) => {
  const generateRecommendations = () => {
    if (!weatherData) return [];

    const recommendations = [];
    const currentHour = new Date().getHours();

    // Temperature-based recommendations
    if (weatherData.temperature > 32) {
      recommendations.push({
        icon: <Sun className="h-4 w-4 text-red-500" />,
        title: 'Temperatura Elevada',
        message: 'Evite atividades físicas ao ar livre. Busque locais climatizados.',
        priority: 'high'
      });
    } else if (weatherData.temperature > 28) {
      recommendations.push({
        icon: <Sun className="h-4 w-4 text-orange-500" />,
        title: 'Calor Moderado',
        message: 'Mantenha-se hidratado e use roupas leves e claras.',
        priority: 'medium'
      });
    }

    // UV-based recommendations
    if (weatherData.uv > 7) {
      recommendations.push({
        icon: <Sun className="h-4 w-4 text-purple-500" />,
        title: 'Índice UV Muito Alto',
        message: 'Use protetor solar FPS 30+, chapéu e óculos escuros.',
        priority: 'high'
      });
    } else if (weatherData.uv > 5) {
      recommendations.push({
        icon: <Sun className="h-4 w-4 text-orange-500" />,
        title: 'Índice UV Alto',
        message: 'Use protetor solar e evite exposição prolongada ao sol.',
        priority: 'medium'
      });
    }

    // Time-based recommendations
    if (currentHour >= 11 && currentHour <= 15 && weatherData.uv > 6) {
      recommendations.push({
        icon: <Clock className="h-4 w-4 text-red-500" />,
        title: 'Horário de Pico Solar',
        message: 'Evite sair ao sol entre 11h e 15h. Busque sombra.',
        priority: 'high'
      });
    }

    // Humidity-based recommendations
    if (weatherData.humidity < 30) {
      recommendations.push({
        icon: <Droplets className="h-4 w-4 text-blue-500" />,
        title: 'Umidade Muito Baixa',
        message: 'Hidrate-se frequentemente e use umidificador em ambientes fechados.',
        priority: 'medium'
      });
    } else if (weatherData.humidity > 80 && weatherData.temperature > 28) {
      recommendations.push({
        icon: <Droplets className="h-4 w-4 text-blue-500" />,
        title: 'Umidade Alta',
        message: 'Sensação térmica elevada. Prefira ambientes ventilados.',
        priority: 'medium'
      });
    }

    // Wind-based recommendations
    if (weatherData.windSpeed > 25) {
      recommendations.push({
        icon: <Wind className="h-4 w-4 text-gray-500" />,
        title: 'Ventos Fortes',
        message: 'Cuidado com objetos soltos. Evite guarda-sóis na praia.',
        priority: 'medium'
      });
    }

    // General recommendations
    if (recommendations.length === 0 || recommendations.every(r => r.priority === 'low')) {
      recommendations.push({
        icon: <Shield className="h-4 w-4 text-green-500" />,
        title: 'Condições Favoráveis',
        message: 'Bom momento para atividades ao ar livre. Mantenha-se hidratado.',
        priority: 'low'
      });
    }

    return recommendations.slice(0, 4); // Limit to 4 recommendations
  };

  const recommendations = generateRecommendations();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-orange-500 bg-orange-50';
      default:
        return 'border-l-green-500 bg-green-50';
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-3 flex items-center">
        <Shield className="h-4 w-4 mr-2 text-fiap-red" />
        Recomendações de Segurança
      </h3>
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`border-l-4 p-3 rounded-r-lg ${getPriorityColor(rec.priority)}`}
          >
            <div className="flex items-start space-x-2">
              {rec.icon}
              <div className="flex-1">
                <div className="font-medium text-sm">{rec.title}</div>
                <div className="text-xs text-gray-600 mt-1">{rec.message}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Future: Defesa Civil Integration Placeholder */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-xs text-gray-500 font-medium">Em Desenvolvimento</div>
          <div className="text-xs text-gray-400 mt-1">
            Integração com alertas da Defesa Civil - SP
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SafetyRecommendations;
