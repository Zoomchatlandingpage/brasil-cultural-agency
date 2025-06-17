import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Calendar, Star, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Destinations() {
  const { data: destinations, isLoading } = useQuery({
    queryKey: ["/api/destinations"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white" id="destinations">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <Skeleton className="h-10 w-96 mx-auto" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white" id="destinations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-bold text-3xl lg:text-4xl text-gray-800">
            Discover Brazil's Hidden Gems
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From vibrant cities to pristine nature, explore destinations curated for authentic Brazilian experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations?.map((destination) => {
            const profiles = destination.idealProfiles?.split(',') || [];
            const profileColors = {
              'Cultural': 'bg-sunset bg-opacity-10 text-orange-700 border-orange-200',
              'Adventure': 'bg-amazon bg-opacity-10 text-green-700 border-green-200',
              'Spiritual': 'bg-ocean bg-opacity-10 text-blue-700 border-blue-200',
              'Luxury': 'bg-purple-600 bg-opacity-10 text-purple-700 border-purple-200',
            };

            return (
              <Card
                key={destination.id}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              >
                <div
                  className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{
                    backgroundImage: `url('${destination.mainImageUrl}')`,
                  }}
                ></div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl">{destination.name}</h3>
                    <div className="text-right">
                      <div className="text-amazon font-bold">
                        From ${destination.priceRangeMin}
                      </div>
                      <div className="text-xs text-gray-500">
                        Up to ${destination.priceRangeMax}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {destination.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profiles.map((profile) => (
                      <Badge
                        key={profile}
                        variant="outline"
                        className={profileColors[profile.trim() as keyof typeof profileColors] || 'bg-gray-100 text-gray-700'}
                      >
                        {profile.trim()}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Plane className="w-4 h-4 text-ocean" />
                      <span>Direct flights available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-ocean" />
                      <span>Best: {destination.bestMonths}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-gold" />
                      <span className="truncate">{destination.sellingPoints}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {!destinations || destinations.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No destinations available at the moment.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
