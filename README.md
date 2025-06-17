# Brasil Cultural Agency - AI-Powered Travel Platform

A comprehensive AI-powered travel platform specializing in Brazilian cultural experiences, featuring intelligent conversation systems, real-time travel API integration, and advanced booking management.

## Features

### 🤖 AI-Powered Chat System
- Intelligent profile detection and personalized recommendations
- Real-time conversation analysis and lead generation
- Dynamic travel package creation based on user preferences

### 🌎 Travel Services Integration
- Flight booking through multiple APIs (Amadeus, Skyscanner)
- Hotel reservations with real-time pricing
- Cultural experience packages tailored to Brazilian destinations

### 📊 Admin Dashboard
- Comprehensive lead management system
- Real-time booking analytics
- Content management for destinations and packages
- AI knowledge base administration

### 🎯 Destinations Featured
- **Rio de Janeiro**: Iconic landmarks, cultural experiences, carnival
- **Salvador**: Afro-Brazilian heritage, historic Pelourinho
- **Chapada Diamantina**: Natural beauty, adventure tourism

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Wouter (routing)
- **Backend**: Node.js, Express, TypeScript
- **Database**: In-memory storage with future PostgreSQL support
- **Authentication**: Session-based with bcrypt
- **UI Components**: Shadcn/ui, Radix UI primitives
- **State Management**: TanStack Query
- **Email**: Nodemailer integration

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/brasil-cultural-agency.git
cd brasil-cultural-agency
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Admin Access
- Navigate to `/admin-login`
- Default credentials: `admin` / `admin123`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   └── lib/           # Utilities and API client
├── server/                # Backend Express application
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data layer
│   └── services/          # Business logic services
├── shared/                # Shared types and schemas
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Chat & AI
- `POST /api/chat/message` - Send chat message
- `POST /api/leads/capture-email` - Capture lead email

### Travel Data
- `GET /api/destinations` - List destinations
- `GET /api/travel-packages` - List travel packages
- `POST /api/bookings` - Create booking

### Admin Management
- `GET /api/admin/leads` - List all leads
- `GET /api/admin/bookings` - List all bookings
- `POST /api/admin/destinations` - Create destination
- `POST /api/admin/travel-packages` - Create travel package

## Environment Variables

Create a `.env` file in the root directory:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Travel API Keys (Optional)
AMADEUS_API_KEY=your-amadeus-key
SKYSCANNER_API_KEY=your-skyscanner-key
BOOKING_API_KEY=your-booking-key

# Session Configuration
SESSION_SECRET=your-session-secret
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please create an issue in the GitHub repository.

---

**Brasil Cultural Agency** - Discover Brazil's rich culture through AI-powered travel experiences.