
import { useEffect, useState } from 'react';
import { fetchPontos, PontoResfriamento } from '@/services/supabaseService';
import { mockPontos } from '@/utils/mockPontos';

export function useMapData() {
  const [pontos, setPontos] = useState<PontoResfriamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const useMock = import.meta.env.VITE_USE_MOCK === 'true';

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      
      try {
        if (useMock) {
          console.log('Usando dados mockados');
          setPontos(mockPontos);
        } else {
          console.log('Buscando dados do Supabase');
          const reais = await fetchPontos();
          if (reais.length === 0) {
            console.log('Nenhum dado do Supabase, usando mock');
            setPontos(mockPontos);
          } else {
            setPontos(reais);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar pontos:', err);
        setError('Erro ao carregar pontos de resfriamento');
        setPontos(mockPontos); // Fallback para mock em caso de erro
      } finally {
        setLoading(false);
      }
    }
    
    load();
  }, [useMock]);

  return { pontos, loading, error };
}
