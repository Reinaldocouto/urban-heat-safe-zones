
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, MapPin, Users, Zap, Shield, Globe, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Documentation: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const SectionHeader = ({ id, title, icon: Icon }: { id: string, title: string, icon: any }) => (
    <div 
      className="flex items-center justify-between p-4 bg-fiap-red text-white cursor-pointer hover:bg-fiap-red/90 transition-colors"
      onClick={() => toggleSection(id)}
    >
      <div className="flex items-center space-x-3">
        <Icon className="h-6 w-6" />
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      {expandedSections.has(id) ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-fiap-gray-light to-white">
      {/* Capa do Documento */}
      <div className="bg-gradient-to-br from-fiap-red to-fiap-red/80 text-white min-h-screen flex flex-col justify-center items-center p-8 text-center">
        <div className="max-w-4xl">
          <div className="mb-8">
            <MapPin className="h-24 w-24 mx-auto mb-6" />
            <h1 className="text-6xl font-bold mb-4">CLIMA SAFE</h1>
            <h2 className="text-3xl font-light mb-6">Sistema de Conforto Térmico Urbano</h2>
            <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-semibold mb-4">Documentação Técnica e Acadêmica</h3>
            <p className="text-xl">Global Solution FIAP 2025</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <Globe className="h-12 w-12 mx-auto mb-3" />
              <h4 className="font-semibold">Solução Global</h4>
              <p className="text-sm opacity-90">Mudanças Climáticas</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-3" />
              <h4 className="font-semibold">Impacto Social</h4>
              <p className="text-sm opacity-90">Saúde Pública</p>
            </div>
            <div className="text-center">
              <Zap className="h-12 w-12 mx-auto mb-3" />
              <h4 className="font-semibold">Inovação</h4>
              <p className="text-sm opacity-90">Tecnologia</p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 text-center">
          <p className="text-lg">Junho 2025</p>
          <p className="text-sm opacity-80">Versão 1.0</p>
        </div>
      </div>

      {/* Sumário Executivo */}
      <div className="max-w-6xl mx-auto p-8">
        <Card className="mb-8">
          <div className="bg-fiap-red text-white p-6">
            <h2 className="text-2xl font-bold flex items-center">
              <CheckCircle className="h-6 w-6 mr-3" />
              Sumário Executivo
            </h2>
          </div>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-fiap-red">Problema Identificado</h3>
                <p className="text-gray-700 mb-4">
                  As ilhas de calor urbano em São Paulo intensificam problemas de saúde pública, 
                  especialmente em populações vulneráveis, com ausência de sistemas integrados 
                  para orientação sobre pontos de resfriamento.
                </p>
                
                <h3 className="text-lg font-semibold mb-3 text-fiap-red">Solução Proposta</h3>
                <p className="text-gray-700">
                  Plataforma web que mapeia pontos de resfriamento urbano, oferece dados climáticos 
                  em tempo real, planeja rotas térmicas e engaja a comunidade através de feedback.
                </p>
              </div>
              
              <div className="bg-fiap-gray-light p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-fiap-red">Indicadores de Sucesso</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Redução no tempo de busca</span>
                    <span className="font-semibold text-green-600">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aumento de utilização</span>
                    <span className="font-semibold text-green-600">40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cobertura da cidade</span>
                    <span className="font-semibold text-green-600">100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Usuários esperados (6 meses)</span>
                    <span className="font-semibold text-green-600">1000+</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seções Expandíveis */}
        <div className="space-y-4">
          {/* Problema e Solução */}
          <Card>
            <SectionHeader id="problema" title="1. Problema e Solução" icon={AlertTriangle} />
            {expandedSections.has('problema') && (
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-fiap-red">Contextualização do Problema</h3>
                    <div className="space-y-4">
                      <div className="border-l-4 border-fiap-red pl-4">
                        <h4 className="font-semibold">Ilhas de Calor Urbano</h4>
                        <p className="text-gray-700">Aumento das temperaturas em grandes centros metropolitanos</p>
                      </div>
                      <div className="border-l-4 border-fiap-red pl-4">
                        <h4 className="font-semibold">Impacto na Saúde</h4>
                        <p className="text-gray-700">Desidratação, insolação e complicações respiratórias</p>
                      </div>
                      <div className="border-l-4 border-fiap-red pl-4">
                        <h4 className="font-semibold">Vulnerabilidade Social</h4>
                        <p className="text-gray-700">População em situação de rua e trabalhadores externos</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-fiap-red">Nossa Solução</h3>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span>Mapeamento inteligente de pontos de resfriamento</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span>Dados climáticos em tempo real</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span>Planejamento de rotas térmicas</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span>Sistema de alertas preventivos</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span>Engajamento comunitário</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Tecnologias */}
          <Card>
            <SectionHeader id="tecnologias" title="2. Stack Tecnológico" icon={Zap} />
            {expandedSections.has('tecnologias') && (
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-3">Frontend</h3>
                    <div className="space-y-2 text-sm">
                      <div>React 18.3.1</div>
                      <div>TypeScript</div>
                      <div>Vite</div>
                      <div>Tailwind CSS</div>
                      <div>Shadcn/UI</div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-3">Backend & APIs</h3>
                    <div className="space-y-2 text-sm">
                      <div>Supabase</div>
                      <div>PostgreSQL</div>
                      <div>WeatherAPI</div>
                      <div>Google Maps</div>
                      <div>REST APIs</div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-800 mb-3">Mapas & Geo</h3>
                    <div className="space-y-2 text-sm">
                      <div>MapLibre GL JS</div>
                      <div>React Map GL</div>
                      <div>Geolocation API</div>
                      <div>OpenStreetMap</div>
                      <div>Algoritmos de proximidade</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Arquitetura */}
          <Card>
            <SectionHeader id="arquitetura" title="3. Arquitetura do Sistema" icon={Globe} />
            {expandedSections.has('arquitetura') && (
              <CardContent className="p-6">
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-center">Fluxo de Dados</h3>
                  <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mb-2">
                        UI
                      </div>
                      <p className="text-sm">Interface React</p>
                    </div>
                    <div className="hidden md:block">→</div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mb-2">
                        API
                      </div>
                      <p className="text-sm">Supabase</p>
                    </div>
                    <div className="hidden md:block">→</div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold mb-2">
                        DB
                      </div>
                      <p className="text-sm">PostgreSQL</p>
                    </div>
                    <div className="hidden md:block">→</div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold mb-2">
                        EXT
                      </div>
                      <p className="text-sm">APIs Externas</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-fiap-red">Componentes Principais</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>MapView - Container principal</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Navigation - Barra de navegação</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span>RoutePlanner - Planejador</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span>UserFeedback - Avaliações</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-fiap-red">Banco de Dados</h3>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                      <div className="mb-2"><strong>pontos_resfriamento</strong></div>
                      <div>- id (integer, PK)</div>
                      <div>- nome (text)</div>
                      <div>- tipo (text)</div>
                      <div>- latitude (numeric)</div>
                      <div>- longitude (numeric)</div>
                      <div>- horario_funcionamento</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Telas e Funcionalidades */}
          <Card>
            <SectionHeader id="telas" title="4. Protótipo e Funcionalidades" icon={MapPin} />
            {expandedSections.has('telas') && (
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-fiap-red">Telas Principais</h3>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">🗺️ Dashboard Principal</h4>
                      <p className="text-sm text-gray-600 mb-2">Mapa interativo com pontos de resfriamento</p>
                      <div className="text-xs space-y-1">
                        <div>• Visualização de marcadores</div>
                        <div>• Geolocalização automática</div>
                        <div>• Widget climático em tempo real</div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">🚗 Planejador de Rotas</h4>
                      <p className="text-sm text-gray-600 mb-2">Otimização de trajetos térmicos</p>
                      <div className="text-xs space-y-1">
                        <div>• Campos origem/destino</div>
                        <div>• Integração Google Maps</div>
                        <div>• Botão localização atual</div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">⚠️ Alertas Climáticos</h4>
                      <p className="text-sm text-gray-600 mb-2">Sistema de notificações preventivas</p>
                      <div className="text-xs space-y-1">
                        <div>• Alertas por severidade</div>
                        <div>• Recomendações de segurança</div>
                        <div>• Histórico de alertas</div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">💬 Sistema de Feedback</h4>
                      <p className="text-sm text-gray-600 mb-2">Avaliação comunitária</p>
                      <div className="text-xs space-y-1">
                        <div>• Visualização pública</div>
                        <div>• Sistema de estrelas</div>
                        <div>• Envio requer login</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-fiap-red mb-4">Mockup das Telas</h3>
                    <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center text-gray-500">
                        <MapPin className="h-12 w-12 mx-auto mb-2" />
                        <p>Dashboard Principal</p>
                        <p className="text-sm">Mapa Interativo</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-200 h-20 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">Rotas</span>
                      </div>
                      <div className="bg-gray-200 h-20 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">Alertas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Impacto Social */}
          <Card>
            <SectionHeader id="impacto" title="5. Resultados e Impacto Social" icon={Users} />
            {expandedSections.has('impacto') && (
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-10 w-10 text-fiap-red" />
                    </div>
                    <h3 className="font-semibold mb-2">Saúde Pública</h3>
                    <p className="text-sm text-gray-600">Redução de casos de insolação e orientação preventiva para grupos vulneráveis</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Inclusão Social</h3>
                    <p className="text-sm text-gray-600">Acessibilidade para população em situação de rua e interface inclusiva</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Sustentabilidade</h3>
                    <p className="text-sm text-gray-600">Otimização de recursos públicos e conscientização ambiental</p>
                  </div>
                </div>
                
                <div className="mt-8 bg-fiap-gray-light p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-fiap-red">Beneficiários Diretos</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">População Geral</h4>
                      <p className="text-sm text-gray-700">Cidadãos que se deslocam pela cidade em busca de conforto térmico</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Trabalhadores Externos</h4>
                      <p className="text-sm text-gray-700">Entregadores, vendedores e profissionais que trabalham nas ruas</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Turistas</h4>
                      <p className="text-sm text-gray-700">Visitantes não familiarizados com pontos de resfriamento da cidade</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Grupos Vulneráveis</h4>
                      <p className="text-sm text-gray-700">Idosos, crianças e pessoas em situação de rua</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Roadmap */}
          <Card>
            <SectionHeader id="roadmap" title="6. Roadmap de Evolução" icon={Calendar} />
            {expandedSections.has('roadmap') && (
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <div className="w-0.5 h-16 bg-gray-300"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">Fase 1 - Fundação</h3>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">CONCLUÍDA</span>
                      </div>
                      <p className="text-sm text-gray-600">MVP com funcionalidades essenciais, testes automatizados e interface responsiva</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <div className="w-0.5 h-16 bg-gray-300"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">Fase 2 - Expansão</h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">3-6 MESES</span>
                      </div>
                      <p className="text-sm text-gray-600">Autenticação completa, notificações push, gamificação e dados climáticos avançados</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      <div className="w-0.5 h-16 bg-gray-300"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">Fase 3 - Inteligência Artificial</h3>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">6-12 MESES</span>
                      </div>
                      <p className="text-sm text-gray-600">Machine learning, chatbot inteligente, análise preditiva e otimização dinâmica</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                      <div className="w-0.5 h-16 bg-gray-300"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">Fase 4 - Expansão Regional</h3>
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">12-18 MESES</span>
                      </div>
                      <p className="text-sm text-gray-600">Outras cidades, parcerias municipais, API pública e integração com transporte</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">Fase 5 - Sustentabilidade</h3>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">18+ MESES</span>
                      </div>
                      <p className="text-sm text-gray-600">Modelo de negócio sustentável, centro de pesquisa e impacto em políticas públicas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Testes e Qualidade */}
          <Card>
            <SectionHeader id="testes" title="7. Testes e Evidências de Qualidade" icon={Shield} />
            {expandedSections.has('testes') && (
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-fiap-red">Estratégia de Testes</h3>
                    <div className="space-y-3">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold">Testes de Integração</h4>
                        <p className="text-sm text-gray-600">APIs externas, fallbacks e geolocalização</p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-semibold">Testes de Interface</h4>
                        <p className="text-sm text-gray-600">Componentes, navegação e responsividade</p>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-semibold">Testes de Performance</h4>
                        <p className="text-sm text-gray-600">Carregamento e otimização de memória</p>
                      </div>
                      <div className="border-l-4 border-orange-500 pl-4">
                        <h4 className="font-semibold">Testes Críticos</h4>
                        <p className="text-sm text-gray-600">Funcionalidades principais e fluxos</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-fiap-red">Métricas de Qualidade</h3>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Cobertura de código</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div className="w-4/5 h-full bg-green-500 rounded-full"></div>
                            </div>
                            <span className="text-sm font-semibold">80%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Performance</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div className="w-5/6 h-full bg-green-500 rounded-full"></div>
                            </div>
                            <span className="text-sm font-semibold">&lt;2s</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Acessibilidade</span>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-semibold">WCAG 2.1 AA</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Compatibilidade</span>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-semibold">99% navegadores</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center p-8 bg-fiap-red text-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">CLIMA SAFE</h2>
          <p className="text-lg mb-2">Sistema de Conforto Térmico Urbano</p>
          <p className="opacity-80">Global Solution FIAP 2025 - Mudanças Climáticas</p>
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-sm">Documentação Técnica e Acadêmica - Versão 1.0 - Junho 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
