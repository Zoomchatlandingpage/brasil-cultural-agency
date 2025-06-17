import { storage } from "../storage";
import { travelApis } from "./travel-apis";
import { v4 as uuidv4 } from "uuid";

interface ConversationContext {
  id: string;
  messages: Array<{ role: "user" | "assistant"; content: string; timestamp: Date }>;
  detectedProfile?: string;
  userInfo?: {
    budget?: number;
    dates?: string;
    destination?: string;
    travelStyle?: string;
  };
  leadId?: number;
  userId?: number;
}

interface AIResponse {
  message: string;
  profileDetected?: string;
  packageData?: any;
  conversationId: string;
  suggestEmailCapture?: boolean;
  requiresBooking?: boolean;
}

class AIEngine {
  private conversations: Map<string, ConversationContext> = new Map();
  
  private profileKeywords = {
    cultural: ['authentic', 'local', 'traditional', 'culture', 'music', 'dance', 'real', 'community', 'samba', 'capoeira', 'history', 'art', 'festival'],
    adventure: ['nature', 'hiking', 'beaches', 'outdoor', 'adventure', 'sports', 'active', 'explore', 'rainforest', 'wildlife', 'surfing', 'diving'],
    spiritual: ['spiritual', 'peaceful', 'meditation', 'zen', 'healing', 'wellness', 'mindful', 'soul', 'retreat', 'yoga', 'ceremony', 'sacred'],
    luxury: ['luxury', 'comfort', 'premium', 'exclusive', 'high-end', 'VIP', 'first-class', 'upscale', 'resort', 'spa', 'concierge', 'suite']
  };

  private responses = {
    welcome: "Hi! I'm your Brazil transformation consultant. What draws you to Brazil? 🇧🇷",
    profileDetected: {
      cultural: "Perfect! I can see you're a Cultural Seeker. Rio and Salvador offer incredible authentic experiences. When are you thinking of traveling?",
      adventure: "Fantastic! You have an Adventure Spirit. Brazil's nature is calling you - from Amazon rainforest to pristine beaches. What's your ideal travel timeframe?",
      spiritual: "Wonderful! I sense you're on a Spiritual Journey. Brazil has amazing retreats and sacred spaces. When would you like to embark on this transformative experience?",
      luxury: "Excellent! You appreciate the finer things - I can curate an exclusive luxury experience. What dates work best for your premium Brazilian getaway?"
    },
    budgetInquiry: "What's your approximate budget for this transformative Brazilian experience?",
    packagesAvailable: "Great! Let me check real-time availability and create personalized packages for you...",
    emailCapture: "I'd love to send you detailed itineraries and exclusive deals! What's your email address?",
    bookingConfirmation: "Perfect! I'll reserve this package for you. Let me process the booking..."
  };

  async processMessage(message: string, conversationId?: string): Promise<AIResponse> {
    try {
      // Get or create conversation context
      let context = conversationId ? this.conversations.get(conversationId) : null;
      
      if (!context) {
        context = {
          id: uuidv4(),
          messages: [],
          userInfo: {}
        };
        this.conversations.set(context.id, context);
      }

      // Add user message to context
      context.messages.push({
        role: "user",
        content: message.toLowerCase(),
        timestamp: new Date()
      });

      // Detect profile if not already detected
      if (!context.detectedProfile) {
        const profile = this.detectProfile(message);
        if (profile) {
          context.detectedProfile = profile;
          
          const response: AIResponse = {
            message: this.responses.profileDetected[profile as keyof typeof this.responses.profileDetected],
            profileDetected: this.formatProfileName(profile),
            conversationId: context.id
          };
          
          context.messages.push({
            role: "assistant",
            content: response.message,
            timestamp: new Date()
          });
          
          return response;
        }
      }

      // Extract travel information
      this.extractTravelInfo(message, context);

      // Determine conversation stage and generate appropriate response
      const response = await this.generateResponse(context);
      
      context.messages.push({
        role: "assistant",
        content: response.message,
        timestamp: new Date()
      });

      return response;

    } catch (error) {
      console.error("AI Engine error:", error);
      return {
        message: "I apologize, but I'm experiencing some technical difficulties. Let me try to help you in a moment!",
        conversationId: conversationId || uuidv4()
      };
    }
  }

  private detectProfile(message: string): string | null {
    const messageLower = message.toLowerCase();
    const scores = {
      cultural: 0,
      adventure: 0,
      spiritual: 0,
      luxury: 0
    };

    // Score each profile based on keyword matches
    Object.entries(this.profileKeywords).forEach(([profile, keywords]) => {
      keywords.forEach(keyword => {
        if (messageLower.includes(keyword)) {
          scores[profile as keyof typeof scores]++;
        }
      });
    });

    // Return profile with highest score (minimum 2 matches required)
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore >= 2) {
      return Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || null;
    }

