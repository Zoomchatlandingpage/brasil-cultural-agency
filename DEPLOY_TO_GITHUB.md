# Guia de Deploy para GitHub - Brasil Cultural Agency

## Visão Geral
Este guia detalha como transferir todo o código desenvolvido para o repositório GitHub existente: `https://github.com/Zoomchatlandingpage/brasil-cultural-agency`

## Estrutura Atual do Projeto

### Arquivos Principais
```
├── client/                          # Frontend React/TypeScript
│   ├── src/
│   │   ├── components/              # Componentes reutilizáveis
│   │   │   ├── ui/                  # Componentes Shadcn/UI
│   │   │   └── admin-sidebar.tsx    # Sidebar do admin
│   │   ├── pages/                   # Páginas da aplicação
│   │   │   ├── admin/               # Páginas administrativas
│   │   │   │   ├── enhanced-dashboard.tsx
│   │   │   │   ├── ai-intelligence.tsx
│   │   │   │   ├── leads-crm.tsx
│   │   │   │   └── destinations.tsx
│   │   │   ├── landing.tsx          # Página inicial
│   │   │   ├── admin-login.tsx      # Login admin
│   │   │   ├── admin-dashboard.tsx  # Dashboard clássico
│   │   │   └── not-found.tsx
│   │   ├── hooks/                   # Custom hooks
│   │   ├── lib/                     # Utilitários
│   │   ├── App.tsx                  # App principal
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Estilos globais
│   └── index.html
├── server/                          # Backend Node.js/Express
│   ├── services/                    # Serviços (AI, Email)
│   ├── storage.ts                   # Camada de dados
│   ├── db.ts                        # Configuração PostgreSQL
│   ├── routes.ts                    # Rotas da API
│   ├── index.ts                     # Servidor principal
│   ├── seed.ts                      # Dados iniciais
│   └── vite.ts                      # Integração Vite
├── shared/                          # Tipos compartilhados
│   └── schema.ts                    # Schema Drizzle
├── package.json                     # Dependências
├── drizzle.config.ts               # Configuração Drizzle
├── tailwind.config.ts              # Configuração Tailwind
├── vite.config.ts                  # Configuração Vite
└── tsconfig.json                   # Configuração TypeScript
```

## Dependências Instaladas

### Backend
- **Framework:** Express.js, TypeScript
- **Database:** PostgreSQL com Drizzle ORM
- **Auth:** bcrypt, express-session
- **AI:** Integração preparada para OpenAI
- **Email:** nodemailer

### Frontend  
- **Framework:** React 18, TypeScript
- **Routing:** wouter
- **UI:** Shadcn/UI, Tailwind CSS
- **State:** TanStack Query (React Query)
- **Forms:** react-hook-form + zod
- **Icons:** lucide-react

### Funcionalidades Implementadas

#### Sistema Admin Completo
1. **Enhanced Dashboard**
   - Métricas em tempo real
   - Alertas de leads quentes
   - Breakdown de receita
   - Funil de conversão
   - Weather API integration

2. **AI Intelligence CMS**
   - Gerenciamento de conhecimento da IA
   - Regras de detecção de perfil
   - Respostas para objeções
   - Analytics de conversação

3. **Leads CRM Avançado**
   - Sistema de pontuação de leads
   - Pipeline de vendas
   - Gestão de atividades
   - Histórico de interações

4. **Gestão de Destinos**
   - CRUD completo de destinos
   - Upload de imagens
   - Configurações técnicas
   - Status e preços

#### API Endpoints Implementados
```
POST   /api/auth/login              # Login admin
POST   /api/auth/logout             # Logout
GET    /api/auth/me                 # Verificar sessão

GET    /api/destinations            # Listar destinos
POST   /api/destinations            # Criar destino
PUT    /api/destinations/:id        # Atualizar destino
DELETE /api/destinations/:id        # Deletar destino

GET    /api/admin/hot-leads         # Leads quentes
GET    /api/admin/leads-pipeline    # Pipeline de vendas
GET    /api/admin/lead-stats        # Estatísticas
GET    /api/admin/ai-knowledge      # Conhecimento IA

POST   /api/chat/message            # Chat com IA
POST   /api/chat/create-lead        # Criar lead do chat
```

## Passos para Deploy no GitHub

### 1. Preparação do Repositório
```bash
# Clone o repositório existente
git clone https://github.com/Zoomchatlandingpage/brasil-cultural-agency.git
cd brasil-cultural-agency

# Crie uma nova branch para a implementação
git checkout -b feature/admin-system-complete
```

### 2. Transferir Arquivos
Copie todos os arquivos do projeto atual para o repositório:
- Substitua ou adicione todos os arquivos da estrutura acima
- Mantenha o `.gitignore` existente
- Atualize o `README.md` com as novas funcionalidades

### 3. Configuração de Ambiente
Crie `.env` com as variáveis necessárias:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/brasil_cultural
NODE_ENV=development
SESSION_SECRET=your-secret-key-here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
OPENAI_API_KEY=your-openai-key (opcional)
```

### 4. Instalação e Setup
```bash
# Instalar dependências
npm install

# Configurar banco de dados
npm run db:push

# Opcional: Popular dados iniciais
npm run db:seed

# Executar em desenvolvimento
npm run dev
```

### 5. Commit e Push
```bash
# Adicionar arquivos
git add .

# Commit
git commit -m "feat: Complete admin system with AI intelligence, CRM, and enhanced dashboard

- Enhanced admin dashboard with real-time metrics
- AI Intelligence CMS for conversation management  
- Advanced Leads CRM with scoring and pipeline
- Complete destination management system
- PostgreSQL integration with Drizzle ORM
- Authentication system with admin credentials
- Responsive UI with Shadcn components"

# Push para o repositório
git push origin feature/admin-system-complete
```

### 6. Criação de Pull Request
1. Acesse o GitHub
2. Crie um Pull Request da branch `feature/admin-system-complete` para `main`
3. Adicione descrição detalhada das funcionalidades

## Credenciais de Acesso
- **Admin Login:** Lucas Nascimento
- **Password:** magaiver123

## Deploy em Produção
Para deploy em produção (Vercel, Railway, etc.):
1. Configure as variáveis de ambiente
2. Configure PostgreSQL em produção
3. Execute `npm run build`
4. Configure domínio personalizado

## Estrutura do Banco de Dados
O sistema usa PostgreSQL com as seguintes tabelas:
- `admin_users` - Usuários administrativos
- `users` - Usuários do sistema
- `leads` - Leads e prospects
- `destinations` - Destinos de viagem
- `travel_packages` - Pacotes de viagem
- `bookings` - Reservas
- `ai_knowledge` - Base de conhecimento da IA
- `api_configs` - Configurações de APIs
- `travel_operators` - Operadores de turismo

## Próximos Passos
1. Configurar CI/CD pipeline
2. Adicionar testes automatizados
3. Implementar mais integrações de APIs
4. Expandir funcionalidades de relatórios
5. Adicionar notificações em tempo real

---

Este projeto agora está pronto para ser um sistema administrativo empresarial completo para a Brasil Cultural Agency.