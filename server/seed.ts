import { db } from "./db";
import { adminUsers, destinations, aiKnowledge, apiConfigs } from "@shared/schema";
import bcrypt from "bcrypt";

async function seedDatabase() {
  console.log("Starting database seeding...");

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.insert(adminUsers).values({
      username: "admin",
      password: hashedPassword,
    }).onConflictDoNothing();

    // Create destinations
    await db.insert(destinations).values([
      {
        name: "Rio de Janeiro",
        status: "active",
        description: "Cidade Maravilhosa com praias icônicas, Cristo Redentor e vida noturna vibrante",
        bestMonths: "Dezembro a Março",
        idealProfiles: "adventurer,cultural,relaxed",
        priceRangeMin: "800",
        priceRangeMax: "2500",
        flightSearchTerms: "Rio de Janeiro, GIG, SDU",
        hotelSearchTerms: "Copacabana, Ipanema, Centro Rio"
      },
      {
        name: "Salvador",
        status: "active", 
        description: "Capital da Bahia rica em cultura afro-brasileira, música e Pelourinho histórico",
        bestMonths: "Setembro a Março",
        idealProfiles: "cultural,adventurer",
        priceRangeMin: "600",
        priceRangeMax: "1800",
        flightSearchTerms: "Salvador, SSA",
        hotelSearchTerms: "Pelourinho, Barra, Salvador Centro"
      },
      {
        name: "Chapada Diamantina",
        status: "active",
        description: "Paraíso natural com cachoeiras, cavernas e trilhas na Bahia",
        bestMonths: "Abril a Setembro",
        idealProfiles: "adventurer,nature",
        priceRangeMin: "500",
        priceRangeMax: "1200",
        flightSearchTerms: "Lençóis, Salvador",
        hotelSearchTerms: "Lençóis, Vale do Capão, Chapada"
      }
    ]).onConflictDoNothing();

    // Create AI knowledge base
    await db.insert(aiKnowledge).values([
      {
        category: "cultural_brazil",
        topic: "Brazilian Culture Overview",
        context: "Comprehensive information about Brazilian cultural diversity, traditions, and regional differences",
        responseTemplate: "Brazil offers incredible cultural diversity with influences from Indigenous, African, and European traditions...",
        keywords: "cultura,tradições,diversidade,regional,música,dança,arte",
        dataSources: "Ministry of Tourism, IBGE Cultural Data",
        priority: 10,
        usageCount: 0,
        effectivenessScore: "high"
      },
      {
        category: "destinations_rio",
        topic: "Rio de Janeiro Attractions",
        context: "Complete guide to Rio's main attractions, beaches, and cultural sites",
        responseTemplate: "Rio de Janeiro is famous for its stunning beaches like Copacabana and Ipanema, iconic landmarks like Christ the Redeemer...",
        keywords: "rio,copacabana,ipanema,cristo,pão de açúcar,carnival",
        dataSources: "RioTur, Official Tourism Board",
        priority: 9,
        usageCount: 0,
        effectivenessScore: "high"
      }
    ]).onConflictDoNothing();

    // Create API configurations
    await db.insert(apiConfigs).values([
      {
        providerName: "Amadeus",
        apiType: "flight",
        status: "active",
        endpointUrl: "https://api.amadeus.com",
        apiKeyField: "AMADEUS_API_KEY",
        markupPercentage: "8.5",
        successRate: "95.2",
        averageResponseTime: "1200"
      },
      {
        providerName: "Booking.com",
        apiType: "hotel", 
        status: "active",
        endpointUrl: "https://distribution-xml.booking.com",
        apiKeyField: "BOOKING_API_KEY",
        markupPercentage: "12.0",
        successRate: "97.8",
        averageResponseTime: "800"
      }
    ]).onConflictDoNothing();

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { seedDatabase };