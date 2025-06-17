import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { storage } from './storage';
import type { ClientPackage, InsertClientPackage, ClientBooking, InsertClientBooking } from '@shared/schema';

const router = Router();

// Schemas
const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const CreateAccountSchema = z.object({
  email: z.string().email(),
  packageData: z.object({
    name: z.string(),
    destination: z.string(),
    duration: z.string(),
    totalPrice: z.number(),
    flightPrice: z.number().optional(),
    hotelPrice: z.number().optional(),
    experiencesPrice: z.number().optional(),
    customServicesPrice: z.number().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

const CustomizePackageSchema = z.object({
  customServices: z.array(z.object({
    id: z.string(),
    duration: z.number(),
    quantity: z.number(),
  })).optional(),
  experiences: z.array(z.string()).optional(),
});

const BookingSchema = z.object({
  travelers: z.array(z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    passport: z.string().optional(),
  })),
  paymentMethod: z.object({
    type: z.enum(['credit_card', 'paypal', 'bank_transfer']),
    details: z.record(z.string()),
  }),
});

// Simple session middleware for client auth
const clientSessions = new Map<string, { userId: number; expiresAt: Date }>();

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function isClientAuthenticated(req: any, res: any, next: any) {
  const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
  
  if (!sessionId) {
    return res.status(401).json({ error: 'No session found' });
  }

  const session = clientSessions.get(sessionId);
  if (!session || session.expiresAt < new Date()) {
    clientSessions.delete(sessionId);
    return res.status(401).json({ error: 'Session expired' });
  }

  req.clientUserId = session.userId;
  next();
}

// POST /api/client/create-account - Create account from AI chat
router.post('/create-account', async (req, res) => {
  try {
    const { email, packageData } = CreateAccountSchema.parse(req.body);
    
    // Generate automatic credentials
    const username = `BrazilExplorer${Math.floor(Math.random() * 9999)}`;
    const password = `Cultural@${Math.floor(Math.random() * 100)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await storage.createUser({
      username,
      email,
      password: hashedPassword,
      userType: 'client',
      profileType: 'Cultural Seeker',
    });
    
    // Calculate commission (25-30% margin)
    const commission = Math.round(packageData.totalPrice * 0.27);
    
    // Create package
    const clientPackage: InsertClientPackage = {
      userId: user.id,
      name: packageData.name,
      destination: packageData.destination,
      duration: packageData.duration,
      totalPrice: packageData.totalPrice.toString(),
      flightPrice: (packageData.flightPrice || 750).toString(),
      hotelPrice: (packageData.hotelPrice || 980).toString(),
      experiencesPrice: (packageData.experiencesPrice || 600).toString(),
      customServicesPrice: (packageData.customServicesPrice || 300).toString(),
      commission: commission.toString(),
      status: 'draft',
      startDate: packageData.startDate || '2025-08-15',
      endDate: packageData.endDate || '2025-08-22',
      packageData: JSON.stringify(packageData),
    };
    
    // For demo, we'll store in memory temporarily
    const packageId = Math.floor(Math.random() * 10000);
    
    // Send credentials via email (simulated)
    console.log(`[EMAIL SENT] Welcome to Brasil Cultural Agency!
    Username: ${username}
    Password: ${password}
    Dashboard: /client/login
    Package: ${packageData.name} - $${packageData.totalPrice}`);
    
    res.json({ 
      success: true, 
      message: 'Account created! Check your email for login credentials.',
      packageId 
    });
    
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// POST /api/client/login - Client login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = LoginSchema.parse(req.body);
    
    const user = await storage.getUserByUsername(username);
    if (!user || user.userType !== 'client') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create session
    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    clientSessions.set(sessionId, {
      userId: user.id,
      expiresAt,
    });
    
    res.json({
      success: true,
      sessionId,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/client/dashboard - Dashboard data
router.get('/dashboard', isClientAuthenticated, async (req: any, res) => {
  try {
    const userId = req.clientUserId;
    
    // Get user
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Simulate active package (in real app, query from clientPackages table)
    const activePackage = {
      id: 1,
      name: 'Rio Cultural Experience',
      destination: 'Rio de Janeiro',
      duration: '7 days',
      totalPrice: 2630,
      flightPrice: 750,
      hotelPrice: 980,
      experiencesPrice: 600,
      customServicesPrice: 300,
      commission: 700,
      status: 'draft',
      startDate: '2025-08-15',
      endDate: '2025-08-22',
    };
    
    // Simulate bookings
    const bookings = [
      {
        id: 1,
        packageName: 'Rio Cultural Experience',
        bookingReference: 'BCA20250001',
        totalPrice: 2630,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      },
    ];
    
    // Simulate stats
    const stats = {
      totalSpent: 2630,
      completedTrips: 0,
      totalBookings: 1,
    };
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      activePackage,
      bookings,
      stats,
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// GET /api/client/services/available - Available services
router.get('/services/available', async (req, res) => {
  try {
    // Simulate available services
    const services = {
      guide: [
        {
          id: 'guide-lucas',
          name: 'Personal Guide (Lucas)',
          description: 'Experienced local guide with fluent English',
          pricePerDay: 50,
          category: 'guide',
        },
      ],
      translator: [
        {
          id: 'translator-service',
          name: 'Portuguese Translation',
          description: 'Real-time translation support',
          priceFixed: 100,
          category: 'translator',
        },
      ],
      experience: [
        {
          id: 'capoeira-workshop',
          name: 'Capoeira Workshop',
          description: 'Learn traditional Brazilian martial art',
          priceFixed: 80,
          category: 'experience',
        },
        {
          id: 'cooking-class',
          name: 'Brazilian Cooking Class',
          description: 'Cook traditional feijoada and more',
          priceFixed: 120,
          category: 'experience',
        },
      ],
    };
    
    res.json(services);
    
  } catch (error) {
    console.error('Services error:', error);
    res.status(500).json({ error: 'Failed to load services' });
  }
});

// PUT /api/client/package/:id - Customize package
router.put('/package/:id', isClientAuthenticated, async (req: any, res) => {
  try {
    const packageId = parseInt(req.params.id);
    const customizations = CustomizePackageSchema.parse(req.body);
    const userId = req.clientUserId;
    
    // Simulate package customization
    let additionalCost = 0;
    let additionalCommission = 0;
    
    if (customizations.customServices) {
      for (const service of customizations.customServices) {
        if (service.id === 'capoeira-workshop') {
          additionalCost += 80;
          additionalCommission += 80; // 100% commission on our services
        } else if (service.id === 'cooking-class') {
          additionalCost += 120;
          additionalCommission += 120;
        }
      }
    }
    
    const newTotal = 2630 + additionalCost;
    const newCommission = 700 + additionalCommission;
    
    res.json({
      success: true,
      package: {
        id: packageId,
        totalPrice: newTotal,
        commission: newCommission,
        savings: Math.round(newTotal * 0.15),
      },
    });
    
  } catch (error) {
    console.error('Package customization error:', error);
    res.status(500).json({ error: 'Failed to update package' });
  }
});

// POST /api/client/package/:id/book - Book package
router.post('/package/:id/book', isClientAuthenticated, async (req: any, res) => {
  try {
    const packageId = parseInt(req.params.id);
    const bookingData = BookingSchema.parse(req.body);
    const userId = req.clientUserId;
    
    // Generate booking reference
    const bookingReference = `BCA${Date.now().toString().slice(-8)}`;
    
    // Simulate booking process
    const totalPrice = 2760; // Package + fees
    
    // Simulate booking confirmations
    const reservations = [
      {
        type: 'flight',
        reference: `FL${Date.now().toString().slice(-6)}`,
        status: 'confirmed',
        price: 750,
      },
      {
        type: 'hotel',
        reference: `HT${Date.now().toString().slice(-6)}`,
        status: 'confirmed',
        price: 980,
      },
      {
        type: 'experience',
        reference: `EX${Date.now().toString().slice(-6)}`,
        status: 'confirmed',
        price: 600,
      },
    ];
    
    // Send confirmation email (simulated)
    console.log(`[BOOKING CONFIRMED] ${bookingReference}
    Traveler: ${bookingData.travelers[0].name}
    Total: $${totalPrice}
    Lucas (Guide): Your commission is $700!`);
    
    res.json({
      success: true,
      bookingReference,
      reservations,
      message: 'Booking confirmed! Check your email for details.',
    });
    
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Booking failed. Please try again.' });
  }
});

// POST /api/client/logout - Logout
router.post('/logout', isClientAuthenticated, async (req: any, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    if (sessionId) {
      clientSessions.delete(sessionId);
    }
    
    res.json({ success: true, message: 'Logged out successfully' });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

export default router;