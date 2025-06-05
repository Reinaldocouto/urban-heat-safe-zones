
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
