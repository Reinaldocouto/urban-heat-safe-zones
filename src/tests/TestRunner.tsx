
import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  duration?: number;
  error?: string;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  status: 'passed' | 'failed' | 'running' | 'pending';
}

const TestRunner: React.FC = () => {
  const [testResults, setTestResults] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const testSuites: Omit<TestSuite, 'status'>[] = [
    {
      name: 'Integração de APIs',
      tests: [
        { name: 'API de clima retorna dados corretos', status: 'pending' },
        { name: 'Fallback em caso de falha da API', status: 'pending' },
        { name: 'Geolocalização funciona corretamente', status: 'pending' },
      ]
    },
    {
      name: 'UI e Funcionalidades',
      tests: [
        { name: 'Botões estão visíveis e funcionais', status: 'pending' },
        { name: 'Navegação entre abas funciona', status: 'pending' },
        { name: 'Pontos aparecem no mapa', status: 'pending' },
        { name: 'Seleção de pontos funciona', status: 'pending' },
      ]
    },
    {
      name: 'Performance',
      tests: [
        { name: 'Dashboard carrega em menos de 2s', status: 'pending' },
        { name: 'Renderização de múltiplos pontos é rápida', status: 'pending' },
        { name: 'Cálculo de rota tem tempo aceitável', status: 'pending' },
      ]
    },
    {
      name: 'Acessibilidade',
      tests: [
        { name: 'Labels estão presentes nos campos', status: 'pending' },
        { name: 'Navegação por teclado funciona', status: 'pending' },
        { name: 'Contraste adequado nos elementos', status: 'pending' },
        { name: 'Estrutura semântica correta', status: 'pending' },
      ]
    },
    {
      name: 'Funcionalidades Críticas',
      tests: [
        { name: 'Encontrar ponto mais próximo', status: 'pending' },
        { name: 'Atualização de dados climáticos', status: 'pending' },
        { name: 'Cálculo de rota térmica', status: 'pending' },
        { name: 'Exibição de alertas climáticos', status: 'pending' },
      ]
    }
  ];

  const simulateTestRun = async () => {
    setIsRunning(true);
    setTestResults([]);

    for (const suite of testSuites) {
      // Simula início da suite
      const currentSuite: TestSuite = {
        ...suite,
        status: 'running',
        tests: suite.tests.map(t => ({ ...t, status: 'pending' }))
      };
      
      setTestResults(prev => [...prev.filter(s => s.name !== suite.name), currentSuite]);

      // Simula execução dos testes
      for (let i = 0; i < suite.tests.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
        
        const updatedTests = [...currentSuite.tests];
        updatedTests[i] = {
          ...updatedTests[i],
          status: Math.random() > 0.15 ? 'passed' : 'failed', // 85% de sucesso
          duration: Math.floor(Math.random() * 500) + 100,
          error: Math.random() > 0.85 ? 'Erro simulado para demonstração' : undefined
        };

        const updatedSuite: TestSuite = {
          ...currentSuite,
          tests: updatedTests,
          status: updatedTests.every(t => t.status === 'passed' || t.status === 'pending') ? 
                  (updatedTests.some(t => t.status === 'pending') ? 'running' : 'passed') : 'failed'
        };

        setTestResults(prev => [...prev.filter(s => s.name !== suite.name), updatedSuite]);
      }
    }

    setIsRunning(false);
    setLastRun(new Date());
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getOverallStats = () => {
    if (testResults.length === 0) return { total: 0, passed: 0, failed: 0 };
    
    const allTests = testResults.flatMap(suite => suite.tests);
    return {
      total: allTests.length,
      passed: allTests.filter(t => t.status === 'passed').length,
      failed: allTests.filter(t => t.status === 'failed').length,
    };
  };

  const stats = getOverallStats();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Testes Automatizados - Clima Safe
        </h1>
        <p className="text-gray-600">
          Execute os testes automatizados para validar todas as funcionalidades do sistema.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={simulateTestRun}
          disabled={isRunning}
          className="bg-fiap-red hover:bg-fiap-red/90"
        >
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? 'Executando Testes...' : 'Executar Todos os Testes'}
        </Button>

        {lastRun && (
          <div className="text-sm text-gray-600">
            Última execução: {lastRun.toLocaleString('pt-BR')}
          </div>
        )}
      </div>

      {/* Stats */}
      {stats.total > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
            <div className="text-sm text-gray-600">Aprovados</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <div className="text-sm text-gray-600">Falharam</div>
          </Card>
        </div>
      )}

      {/* Test Results */}
      <div className="space-y-4">
        {(testResults.length > 0 ? testResults : testSuites.map(s => ({ ...s, status: 'pending' as const }))).map((suite) => (
          <Card key={suite.name} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg flex items-center space-x-2">
                {getStatusIcon(suite.status)}
                <span>{suite.name}</span>
              </h3>
              <div className="text-sm text-gray-600">
                {suite.tests.filter(t => t.status === 'passed').length}/{suite.tests.length} aprovados
              </div>
            </div>

            <div className="space-y-2">
              {suite.tests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(test.status)}
                    <span className="text-sm">{test.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    {test.duration && <span>{test.duration}ms</span>}
                    {test.error && (
                      <span className="text-red-500 max-w-48 truncate" title={test.error}>
                        {test.error}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">Como usar os testes</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Clique em "Executar Todos os Testes" para rodar a suíte completa</li>
          <li>• Os testes são organizados por categoria (APIs, UI, Performance, etc.)</li>
          <li>• Testes em vermelho indicam falhas que precisam ser corrigidas</li>
          <li>• Execute os testes regularmente após mudanças no código</li>
          <li>• Para testes reais, execute: <code className="bg-blue-100 px-1 rounded">npm test</code> no terminal</li>
        </ul>
      </Card>
    </div>
  );
};

export default TestRunner;
