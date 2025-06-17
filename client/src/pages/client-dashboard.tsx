import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  User, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Plane, 
  Hotel, 
  Coffee, 
  MessageCircle,
  Settings,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Plus,
  CreditCard,
  Shield,
  Users
} from 'lucide-react';

interface ClientPackage {
  id: number;
  name: string;
  destination: string;
  duration: string;
  totalPrice: number;
  flightPrice: number;
  hotelPrice: number;
  experiencesPrice: number;
  customServicesPrice: number;
  commission: number;
  status: 'draft' | 'confirmed' | 'paid' | 'completed';
  startDate: string;
  endDate: string;
  packageData?: string;
}

interface BookingItem {
  id: number;
  type: 'flight' | 'hotel' | 'experience' | 'service';
  name: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  price: number;
  reference?: string;
  metadata?: string;
}

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch client dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/client/dashboard'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch available services
  const { data: availableServices } = useQuery({
    queryKey: ['/api/client/services/available'],
  });

  const user = dashboardData?.user;
  const activePackage = dashboardData?.activePackage;
  const bookings = dashboardData?.bookings || [];
  const stats = dashboardData?.stats || {};

  // Package customization mutation
  const customizePackageMutation = useMutation({
    mutationFn: async (data: { packageId: number; customizations: any }) => {
      return await apiRequest(`/api/client/package/${data.packageId}`, {
        method: 'PUT',
        body: data.customizations,
      });
    },
    onSuccess: () => {
      toast({
        title: "Package Updated",
        description: "Your travel package has been successfully customized.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/client/dashboard'] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update package.",
        variant: "destructive",
      });
    },
  });

  // Booking mutation
  const bookPackageMutation = useMutation({
    mutationFn: async (data: { packageId: number; bookingData: any }) => {
      return await apiRequest(`/api/client/package/${data.packageId}/book`, {
        method: 'POST',
        body: data.bookingData,
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Booking Confirmed!",
        description: `Your booking reference is ${data.bookingReference}. Check your email for details.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/client/dashboard'] });
      setActiveTab('bookings');
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'paid': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-amazon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your travel dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-amazon-ocean rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">Brasil Cultural Agency</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Support
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.firstName || user?.username}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            👋 Welcome back, {user?.firstName || user?.username?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Your Brazilian Journey awaits</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="package">My Trip</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* My Trip Card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>My Trip</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activePackage ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{activePackage.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {activePackage.duration} • ${activePackage.totalPrice.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activePackage.startDate} to {activePackage.endDate}
                          </p>
                        </div>
                        <Badge className={getStatusColor(activePackage.status)}>
                          {activePackage.status}
                        </Badge>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => setActiveTab('package')}
                      >
                        Customize Trip
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">No active trip</p>
                      <Button onClick={() => window.location.href = '/'}>
                        Start Planning
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Assistant Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>AI Assistant</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        "Ready to add more magic to your {activePackage?.destination || 'Brazil'} trip?"
                      </p>
                    </div>
                    <Button variant="outline" className="w-full">
                      Chat Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Your Guide Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5" />
                    <span>Your Guide</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-amazon-ocean rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">L</span>
                      </div>
                      <div>
                        <p className="font-semibold">Lucas</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Guide • Translator</p>
                        <p className="text-xs text-green-600 dark:text-green-400">Available 24/7</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Message Lucas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                      <p className="text-2xl font-bold">${stats.totalSpent?.toLocaleString() || '0'}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-amazon" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Completed Trips</p>
                      <p className="text-2xl font-bold">{stats.completedTrips || 0}</p>
                    </div>
                    <MapPin className="w-8 h-8 text-amazon" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
                      <p className="text-2xl font-bold">{stats.totalBookings || 0}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-amazon" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Recent Bookings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                        </div>
                        <div>
                          <p className="font-medium">{booking.packageName || 'Travel Package'}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${Number(booking.totalPrice).toLocaleString()}</p>
                        <Badge variant="outline" className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {bookings.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No bookings yet. Start planning your first trip!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Package Customization Tab */}
          <TabsContent value="package" className="space-y-6">
            {activePackage ? (
              <PackageCustomizer 
                package={activePackage} 
                availableServices={availableServices}
                onCustomize={customizePackageMutation.mutate}
                onBook={bookPackageMutation.mutate}
                isCustomizing={customizePackageMutation.isPending}
                isBooking={bookPackageMutation.isPending}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Package</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Start a conversation with our AI to create your personalized travel package.
                  </p>
                  <Button onClick={() => window.location.href = '/'}>
                    Talk to AI Assistant
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <BookingsList bookings={bookings} />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <ProfileSettings user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Package Customizer Component
function PackageCustomizer({ 
  package: pkg, 
  availableServices, 
  onCustomize, 
  onBook, 
  isCustomizing, 
  isBooking 
}: any) {
  const [customizations, setCustomizations] = useState({
    customServices: [],
    experiences: [],
  });
  
  const [showBookingForm, setShowBookingForm] = useState(false);

  const handleCustomize = () => {
    onCustomize({
      packageId: pkg.id,
      customizations
    });
  };

  const handleBook = () => {
    setShowBookingForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{pkg.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">{pkg.destination} • {pkg.duration}</p>
        </div>
        <Badge className={getStatusColor(pkg.status)}>{pkg.status}</Badge>
      </div>

      {/* Flight Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Plane className="w-5 h-5" />
              <span>Flight</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold">${Number(pkg.flightPrice).toLocaleString()}</span>
              <Button variant="outline" size="sm">Change</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="font-medium">Washington DC → {pkg.destination}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">TAM Airlines • Direct • 8h 30m</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Departure: {pkg.startDate} • Return: {pkg.endDate}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Hotel Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Hotel className="w-5 h-5" />
              <span>Accommodation</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold">${Number(pkg.hotelPrice).toLocaleString()}</span>
              <Button variant="outline" size="sm">Change</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="font-medium">Boutique Hotel {pkg.destination.split(' ')[0]}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">4⭐ • Ocean view • Breakfast included</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{pkg.duration}</p>
          </div>
        </CardContent>
      </Card>

      {/* Experiences Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Coffee className="w-5 h-5" />
              <span>Cultural Experiences</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold">${Number(pkg.experiencesPrice).toLocaleString()}</span>
              <Button variant="outline" size="sm">Customize</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <span>✓ Samba class with live music</span>
              <span className="font-medium">$120</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <span>✓ Cultural neighborhood tour</span>
              <span className="font-medium">$180</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <span>✓ Traditional cooking experience</span>
              <span className="font-medium">$150</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <span>✓ Historical site with guide</span>
              <span className="font-medium">$150</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Services Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Your Personal Services</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold">${Number(pkg.customServicesPrice).toLocaleString()}</span>
              <Button variant="outline" size="sm">Customize</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <span>✓ Personal guide (Lucas) - {pkg.duration}</span>
              <span className="font-medium">$200</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <span>✓ Portuguese translator services</span>
              <span className="font-medium">$100</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <span>✓ WhatsApp support 24/7</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <span>✓ Airport pickup & transfers</span>
              <span className="font-medium">Included</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center text-lg font-bold mb-4">
            <span>Total Package Price:</span>
            <span className="text-2xl text-amazon">${Number(pkg.totalPrice).toLocaleString()}</span>
          </div>
          <div className="text-sm text-green-600 dark:text-green-400 mb-4">
            You save ${Math.round(Number(pkg.totalPrice) * 0.15).toLocaleString()}!
          </div>
          
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={handleCustomize}
              disabled={isCustomizing}
            >
              {isCustomizing ? 'Updating...' : 'Update Package'}
            </Button>
            <Button 
              className="flex-1 bg-amazon hover:bg-green-700"
              onClick={handleBook}
              disabled={isBooking || pkg.status === 'paid'}
            >
              {pkg.status === 'paid' ? 'Already Booked' : 'Book This Trip'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm 
          package={pkg}
          onBook={onBook}
          onCancel={() => setShowBookingForm(false)}
          isBooking={isBooking}
        />
      )}
    </div>
  );
}

// Bookings List Component
function BookingsList({ bookings }: { bookings: any[] }) {
  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Bookings Yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your confirmed bookings will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking: any) => (
        <Card key={booking.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{booking.packageName || 'Travel Booking'}</span>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Booking Reference</p>
                <p className="font-medium">{booking.bookingReference}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                <p className="font-medium">${Number(booking.totalPrice).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Booking Date</p>
                <p className="font-medium">{new Date(booking.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <p className="font-medium capitalize">{booking.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Profile Settings Component
function ProfileSettings({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(user || {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Profile Settings</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={profile.firstName || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={profile.lastName || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={profile.phone || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
        </div>
        
        {isEditing && (
          <div className="flex gap-4">
            <Button onClick={() => setIsEditing(false)}>
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Booking Form Component
function BookingForm({ package: pkg, onBook, onCancel, isBooking }: any) {
  const [travelerData, setTravelerData] = useState({
    name: '',
    email: '',
    phone: '',
    passport: ''
  });
  
  const [paymentData, setPaymentData] = useState({
    type: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBook({
      packageId: pkg.id,
      bookingData: {
        travelers: [travelerData],
        paymentMethod: {
          type: paymentData.type,
          details: paymentData
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Complete Your Booking</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            {pkg.name} • ${Number(pkg.totalPrice).toLocaleString()}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Traveler Details */}
            <div className="space-y-4">
              <h3 className="font-semibold">Traveler Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="travelerName">Full Name</Label>
                  <Input
                    id="travelerName"
                    value={travelerData.name}
                    onChange={(e) => setTravelerData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="travelerEmail">Email</Label>
                  <Input
                    id="travelerEmail"
                    type="email"
                    value={travelerData.email}
                    onChange={(e) => setTravelerData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="travelerPhone">Phone</Label>
                  <Input
                    id="travelerPhone"
                    value={travelerData.phone}
                    onChange={(e) => setTravelerData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="passport">Passport Number</Label>
                  <Input
                    id="passport"
                    value={travelerData.passport}
                    onChange={(e) => setTravelerData(prev => ({ ...prev, passport: e.target.value }))}
                    placeholder="Required for international travel"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Details */}
            <div className="space-y-4">
              <h3 className="font-semibold">Payment Method</h3>
              <div className="space-y-4">
                <Select value={paymentData.type} onValueChange={(value) => setPaymentData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
                
                {paymentData.type === 'credit_card' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input
                        id="nameOnCard"
                        value={paymentData.nameOnCard}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, nameOnCard: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Booking Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Package Total:</span>
                  <span>${Number(pkg.totalPrice).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Booking Fee:</span>
                  <span>$50</span>
                </div>
                <div className="flex justify-between">
                  <span>Travel Insurance:</span>
                  <span>$80</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${(Number(pkg.totalPrice) + 50 + 80).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isBooking}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-amazon hover:bg-green-700"
                disabled={isBooking}
              >
                {isBooking ? 'Processing...' : `Confirm & Pay $${(Number(pkg.totalPrice) + 130).toLocaleString()}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'paid': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
}