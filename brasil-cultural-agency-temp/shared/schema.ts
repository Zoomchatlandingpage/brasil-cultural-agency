import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  leads: many(leads),
  bookings: many(bookings),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  user: one(users, {
    fields: [leads.userId],
    references: [users.id],
  }),
}));

export const destinationsRelations = relations(destinations, ({ many }) => ({
  travelPackages: many(travelPackages),
}));

export const travelPackagesRelations = relations(travelPackages, ({ one, many }) => ({
  destination: one(destinations, {
    fields: [travelPackages.destinationId],
    references: [destinations.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  travelPackage: one(travelPackages, {
    fields: [bookings.packageId],
    references: [travelPackages.id],
  }),
}));

// Enhanced AI Intelligence Schema
export const aiKnowledgeBase = pgTable("ai_knowledge_base", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // "destinations", "objections", "profiles"
  subcategory: text("subcategory"), // "rio", "safety", "cultural-seeker"
  title: text("title").notNull(),
  content: text("content").notNull(),
  keywords: text("keywords"), // comma-separated
  usageCount: integer("usage_count").default(0),
  effectiveness: decimal("effectiveness", { precision: 3, scale: 2 }).default("0.0"),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const conversationContext = pgTable("conversation_context", {
  id: serial("id").primaryKey(),
  conversationId: text("conversation_id").notNull(),
  profileDetected: text("profile_detected"),
  keywordsExtracted: text("keywords_extracted"),
  sentimentScore: decimal("sentiment_score", { precision: 3, scale: 2 }),
  intentClassification: text("intent_classification"),
  contextData: text("context_data"), // JSON string
  aiResponse: text("ai_response"),
  userSatisfaction: integer("user_satisfaction"), // 1-5 rating
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced Leads & CRM Schema
export const leadScoring = pgTable("lead_scoring", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id),
  budgetScore: integer("budget_score").default(0),
  timelineScore: integer("timeline_score").default(0),
  engagementScore: integer("engagement_score").default(0),
  profileMatchScore: integer("profile_match_score").default(0),
  totalScore: integer("total_score").default(0),
  scoreCategory: text("score_category").default("cold"), // hot, warm, qualified, cold, unqualified
  lastCalculated: timestamp("last_calculated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leadActivities = pgTable("lead_activities", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id),
  activityType: text("activity_type").notNull(), // "message", "email", "call", "note", "status_change"
  description: text("description").notNull(),
  metadata: text("metadata"), // JSON string with additional data
  performedBy: text("performed_by"), // admin username or "system"
  createdAt: timestamp("created_at").defaultNow(),
});

export const leadNotes = pgTable("lead_notes", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id),
  noteText: text("note_text").notNull(),
  isPrivate: boolean("is_private").default(false),
  isPinned: boolean("is_pinned").default(false),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Media Library Schema
export const mediaLibrary = pgTable("media_library", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  category: text("category").default("general"), // destinations, experiences, people, social-media
  tags: text("tags"), // comma-separated
  altText: text("alt_text"),
  uploadedBy: text("uploaded_by").notNull(),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Analytics Schema
export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(), // page_view, chat_start, lead_created, booking_made
  sessionId: text("session_id"),
  userId: integer("user_id").references(() => users.id),
  leadId: integer("lead_id").references(() => leads.id),
  bookingId: integer("booking_id").references(() => bookings.id),
  metadata: text("metadata"), // JSON string
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced Package Components Schema
export const packageComponents = pgTable("package_components", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // flight, hotel, experience, transfer, meal
  description: text("description"),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }),
  markup: decimal("markup", { precision: 5, scale: 2 }).default("0.0"),
  supplier: text("supplier"),
  duration: integer("duration"), // in hours/days
  capacity: integer("capacity"),
  tags: text("tags"), // comma-separated
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Type exports for new schemas
export type AIKnowledgeBase = typeof aiKnowledgeBase.$inferSelect;
export type InsertAIKnowledgeBase = typeof aiKnowledgeBase.$inferInsert;
export type ConversationContext = typeof conversationContext.$inferSelect;
export type InsertConversationContext = typeof conversationContext.$inferInsert;
export type LeadScoring = typeof leadScoring.$inferSelect;
export type InsertLeadScoring = typeof leadScoring.$inferInsert;
export type LeadActivity = typeof leadActivities.$inferSelect;
export type InsertLeadActivity = typeof leadActivities.$inferInsert;
export type LeadNote = typeof leadNotes.$inferSelect;
export type InsertLeadNote = typeof leadNotes.$inferInsert;
export type MediaFile = typeof mediaLibrary.$inferSelect;
export type InsertMediaFile = typeof mediaLibrary.$inferInsert;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = typeof analyticsEvents.$inferInsert;
export type PackageComponent = typeof packageComponents.$inferSelect;
export type InsertPackageComponent = typeof packageComponents.$inferInsert;
