#!/bin/bash

# Script para atualizar repositório GitHub com dashboard do cliente
# Brasil Cultural Agency - Atualização Dashboard Cliente

echo "🚀 Iniciando atualização do repositório GitHub..."

# Verificar se está em um repositório git
if [ ! -d ".git" ]; then
    echo "❌ Erro: Este diretório não é um repositório Git"
    echo "💡 Execute: git init && git remote add origin <URL_DO_SEU_REPO>"
    exit 1
fi

# Verificar se há mudanças
if [ -z "$(git status --porcelain)" ]; then
    echo "ℹ️ Nenhuma mudança detectada"
else
    echo "📝 Mudanças detectadas, preparando commit..."
fi

# Adicionar todos os arquivos
echo "📂 Adicionando arquivos..."
git add .

# Criar commit com mensagem descritiva
echo "💾 Criando commit..."
git commit -m "feat: Implementar dashboard completo do cliente

✅ Sistema de autenticação independente para clientes
✅ Dashboard personalizado com customização de pacotes
✅ API backend com rotas dedicadas (/api/client/*)
✅ Integração com sistema de reservas e pagamentos
✅ Interface responsiva para gestão de viagens
✅ Cálculo automático de comissões para Lucas

Arquivos principais:
- client/src/pages/client-login.tsx
- client/src/pages/client-dashboard.tsx
- server/client-routes.ts
- shared/schema.ts (tabelas client_packages, etc)

Jornada do cliente: AI Chat → Email → Dashboard → Booking"

# Verificar branch atual
CURRENT_BRANCH=$(git branch --show-current)
echo "🌿 Branch atual: $CURRENT_BRANCH"

# Push para o repositório
echo "⬆️ Enviando para GitHub..."
if git push origin $CURRENT_BRANCH; then
    echo "✅ Repositório atualizado com sucesso!"
    echo ""
    echo "🎯 Principais atualizações enviadas:"
    echo "   • Sistema completo de dashboard do cliente"
    echo "   • APIs RESTful para autenticação e booking"
    echo "   • Interface de customização de pacotes"
    echo "   • Integração com sistema existente de IA"
    echo ""
    echo "🔗 URLs importantes:"
    echo "   • Cliente: /client/login"
    echo "   • Dashboard: /client/dashboard"
    echo "   • Admin: /admin/login"
    echo ""
    echo "📚 Consulte ATUALIZAÇÃO-DASHBOARD-CLIENTE.md para detalhes"
else
    echo "❌ Erro ao enviar para GitHub"
    echo "💡 Verifique suas credenciais e conexão"
    exit 1
fi

echo ""
echo "🎉 Atualização concluída! O dashboard do cliente está no ar."