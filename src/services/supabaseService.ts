
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
    
    // Using Supabase PostGIS extension for proximity calculation
    const { data, error } = await supabase
      .rpc('get_nearby_pontos', {
        user_lat: latitude,
        user_lng: longitude,
        proximity_limit: limit
      });
    
    if (error) {
      console.log('RPC function not available, using simple fetch with client-side sorting');
      // Fallback to regular fetch and sort by distance on client
      const allPontos = await fetchPontos();
      return allPontos
        .map(ponto => ({
          ...ponto,
          distance: Math.sqrt(
            Math.pow(ponto.latitude - latitude, 2) + 
            Math.pow(ponto.longitude - longitude, 2)
          )
        }))
        .sort((a: any, b: any) => a.distance - b.distance)
        .slice(0, limit);
    }
    
    // Convert id to string and ensure type compatibility
    return (data || []).map((ponto: any) => ({
      ...ponto,
      id: ponto.id.toString(),
      tipo: ponto.tipo as 'parque' | 'fonte' | 'abrigo'
    }));
  } catch (error) {
    console.error('Erro ao buscar pontos próximos:', error);
    return [];
  }
}
