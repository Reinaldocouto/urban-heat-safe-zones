
import { supabase } from '@/integrations/supabase/client';

export interface PontoResfriamento {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'parque' | 'fonte' | 'abrigo';
  latitude: number;
  longitude: number;
  horario_funcionamento: string;
  cidade: string;
  uf: string;
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function fetchPontos(): Promise<PontoResfriamento[]> {
  try {
    console.log('Buscando pontos do Supabase...');
    const { data, error } = await supabase
      .from('pontos_resfriamento')
      .select('*')
      .order('nome');
    
    if (error) {
      console.error('Erro ao buscar pontos:', error);
      return [];
    }
    
    console.log(`${data?.length || 0} pontos encontrados no Supabase`);
    
    // Convert id to string and ensure type compatibility
    return (data || []).map(ponto => ({
      ...ponto,
      id: ponto.id.toString(),
      tipo: ponto.tipo as 'parque' | 'fonte' | 'abrigo'
    }));
  } catch (error) {
    console.error('Erro na conexão com Supabase:', error);
    return [];
  }
}

export async function fetchPontosByProximity(
  latitude: number, 
  longitude: number, 
  limit: number = 10
): Promise<PontoResfriamento[]> {
  try {
    console.log(`Buscando pontos próximos a ${latitude}, ${longitude}`);
    
    // Get all points first
    const allPontos = await fetchPontos();
    
    if (allPontos.length === 0) {
      return [];
    }
    
    // Add distance calculation and sort by proximity
    const pontosWithDistance = allPontos.map(ponto => ({
      ...ponto,
      distance: calculateDistance(latitude, longitude, ponto.latitude, ponto.longitude)
    }));
    
    // Sort by distance and return limited results without the distance property
    return pontosWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)
      .map(({ distance, ...ponto }) => ponto);
  } catch (error) {
    console.error('Erro ao buscar pontos próximos:', error);
    return [];
  }
}

export async function fetchPontoById(id: string): Promise<PontoResfriamento | null> {
  try {
    console.log(`Buscando ponto com ID: ${id}`);
    const { data, error } = await supabase
      .from('pontos_resfriamento')
      .select('*')
      .eq('id', parseInt(id))
      .single();
    
    if (error) {
      console.error('Erro ao buscar ponto:', error);
      return null;
    }
    
    return {
      ...data,
      id: data.id.toString(),
      tipo: data.tipo as 'parque' | 'fonte' | 'abrigo'
    };
  } catch (error) {
    console.error('Erro ao buscar ponto por ID:', error);
    return null;
  }
}
