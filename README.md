# Brasil Cultural Agency - AI-Powered Travel Platform

Uma plataforma completa de viagens com foco em experiências culturais autênticas brasileiras, combinando BRASIL UNBOXED com busca de voos e hotéis em uma interface integrada.

## 🚀 Funcionalidades Principais

### Dashboard do Cliente Integrado
- **BRASIL UNBOXED**: Experiências culturais autênticas
- **Busca de Voos**: Sistema de pesquisa com múltiplas companhias aéreas
- **Busca de Hotéis**: Sistema de pesquisa com hotéis de qualidade
- Interface em abas para navegação intuitiva
- Design responsivo e moderno

### Painel Administrativo Completo
- Gerenciamento de experiências e destinos
- Sistema CRM para leads e clientes
- Analytics e relatórios de negócio
- Configurações de API e integrações
- Controle de inteligência artificial

## 🛠️ Tecnologias

- **Frontend**: React.js + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **UI**: Shadcn/ui + Radix UI
- **State**: TanStack Query

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/brasil-cultural-agency.git
cd brasil-cultural-agency

# Instale as dependências
npm install

# Configure o banco de dados
npm run db:push

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🔧 Configuração

### Variáveis de Ambiente
```env
DATABASE_URL=postgresql://...
SESSION_SECRET=your-session-secret

# APIs Externas (Opcionais)
AMADEUS_API_KEY=your-amadeus-key
BOOKING_API_KEY=your-booking-key
SENDGRID_API_KEY=your-sendgrid-key
```

## 🌐 Rotas Principais

- `/` - Landing page
- `/client-dashboard-integrated` - Dashboard completo do cliente
- `/admin` - Painel administrativo
- `/admin/brasil-unboxed` - Gerenciamento de experiências

## 📋 APIs Disponíveis

### Experiências
- `GET /api/experiences` - Lista experiências
- `POST /api/experiences` - Cria experiência
- `PUT /api/experiences/:id` - Atualiza experiência

### Busca de Viagens
- `POST /api/search/flights` - Busca voos
- `POST /api/search/hotels` - Busca hotéis

### Administrativo
- `GET /api/admin/*` - Rotas do painel admin
- `GET /api/analytics/*` - Dados de analytics

## 🚢 Deploy

### Replit Deployment
1. Conecte seu repositório GitHub ao Replit
2. Configure as variáveis de ambiente
3. Execute `npm run build`
4. Deploy automático via Replit

### Produção
1. Configure banco PostgreSQL em produção
2. Defina variáveis de ambiente
3. Execute migrações: `npm run db:push`
4. Build: `npm run build`
5. Start: `npm start`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Contato

Brasil Cultural Agency - contato@brasilcultural.com

Link do Projeto: [https://github.com/seu-usuario/brasil-cultural-agency](https://github.com/seu-usuario/brasil-cultural-agency)