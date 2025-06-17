import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Phone, 
  Mail, 
  DollarSign,
  Clock,
  Target,
  Flame,
  Plus,
  Edit,
  Archive,
  Star,
  Calendar,
  Eye,
  Filter,
  Search,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: number;
  userId?: number;
  user?: {
    email: string;
    username: string;
  };
  profileType?: string;
  estimatedBudget?: string;
  travelDates?: string;
  status?: string;
  interestLevel?: string;
  recommendedDestinations?: string;
  createdAt: string;
  scoring?: {
    totalScore: number;
    scoreCategory: string;
    budgetScore: number;
    timelineScore: number;
    engagementScore: number;
    profileMatchScore: number;
  };
  recentActivities?: Activity[];
  notes?: Note[];
  lastActivity?: Activity;
}

interface Activity {
  id: number;
  activityType: string;
  description: string;
  performedBy: string;
  createdAt: string;
  timeAgo?: string;
}

interface Note {
  id: number;
  noteText: string;
  isPrivate: boolean;
  isPinned: boolean;
  createdBy: string;
  createdAt: string;
}

interface Pipeline {
  new: Lead[];
  qualified: Lead[];
  engaged: Lead[];
  proposal: Lead[];
  closed_won: Lead[];
  closed_lost: Lead[];
}

