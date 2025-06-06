
import React, { useState } from 'react';
import { Settings, TestTube, Bug, Database, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TestRunner from '@/tests/TestRunner';

const DevTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gray-800 hover:bg-gray-700 text-white shadow-lg"
          size="sm"
        >
          <Settings className="h-4 w-4 mr-2" />
          Dev Tools
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Ferramentas de Desenvolvimento</span>
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </Button>
        </div>

        <div className="p-4 h-full overflow-y-auto">
          <Tabs defaultValue="tests" className="h-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="tests" className="flex items-center space-x-1">
                <TestTube className="h-4 w-4" />
                <span>Testes</span>
              </TabsTrigger>
              <TabsTrigger value="debug" className="flex items-center space-x-1">
                <Bug className="h-4 w-4" />
                <span>Debug</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center space-x-1">
                <Database className="h-4 w-4" />
                <span>Dados</span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center space-x-1">
                <Zap className="h-4 w-4" />
                <span>Performance</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tests" className="h-full">
              <TestRunner />
            </TabsContent>

            <TabsContent value="debug" className="space-y-4">
              <h3 className="text-lg font-semibold">Informações de Debug</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Estado da Aplicação</h4>
                  <div className="text-sm space-y-1">
                    <div>• Geolocalização: {navigator.geolocation ? '✅ Disponível' : '❌ Indisponível'}</div>
                    <div>• Local Storage: {localStorage ? '✅ Funcionando' : '❌ Bloqueado'}</div>
                    <div>• Service Worker: {navigator.serviceWorker ? '✅ Suportado' : '❌ Não suportado'}</div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Informações do Navegador</h4>
                  <div className="text-sm space-y-1">
                    <div>• User Agent: {navigator.userAgent.slice(0, 50)}...</div>
                    <div>• Idioma: {navigator.language}</div>
                    <div>• Online: {navigator.onLine ? '✅ Conectado' : '❌ Offline'}</div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              <h3 className="text-lg font-semibold">Gerenciamento de Dados</h3>
              <div className="space-y-4">
                <Button 
                  onClick={() => localStorage.clear()}
                  variant="outline"
                  className="w-full"
                >
                  Limpar Local Storage
                </Button>
                
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Dados Armazenados</h4>
                  <div className="text-sm">
                    <p>Local Storage: {Object.keys(localStorage).length} itens</p>
                    <p>Session Storage: {Object.keys(sessionStorage).length} itens</p>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <h3 className="text-lg font-semibold">Monitoramento de Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Métricas</h4>
                  <div className="text-sm space-y-1">
                    <div>• Tempo de carregamento: ~{Math.floor(performance.now())}ms</div>
                    <div>• Memória usada: {(performance as any).memory ? 
                      `${Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)}MB` : 
                      'N/A'}</div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Network</h4>
                  <div className="text-sm space-y-1">
                    <div>• Conexão: {(navigator as any).connection?.effectiveType || 'Desconhecida'}</div>
                    <div>• Downlink: {(navigator as any).connection?.downlink || 'N/A'} Mbps</div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default DevTools;
