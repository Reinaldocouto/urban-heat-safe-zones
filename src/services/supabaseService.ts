
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Only create supabase client if both URL and key are provided
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

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
  // If supabase is not configured, return empty array (hook will use mock data)
  if (!supabase) {
    console.log('Supabase não configurado, usando dados mockados');
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('pontos_resfriamento')
      .select('*');
    
    if (error) {
      console.error('Erro ao buscar pontos:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Erro na conexão com Supabase:', error);
    return [];
  }
}
