# Como Criar o Repositório GitHub - Brasil Cultural Agency

## Passo 1: Criar Repositório no GitHub
1. Acesse [GitHub.com](https://github.com) e faça login
2. Clique no botão "+" e selecione "New repository"
3. Nome: `brasil-cultural-agency`
4. Descrição: "Plataforma de Viagens Culturais do Brasil com IA"
5. Deixe público
6. NÃO inicializar com README
7. Clique "Create repository"

## Passo 2: No Terminal do Replit
Execute estes comandos na ordem:

```bash
# Remover arquivos de bloqueio do git
rm -f .git/index.lock .git/config.lock .git/refs/remotes/origin/main.lock

# Verificar status
git status

# Adicionar arquivos
git add .

# Commit das mudanças
git commit -m "Plataforma Brasil Cultural Agency - Sistema completo com IA"

# Conectar ao seu repositório GitHub (substitua SEU-USUARIO)
git remote set-url origin https://github.com/SEU-USUARIO/brasil-cultural-agency.git

# Enviar para GitHub
git push -u origin main
```

## Passo 3: Se ainda der erro
Se continuar com problemas de lock:

```bash
# Reinicializar git completamente
rm -rf .git
git init
git add .
git commit -m "Inicial: Brasil Cultural Agency"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/brasil-cultural-agency.git
git push -u origin main
```

## Recursos do Sistema
- Chat IA com detecção de perfil de viajante
- Dashboard administrativo
- Gerenciamento de leads e reservas
- Integração com APIs de viagem
- Sistema de autenticação
- Design responsivo

## Deploy Automático
Depois do GitHub configurado, você pode usar:
- Vercel (conecta automaticamente)
- Netlify
- Railway
- Ou clicar "Deploy" aqui no Replit