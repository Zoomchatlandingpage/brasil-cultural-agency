import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Mountain, Bath, Crown, Utensils, Users, Plane, Calendar, Star, Backpack, Waves, Binoculars, Heart, Leaf, HandHeart, Hotel, Glasses, UserRoundCheck } from "lucide-react";

export default function ProfileTypes() {
  const profiles = [
    {
      id: "cultural",
      title: "Cultural Seeker",
      description: "Authentic local experiences, traditional music, dance, and real community connections.",
      gradient: "from-sunset to-gold",
      icon: Music,
      features: [
        { icon: Music, text: "Samba & Bossa Nova experiences" },
        { icon: Utensils, text: "Traditional cooking classes" },
        { icon: Users, text: "Local community immersion" },
      ],
    },
    {
      id: "adventure",
      title: "Adventure Spirit",
      description: "Nature exploration, hiking, beaches, outdoor sports, and active discoveries.",
      gradient: "from-amazon to-green-600",
      icon: Mountain,
      features: [
        { icon: Backpack, text: "Amazon rainforest trekking" },
        { icon: Waves, text: "Surfing & beach adventures" },
        { icon: Binoculars, text: "Wildlife watching tours" },
      ],
    },
    {
      id: "spiritual",
      title: "Spiritual Journey",
      description: "Peaceful retreats, meditation, wellness, healing, and mindful soul connections.",
      gradient: "from-ocean to-blue-600",
      icon: Bath,
      features: [
        { icon: Bath, text: "Wellness & healing retreats" },
        { icon: Leaf, text: "Meditation in nature" },
        { icon: HandHeart, text: "Spiritual ceremonies" },
      ],
    },
    {
      id: "luxury",
      title: "Luxury Traveler",
      description: "Premium comfort, exclusive experiences, high-end accommodations, and VIP treatment.",
      gradient: "from-purple-600 to-pink-600",
      icon: Crown,
      features: [
        { icon: Hotel, text: "5-star resorts & hotels" },
        { icon: Glasses, text: "Exclusive dining experiences" },
        { icon: UserRoundCheck, text: "Personal concierge service" },
      ],
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-bold text-3xl lg:text-4xl text-gray-800">
            Find Your Perfect Brazilian Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI consultant identifies your travel personality and creates personalized experiences that match your interests and budget.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {profiles.map((profile) => {
            const IconComponent = profile.icon;
            
            return (
              <Card
                key={profile.id}
                className={`group bg-gradient-to-br ${profile.gradient} text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer`}
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  
                  <h3 className="font-bold text-xl mb-3">{profile.title}</h3>
                  
                  <p className="text-sm opacity-90 mb-4 leading-relaxed">
                    {profile.description}
                  </p>
                  
                  <div className="space-y-2">
                    {profile.features.map((feature, index) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <div key={index} className="flex items-center space-x-2 text-xs">
                          <FeatureIcon className="h-3 w-3 flex-shrink-0" />
                          <span className="opacity-90">{feature.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button className="bg-amazon text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl">
            Start Your Journey Now
          </button>
        </div>
        
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            ✨ Our AI detects your personality through natural conversation
          </p>
        </div>
      </div>
    </section>
  );
}
