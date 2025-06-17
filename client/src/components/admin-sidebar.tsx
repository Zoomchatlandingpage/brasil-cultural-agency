import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  Brain,
  Users,
  MapPin, 
  Package, 
  Calendar, 
  TrendingUp,
  Image,
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Globe,
  Flame
} from "lucide-react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const navigationItems = [
  { icon: Flame, label: "Enhanced Dashboard", href: "/admin/enhanced-dashboard", active: true },
  { icon: BarChart3, label: "Classic Dashboard", href: "/admin/dashboard", active: false },
  { icon: Brain, label: "AI Intelligence", href: "/admin/ai-intelligence", active: false },
  { icon: Users, label: "Leads & CRM", href: "/admin/leads-crm", active: false },
  { icon: MapPin, label: "Destinations", href: "/admin/destinations", active: false },
  { icon: Package, label: "Packages", href: "/admin/packages", active: false },
  { icon: Calendar, label: "Bookings", href: "/admin/bookings", active: false },
  { icon: TrendingUp, label: "Analytics", href: "/admin/analytics", active: false },
  { icon: Image, label: "Content & Media", href: "/admin/content", active: false },
  { icon: Settings, label: "API Management", href: "/admin/apis", active: false },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      });
      setLocation("/admin/login");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-amazon-ocean rounded-full flex items-center justify-center">
                <Globe className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-800 text-sm">Admin Panel</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="p-2"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        {!collapsed && (
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Navigation
          </div>
        )}
        
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Button
                key={item.href}
                variant={item.active ? "secondary" : "ghost"}
                className={`w-full justify-start ${collapsed ? 'px-2' : 'px-3'} ${
                  item.active ? 'bg-amazon bg-opacity-10 text-amazon hover:bg-amazon hover:bg-opacity-20' : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setLocation(item.href)}
              >
                <IconComponent className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!collapsed && (
          <>
            <div className="text-xs text-gray-500 mb-3">
              <div className="font-semibold">Lucas Nascimento</div>
              <div>System Administrator</div>
            </div>
            <Separator className="mb-3" />
          </>
        )}
        
        <Button
          variant="ghost"
          className={`w-full justify-start text-gray-600 hover:bg-red-50 hover:text-red-600 ${collapsed ? 'px-2' : 'px-3'}`}
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
          {!collapsed && <span>{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>}
        </Button>
      </div>
    </div>
  );
}
