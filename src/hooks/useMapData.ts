
import { useEffect, useState } from 'react';
import { fetchPontos, PontoResfriamento } from '@/services/supabaseService';
import { mockPontos } from '@/utils/mockPontos';

export function useMapData() {
  const [pontos, setPontos] = useState<PontoResfriamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const useMock = import.meta.env.VITE_USE_MOCK === 'true';

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      
      try {
        if (useMock) {
          console.log('Usando dados mockados');
          setPontos(mockPontos);
        } else {
          console.log('Buscando dados do Supabase');
          const dados = await fetchPontos();
          
          if (dados.length === 0) {
            console.log('Nenhum dado encontrado no Supabase, usando mock como fallback');
            setPontos(mockPontos);
          } else {
            console.log(`${dados.length} pontos carregados do Supabase`);
            setPontos(dados);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar pontos:', err);
        setError('Erro ao carregar pontos de resfriamento');
        // Fallback para mock em caso de erro
        setPontos(mockPontos);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [useMock]);

  const refetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const dados = await fetchPontos();
      setPontos(dados.length > 0 ? dados : mockPontos);
    } catch (err) {
      console.error('Erro ao recarregar pontos:', err);
      setError('Erro ao recarregar pontos');
      setPontos(mockPontos);
    } finally {
      setLoading(false);
    }
  };

  return { pontos, loading, error, refetchData };
}
