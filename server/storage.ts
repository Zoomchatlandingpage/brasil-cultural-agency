import {
  AdminUser, InsertAdminUser, User, InsertUser, Lead, InsertLead,
  Destination, InsertDestination, TravelPackage, InsertTravelPackage,
  Booking, InsertBooking, AiKnowledge, InsertAiKnowledge,
  ApiConfig, InsertApiConfig, TravelOperator, InsertTravelOperator
} from "@shared/schema";
import bcrypt from "bcrypt";

export interface IStorage {
  // Admin users
  getAdminUser(id: number): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(adminUser: InsertAdminUser): Promise<AdminUser>;
  verifyAdminUser(username: string, password: string): Promise<AdminUser | null>;

  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Leads
  getLead(id: number): Promise<Lead | undefined>;
  getLeadsByUserId(userId: number): Promise<Lead[]>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, updates: Partial<InsertLead>): Promise<Lead | undefined>;
  getAllLeads(): Promise<Lead[]>;

  // Destinations
  getDestination(id: number): Promise<Destination | undefined>;
  getAllDestinations(): Promise<Destination[]>;
  getActiveDestinations(): Promise<Destination[]>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  updateDestination(id: number, updates: Partial<InsertDestination>): Promise<Destination | undefined>;
  deleteDestination(id: number): Promise<boolean>;

  // Travel packages
  getTravelPackage(id: number): Promise<TravelPackage | undefined>;
  getAllTravelPackages(): Promise<TravelPackage[]>;
  getTravelPackagesByDestination(destinationId: number): Promise<TravelPackage[]>;
  createTravelPackage(travelPackage: InsertTravelPackage): Promise<TravelPackage>;
  updateTravelPackage(id: number, updates: Partial<InsertTravelPackage>): Promise<TravelPackage | undefined>;
  deleteTravelPackage(id: number): Promise<boolean>;

  // Bookings
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByUserId(userId: number): Promise<Booking[]>;
  getAllBookings(): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, updates: Partial<InsertBooking>): Promise<Booking | undefined>;

  // AI Knowledge
  getAiKnowledge(id: number): Promise<AiKnowledge | undefined>;
  getAllAiKnowledge(): Promise<AiKnowledge[]>;
  getAiKnowledgeByCategory(category: string): Promise<AiKnowledge[]>;
  createAiKnowledge(aiKnowledge: InsertAiKnowledge): Promise<AiKnowledge>;
  updateAiKnowledge(id: number, updates: Partial<InsertAiKnowledge>): Promise<AiKnowledge | undefined>;
  deleteAiKnowledge(id: number): Promise<boolean>;

  // API Configs
  getApiConfig(id: number): Promise<ApiConfig | undefined>;
  getAllApiConfigs(): Promise<ApiConfig[]>;
  getApiConfigByProvider(providerName: string): Promise<ApiConfig | undefined>;
  createApiConfig(apiConfig: InsertApiConfig): Promise<ApiConfig>;
  updateApiConfig(id: number, updates: Partial<InsertApiConfig>): Promise<ApiConfig | undefined>;

  // Travel Operators
  getTravelOperator(id: number): Promise<TravelOperator | undefined>;
  getAllTravelOperators(): Promise<TravelOperator[]>;
  createTravelOperator(travelOperator: InsertTravelOperator): Promise<TravelOperator>;
  updateTravelOperator(id: number, updates: Partial<InsertTravelOperator>): Promise<TravelOperator | undefined>;
}

export class MemStorage implements IStorage {
  private adminUsers: Map<number, AdminUser>;
  private users: Map<number, User>;
  private leads: Map<number, Lead>;
  private destinations: Map<number, Destination>;
  private travelPackages: Map<number, TravelPackage>;
  private bookings: Map<number, Booking>;
  private aiKnowledge: Map<number, AiKnowledge>;
  private apiConfigs: Map<number, ApiConfig>;
  private travelOperators: Map<number, TravelOperator>;
  private currentId: number;

  constructor() {
    this.adminUsers = new Map();
    this.users = new Map();
    this.leads = new Map();
    this.destinations = new Map();
    this.travelPackages = new Map();
    this.bookings = new Map();
    this.aiKnowledge = new Map();
    this.apiConfigs = new Map();
    this.travelOperators = new Map();
    this.currentId = 1;
    this.initializeData();
  }

