
#!/bin/bash

echo "🧪 Executando Testes Automatizados do Clima Safe"
echo "================================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Executar testes
echo "📋 Executando suíte de testes..."

# Testes unitários
echo -e "\n${YELLOW}1. Testes Unitários${NC}"
npm test -- --watchAll=false --coverage --testPathPattern="services|components" 2>/dev/null
print_status $? "Testes de serviços e componentes"

# Testes de integração
echo -e "\n${YELLOW}2. Testes de Integração${NC}"
npm test -- --watchAll=false --testPathPattern="integration" 2>/dev/null
print_status $? "Testes de fluxo integrado"

# Testes de performance
echo -e "\n${YELLOW}3. Testes de Performance${NC}"
npm test -- --watchAll=false --testPathPattern="performance" 2>/dev/null
print_status $? "Testes de performance"

# Testes de acessibilidade
echo -e "\n${YELLOW}4. Testes de Acessibilidade${NC}"
npm test -- --watchAll=false --testPathPattern="accessibility" 2>/dev/null
print_status $? "Testes de acessibilidade"

# Testes de funcionalidades críticas
echo -e "\n${YELLOW}5. Funcionalidades Críticas${NC}"
npm test -- --watchAll=false --testPathPattern="functionality" 2>/dev/null
print_status $? "Testes de funcionalidades críticas"

echo -e "\n🏁 Execução completa!"
echo "📊 Verifique o relatório de cobertura em: coverage/lcov-report/index.html"

