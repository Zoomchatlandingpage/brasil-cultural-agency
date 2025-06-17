# Brasil Cultural Agency - Plataforma de Viagens com IA

Uma plataforma completa de viagens culturais brasileiras com sistema administrativo empresarial, inteligência artificial e CRM avançado.

## 🎯 Funcionalidades Principais

### Sistema Administrativo Completo
- **Enhanced Dashboard** - Métricas em tempo real com alertas de leads quentes
- **AI Intelligence CMS** - Centro de controle da IA para treinamento e otimização
- **Leads CRM Avançado** - Sistema de pontuação, pipeline e gestão de atividades
- **Gestão de Destinos** - CRUD completo com configurações técnicas
- **Gestão de Pacotes** - Criação visual de pacotes de viagem
- **Centro de Reservas** - Operações de booking centralizadas
- **Analytics & Reports** - Business intelligence e relatórios
- **API Management** - Gerenciamento de integrações

### Tecnologias

#### Backend
- **Framework:** Node.js + Express + TypeScript
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** bcrypt + express-session
- **AI:** Preparado para OpenAI integration
- **Email:** nodemailer

#### Frontend
- **Framework:** React 18 + TypeScript
- **UI:** Shadcn/UI + Tailwind CSS
- **Routing:** wouter
- **State:** TanStack Query
- **Forms:** react-hook-form + zod

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- Git

### Setup Local

1. **Clone o repositório**
```bash
git clone https://github.com/Zoomchatlandingpage/brasil-cultural-agency.git
cd brasil-cultural-agency
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o ambiente**
```bash
cp .env.example .env
# Edite o .env com suas configurações
```

4. **Configure o banco de dados**
```bash
# Execute as migrações
npm run db:push

# Opcional: Popular dados iniciais
npm run db:seed
```

5. **Execute em desenvolvimento**
```bash
npm run dev
```

A aplicação estará rodando em `http://localhost:5000`

## 🎮 Uso

### Acesso Administrativo
- **URL:** `/admin/login`
- **Usuário:** Lucas Nascimento
- **Senha:** magaiver123

### Módulos Administrativos

#### Enhanced Dashboard
- Visão geral em tempo real
- Alertas de leads quentes
- Breakdown de receita por destino
- Funil de conversão detalhado

#### AI Intelligence
- Gerenciar conhecimento da IA
- Configurar regras de detecção de perfil
- Treinar respostas para objeções
- Analytics de conversação

#### Leads & CRM
- Sistema de pontuação automática
- Pipeline visual de vendas
- Gestão de atividades e follow-ups
- Histórico completo de interações

#### Gestão de Destinos
- CRUD completo de destinos
- Configurações de preços
- Termos de busca para APIs
- Upload de imagens

## 🗄️ Estrutura do Banco

### Tabelas Principais
- `admin_users` - Usuários administrativos
- `users` - Usuários do sistema
- `leads` - Leads e prospects
- `destinations` - Destinos de viagem
- `travel_packages` - Pacotes de viagem
- `bookings` - Reservas
- `ai_knowledge` - Base de conhecimento da IA
- `api_configs` - Configurações de APIs

## 📡 API Endpoints

### Autenticação
```
POST   /api/auth/login              # Login admin
POST   /api/auth/logout             # Logout
GET    /api/auth/me                 # Verificar sessão
```

### Destinos
```
GET    /api/destinations            # Listar destinos
POST   /api/destinations            # Criar destino
PUT    /api/destinations/:id        # Atualizar destino
DELETE /api/destinations/:id        # Deletar destino
```

### Admin
```
GET    /api/admin/hot-leads         # Leads quentes
GET    /api/admin/leads-pipeline    # Pipeline de vendas
GET    /api/admin/ai-knowledge      # Conhecimento IA
GET    /api/admin/analytics         # Analytics dashboard
```

## 🌐 Deploy

### Variáveis de Ambiente
```env
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-password
OPENAI_API_KEY=your-key (opcional)
```

### Plataformas Recomendadas
- **Backend:** Railway, Render, Heroku
- **Database:** Neon, Supabase, Railway
- **Frontend:** Vercel, Netlify

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🔧 Desenvolvimento

### Scripts Disponíveis
```bash
npm run dev        # Desenvolvimento
npm run build      # Build para produção
npm run start      # Executar em produção
npm run db:push    # Aplicar schema ao banco
npm run db:studio  # Interface visual do banco
npm run db:seed    # Popular dados iniciais
```

### Arquitetura
- **Frontend:** React SPA com roteamento client-side
- **Backend:** API REST com Express
- **Database:** PostgreSQL com migrations automáticas
- **Deployment:** Pronto para deploy em containers ou serverless

---

**Brasil Cultural Agency** - Transformando a experiência de viagem cultural no Brasil através da tecnologia.
