import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authMiddleware, createSession, destroySession } from "./services/auth";
import { aiEngine } from "./services/ai-engine";
import { travelApis } from "./services/travel-apis";
import { emailService } from "./services/email";
import { insertUserSchema, insertLeadSchema, insertDestinationSchema, insertTravelPackageSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const chatMessageSchema = z.object({
  message: z.string().min(1),
  conversationId: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await storage.verifyAdminUser(username, password);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      await createSession(req, user.id);
      res.json({ user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    await destroySession(req);
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", authMiddleware, async (req, res) => {
    const user = await storage.getAdminUser(req.userId!);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user: { id: user.id, username: user.username } });
  });

  // AI Chat routes
  app.post("/api/chat/message", async (req, res) => {
    try {
      const { message, conversationId } = chatMessageSchema.parse(req.body);
      const response = await aiEngine.processMessage(message, conversationId);
      res.json(response);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/chat/create-lead", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      
      // Send email notification
      if (leadData.userId) {
        const user = await storage.getUser(leadData.userId);
        if (user?.email) {
          await emailService.sendLeadConfirmation(user.email, lead);
        }
      }
      
      res.json(lead);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // User registration
  app.post("/api/users/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.json({ user: { id: user.id, email: user.email, username: user.username } });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Destinations routes
  app.get("/api/destinations", async (req, res) => {
    const destinations = await storage.getActiveDestinations();
    res.json(destinations);
  });

  app.get("/api/destinations/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const destination = await storage.getDestination(id);
    
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    
    res.json(destination);
  });

  app.post("/api/destinations", authMiddleware, async (req, res) => {
    try {
      const destinationData = insertDestinationSchema.parse(req.body);
      const destination = await storage.createDestination(destinationData);
      res.json(destination);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/destinations/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertDestinationSchema.partial().parse(req.body);
      const destination = await storage.updateDestination(id, updates);
      
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      
      res.json(destination);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.delete("/api/destinations/:id", authMiddleware, async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteDestination(id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Destination not found" });
    }
    
    res.json({ message: "Destination deleted successfully" });
  });

  // Travel packages routes
  app.get("/api/packages", async (req, res) => {
    const packages = await storage.getAllTravelPackages();
    res.json(packages);
  });

  app.get("/api/packages/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const travelPackage = await storage.getTravelPackage(id);
    
    if (!travelPackage) {
      return res.status(404).json({ message: "Package not found" });
    }
    
    res.json(travelPackage);
  });

  app.post("/api/packages", authMiddleware, async (req, res) => {
    try {
      const packageData = insertTravelPackageSchema.parse(req.body);
      const travelPackage = await storage.createTravelPackage(packageData);
      res.json(travelPackage);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Booking routes
  app.get("/api/bookings", authMiddleware, async (req, res) => {
    const bookings = await storage.getAllBookings();
    res.json(bookings);
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Create booking with travel APIs
      const flightBooking = await travelApis.bookFlight(bookingData);
      const hotelBooking = await travelApis.bookHotel(bookingData);
      
      const booking = await storage.createBooking({
        ...bookingData,
        flightBookingRef: flightBooking.reference,
        hotelBookingRef: hotelBooking.reference,
        apiResponses: JSON.stringify({ flight: flightBooking, hotel: hotelBooking }),
      });
      
      // Send confirmation email
      if (bookingData.userId) {
        const user = await storage.getUser(bookingData.userId);
        if (user?.email) {
          await emailService.sendBookingConfirmation(user.email, booking);
        }
      }
      
      res.json(booking);
    } catch (error) {
      res.status(400).json({ message: "Booking failed: " + error });
    }
  });

  // Leads management
  app.get("/api/leads", authMiddleware, async (req, res) => {
    const leads = await storage.getAllLeads();
    res.json(leads);
  });

  // Analytics routes
  app.get("/api/analytics/dashboard", authMiddleware, async (req, res) => {
    const leads = await storage.getAllLeads();
    const bookings = await storage.getAllBookings();
    
    const totalLeads = leads.length;
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, booking) => sum + parseFloat(booking.totalPrice || "0"), 0);
    const conversionRate = totalLeads > 0 ? (totalBookings / totalLeads) * 100 : 0;
    
    res.json({
      totalLeads,
      totalBookings,
      totalRevenue,
      conversionRate: Math.round(conversionRate),
    });
  });

  // Real-time pricing
  app.post("/api/pricing/flight", async (req, res) => {
    try {
      const { origin, destination, departureDate, returnDate, passengers } = req.body;
      const pricing = await travelApis.getFlightPricing({
        origin,
        destination,
        departureDate,
        returnDate,
        passengers,
      });
      res.json(pricing);
    } catch (error) {
      res.status(500).json({ message: "Failed to get flight pricing" });
    }
  });

  app.post("/api/pricing/hotel", async (req, res) => {
    try {
      const { location, checkIn, checkOut, guests } = req.body;
      const pricing = await travelApis.getHotelPricing({
        location,
        checkIn,
        checkOut,
        guests,
      });
      res.json(pricing);
    } catch (error) {
      res.status(500).json({ message: "Failed to get hotel pricing" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
