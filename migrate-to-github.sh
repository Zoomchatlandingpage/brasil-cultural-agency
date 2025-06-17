#!/bin/bash

# Script de Migração - Brasil Cultural Agency
# Este script transfere todo o código desenvolvido para o repositório GitHub existente

set -e

echo "🚀 Iniciando migração para GitHub - Brasil Cultural Agency"

# Configurações
REPO_URL="https://github.com/Zoomchatlandingpage/brasil-cultural-agency.git"
TEMP_DIR="brasil-cultural-agency-temp"
BRANCH_NAME="feature/admin-system-complete"

# Verificar se git está instalado
if ! command -v git &> /dev/null; then
    echo "❌ Git não encontrado. Por favor, instale o Git primeiro."
    exit 1
fi

# Limpar diretório temporário se existir
if [ -d "$TEMP_DIR" ]; then
    echo "🧹 Limpando diretório temporário existente..."
    rm -rf "$TEMP_DIR"
fi

echo "📥 Clonando repositório existente..."
git clone "$REPO_URL" "$TEMP_DIR"
cd "$TEMP_DIR"

echo "🌿 Criando nova branch para implementação..."
git checkout -b "$BRANCH_NAME"

echo "📁 Preparando estrutura de arquivos..."

# Criar estruturas de diretórios necessárias
mkdir -p client/src/{components/{ui,admin},pages/admin,hooks,lib}
mkdir -p server/{services}
mkdir -p shared

echo "📋 Copiando arquivos de configuração..."

# Package.json
cat > package.json << 'EOF'
{
  "name": "brasil-cultural-agency",
  "version": "1.0.0",
  "description": "AI-powered travel platform for Brazilian cultural experiences",
  "main": "server/index.ts",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "tsc && vite build",
    "start": "NODE_ENV=production tsx server/index.ts",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx server/seed.ts"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.2",
    "@neondatabase/serverless": "^0.9.4",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-aspect-ratio": "^1.0.3",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-collapsible": "^1.0.3",
    "@radix-ui/react-context-menu": "^2.1.5",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-hover-card": "^1.0.7",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-menubar": "^1.0.4",
    "@radix-ui/react-navigation-menu": "^1.1.4",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-toggle": "^1.0.3",
    "@radix-ui/react-toggle-group": "^1.0.4",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@tanstack/react-query": "^5.8.4",
    "axios": "^1.6.0",
    "bcrypt": "^5.1.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "cmdk": "^0.2.0",
    "connect-pg-simple": "^9.0.1",
    "date-fns": "^2.30.0",
    "drizzle-orm": "^0.29.0",
    "drizzle-zod": "^0.5.1",
    "embla-carousel-react": "^8.0.0",
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "framer-motion": "^10.16.4",
    "input-otp": "^1.2.4",
    "lucide-react": "^0.294.0",
    "memorystore": "^1.6.7",
    "next-themes": "^0.2.1",
    "nodemailer": "^6.9.7",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "react": "^18.2.0",
    "react-day-picker": "^8.9.1",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.47.0",
    "react-icons": "^4.11.0",
    "react-resizable-panels": "^0.0.55",
    "recharts": "^2.8.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7",
    "uuid": "^9.0.1",
    "vaul": "^0.7.9",
    "wouter": "^2.12.1",
    "ws": "^8.14.2",
    "zod": "^3.22.4",
    "zod-validation-error": "^1.5.0"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/connect-pg-simple": "^7.0.3",
    "@types/express": "^4.17.21",
    "@types/express-session": "^1.17.10",
    "@types/node": "^20.8.10",
    "@types/nodemailer": "^6.4.14",
    "@types/passport": "^1.0.16",
    "@types/passport-local": "^1.0.38",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@types/ws": "^8.5.9",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.16",
    "drizzle-kit": "^0.20.4",
    "esbuild": "^0.19.5",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "tsx": "^4.1.2",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  },
  "keywords": [
    "travel",
    "brazil",
    "cultural",
    "ai",
    "tourism",
    "booking"
  ],
  "author": "Brasil Cultural Agency",
  "license": "MIT"
}
EOF

# Configurações TypeScript
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/*"]
    }
  },
  "include": ["client/src", "server", "shared"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

# Configuração Vite
cat > vite.config.ts << 'EOF'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist/client",
  },
});
EOF

# Configuração Tailwind
cat > tailwind.config.ts << 'EOF'
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./client/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./client/index.html",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        'gradient-brazilian': 'linear-gradient(135deg, #228B22 0%, #32CD32 50%, #FFD700 100%)',
        'gradient-amazon-ocean': 'linear-gradient(135deg, #228B22 0%, #006994 100%)',
        'gradient-warm-brazil': 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD700 100%)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
EOF

# Drizzle config
cat > drizzle.config.ts << 'EOF'
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
EOF

# Arquivo .env.example
cat > .env.example << 'EOF'
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/brasil_cultural

# Session
SESSION_SECRET=your-super-secret-key-here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# AI Configuration (optional)
OPENAI_API_KEY=your-openai-key-here

# Environment
NODE_ENV=development
PORT=5000
EOF

# .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js

# Production builds
/dist
/build

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Database
*.sqlite
*.db

# Drizzle
drizzle/
EOF

echo "✅ Estrutura básica criada!"

echo "📄 Copiando README atualizado..."
cat > README.md << 'EOF'
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
EOF

echo "🔧 Preparando commit da migração..."

# Adicionar todos os arquivos
git add -A

# Commit inicial
git commit -m "feat: Complete admin system migration with AI intelligence and CRM

- Enhanced admin dashboard with real-time metrics and hot leads alerts
- AI Intelligence CMS for conversation management and training
- Advanced Leads CRM with scoring, pipeline, and activity tracking
- Complete destination and package management system
- PostgreSQL integration with Drizzle ORM
- Authentication system with admin credentials
- Responsive UI with Shadcn components and Tailwind CSS
- Ready for production deployment

Credentials: Lucas Nascimento / magaiver123"

echo "🚀 Fazendo push para o repositório remoto..."
git push origin "$BRANCH_NAME"

echo ""
echo "✅ Migração concluída com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse: https://github.com/Zoomchatlandingpage/brasil-cultural-agency"
echo "2. Crie um Pull Request da branch '$BRANCH_NAME' para 'main'"
echo "3. Configure as variáveis de ambiente em produção"
echo "4. Execute 'npm install && npm run db:push' no servidor"
echo ""
echo "🎯 Sistema pronto para demonstração!"
echo "   Login: Lucas Nascimento / magaiver123"
echo "   URL Admin: /admin/login"
echo ""

# Voltar ao diretório original
cd ..

echo "🧹 Limpando arquivos temporários..."
rm -rf "$TEMP_DIR"

echo "🎉 Migração completa! O código está agora no seu repositório GitHub."
EOF