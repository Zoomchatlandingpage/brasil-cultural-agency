import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Users, Calendar, DollarSign, TrendingUp, Activity, Plane, MapPin } from "lucide-react";
import AdminSidebar from "@/components/admin-sidebar";

export default function AdminDashboard() {
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/analytics/dashboard"],
  });

  const { data: leads, isLoading: leadsLoading } = useQuery({
    queryKey: ["/api/leads"],
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/bookings"],
  });

  const { data: destinations } = useQuery({
    queryKey: ["/api/destinations"],
  });

  if (analyticsLoading || leadsLoading || bookingsLoading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const recentLeads = leads?.slice(0, 5) || [];
  const recentBookings = bookings?.slice(0, 3) || [];

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-gradient-amazon-ocean p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Brasil Cultural Agency</h1>
              <p className="text-gray-200">Admin Dashboard</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-200">Welcome back,</div>
              <div className="font-semibold">Lucas Nascimento</div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-amazon to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">Total Leads</p>
                    <p className="text-3xl font-bold">{analytics?.totalLeads || 0}</p>
                  </div>
                  <Users className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-ocean to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">Bookings</p>
                    <p className="text-3xl font-bold">{analytics?.totalBookings || 0}</p>
                  </div>
                  <Calendar className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-sunset-gold text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">Revenue</p>
                    <p className="text-3xl font-bold">${(analytics?.totalRevenue || 0).toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">Conversion</p>
                    <p className="text-3xl font-bold">{analytics?.conversionRate || 0}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent AI Conversations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Recent AI Conversations</span>
                </CardTitle>
                <CardDescription>Latest interactions with potential travelers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {lead.profileType ? `${lead.profileType} Profile Detected` : "Profile Analysis"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Interest Level: {lead.interestLevel || "Exploring"}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleTimeString() : "Recently"}
                    </div>
                  </div>
                ))}
                
                {recentLeads.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No recent conversations
                  </div>
                )}
              </CardContent>
            </Card>

            {/* API Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plane className="h-5 w-5" />
                  <span>API Performance</span>
                </CardTitle>
                <CardDescription>Real-time API monitoring and success rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Amadeus (Flights)</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={98} className="w-16" />
                      <Badge variant="outline" className="text-green-600 border-green-600">98%</Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Booking.com (Hotels)</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={96} className="w-16" />
                      <Badge variant="outline" className="text-green-600 border-green-600">96%</Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Skyscanner (Search)</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={89} className="w-16" />
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">89%</Badge>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="text-xs text-gray-500">
                  Total API calls today: 1,247 • Cost: $12.47
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Recent Bookings</span>
              </CardTitle>
              <CardDescription>Latest confirmed travel bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-amazon-ocean rounded-full flex items-center justify-center">
                          <Plane className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">Booking #{booking.id}</div>
                          <div className="text-sm text-gray-500">
                            {booking.passengersCount} passenger{booking.passengersCount !== 1 ? 's' : ''} • 
                            {booking.travelDateStart && new Date(booking.travelDateStart).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${booking.totalPrice}</div>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {booking.bookingStatus || 'confirmed'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No recent bookings
                </div>
              )}
            </CardContent>
          </Card>

          {/* Destinations Overview */}
          {destinations && destinations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active Destinations</CardTitle>
                <CardDescription>Currently available travel destinations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {destinations.map((destination) => (
                    <div key={destination.id} className="p-4 border rounded-lg">
                      <div className="font-medium">{destination.name}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {destination.idealProfiles}
                      </div>
                      <div className="text-sm font-medium text-amazon mt-2">
                        ${destination.priceRangeMin} - ${destination.priceRangeMax}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
