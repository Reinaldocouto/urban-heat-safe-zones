
import { PontoResfriamento, fetchPontosByProximity } from './supabaseService';
import { getForecastByCoordinates, getRouteWeatherData, ForecastData } from './weatherService';
import { findNearestPoint } from '@/utils/distance';

export interface RoutePoint {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface OptimizedRoute {
  startPoint: RoutePoint;
  endPoint: RoutePoint;
  coolingPoints: PontoResfriamento[];
  weatherData: {
    start: ForecastData | null;
    end: ForecastData | null;
    route: ForecastData | null;
  };
  recommendations: string[];
  estimatedDuration: number; // em minutos
  thermalRisk: 'low' | 'medium' | 'high';
}

export async function calculateOptimalRoute(
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number
): Promise<OptimizedRoute> {
  try {
    console.log('Calculando rota térmica otimizada...');
    
    // Calculate midpoint for route weather
    const midLat = (startLat + endLat) / 2;
    const midLon = (startLon + endLon) / 2;
    
    // Get weather data for route
    const [routeWeatherData, routeMidWeather] = await Promise.all([
      getRouteWeatherData(startLat, startLon, endLat, endLon),
      getForecastByCoordinates(midLat, midLon)
    ]);
    
    // Find cooling points along the route
    const coolingPoints = await findCoolingPointsAlongRoute(
      startLat, startLon, endLat, endLon
    );
    
    // Calculate distance for time estimation (rough calculation)
    const distance = Math.sqrt(
      Math.pow(endLat - startLat, 2) + Math.pow(endLon - startLon, 2)
    ) * 111; // Convert to approximate km
    
    const estimatedDuration = Math.round(distance * 5); // Rough estimate: 5 min per km walking
    
    // Analyze thermal risk
    const thermalRisk = calculateThermalRisk(routeMidWeather);
    
    // Generate recommendations
    const recommendations = generateRouteRecommendations(
      routeMidWeather,
      coolingPoints,
      thermalRisk,
      estimatedDuration
    );
    
    return {
      startPoint: { latitude: startLat, longitude: startLon },
      endPoint: { latitude: endLat, longitude: endLon },
      coolingPoints,
      weatherData: {
        start: routeWeatherData.start,
        end: routeWeatherData.end,
        route: routeMidWeather
      },
      recommendations,
      estimatedDuration,
      thermalRisk
    };
  } catch (error) {
    console.error('Erro ao calcular rota otimizada:', error);
    throw new Error('Não foi possível calcular a rota térmica');
  }
}

async function findCoolingPointsAlongRoute(
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number
): Promise<PontoResfriamento[]> {
  // Get points near start
  const startPoints = await fetchPontosByProximity(startLat, startLon, 3);
  
  // Get points near end
  const endPoints = await fetchPontosByProximity(endLat, endLon, 3);
  
  // Get points near midpoint
  const midLat = (startLat + endLat) / 2;
  const midLon = (startLon + endLon) / 2;
  const midPoints = await fetchPontosByProximity(midLat, midLon, 2);
  
  // Combine and deduplicate
  const allPoints = [...startPoints, ...endPoints, ...midPoints];
  const uniquePoints = allPoints.filter((point, index, self) => 
    index === self.findIndex(p => p.id === point.id)
  );
  
  return uniquePoints.slice(0, 8); // Limit to 8 points for performance
}

function calculateThermalRisk(weather: ForecastData | null): 'low' | 'medium' | 'high' {
  if (!weather) return 'medium';
  
  let riskScore = 0;
  
  // Temperature risk
  if (weather.temperature > 35) riskScore += 3;
  else if (weather.temperature > 30) riskScore += 2;
  else if (weather.temperature > 25) riskScore += 1;
  
  // UV risk
  if (weather.uv > 8) riskScore += 2;
  else if (weather.uv > 6) riskScore += 1;
  
  // Humidity risk (low humidity increases thermal stress)
  if (weather.humidity < 30) riskScore += 2;
  else if (weather.humidity < 50) riskScore += 1;
  
  if (riskScore >= 5) return 'high';
  if (riskScore >= 3) return 'medium';
  return 'low';
}

function generateRouteRecommendations(
  weather: ForecastData | null,
  coolingPoints: PontoResfriamento[],
  thermalRisk: 'low' | 'medium' | 'high',
  duration: number
): string[] {
  const recommendations: string[] = [];
  
  if (thermalRisk === 'high') {
    recommendations.push('⚠️ Risco térmico elevado - considere adiar a viagem');
    recommendations.push('🧴 Leve bastante água e protetor solar');
  } else if (thermalRisk === 'medium') {
    recommendations.push('⚡ Risco térmico moderado - tome precauções');
    recommendations.push('💧 Mantenha-se hidratado durante o trajeto');
  }
  
  if (weather) {
    if (weather.temperature > 30) {
      recommendations.push('🌡️ Temperatura elevada - use roupas leves');
    }
    
    if (weather.uv > 6) {
      recommendations.push('☀️ Índice UV alto - evite exposição direta ao sol');
    }
    
    if (weather.windSpeed > 15) {
      recommendations.push('💨 Ventos fortes - cuidado com objetos soltos');
    }
  }
  
  if (duration > 30) {
    recommendations.push(`⏱️ Trajeto longo (${duration} min) - planeje paradas`);
  }
  
  if (coolingPoints.length > 0) {
    const parques = coolingPoints.filter(p => p.tipo === 'parque').length;
    const fontes = coolingPoints.filter(p => p.tipo === 'fonte').length;
    const abrigos = coolingPoints.filter(p => p.tipo === 'abrigo').length;
    
    if (parques > 0) recommendations.push(`🌳 ${parques} parque(s) disponível(is) na rota`);
    if (fontes > 0) recommendations.push(`💧 ${fontes} fonte(s) de água na rota`);
    if (abrigos > 0) recommendations.push(`🏠 ${abrigos} abrigo(s) climatizado(s) na rota`);
  }
  
  // Best time recommendations
  const currentHour = new Date().getHours();
  if (currentHour >= 10 && currentHour <= 16) {
    recommendations.push('🕐 Considere viajar antes das 10h ou após as 16h');
  }
  
  return recommendations;
}

export async function findBestCoolingPoint(
  userLat: number,
  userLon: number,
  type?: 'parque' | 'fonte' | 'abrigo'
): Promise<PontoResfriamento | null> {
  try {
    const nearbyPoints = await fetchPontosByProximity(userLat, userLon, 20);
    
    let filteredPoints = nearbyPoints;
    if (type) {
      filteredPoints = nearbyPoints.filter(point => point.tipo === type);
    }
    
    if (filteredPoints.length === 0) return null;
    
    const { point } = findNearestPoint(userLat, userLon, filteredPoints);
    return point;
  } catch (error) {
    console.error('Erro ao encontrar melhor ponto de resfriamento:', error);
    return null;
  }
}
