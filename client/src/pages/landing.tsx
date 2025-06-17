import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Globe, Clock, Heart, Shield, Award, MapPin, Calendar, Star, Plane, Music, Mountain, Bath, Crown } from "lucide-react";
import AiChatInterface from "@/components/ai-chat-interface";
import ProfileTypes from "@/components/profile-types";
import Destinations from "@/components/destinations";
import { Link } from "wouter";

export default function Landing() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-warm-white text-gray-800">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-amazon-ocean rounded-full flex items-center justify-center">
                <Globe className="text-white text-lg" />
              </div>
              <span className="font-bold text-xl text-gray-800">Brasil Cultural Agency</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#destinations" className="text-gray-600 hover:text-amazon transition-colors">Destinations</a>
              <a href="#experiences" className="text-gray-600 hover:text-amazon transition-colors">Experiences</a>
              <a href="#about" className="text-gray-600 hover:text-amazon transition-colors">About</a>
              <Link href="/admin/login">
                <Button className="bg-amazon text-white hover:bg-green-700">
                  Admin Login
                </Button>
              </Link>
            </div>
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <span className="sr-only">Open menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </nav>
      {/* Hero Section with AI Chat Interface */}
      <section className="relative bg-gradient-brazilian min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div 
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Intro Content */}
            <div className="text-white space-y-6">
              <h1 className="font-bold text-4xl lg:text-6xl leading-tight hero-text">
                Discover Your
                <span className="text-gold"> Authentic Brazil</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-100 leading-relaxed bg-[#00000075]">
                AI-powered travel consultant creating personalized cultural journeys that transform how Americans experience Brazil.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <Badge variant="secondary" className="bg-white bg-opacity-20 text-white px-4 py-2">
                  <span className="mr-2">🤖</span>
                  AI-Powered Consultant
                </Badge>
                <Badge variant="secondary" className="bg-white bg-opacity-20 text-white px-4 py-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Real-Time Booking
                </Badge>
                <Badge variant="secondary" className="bg-white bg-opacity-20 text-white px-4 py-2">
                  <Heart className="w-4 h-4 mr-2" />
                  Authentic Experiences
                </Badge>
              </div>
            </div>

            {/* Right Column - AI Chat Interface */}
            <div className="chat-interface">
              <AiChatInterface />
            </div>
          </div>
        </div>
      </section>
      {/* Profile Types Section */}
      <ProfileTypes />
      {/* How It Works Section */}
      <section className="py-16 bg-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-bold text-3xl lg:text-4xl text-gray-800">
              How Our AI Travel Consultant Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of travel planning with our intelligent system that creates personalized Brazilian adventures.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-amazon-ocean rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="font-bold text-xl">AI Conversation</h3>
              <p className="text-gray-600">Chat with our AI consultant to discover your travel personality and preferences through natural conversation.</p>
              <Card>
                <CardContent className="p-4">
                  <div className="text-xs text-amazon font-semibold mb-2">Keywords Detected:</div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-amazon border-amazon">authentic</Badge>
                    <Badge variant="outline" className="text-amazon border-amazon">culture</Badge>
                    <Badge variant="outline" className="text-amazon border-amazon">local</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-sunset-gold rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="font-bold text-xl">Real-Time Pricing</h3>
              <p className="text-gray-600">Our system instantly checks live flight prices, hotel availability, and experience costs across multiple providers.</p>
              <Card>
                <CardContent className="p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center space-x-2">
                      <Plane className="w-4 h-4 text-ocean" />
                      <span>Amadeus API</span>
                    </span>
                    <span className="text-green-600 font-semibold">✓ Connected</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center space-x-2">
                      <span className="w-4 h-4 bg-ocean rounded"></span>
                      <span>Booking.com API</span>
                    </span>
                    <span className="text-green-600 font-semibold">✓ Connected</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-ocean to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="font-bold text-xl">Instant Booking</h3>
              <p className="text-gray-600">Approve your personalized package and we'll handle all bookings with instant confirmations and email receipts.</p>
              <Card>
                <CardContent className="p-4 space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-green-600">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    <span>Flight Reserved</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    <span>Hotel Confirmed</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    <span>Experiences Booked</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Destinations */}
      <Destinations />
      {/* CTA Section */}
      <section className="py-16 bg-gradient-brazilian">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 text-white">
            <h2 className="font-bold text-3xl lg:text-5xl">
              Ready to Transform Your Brazilian Journey?
            </h2>
            <p className="text-xl text-gray-100 leading-relaxed">
              Let our AI travel consultant create your perfect authentic Brazilian experience with real-time pricing and instant booking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-amazon hover:bg-gray-100 font-bold text-lg px-8 py-4">
                <span className="mr-2">💬</span>
                Start AI Conversation
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white hover:bg-white hover:text-amazon font-bold text-lg px-8 py-4 text-[#04095e]">
                Learn More
              </Button>
            </div>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gold" />
                <span>Secure Booking</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gold" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-gold" />
                <span>Best Price Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-amazon-ocean rounded-full flex items-center justify-center">
                  <Globe className="text-white" />
                </div>
                <span className="font-bold text-xl">Brasil Cultural Agency</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered travel platform creating authentic Brazilian cultural experiences for American travelers.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Destinations</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Rio de Janeiro</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Salvador</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chapada Diamantina</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Amazon Rainforest</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Travel Styles</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Cultural Seeker</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Adventure Spirit</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Spiritual Journey</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Luxury Traveler</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li>
                  <Link href="/admin/login">
                    <a className="hover:text-white transition-colors">Admin Login</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-gray-800" />

          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2024 Brasil Cultural Agency. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