    return null;
  }

  private extractTravelInfo(message: string, context: ConversationContext): void {
    const messageLower = message.toLowerCase();

    // Extract budget
    const budgetMatch = messageLower.match(/\$?(\d{1,3}(?:,?\d{3})*)/);
    if (budgetMatch) {
      const budget = parseInt(budgetMatch[1].replace(/,/g, ''));
      if (budget >= 500 && budget <= 50000) {
        context.userInfo!.budget = budget;
      }
    }

    // Extract dates/months
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                   'july', 'august', 'september', 'october', 'november', 'december',
                   'jan', 'feb', 'mar', 'apr', 'may', 'jun', 
                   'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    
    months.forEach(month => {
      if (messageLower.includes(month)) {
        context.userInfo!.dates = message.match(new RegExp(`\\b\\w*${month}\\w*.*?\\d*`, 'i'))?.[0] || month;
      }
    });

    // Extract destinations
    const destinations = ['rio', 'salvador', 'chapada', 'amazon', 'sao paulo', 'brasilia', 'florianopolis'];
    destinations.forEach(dest => {
      if (messageLower.includes(dest)) {
        context.userInfo!.destination = dest;
      }
    });
  }

  private async generateResponse(context: ConversationContext): Promise<AIResponse> {
    const lastMessage = context.messages[context.messages.length - 1].content;
    const userInfo = context.userInfo!;

    // Check if user is expressing booking interest
    if (this.isBookingInterest(lastMessage)) {
      return {
        message: "Excellent! I'm processing your booking now. You'll receive confirmation details shortly. Welcome to your Brazilian adventure! 🎉",
        conversationId: context.id,
        requiresBooking: true
      };
    }

    // If we have profile, budget, and some travel info, create package
    if (context.detectedProfile && userInfo.budget && (userInfo.dates || userInfo.destination)) {
      const packageData = await this.createPersonalizedPackage(context);
      
      return {
        message: "Perfect! I found excellent options for your dates. Here's a personalized package that matches your style and budget:",
        conversationId: context.id,
        packageData
      };
    }

    // Ask for missing information
    if (context.detectedProfile && !userInfo.budget) {
      return {
        message: this.responses.budgetInquiry,
        conversationId: context.id
      };
    }

    if (context.detectedProfile && userInfo.budget && !userInfo.dates) {
      return {
        message: "Great budget! When would you like to travel? I can check real-time availability for those dates.",
        conversationId: context.id
      };
    }

    // Default responses based on conversation flow
    if (context.messages.length <= 2) {
      return {
        message: "Tell me more about what kind of Brazilian experience you're looking for. Are you interested in culture, adventure, relaxation, or luxury?",
        conversationId: context.id
      };
    }

    return {
      message: "I'd love to help you plan the perfect Brazilian journey! Could you tell me more about your travel dates and budget?",
      conversationId: context.id,
      suggestEmailCapture: context.messages.length > 4
    };
  }

  private async createPersonalizedPackage(context: ConversationContext): Promise<any> {
    const userInfo = context.userInfo!;
    const profile = context.detectedProfile!;
    
    try {
      // Get destinations that match the profile
      const destinations = await storage.getActiveDestinations();
      const matchingDestination = destinations.find(dest => 
        dest.idealProfiles?.toLowerCase().includes(profile)
      ) || destinations[0]; // Fallback to first destination

      if (!matchingDestination) {
        throw new Error("No destinations available");
      }

      // Calculate base pricing based on profile and destination
      const basePricing = this.calculateBasePricing(profile, userInfo.budget!);
      
      // Try to get real-time pricing (with fallback)
      let flightPrice = basePricing.flight;
      let hotelPrice = basePricing.hotel;
      
      try {
        const flightPricing = await travelApis.getFlightPricing({
          origin: "IAD", // Washington DC area
          destination: matchingDestination.airportCodes?.split(',')[0] || "GIG",
          departureDate: this.formatTravelDate(userInfo.dates),
          passengers: 1
        });
        flightPrice = flightPricing.price;
      } catch (error) {
        console.log("Using fallback flight pricing");
      }

      try {
        const hotelPricing = await travelApis.getHotelPricing({
          location: matchingDestination.name,
          checkIn: this.formatTravelDate(userInfo.dates),
          checkOut: this.formatTravelDate(userInfo.dates, 7), // 7 days later
          guests: 1
        });
        hotelPrice = hotelPricing.price;
      } catch (error) {
        console.log("Using fallback hotel pricing");
      }

      const totalPrice = flightPrice + hotelPrice + basePricing.experiences + basePricing.transfers;
      const savings = Math.max(0, userInfo.budget! - totalPrice);

      return {
        destinationName: matchingDestination.name,
        flightPrice,
        hotelPrice,
        experiencePrice: basePricing.experiences,
        transferPrice: basePricing.transfers,
        totalPrice,
        savings,
        duration: "7 days",
        profileMatch: this.formatProfileName(profile)
      };
      
    } catch (error) {
      console.error("Package creation error:", error);
      // Return fallback package
      return this.getFallbackPackage(profile, userInfo.budget!);
    }
  }

  private calculateBasePricing(profile: string, budget: number): any {
    const baseRates = {
      cultural: { flight: 750, hotel: 140, experiences: 600, transfers: 120 },
      adventure: { flight: 680, hotel: 120, experiences: 550, transfers: 100 },
      spiritual: { flight: 720, hotel: 160, experiences: 400, transfers: 80 },
      luxury: { flight: 1200, hotel: 350, experiences: 800, transfers: 200 }
    };

    const rates = baseRates[profile as keyof typeof baseRates] || baseRates.cultural;
    
    // Adjust based on budget (scale up/down by max 30%)
    const budgetFactor = Math.min(1.3, Math.max(0.7, budget / 2500));
    
    return {
      flight: Math.round(rates.flight * budgetFactor),
      hotel: Math.round(rates.hotel * budgetFactor),
      experiences: Math.round(rates.experiences * budgetFactor),
      transfers: Math.round(rates.transfers * budgetFactor)
    };
  }

  private getFallbackPackage(profile: string, budget: number): any {
    const pricing = this.calculateBasePricing(profile, budget);
    const totalPrice = pricing.flight + pricing.hotel + pricing.experiences + pricing.transfers;
    
    return {
      destinationName: "Rio de Janeiro",
      flightPrice: pricing.flight,
      hotelPrice: pricing.hotel,
      experiencePrice: pricing.experiences,
      transferPrice: pricing.transfers,
      totalPrice,
      savings: Math.max(0, budget - totalPrice),
      duration: "7 days",
      profileMatch: this.formatProfileName(profile)
    };
  }

  private formatTravelDate(dateString?: string, addDays: number = 0): string {
    // Simple date formatting - in production, use proper date parsing
    const date = new Date();
    date.setDate(date.getDate() + 30 + addDays); // Default to 30 days from now
    return date.toISOString().split('T')[0];
  }

  private formatProfileName(profile: string): string {
    const names = {
      cultural: "Cultural Seeker",
      adventure: "Adventure Spirit", 
      spiritual: "Spiritual Journey",
      luxury: "Luxury Traveler"
    };
    return names[profile as keyof typeof names] || "Explorer";
  }

  private isBookingInterest(message: string): boolean {
    const bookingKeywords = ['yes', 'book', 'reserve', 'confirm', 'interested', 'take it', 'sounds good', 'perfect'];
    return bookingKeywords.some(keyword => message.includes(keyword));
  }

  async createLeadFromConversation(conversationId: string, email?: string): Promise<number | null> {
    const context = this.conversations.get(conversationId);
    if (!context) return null;

    try {
      // Create user if email provided
      let userId = context.userId;
      if (email && !userId) {
        const username = email.split('@')[0] + Math.random().toString(36).substr(2, 4);
        const password = Math.random().toString(36).substr(2, 12);
        
        const user = await storage.createUser({
          email,
          username,
          password,
          profileType: context.detectedProfile,
          conversationLog: JSON.stringify(context.messages)
        });
        userId = user.id;
        context.userId = userId;
      }

      // Create lead
      const lead = await storage.createLead({
        userId,
        profileScore: this.calculateProfileScore(context),
        interestLevel: this.determineInterestLevel(context),
        recommendedDestinations: context.userInfo?.destination || "Rio de Janeiro",
        estimatedBudget: context.userInfo?.budget?.toString(),
        travelDates: context.userInfo?.dates,
        bookingStatus: "inquiry",
        status: "new"
      });

      return lead.id;
    } catch (error) {
      console.error("Lead creation error:", error);
      return null;
    }
  }

  private calculateProfileScore(context: ConversationContext): number {
    // Simple scoring based on conversation quality
    const messageCount = context.messages.length;
    const hasProfile = context.detectedProfile ? 25 : 0;
    const hasBudget = context.userInfo?.budget ? 25 : 0;
    const hasDates = context.userInfo?.dates ? 25 : 0;
    const engagementScore = Math.min(25, messageCount * 5);
    
    return hasProfile + hasBudget + hasDates + engagementScore;
  }

  private determineInterestLevel(context: ConversationContext): string {
    const score = this.calculateProfileScore(context);
    if (score >= 80) return "high";
    if (score >= 50) return "medium";
    return "low";
  }
}

export const aiEngine = new AIEngine();
