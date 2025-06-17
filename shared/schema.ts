import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin users
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quiz users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  profileType: text("profile_type"),
  quizResponses: text("quiz_responses"),
  conversationLog: text("conversation_log"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Leads and bookings
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  profileScore: integer("profile_score"),
  interestLevel: text("interest_level"),
  recommendedDestinations: text("recommended_destinations"),
  estimatedBudget: decimal("estimated_budget", { precision: 10, scale: 2 }),
  travelDates: text("travel_dates"),
  bookingStatus: text("booking_status").default("inquiry"),
  status: text("status").default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Destinations (admin editable)
export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  bestMonths: text("best_months"),
  idealProfiles: text("ideal_profiles"),
  priceRangeMin: decimal("price_range_min", { precision: 10, scale: 2 }),
  priceRangeMax: decimal("price_range_max", { precision: 10, scale: 2 }),
  sellingPoints: text("selling_points"),
  mainImageUrl: text("main_image_url"),
  airportCodes: text("airport_codes"),
  hotelSearchTerms: text("hotel_search_terms"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Travel packages (admin created)
export const travelPackages = pgTable("travel_packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  destinationId: integer("destination_id").references(() => destinations.id),
  durationDays: integer("duration_days"),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }),
  includedServices: text("included_services"),
  profileTargets: text("profile_targets"),
  flightIncluded: boolean("flight_included").default(true),
  hotelIncluded: boolean("hotel_included").default(true),
  experiencesIncluded: text("experiences_included"),
  markupPercentage: decimal("markup_percentage", { precision: 5, scale: 2 }),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Real-time bookings
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  packageId: integer("package_id").references(() => travelPackages.id),
  flightBookingRef: text("flight_booking_ref"),
  hotelBookingRef: text("hotel_booking_ref"),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }),
  bookingDate: timestamp("booking_date"),
  travelDateStart: timestamp("travel_date_start"),
  travelDateEnd: timestamp("travel_date_end"),
  passengersCount: integer("passengers_count"),
  specialRequests: text("special_requests"),
  paymentStatus: text("payment_status").default("pending"),
  bookingStatus: text("booking_status").default("confirmed"),
  apiResponses: text("api_responses"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI conversation intelligence (admin editable)
export const aiKnowledge = pgTable("ai_knowledge", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  topic: text("topic").notNull(),
  context: text("context"),
  responseTemplate: text("response_template"),
  keywords: text("keywords"),
  dataSources: text("data_sources"),
  priority: integer("priority").default(1),
  usageCount: integer("usage_count").default(0),
  effectivenessScore: decimal("effectiveness_score", { precision: 3, scale: 2 }).default("0.0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// API configurations (admin managed)
export const apiConfigs = pgTable("api_configs", {
  id: serial("id").primaryKey(),
  providerName: text("provider_name").notNull(),
  apiType: text("api_type").notNull(),
  endpointUrl: text("endpoint_url"),
  apiKeyField: text("api_key_field"),
  rateLimit: integer("rate_limit"),
  costPerCall: decimal("cost_per_call", { precision: 8, scale: 4 }),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }),
  markupPercentage: decimal("markup_percentage", { precision: 5, scale: 2 }),
  status: text("status").default("active"),
  lastUsed: timestamp("last_used"),
  successRate: decimal("success_rate", { precision: 5, scale: 2 }).default("100.0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Travel operators and consolidators
export const travelOperators = pgTable("travel_operators", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  operatorType: text("operator_type"),
  apiProvider: text("api_provider"),
  coverageAreas: text("coverage_areas"),
  specialties: text("specialties"),
  commissionStructure: text("commission_structure"),
  bookingTerms: text("booking_terms"),
  contactInfo: text("contact_info"),
  partnershipLevel: text("partnership_level"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
  createdAt: true,
});

export const insertTravelPackageSchema = createInsertSchema(travelPackages).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertAiKnowledgeSchema = createInsertSchema(aiKnowledge).omit({
  id: true,
  createdAt: true,
});

export const insertApiConfigSchema = createInsertSchema(apiConfigs).omit({
  id: true,
  createdAt: true,
});

export const insertTravelOperatorSchema = createInsertSchema(travelOperators).omit({
  id: true,
  createdAt: true,
});

// Types
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type TravelPackage = typeof travelPackages.$inferSelect;
export type InsertTravelPackage = z.infer<typeof insertTravelPackageSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type AiKnowledge = typeof aiKnowledge.$inferSelect;
export type InsertAiKnowledge = z.infer<typeof insertAiKnowledgeSchema>;
export type ApiConfig = typeof apiConfigs.$inferSelect;
export type InsertApiConfig = z.infer<typeof insertApiConfigSchema>;
export type TravelOperator = typeof travelOperators.$inferSelect;
export type InsertTravelOperator = z.infer<typeof insertTravelOperatorSchema>;
