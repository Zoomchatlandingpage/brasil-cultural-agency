import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Play, MapPin, Clock, ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Experience } from "@shared/schema";

const categories = [
  "All Experiences",
  "🌅 Day Adventures",
  "🏖️ Beach & Relax", 
  "🌙 Night Life",
  "💎 Exclusive",
  "🎭 Cultural"
];

export default function BrasilUnboxed() {
  const [selectedCategory, setSelectedCategory] = useState("All Experiences");
  const [cart, setCart] = useState<Experience[]>([]);

  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ["/api/experiences", { active: "true" }],
  });

  const filteredExperiences = experiences.filter((exp: Experience) => 
    selectedCategory === "All Experiences" || 
    exp.category === selectedCategory.replace(/^[🌅🏖️🌙💎🎭]\s/, "")
  );

  const addToCart = (experience: Experience) => {
    setCart(prev => [...prev, experience]);
  };

  const removeFromCart = (experienceId: number) => {
    setCart(prev => prev.filter(item => item.id !== experienceId));
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Day Adventures": "text-green-600",
      "Beach & Relax": "text-blue-600",
      "Night Life": "text-purple-600",
      "Exclusive": "text-yellow-600",
      "Cultural": "text-red-600",
    };
    return colors[category as keyof typeof colors] || "text-gray-600";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 p-6">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          BRASIL UNBOXED
        </h1>
      </header>

      {/* Hero Section */}
      <section className="text-center py-12 px-6 bg-gradient-radial from-yellow-900/10 to-transparent">
        <h2 className="text-5xl font-bold mb-4">Build Your Brazilian Journey</h2>
        <p className="text-lg text-gray-400 mb-8">
          Add authentic experiences to your trip • Click to add to cart
        </p>
      </section>

      {/* Category Tabs */}
      <div className="flex gap-3 px-6 mb-8 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              flex-shrink-0 px-6 py-3 rounded-full border transition-all duration-300 text-sm font-medium
              ${selectedCategory === category 
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-transparent" 
                : "bg-gray-800/50 text-white border-gray-700 hover:bg-gray-700/50 hover:border-gray-600"
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Experiences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-12">
        {filteredExperiences.map((experience: Experience) => (
          <div
            key={experience.id}
            className="bg-gray-900/30 border border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-2 hover:border-yellow-500/30 hover:shadow-2xl hover:shadow-yellow-500/10"
          >
            {/* Media */}
            <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
              <img
                src={experience.mediaUrl}
                alt={experience.title}
                className="w-full h-full object-cover"
              />
              
              {experience.isVideo && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 bg-black/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Play className="w-6 h-6 text-yellow-400 ml-1" />
                  </div>
                </div>
              )}

              {experience.localOnly && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-none">
                    <MapPin className="w-3 h-3 mr-1" />
                    Local Only
                  </Badge>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">{experience.duration}</span>
              </div>

              <h3 className="text-xl font-semibold mb-3">{experience.title}</h3>
              
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                {experience.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-yellow-400">
                  ${experience.price}
                  <span className="text-sm text-gray-400 font-normal ml-1">/person</span>
                </div>
                
                <Button
                  onClick={() => addToCart(experience)}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-6 py-2 rounded-full hover:scale-105 transition-transform duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredExperiences.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🌟</div>
          <h3 className="text-2xl font-semibold mb-2">No experiences found</h3>
          <p className="text-gray-400">
            Try selecting a different category to discover amazing experiences.
          </p>
        </div>
      )}

      {/* Floating Cart */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full p-4 shadow-2xl cursor-pointer hover:scale-110 transition-transform duration-200">
            <ShoppingCart className="w-6 h-6" />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {cart.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}