
# Clima Safe - Conforto Térmico Urbano

Sistema de monitoramento climático urbano e mapeamento de pontos de resfriamento desenvolvido para a FIAP.

## 🚀 Funcionalidades

- **Mapa Interativo**: Visualização de pontos de resfriamento (parques, fontes, abrigos)
- **Geolocalização**: Encontre o ponto mais próximo da sua localização
- **Dados Climáticos**: Informações meteorológicas em tempo real
- **Alertas Climáticos**: Notificações sobre condições climáticas extremas
- **Planejador de Rotas**: Rotas otimizadas considerando o conforto térmico
- **Feedback dos Usuários**: Sistema de avaliação e comentários

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Vite
- **Mapas**: MapLibre GL JS + React Map GL
- **Estilização**: Tailwind CSS
- **APIs**: WeatherAPI, Supabase
- **Componentes**: Shadcn/UI, Lucide React

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd clima-safe
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Preencha as chaves de API no arquivo `.env`:
- **Supabase**: Crie um projeto em [supabase.com](https://supabase.com)
- **WeatherAPI**: Obtenha uma chave em [weatherapi.com](https://weatherapi.com)

5. Execute o projeto:
```bash
npm run dev
```

## 🗃️ Configuração do Banco de Dados (Supabase)

Crie a tabela `pontos_resfriamento` no Supabase com a seguinte estrutura:

```sql
CREATE TABLE pontos_resfriamento (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT CHECK (tipo IN ('parque', 'fonte', 'abrigo')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  horario_funcionamento TEXT,
  cidade TEXT,
  uf TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎨 Design System

O projeto utiliza as cores oficiais da FIAP:
- **Vermelho FIAP**: `#cc092f`
- **Preto**: `#000000`
- **Branco**: `#ffffff`
- **Cinza Escuro**: `#333333`
- **Cinza Claro**: `#f5f5f5`

## 🌡️ APIs Utilizadas

### WeatherAPI
- Dados meteorológicos em tempo real
- Previsões e alertas climáticos
- Índices UV e umidade

### Supabase
- Armazenamento de pontos de resfriamento
- Sistema de autenticação (futuro)
- Banco de dados PostgreSQL

## 📱 Responsividade

O projeto é mobile-first e adapta-se a diferentes tamanhos de tela:
- **Mobile**: Layout empilhado, controles otimizados
- **Desktop**: Layout em duas colunas (mapa + painel lateral)

## 🧪 Modo de Desenvolvimento

Para testar sem APIs externas, configure `VITE_USE_MOCK=true` no arquivo `.env`. 
Isso utilizará dados mockados locais.

## 📄 Estrutura de Arquivos

```
src/
├── components/
│   ├── map/
│   │   ├── MapView.tsx
│   │   ├── MapMarkers.tsx
│   │   ├── MapControls.tsx
│   │   ├── MapLegend.tsx
│   │   ├── PointDetailsPanel.tsx
│   │   └── TemperatureDisplay.tsx
│   ├── Navigation.tsx
│   ├── ClimateAlerts.tsx
│   ├── RoutePlanner.tsx
│   └── UserFeedback.tsx
├── hooks/
│   ├── useGeolocation.ts
│   ├── useMapData.ts
│   └── use-toast.ts
├── services/
│   ├── supabaseService.ts
│   └── weatherService.ts
├── utils/
│   ├── distance.ts
│   └── mockPontos.ts
└── pages/
    └── Index.tsx
```

## 🚧 Roadmap

- [ ] Integração com direções de rota
- [ ] Sistema de autenticação
- [ ] Notificações push
- [ ] Modo offline
- [ ] Analytics e métricas
- [ ] API pública

## 👥 Contribuição

Este projeto foi desenvolvido como parte do programa FIAP Climate. 
Para contribuições, siga as diretrizes de código e abra um Pull Request.

## 📝 Licença

Projeto acadêmico FIAP - Todos os direitos reservados.
