import { apiRequest } from "./queryClient";

export interface FlightPricingRequest {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
}

export interface HotelPricingRequest {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface PricingResponse {
  price: number;
  currency: string;
  provider: string;
  options: any[];
}

export const api = {
  // Flight pricing
  async getFlightPricing(request: FlightPricingRequest): Promise<PricingResponse> {
    const response = await apiRequest("POST", "/api/pricing/flight", request);
    return response.json();
  },

  // Hotel pricing
  async getHotelPricing(request: HotelPricingRequest): Promise<PricingResponse> {
    const response = await apiRequest("POST", "/api/pricing/hotel", request);
    return response.json();
  },

  // User registration
  async registerUser(userData: { email: string; username: string; password: string }) {
    const response = await apiRequest("POST", "/api/users/register", userData);
    return response.json();
  },

  // Lead creation
  async createLead(leadData: any) {
    const response = await apiRequest("POST", "/api/chat/create-lead", leadData);
    return response.json();
  },

  // Booking creation
  async createBooking(bookingData: any) {
    const response = await apiRequest("POST", "/api/bookings", bookingData);
    return response.json();
  },
};