  private async initializeData() {
    // Create default admin user
    const hashedPassword = await bcrypt.hash("magaiver123", 10);
    const adminUser: AdminUser = {
      id: this.currentId++,
      username: "Lucas Nascimento",
      password: hashedPassword,
      createdAt: new Date(),
    };
    this.adminUsers.set(adminUser.id, adminUser);

    // Create sample destinations
    const rioDestination: Destination = {
      id: this.currentId++,
      name: "Rio de Janeiro",
      description: "Experience the Marvelous City with its iconic landmarks, vibrant culture, and stunning beaches.",
      bestMonths: "Mar-May, Sep-Nov",
      idealProfiles: "Cultural,Adventure",
      priceRangeMin: "1800",
      priceRangeMax: "3500",
      sellingPoints: "Christ Redeemer, Sugarloaf, Copacabana, Samba culture",
      mainImageUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325",
      airportCodes: "GIG,SDU",
      hotelSearchTerms: "Copacabana,Ipanema,Santa Teresa",
      status: "active",
      createdAt: new Date(),
    };
    this.destinations.set(rioDestination.id, rioDestination);

    const salvadorDestination: Destination = {
      id: this.currentId++,
      name: "Salvador",
      description: "Dive deep into Afro-Brazilian culture in Brazil's first capital.",
      bestMonths: "Sep-Mar",
      idealProfiles: "Cultural,Spiritual",
      priceRangeMin: "1500",
      priceRangeMax: "2800",
      sellingPoints: "Pelourinho, Capoeira, Bahian cuisine, African heritage",
      mainImageUrl: "https://images.unsplash.com/photo-1612214070475-1e73f478188c",
      airportCodes: "SSA",
      hotelSearchTerms: "Pelourinho,Barra,Rio Vermelho",
      status: "active",
      createdAt: new Date(),
    };
    this.destinations.set(salvadorDestination.id, salvadorDestination);

    const chapadaDestination: Destination = {
      id: this.currentId++,
      name: "Chapada Diamantina",
      description: "Escape to pristine nature with waterfalls, caves, and hiking trails.",
      bestMonths: "Apr-Sep",
      idealProfiles: "Adventure,Spiritual",
      priceRangeMin: "1200",
      priceRangeMax: "2200",
      sellingPoints: "Waterfalls, caves, hiking, table mountains, crystal pools",
      mainImageUrl: "https://images.unsplash.com/photo-1520175480921-4edfa2983e0f",
      airportCodes: "LEC",
      hotelSearchTerms: "Lencois,Vale do Capao,Mucuge",
      status: "active",
      createdAt: new Date(),
    };
    this.destinations.set(chapadaDestination.id, chapadaDestination);

    // Create sample AI knowledge
    const culturalKnowledge: AiKnowledge = {
      id: this.currentId++,
      category: "cultural",
      topic: "Brazilian culture introduction",
      context: "User shows interest in authentic cultural experiences",
      responseTemplate: "Brazil offers incredible cultural diversity! From samba in Rio to capoeira in Salvador, each region has unique traditions. What aspects of Brazilian culture interest you most?",
      keywords: "authentic,culture,traditional,local,music,dance,capoeira,samba",
      dataSources: "destinations,experiences",
      priority: 1,
      usageCount: 0,
      effectivenessScore: "0.0",
      createdAt: new Date(),
    };
    this.aiKnowledge.set(culturalKnowledge.id, culturalKnowledge);

    // Create sample API configs
    const amadeusConfig: ApiConfig = {
      id: this.currentId++,
      providerName: "Amadeus",
      apiType: "flights",
      endpointUrl: "https://api.amadeus.com",
      apiKeyField: "AMADEUS_API_KEY",
      rateLimit: 1000,
      costPerCall: "0.01",
      commissionRate: "5.0",
      markupPercentage: "10.0",
      status: "active",
      lastUsed: new Date(),
      successRate: "98.0",
      createdAt: new Date(),
    };
    this.apiConfigs.set(amadeusConfig.id, amadeusConfig);
  }

  // Admin users
  async getAdminUser(id: number): Promise<AdminUser | undefined> {
    return this.adminUsers.get(id);
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    return Array.from(this.adminUsers.values()).find(user => user.username === username);
  }

  async createAdminUser(adminUser: InsertAdminUser): Promise<AdminUser> {
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    const id = this.currentId++;
    const user: AdminUser = {
      ...adminUser,
      id,
      password: hashedPassword,
      createdAt: new Date(),
    };
    this.adminUsers.set(id, user);
    return user;
  }

  async verifyAdminUser(username: string, password: string): Promise<AdminUser | null> {
    const user = await this.getAdminUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const id = this.currentId++;
    const newUser: User = {
      ...user,
      id,
      password: hashedPassword,
      createdAt: new Date(),
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Leads
  async getLead(id: number): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async getLeadsByUserId(userId: number): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter(lead => lead.userId === userId);
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const id = this.currentId++;
    const newLead: Lead = {
      ...lead,
      id,
      createdAt: new Date(),
    };
    this.leads.set(id, newLead);
    return newLead;
  }

  async updateLead(id: number, updates: Partial<InsertLead>): Promise<Lead | undefined> {
    const lead = this.leads.get(id);
    if (!lead) return undefined;
    
    const updatedLead = { ...lead, ...updates };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }

  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  // Destinations
  async getDestination(id: number): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }

