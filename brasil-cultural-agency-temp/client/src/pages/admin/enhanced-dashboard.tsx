import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Flame, 
  DollarSign, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Phone, 
  Mail,
  AlertTriangle,
  Plus,
  BarChart3,
  Send,
  RefreshCw,
  Upload,
  Download,
  Calendar,
  MapPin,
  Sun,
  Cloud,
  Star
} from "lucide-react";

interface HotLead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  budget: string;
  profileType: string;
  lastActivity: string;
  timeAgo: string;
  destination: string;
  urgencyScore: number;
  messages: number;
}

interface RevenueBreakdown {
  total: number;
  growth: number;
  byDestination: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
  monthlyTarget: number;
}

interface ConversionFunnel {
  websiteVisitors: number;
  chatStarts: number;
  leadsGenerated: number;
  quotesRequested: number;
  bookingsConfirmed: number;
  overallConversion: number;
}

interface DestinationWeather {
  destination: string;
  temperature: number;
  condition: string;
  icon: string;
  events: string[];
}

export default function EnhancedDashboard() {
  const [refreshing, setRefreshing] = useState(false);

  // Queries for dashboard data
  const { data: hotLeads = [], isLoading: hotLeadsLoading } = useQuery({
    queryKey: ["/api/admin/hot-leads"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: revenue, isLoading: revenueLoading } = useQuery({
    queryKey: ["/api/admin/revenue-breakdown"],
  });

  const { data: funnel, isLoading: funnelLoading } = useQuery({
    queryKey: ["/api/admin/conversion-funnel"],
  });

  const { data: weather = [], isLoading: weatherLoading } = useQuery({
    queryKey: ["/api/admin/destination-weather"],
  });

  const { data: recentActivity = [], isLoading: activityLoading } = useQuery({
    queryKey: ["/api/admin/recent-activity"],
    refetchInterval: 60000, // Refresh every minute
  });

  const handleRefreshAll = async () => {
    setRefreshing(true);
    // Trigger refresh of all queries
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getUrgencyColor = (score: number) => {
    if (score >= 80) return "text-red-600 bg-red-50";
    if (score >= 60) return "text-orange-600 bg-orange-50";
    return "text-yellow-600 bg-yellow-50";
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-4 h-4 text-gray-500" />;
      default: return <Sun className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header with Quick Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Operations Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Real-time business intelligence for Brasil Cultural Agency
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={handleRefreshAll}
            variant="outline"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh All
          </Button>
          
          <Button variant="default">
            <Plus className="w-4 h-4 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              New Destination
            </Button>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create Package
            </Button>
            <Button size="sm" variant="outline">
              <Send className="w-4 h-4 mr-2" />
              Bulk Email
            </Button>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button size="sm" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync APIs
            </Button>
            <Button size="sm" variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send SMS
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hot Leads Alert Section */}
      <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-red-800 dark:text-red-200">
            <Flame className="w-5 h-5 mr-2" />
            HOT LEADS - Need Immediate Attention
            <Badge variant="destructive" className="ml-2">
              {hotLeads.length} urgent
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hotLeadsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-gray-200 h-20 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {hotLeads.slice(0, 3).map((lead: HotLead) => (
                <div key={lead.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {lead.name}
                        </h3>
                        <Badge className={getUrgencyColor(lead.urgencyScore)}>
                          {lead.urgencyScore}% HOT
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div>
                          <span className="font-medium">Budget:</span> {lead.budget}
                        </div>
                        <div>
                          <span className="font-medium">Interest:</span> {lead.destination}
                        </div>
                        <div>
                          <span className="font-medium">Messages:</span> {lead.messages}
                        </div>
                        <div>
                          <span className="font-medium">Last activity:</span> {lead.timeAgo}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                        "{lead.lastActivity}"
                      </p>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="default">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Reply
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="w-4 h-4 mr-1" />
                        Email
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {hotLeads.length > 3 && (
                <Button variant="outline" className="w-full">
                  View All {hotLeads.length} Hot Leads
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Revenue This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <div className="text-3xl font-bold text-green-600">
                    ${revenue?.total?.toLocaleString() || '0'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                    +{revenue?.growth || 0}% vs last month
                  </div>
                </div>
                
                <div className="space-y-3">
                  {revenue?.byDestination?.map((dest: any) => (
                    <div key={dest.name} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {dest.name}
                      </span>
                      <div className="text-right">
                        <div className="font-medium">${dest.amount.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{dest.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Detailed Report
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            {funnelLoading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-6 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Website Visitors</span>
                  <span className="font-medium">{funnel?.websiteVisitors?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">↓ Started Chat</span>
                  <span className="font-medium">{funnel?.chatStarts || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">↓ Generated Lead</span>
                  <span className="font-medium">{funnel?.leadsGenerated || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">↓ Received Quote</span>
                  <span className="font-medium">{funnel?.quotesRequested || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">↓ Confirmed Booking</span>
                  <span className="font-medium text-green-600">{funnel?.bookingsConfirmed || 0}</span>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {funnel?.overallConversion || 0}%
                    </div>
                    <div className="text-xs text-gray-500">Overall Conversion</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Weather & Events for Destinations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Destination Weather & Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weatherLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-gray-200 h-24 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {weather.map((dest: DestinationWeather) => (
                <div key={dest.destination} className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {dest.destination}
                    </h3>
                    {getWeatherIcon(dest.condition)}
                  </div>
                  
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {dest.temperature}°C
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {dest.condition}
                  </div>
                  
                  {dest.events.length > 0 && (
                    <div className="text-xs text-blue-600 dark:text-blue-300">
                      📅 {dest.events[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Live Activity Feed
            </div>
            <Badge variant="outline" className="animate-pulse">
              LIVE
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activityLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse flex space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {recentActivity.map((activity: any, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {activity.description}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {activity.timeAgo}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}