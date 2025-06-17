import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/landing";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import EnhancedDashboard from "@/pages/admin/enhanced-dashboard";
import AIIntelligence from "@/pages/admin/ai-intelligence";
import LeadsCRM from "@/pages/admin/leads-crm";
import DestinationsAdmin from "@/pages/admin/destinations";
import PackagesAdmin from "@/pages/admin/packages";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/enhanced-dashboard" component={EnhancedDashboard} />
      <Route path="/admin/ai-intelligence" component={AIIntelligence} />
      <Route path="/admin/leads-crm" component={LeadsCRM} />
      <Route path="/admin/destinations" component={DestinationsAdmin} />
      <Route path="/admin/packages" component={PackagesAdmin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
