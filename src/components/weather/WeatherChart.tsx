
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WeatherChartProps {
  latitude: number;
  longitude: number;
}

interface HourlyData {
  time: string;
  temperature: number;
  uv: number;
  hour: number;
}

const WeatherChart: React.FC<WeatherChartProps> = ({ latitude, longitude }) => {
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate mock 24-hour forecast data
    const generateHourlyData = () => {
      const data: HourlyData[] = [];
      const currentHour = new Date().getHours();
      const baseTemp = 20 + Math.random() * 15; // Base temperature between 20-35°C
      
      for (let i = 0; i < 24; i++) {
        const hour = (currentHour + i) % 24;
        // Temperature variation throughout the day
        const tempVariation = Math.sin((hour - 6) / 24 * 2 * Math.PI) * 8;
        const temperature = Math.round(baseTemp + tempVariation + (Math.random() - 0.5) * 4);
        
        // UV index (0 during night, peaks at midday)
        let uv = 0;
        if (hour >= 6 && hour <= 18) {
          uv = Math.round(Math.sin((hour - 6) / 12 * Math.PI) * 10);
        }
        
        data.push({
          time: `${hour.toString().padStart(2, '0')}:00`,
          temperature,
          uv,
          hour
        });
      }
      
      setHourlyData(data);
      setIsLoading(false);
    };

    generateHourlyData();
  }, [latitude, longitude]);

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-3">Previsão 24 Horas</h3>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              fontSize={10}
              interval={5}
            />
            <YAxis 
              fontSize={10}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip 
              contentStyle={{ 
                fontSize: '12px',
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <Legend fontSize={10} />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Temperatura (°C)"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="uv" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="Índice UV"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default WeatherChart;