  async getAllDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async getActiveDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values()).filter(dest => dest.status === "active");
  }

  async createDestination(destination: InsertDestination): Promise<Destination> {
    const id = this.currentId++;
    const newDestination: Destination = {
      ...destination,
      id,
      createdAt: new Date(),
    };
    this.destinations.set(id, newDestination);
    return newDestination;
  }

  async updateDestination(id: number, updates: Partial<InsertDestination>): Promise<Destination | undefined> {
    const destination = this.destinations.get(id);
    if (!destination) return undefined;
    
    const updatedDestination = { ...destination, ...updates };
    this.destinations.set(id, updatedDestination);
    return updatedDestination;
  }

  async deleteDestination(id: number): Promise<boolean> {
    return this.destinations.delete(id);
  }

  // Travel packages
  async getTravelPackage(id: number): Promise<TravelPackage | undefined> {
    return this.travelPackages.get(id);
  }

  async getAllTravelPackages(): Promise<TravelPackage[]> {
    return Array.from(this.travelPackages.values());
  }

  async getTravelPackagesByDestination(destinationId: number): Promise<TravelPackage[]> {
    return Array.from(this.travelPackages.values()).filter(pkg => pkg.destinationId === destinationId);
  }

  async createTravelPackage(travelPackage: InsertTravelPackage): Promise<TravelPackage> {
    const id = this.currentId++;
    const newPackage: TravelPackage = {
      ...travelPackage,
      id,
      createdAt: new Date(),
    };
    this.travelPackages.set(id, newPackage);
    return newPackage;
  }

  async updateTravelPackage(id: number, updates: Partial<InsertTravelPackage>): Promise<TravelPackage | undefined> {
    const travelPackage = this.travelPackages.get(id);
    if (!travelPackage) return undefined;
    
    const updatedPackage = { ...travelPackage, ...updates };
    this.travelPackages.set(id, updatedPackage);
    return updatedPackage;
  }

  async deleteTravelPackage(id: number): Promise<boolean> {
    return this.travelPackages.delete(id);
  }

  // Bookings
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.userId === userId);
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.currentId++;
    const newBooking: Booking = {
      ...booking,
      id,
      createdAt: new Date(),
    };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async updateBooking(id: number, updates: Partial<InsertBooking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, ...updates };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // AI Knowledge
  async getAiKnowledge(id: number): Promise<AiKnowledge | undefined> {
    return this.aiKnowledge.get(id);
  }

  async getAllAiKnowledge(): Promise<AiKnowledge[]> {
    return Array.from(this.aiKnowledge.values());
  }

  async getAiKnowledgeByCategory(category: string): Promise<AiKnowledge[]> {
    return Array.from(this.aiKnowledge.values()).filter(knowledge => knowledge.category === category);
  }

  async createAiKnowledge(aiKnowledge: InsertAiKnowledge): Promise<AiKnowledge> {
    const id = this.currentId++;
    const newKnowledge: AiKnowledge = {
      ...aiKnowledge,
      id,
      createdAt: new Date(),
    };
    this.aiKnowledge.set(id, newKnowledge);
    return newKnowledge;
  }

  async updateAiKnowledge(id: number, updates: Partial<InsertAiKnowledge>): Promise<AiKnowledge | undefined> {
    const knowledge = this.aiKnowledge.get(id);
    if (!knowledge) return undefined;
    
    const updatedKnowledge = { ...knowledge, ...updates };
    this.aiKnowledge.set(id, updatedKnowledge);
    return updatedKnowledge;
  }

  async deleteAiKnowledge(id: number): Promise<boolean> {
    return this.aiKnowledge.delete(id);
  }

  // API Configs
  async getApiConfig(id: number): Promise<ApiConfig | undefined> {
    return this.apiConfigs.get(id);
  }

  async getAllApiConfigs(): Promise<ApiConfig[]> {
    return Array.from(this.apiConfigs.values());
  }

  async getApiConfigByProvider(providerName: string): Promise<ApiConfig | undefined> {
    return Array.from(this.apiConfigs.values()).find(config => config.providerName === providerName);
  }

  async createApiConfig(apiConfig: InsertApiConfig): Promise<ApiConfig> {
    const id = this.currentId++;
    const newConfig: ApiConfig = {
      ...apiConfig,
      id,
      createdAt: new Date(),
    };
    this.apiConfigs.set(id, newConfig);
    return newConfig;
  }

  async updateApiConfig(id: number, updates: Partial<InsertApiConfig>): Promise<ApiConfig | undefined> {
    const config = this.apiConfigs.get(id);
    if (!config) return undefined;
    
    const updatedConfig = { ...config, ...updates };
    this.apiConfigs.set(id, updatedConfig);
    return updatedConfig;
  }

  // Travel Operators
  async getTravelOperator(id: number): Promise<TravelOperator | undefined> {
    return this.travelOperators.get(id);
  }

  async getAllTravelOperators(): Promise<TravelOperator[]> {
    return Array.from(this.travelOperators.values());
  }

  async createTravelOperator(travelOperator: InsertTravelOperator): Promise<TravelOperator> {
    const id = this.currentId++;
    const newOperator: TravelOperator = {
      ...travelOperator,
      id,
      createdAt: new Date(),
    };
    this.travelOperators.set(id, newOperator);
    return newOperator;
  }

  async updateTravelOperator(id: number, updates: Partial<InsertTravelOperator>): Promise<TravelOperator | undefined> {
    const operator = this.travelOperators.get(id);
    if (!operator) return undefined;
    
    const updatedOperator = { ...operator, ...updates };
    this.travelOperators.set(id, updatedOperator);
    return updatedOperator;
  }
}

export const storage = new MemStorage();