export default function LeadsCRM() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"pipeline" | "list">("pipeline");
  const [showLeadDialog, setShowLeadDialog] = useState(false);
  
  const [newActivity, setNewActivity] = useState({
    activityType: "note",
    description: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: hotLeads = [], isLoading: hotLeadsLoading } = useQuery({
    queryKey: ["/api/admin/hot-leads"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: pipeline, isLoading: pipelineLoading } = useQuery({
    queryKey: ["/api/admin/leads-pipeline"],
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: allLeads = [], isLoading: allLeadsLoading } = useQuery({
    queryKey: ["/api/admin/leads"],
  });

  const { data: leadStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/lead-stats"],
  });

  // Mutations
  const addNoteMutation = useMutation({
    mutationFn: async ({ leadId, note }: { leadId: number; note: string }) => {
      const response = await apiRequest("POST", `/api/admin/leads/${leadId}/notes`, {
        noteText: note,
        isPrivate: false,
        isPinned: false,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hot-leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads-pipeline"] });
      setNewNote("");
      toast({
        title: "Note Added",
        description: "Lead note saved successfully!",
      });
    },
  });

  const updateLeadStatusMutation = useMutation({
    mutationFn: async ({ leadId, status }: { leadId: number; status: string }) => {
      const response = await apiRequest("PUT", `/api/admin/leads/${leadId}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads-pipeline"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hot-leads"] });
      toast({
        title: "Lead Updated",
        description: "Lead status updated successfully!",
      });
    },
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-red-600 bg-red-50 border-red-200";
    if (score >= 60) return "text-orange-600 bg-orange-50 border-orange-200";
    if (score >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  const getScoreLabel = (category: string) => {
    switch (category) {
      case "hot": return { label: "HOT", color: "bg-red-500" };
      case "warm": return { label: "WARM", color: "bg-orange-500" };
      case "qualified": return { label: "QUALIFIED", color: "bg-blue-500" };
      case "cold": return { label: "COLD", color: "bg-gray-500" };
      default: return { label: "UNQUALIFIED", color: "bg-gray-400" };
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredLeads = allLeads.filter((lead: Lead) => {
    const matchesSearch = !searchQuery || 
      lead.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.recommendedDestinations?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || lead.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Users className="w-8 h-8 mr-3 text-blue-600" />
            Leads & CRM
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Transform every visitor into a loyal customer
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant={viewMode === "pipeline" ? "default" : "outline"}
            onClick={() => setViewMode("pipeline")}
          >
            Pipeline View
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
          >
            List View
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* HOT LEADS ALERT SECTION */}
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
                <div key={i} className="animate-pulse bg-gray-200 h-24 rounded"></div>
              ))}
            </div>
          ) : hotLeads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p>No hot leads requiring immediate attention!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {hotLeads.slice(0, 3).map((lead: Lead) => (
                <div key={lead.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {lead.user?.username || lead.user?.email || `Lead #${lead.id}`}
                        </h3>
                        {lead.scoring && (
                          <Badge className={`${getScoreColor(lead.scoring.totalScore)}`}>
                            {lead.scoring.totalScore}% {getScoreLabel(lead.scoring.scoreCategory).label}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <div>
                          <span className="font-medium">Budget:</span> {lead.estimatedBudget || "Not specified"}
                        </div>
                        <div>
                          <span className="font-medium">Interest:</span> {lead.recommendedDestinations || "Multiple"}
                        </div>
                        <div>
                          <span className="font-medium">Profile:</span> {lead.profileType || "Unknown"}
                        </div>
                        <div>
                          <span className="font-medium">Last activity:</span> {formatTimeAgo(lead.createdAt)}
                        </div>
                      </div>
                      
                      {lead.lastActivity && (
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Latest:</span> "{lead.lastActivity.description}"
                        </p>
                      )}
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {allLeads.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Hot Leads</p>
                <p className="text-2xl font-bold text-red-600">{hotLeads.length}</p>
              </div>
              <Flame className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Conversion Rate</p>
                <p className="text-2xl font-bold text-green-600">23.8%</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Avg Deal Size</p>
                <p className="text-2xl font-bold text-purple-600">$2,367</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      {viewMode === "pipeline" ? (
        /* Pipeline View */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Sales Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pipelineLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="animate-pulse bg-gray-200 h-64 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* New Leads */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">🌱 New</h3>
                    <Badge variant="outline">{pipeline?.new?.length || 0}</Badge>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {pipeline?.new?.map((lead: Lead) => (
                      <div key={lead.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {lead.user?.username || `Lead #${lead.id}`}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">
                          {lead.estimatedBudget && `$${lead.estimatedBudget}`}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(lead.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Qualified Leads */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">🔍 Qualified</h3>
                    <Badge variant="outline">{pipeline?.qualified?.length || 0}</Badge>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {pipeline?.qualified?.map((lead: Lead) => (
                      <div key={lead.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border">
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {lead.user?.username || `Lead #${lead.id}`}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">
                          {lead.estimatedBudget && `$${lead.estimatedBudget}`}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(lead.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Engaged Leads */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">💬 Engaged</h3>
                    <Badge variant="outline">{pipeline?.engaged?.length || 0}</Badge>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {pipeline?.engaged?.map((lead: Lead) => (
                      <div key={lead.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded border">
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {lead.user?.username || `Lead #${lead.id}`}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">
                          {lead.estimatedBudget && `$${lead.estimatedBudget}`}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(lead.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proposal Sent */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">💰 Proposal</h3>
                    <Badge variant="outline">{pipeline?.proposal?.length || 0}</Badge>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {pipeline?.proposal?.map((lead: Lead) => (
                      <div key={lead.id} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border">
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {lead.user?.username || `Lead #${lead.id}`}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">
                          {lead.estimatedBudget && `$${lead.estimatedBudget}`}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(lead.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Closed Won */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">🎉 Won</h3>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      {pipeline?.closed_won?.length || 0}
                    </Badge>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {pipeline?.closed_won?.map((lead: Lead) => (
                      <div key={lead.id} className="p-3 bg-green-100 dark:bg-green-900/30 rounded border border-green-200">
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {lead.user?.username || `Lead #${lead.id}`}
                        </div>
                        <div className="text-xs text-green-700 dark:text-green-300">
                          {lead.estimatedBudget && `$${lead.estimatedBudget}`}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(lead.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* List View */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                All Leads
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search leads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="engaged">Engaged</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allLeadsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="animate-pulse bg-gray-200 h-20 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLeads.map((lead: Lead) => (
                  <div key={lead.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {lead.user?.username || lead.user?.email || `Lead #${lead.id}`}
                          </h3>
                          {lead.scoring && (
                            <Badge className={getScoreColor(lead.scoring.totalScore)}>
                              {getScoreLabel(lead.scoring.scoreCategory).label}
                            </Badge>
                          )}
                          <Badge variant="outline">
                            {lead.status || "new"}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <div>
                            <span className="font-medium">Email:</span> {lead.user?.email || "Not provided"}
                          </div>
                          <div>
                            <span className="font-medium">Budget:</span> {lead.estimatedBudget || "Not specified"}
                          </div>
                          <div>
                            <span className="font-medium">Interest:</span> {lead.recommendedDestinations || "Multiple"}
                          </div>
                          <div>
                            <span className="font-medium">Created:</span> {formatTimeAgo(lead.createdAt)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => setSelectedLead(lead)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lead Detail Dialog */}
      {selectedLead && (
        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Lead Details: {selectedLead.user?.username || `Lead #${selectedLead.id}`}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Lead Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedLead.user?.email || "Not provided"}
                  </div>
                </div>
                <div>
                  <Label>Budget</Label>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedLead.estimatedBudget || "Not specified"}
                  </div>
                </div>
                <div>
                  <Label>Travel Dates</Label>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedLead.travelDates || "Flexible"}
                  </div>
                </div>
                <div>
                  <Label>Profile Type</Label>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedLead.profileType || "Unknown"}
                  </div>
                </div>
              </div>

              {/* Lead Scoring */}
              {selectedLead.scoring && (
                <div>
                  <Label className="text-base font-medium">Lead Scoring</Label>
                  <div className="grid grid-cols-4 gap-4 mt-2">
                    <div className="text-center">
                      <div className="text-lg font-bold">{selectedLead.scoring.budgetScore}</div>
                      <div className="text-xs text-gray-500">Budget</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{selectedLead.scoring.timelineScore}</div>
                      <div className="text-xs text-gray-500">Timeline</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{selectedLead.scoring.engagementScore}</div>
                      <div className="text-xs text-gray-500">Engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{selectedLead.scoring.totalScore}</div>
                      <div className="text-xs text-gray-500">Total Score</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Note */}
              <div>
                <Label htmlFor="newNote">Add Note</Label>
                <div className="flex space-x-2 mt-1">
                  <Textarea
                    id="newNote"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note about this lead..."
                    rows={2}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => addNoteMutation.mutate({ leadId: selectedLead.id, note: newNote })}
                    disabled={!newNote.trim() || addNoteMutation.isPending}
                  >
                    Add Note
                  </Button>
                </div>
              </div>

              {/* Notes History */}
              {selectedLead.notes && selectedLead.notes.length > 0 && (
                <div>
                  <Label className="text-base font-medium">Notes History</Label>
                  <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
                    {selectedLead.notes.map((note: Note) => (
                      <div key={note.id} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                        <div className="font-medium">{note.createdBy}</div>
                        <div className="text-gray-700 dark:text-gray-300">{note.noteText}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(note.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}