
import type { PontoResfriamento } from '@/services/supabaseService';
import { additionalPontos } from './additionalPontos';

export const mockPontos: PontoResfriamento[] = [
  {
    id: '1',
    nome: 'Parque do Ibirapuera',
    descricao: 'Área arborizada com sombra e bancos para descanso.',
    tipo: 'parque',
    latitude: -23.5874,
    longitude: -46.6576,
    horario_funcionamento: '05:00 - 22:00',
    cidade: 'São Paulo',
    uf: 'SP',
  },
  {
    id: '2',
    nome: 'Fonte Monumental do Parque',
    descricao: 'Fonte de água potável gratuita disponível 24h.',
    tipo: 'fonte',
    latitude: -23.5505,
    longitude: -46.6333,
    horario_funcionamento: '24h',
    cidade: 'São Paulo',
    uf: 'SP',
  },
  {
    id: '3',
    nome: 'Abrigo Coberto Centro',
    descricao: 'Abrigo climatizado com sistema de ar-condicionado.',
    tipo: 'abrigo',
    latitude: -23.5610,
    longitude: -46.6600,
    horario_funcionamento: '08:00 - 18:00',
    cidade: 'São Paulo',
    uf: 'SP',
  },
  {
    id: '4',
    nome: 'Parque da Luz',
    descricao: 'Parque histórico com áreas sombreadas e jardins.',
    tipo: 'parque',
    latitude: -23.5355,
    longitude: -46.6388,
    horario_funcionamento: '06:00 - 18:00',
    cidade: 'São Paulo',
    uf: 'SP',
  },
  {
    id: '5',
    nome: 'Fonte da Praça da República',
    descricao: 'Fonte ornamental com bebedouros públicos.',
    tipo: 'fonte',
    latitude: -23.5432,
    longitude: -46.6414,
    horario_funcionamento: '24h',
    cidade: 'São Paulo',
    uf: 'SP',
  },
  {
    id: '6',
    nome: 'Centro de Acolhimento Sé',
    descricao: 'Espaço climatizado para repouso durante o calor.',
    tipo: 'abrigo',
    latitude: -23.5501,
    longitude: -46.6343,
    horario_funcionamento: '07:00 - 19:00',
    cidade: 'São Paulo',
    uf: 'SP',
  },
  // Adding all additional points
  ...additionalPontos
];
