
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
    
    // Get all points and sort by distance on client side
    const allPontos = await fetchPontos();
    
    // Add distance calculation and sort
    const pontosWithDistance = allPontos.map(ponto => ({
      ...ponto,
      distance: Math.sqrt(
        Math.pow(ponto.latitude - latitude, 2) + 
        Math.pow(ponto.longitude - longitude, 2)
      )
    }));
    
    // Sort by distance and return without the distance property
    return pontosWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)
      .map(({ distance, ...ponto }) => ponto);
  } catch (error) {
    console.error('Erro ao buscar pontos próximos:', error);
    return [];
  }
}
