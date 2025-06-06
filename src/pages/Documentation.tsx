
import React from 'react';
import { ArrowLeft, Download, BookOpen, Code, Users, Zap, Shield, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

const Documentation: React.FC = () => {
  const { toast } = useToast();

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.setTextColor(237, 20, 91); // FIAP Pink
      doc.text('FIAP Climate Safe - Documentação Técnica', 20, 30);
      
      // Subtitle
      doc.setFontSize(12);
      doc.setTextColor(97, 7, 37); // FIAP Dark
      doc.text('Sistema de Monitoramento Climático e Pontos de Resfriamento', 20, 45);
      
      // Content sections
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      
      let yPosition = 65;
      
      const sections = [
        {
          title: 'Visão Geral',
          content: 'Sistema para monitoramento de condições climáticas e localização de pontos de resfriamento urbano.'
        },
        {
          title: 'Funcionalidades Principais',
          content: '• Mapeamento interativo\n• Dados meteorológicos em tempo real\n• Rotas otimizadas\n• Alertas de segurança'
        },
        {
          title: 'Tecnologias',
          content: 'React, TypeScript, Tailwind CSS, MapLibre GL, Supabase'
        }
      ];
      
      sections.forEach(section => {
        doc.setFontSize(14);
        doc.setTextColor(237, 20, 91);
        doc.text(section.title, 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const lines = doc.splitTextToSize(section.content, 170);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 5 + 10;
      });
      
      doc.save('fiap-climate-safe-documentacao.pdf');
      
      toast({
        title: 'Download concluído',
        description: 'A documentação técnica foi baixada com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: 'Erro no download',
        description: 'Não foi possível gerar o PDF da documentação.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-fiap-dark">
      {/* Header */}
      <div className="bg-fiap-dark border-b border-fiap-pink/20 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="text-white hover:bg-fiap-pink/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Mapa
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Documentação Técnica</h1>
              <p className="text-fiap-pink">FIAP Climate Safe</p>
            </div>
          </div>
          <Button onClick={generatePDF} className="bg-fiap-pink hover:bg-fiap-pink/90 text-white">
            <Download className="h-4 w-4 mr-2" />
            Baixar Documentação Técnica Completa
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card className="bg-fiap-gray-dark border-fiap-pink/20">
              <CardHeader>
                <CardTitle className="flex items-center text-fiap-pink">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Visão Geral do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <p className="mb-4">
                  O FIAP Climate Safe é uma aplicação web desenvolvida para monitoramento de condições climáticas 
                  e localização de pontos de resfriamento urbano em situações de calor extremo.
                </p>
                <p>
                  A plataforma utiliza dados meteorológicos em tempo real e geolocalização para fornecer 
                  informações precisas sobre locais seguros próximos ao usuário.
                </p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-fiap-gray-dark border-fiap-pink/20">
              <CardHeader>
                <CardTitle className="flex items-center text-fiap-pink">
                  <Zap className="h-5 w-5 mr-2" />
                  Funcionalidades Principais
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Map className="h-5 w-5 text-fiap-pink mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-fiap-pink">Mapeamento Interativo</h4>
                        <p className="text-sm text-gray-300">Visualização em tempo real de pontos de resfriamento com filtros avançados.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-fiap-pink mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-fiap-pink">Alertas de Segurança</h4>
                        <p className="text-sm text-gray-300">Notificações baseadas em condições climáticas críticas.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Code className="h-5 w-5 text-fiap-pink mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-fiap-pink">API Meteorológica</h4>
                        <p className="text-sm text-gray-300">Integração com serviços de dados climáticos atualizados.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users className="h-5 w-5 text-fiap-pink mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-fiap-pink">Interface Intuitiva</h4>
                        <p className="text-sm text-gray-300">Design responsivo otimizado para dispositivos móveis.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Architecture */}
            <Card className="bg-fiap-gray-dark border-fiap-pink/20">
              <CardHeader>
                <CardTitle className="flex items-center text-fiap-pink">
                  <Code className="h-5 w-5 mr-2" />
                  Arquitetura Técnica
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-fiap-pink mb-2">Frontend</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      <li>React 18 com TypeScript</li>
                      <li>Tailwind CSS para estilização</li>
                      <li>React Router para navegação</li>
                      <li>Componentes shadcn/ui</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-fiap-pink mb-2">Mapas e Geolocalização</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      <li>MapLibre GL para renderização de mapas</li>
                      <li>API de Geolocalização do navegador</li>
                      <li>Cálculos de distância e rotas otimizadas</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-fiap-pink mb-2">Backend e Dados</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      <li>Supabase para banco de dados e autenticação</li>
                      <li>APIs meteorológicas externas</li>
                      <li>Sistema de cache para otimização</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card className="bg-fiap-gray-dark border-fiap-pink/20">
              <CardHeader>
                <CardTitle className="text-fiap-pink">Links Rápidos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/" className="block">
                  <Button variant="outline" className="w-full justify-start border-fiap-pink text-white hover:bg-fiap-pink/20">
                    <Map className="h-4 w-4 mr-2" />
                    Voltar ao Mapa
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-fiap-pink text-white hover:bg-fiap-pink/20"
                  onClick={generatePDF}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            {/* Project Info */}
            <Card className="bg-fiap-gray-dark border-fiap-pink/20">
              <CardHeader>
                <CardTitle className="text-fiap-pink">Informações do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-white">
                <div>
                  <span className="font-semibold text-fiap-pink">Versão:</span>
                  <span className="ml-2">1.0.0</span>
                </div>
                <div>
                  <span className="font-semibold text-fiap-pink">Última Atualização:</span>
                  <span className="ml-2">Dezembro 2024</span>
                </div>
                <div>
                  <span className="font-semibold text-fiap-pink">Licença:</span>
                  <span className="ml-2">MIT</span>
                </div>
                <Separator className="bg-fiap-pink/20" />
                <div>
                  <span className="font-semibold text-fiap-pink">Desenvolvido por:</span>
                  <span className="ml-2">Equipe FIAP</span>
                </div>
              </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card className="bg-fiap-gray-dark border-fiap-pink/20">
              <CardHeader>
                <CardTitle className="text-fiap-pink">Estatísticas de Uso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-white">
                <div className="flex justify-between">
                  <span>Pontos Cadastrados:</span>
                  <span className="font-semibold text-fiap-pink">150+</span>
                </div>
                <div className="flex justify-between">
                  <span>APIs Integradas:</span>
                  <span className="font-semibold text-fiap-pink">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Componentes:</span>
                  <span className="font-semibold text-fiap-pink">50+</span>
                </div>
                <div className="flex justify-between">
                  <span>Testes Automatizados:</span>
                  <span className="font-semibold text-fiap-pink">25</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
