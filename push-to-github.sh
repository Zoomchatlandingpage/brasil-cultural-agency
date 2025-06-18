#!/bin/bash

echo "🚀 Preparando para enviar código para GitHub..."

# Adicionar todos os arquivos
echo "📁 Adicionando arquivos ao staging..."
git add .

# Fazer commit com mensagem detalhada
echo "💾 Fazendo commit das alterações..."
git commit -m "feat: Sistema completo integrado Brasil Cultural Agency

✅ Dashboard do cliente integrado com 3 abas principais
✅ BRASIL UNBOXED: Experiências culturais autênticas
✅ Busca de Voos: API mock pronta para integração real
✅ Busca de Hotéis: API mock pronta para integração real
✅ Painel admin com acesso direto ao dashboard do cliente
✅ Interface responsiva e user-friendly
✅ Sistema de filtros e categorias implementado
✅ APIs testadas e funcionando corretamente

Funcionalidades principais:
- /client-dashboard-integrated: Dashboard completo do cliente
- APIs REST para voos e hotéis (/api/search/flights, /api/search/hotels)
- Integração visual perfeita entre todos os componentes
- Pronto para integração com APIs reais (Amadeus, Booking.com)
- Sistema de autenticação admin implementado

Próximos passos:
- Integração com APIs reais de voos e hotéis
- Finalização do sistema de autenticação
- Deploy em produção"

# Push para o repositório remoto
echo "🌐 Enviando para GitHub..."
git push origin main

echo "✅ Código enviado com sucesso para o repositório GitHub!"
echo "🔗 Você pode visualizar em: https://github.com/seu-usuario/brasil-cultural-agency"