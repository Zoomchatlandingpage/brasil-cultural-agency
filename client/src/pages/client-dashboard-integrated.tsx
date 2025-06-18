import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Play, MapPin, Clock, ShoppingCart, Plus, Plane, Hotel, 
  Search, Calendar, Users, Star, Filter, ChevronDown,
  Globe, Compass, Camera, Music
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Experience } from "@shared/schema";

const categories = [
  { id: "all", label: "All Experiences", icon: Globe },
  { id: "day-adventures", label: "Day Adventures", icon: Compass, emoji: "🌅" },
  { id: "beach-relax", label: "Beach & Relax", icon: Camera, emoji: "🏖️" }, 
  { id: "night-life", label: "Night Life", icon: Music, emoji: "🌙" },
  { id: "exclusive", label: "Exclusive", icon: Star, emoji: "💎" },
  { id: "cultural", label: "Cultural", icon: Globe, emoji: "🎭" }
];

export default function ClientDashboardIntegrated() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<Experience[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Flight search state
  const [flightSearch, setFlightSearch] = useState({
    from: "",
    to: "",
    departure: "",
    return: "",
    passengers: "1"
  });

  // Hotel search state
  const [hotelSearch, setHotelSearch] = useState({
    destination: "",
    checkin: "",
    checkout: "",
    guests: "1"
  });

  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ["/api/experiences", { active: "true" }],
  });

  const filteredExperiences = experiences.filter((exp: Experience) => {
    const categoryMatch = selectedCategory === "all" || 
      exp.category === selectedCategory.replace(/^[🌅🏖️🌙💎🎭]\s/, "").replace(/-/g, " ");
    const searchMatch = searchQuery === "" || 
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const addToCart = (experience: Experience) => {
    setCart(prev => [...prev, experience]);
  };

  const removeFromCart = (experienceId: number) => {
    setCart(prev => prev.filter(item => item.id !== experienceId));
  };

  const handleFlightSearch = () => {
    // Integração com API de voos aqui
    console.log("Searching flights:", flightSearch);
  };

  const handleHotelSearch = () => {
    // Integração com API de hotéis aqui
    console.log("Searching hotels:", hotelSearch);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard do Cliente - Brasil Cultural Agency
          </h1>
          <p className="text-gray-600 mt-2">
            Planeje sua viagem perfeita com experiências autênticas + voos e hospedagem
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="experiences" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white">
            <TabsTrigger value="experiences" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              BRASIL UNBOXED
            </TabsTrigger>
            <TabsTrigger value="flights" className="flex items-center gap-2">
              <Plane className="w-4 h-4" />
              Buscar Voos
            </TabsTrigger>
            <TabsTrigger value="hotels" className="flex items-center gap-2">
              <Hotel className="w-4 h-4" />
              Buscar Hotéis
            </TabsTrigger>
          </TabsList>

          {/* BRASIL UNBOXED Tab */}
          <TabsContent value="experiences" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar experiências autênticas..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filtros Avançados
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Category Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      flex-shrink-0 px-6 py-3 rounded-full border transition-all duration-300 text-sm font-medium flex items-center gap-2
                      ${selectedCategory === category.id 
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent shadow-lg" 
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      }
                    `}
                  >
                    {category.emoji && <span>{category.emoji}</span>}
                    <IconComponent className="w-4 h-4" />
                    {category.label}
                  </button>
                );
              })}
            </div>

            {/* Experiences Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiences.map((experience: Experience) => (
                <Card
                  key={experience.id}
                  className="overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl"
                >
                  {/* Media */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                    <img
                      src={experience.mediaUrl}
                      alt={experience.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {experience.isVideo && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-16 h-16 bg-black/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                    )}

                    {experience.localOnly && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-none">
                          <MapPin className="w-3 h-3 mr-1" />
                          Exclusivo Local
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{experience.duration}</span>
                    </div>

                    <h3 className="text-xl font-semibold mb-3 text-gray-800">{experience.title}</h3>
                    
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                      {experience.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-blue-600">
                        R$ {experience.price}
                        <span className="text-sm text-gray-500 font-normal ml-1">/pessoa</span>
                      </div>
                      
                      <Button
                        onClick={() => addToCart(experience)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-6 py-2 rounded-full hover:scale-105 transition-transform duration-200"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredExperiences.length === 0 && (
              <Card>
                <CardContent className="text-center py-16">
                  <div className="text-6xl mb-4">🌟</div>
                  <h3 className="text-2xl font-semibold mb-2">Nenhuma experiência encontrada</h3>
                  <p className="text-gray-600">
                    Tente selecionar uma categoria diferente ou ajustar sua busca.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Flight Search Tab */}
          <TabsContent value="flights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="w-5 h-5" />
                  Buscar Voos para o Brasil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">De onde você vem?</label>
                    <Input
                      placeholder="Cidade ou aeroporto de origem"
                      value={flightSearch.from}
                      onChange={(e) => setFlightSearch({...flightSearch, from: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Para onde no Brasil?</label>
                    <Input
                      placeholder="Destino no Brasil"
                      value={flightSearch.to}
                      onChange={(e) => setFlightSearch({...flightSearch, to: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Data de ida</label>
                    <Input
                      type="date"
                      value={flightSearch.departure}
                      onChange={(e) => setFlightSearch({...flightSearch, departure: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Data de volta</label>
                    <Input
                      type="date"
                      value={flightSearch.return}
                      onChange={(e) => setFlightSearch({...flightSearch, return: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Passageiros</label>
                    <Input
                      type="number"
                      min="1"
                      value={flightSearch.passengers}
                      onChange={(e) => setFlightSearch({...flightSearch, passengers: e.target.value})}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleFlightSearch}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Buscar Voos
                </Button>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Em breve:</strong> Integração com principais companhias aéreas para busca de voos em tempo real.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hotel Search Tab */}
          <TabsContent value="hotels" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="w-5 h-5" />
                  Buscar Hospedagem no Brasil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Destino</label>
                  <Input
                    placeholder="Cidade ou região no Brasil"
                    value={hotelSearch.destination}
                    onChange={(e) => setHotelSearch({...hotelSearch, destination: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-in</label>
                    <Input
                      type="date"
                      value={hotelSearch.checkin}
                      onChange={(e) => setHotelSearch({...hotelSearch, checkin: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-out</label>
                    <Input
                      type="date"
                      value={hotelSearch.checkout}
                      onChange={(e) => setHotelSearch({...hotelSearch, checkout: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hóspedes</label>
                    <Input
                      type="number"
                      min="1"
                      value={hotelSearch.guests}
                      onChange={(e) => setHotelSearch({...hotelSearch, guests: e.target.value})}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleHotelSearch}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Buscar Hotéis
                </Button>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Em breve:</strong> Integração com Booking.com, Hoteis.com e outras plataformas para busca de hospedagem.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Cart */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-4 shadow-2xl cursor-pointer hover:scale-110 transition-transform duration-200">
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