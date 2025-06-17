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
  Brain, 
  MessageSquare, 
  Target, 
  Shield, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Users,
  AlertTriangle,
  TrendingUp,
  Eye,
  Settings
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AIKnowledge {
  id: number;
  category: string;
  subcategory?: string;
  title: string;
  content: string;
  keywords?: string;
  usageCount: number;
  effectiveness: string;
  isActive: boolean;
  priority: number;
  createdAt: string;
}

interface ProfileRule {
  id: number;
  profileName: string;
  keywords: string[];
  phrases: string[];
  behaviors: string[];
  recommendations: {
    destinations: Array<{ name: string; confidence: number }>;
    tone: string;
    avoid: string[];
  };
}

interface ObjectionResponse {
  id: number;
  objection: string;
  triggers: string[];
  responseTemplate: string;
  followUpActions: string[];
  effectiveness: number;
}

export default function AIIntelligence() {
  const [selectedCategory, setSelectedCategory] = useState("destinations");
  const [editingKnowledge, setEditingKnowledge] = useState<AIKnowledge | null>(null);
  const [editingProfile, setEditingProfile] = useState<ProfileRule | null>(null);
  const [editingObjection, setEditingObjection] = useState<ObjectionResponse | null>(null);
  const [showKnowledgeDialog, setShowKnowledgeDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showObjectionDialog, setShowObjectionDialog] = useState(false);
  
  const [newKnowledge, setNewKnowledge] = useState({
    category: "destinations",
    subcategory: "",
    title: "",
    content: "",
    keywords: "",
    priority: 1,
  });

  const [newProfile, setNewProfile] = useState({
    profileName: "",
    keywords: "",
    phrases: "",
    behaviors: "",
    destinations: "",
    tone: "",
    avoid: "",
  });

  const [newObjection, setNewObjection] = useState({
    objection: "",
    triggers: "",
    responseTemplate: "",
    followUpActions: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: knowledgeItems = [], isLoading: knowledgeLoading } = useQuery({
    queryKey: ["/api/admin/ai-knowledge"],
  });

  const { data: profileRules = [], isLoading: profilesLoading } = useQuery({
    queryKey: ["/api/admin/profile-rules"],
  });

  const { data: objectionResponses = [], isLoading: objectionsLoading } = useQuery({
    queryKey: ["/api/admin/objection-responses"],
  });

  const { data: conversationAnalytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/admin/conversation-analytics"],
  });

  // Mutations
  const createKnowledgeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/admin/ai-knowledge", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ai-knowledge"] });
      setNewKnowledge({
        category: "destinations",
        subcategory: "",
        title: "",
        content: "",
        keywords: "",
        priority: 1,
      });
      setShowKnowledgeDialog(false);
      toast({
        title: "Knowledge Added",
        description: "AI knowledge base updated successfully!",
      });
    },
  });

  const updateKnowledgeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest("PUT", `/api/admin/ai-knowledge/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ai-knowledge"] });
      setEditingKnowledge(null);
      toast({
        title: "Knowledge Updated",
        description: "AI knowledge base updated successfully!",
      });
    },
  });

  const deleteKnowledgeMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/ai-knowledge/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ai-knowledge"] });
      toast({
        title: "Knowledge Deleted",
        description: "Knowledge item removed from AI database",
      });
    },
  });

  const filteredKnowledge = knowledgeItems.filter((item: AIKnowledge) => 
    selectedCategory === "all" || item.category === selectedCategory
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "destinations": return "🏖️";
      case "objections": return "🛡️";
      case "profiles": return "👤";
      case "pricing": return "💰";
      default: return "📚";
    }
  };

  const getEffectivenessColor = (score: string) => {
    const num = parseFloat(score);
    if (num >= 80) return "text-green-600 bg-green-50";
    if (num >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Brain className="w-8 h-8 mr-3 text-blue-600" />
            AI Intelligence CMS
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Teach your AI how to convert visitors into customers
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            AI Settings
          </Button>
        </div>
      </div>

      {/* AI Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Knowledge Items</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {knowledgeItems.length}
                </p>
              </div>
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Response Rate</p>
                <p className="text-2xl font-bold text-green-600">98.7%</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Avg. Conversation</p>
                <p className="text-2xl font-bold text-blue-600">12.4 msgs</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Lead Conversion</p>
                <p className="text-2xl font-bold text-purple-600">23.8%</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="knowledge" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="profiles">Profile Detection</TabsTrigger>
          <TabsTrigger value="objections">Objection Handling</TabsTrigger>
          <TabsTrigger value="analytics">Conversation Analytics</TabsTrigger>
        </TabsList>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                AI Knowledge Base
              </CardTitle>
              <Dialog open={showKnowledgeDialog} onOpenChange={setShowKnowledgeDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Knowledge
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Knowledge</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          value={newKnowledge.category} 
                          onValueChange={(value) => setNewKnowledge({...newKnowledge, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="destinations">🏖️ Destinations</SelectItem>
                            <SelectItem value="objections">🛡️ Objections</SelectItem>
                            <SelectItem value="profiles">👤 Profiles</SelectItem>
                            <SelectItem value="pricing">💰 Pricing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="subcategory">Subcategory</Label>
                        <Input
                          id="subcategory"
                          value={newKnowledge.subcategory}
                          onChange={(e) => setNewKnowledge({...newKnowledge, subcategory: e.target.value})}
                          placeholder="e.g., rio, safety, cultural-seeker"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newKnowledge.title}
                        onChange={(e) => setNewKnowledge({...newKnowledge, title: e.target.value})}
                        placeholder="Knowledge title"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={newKnowledge.content}
                        onChange={(e) => setNewKnowledge({...newKnowledge, content: e.target.value})}
                        placeholder="Detailed knowledge content..."
                        rows={6}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                      <Input
                        id="keywords"
                        value={newKnowledge.keywords}
                        onChange={(e) => setNewKnowledge({...newKnowledge, keywords: e.target.value})}
                        placeholder="rio, beach, culture, safety"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="priority">Priority (1-10)</Label>
                      <Input
                        id="priority"
                        type="number"
                        min="1"
                        max="10"
                        value={newKnowledge.priority}
                        onChange={(e) => setNewKnowledge({...newKnowledge, priority: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowKnowledgeDialog(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={() => createKnowledgeMutation.mutate(newKnowledge)}
                        disabled={createKnowledgeMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Knowledge
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            
            <CardContent>
              {/* Category Filter */}
              <div className="flex space-x-2 mb-6">
                <Button 
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                >
                  All
                </Button>
                <Button 
                  variant={selectedCategory === "destinations" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("destinations")}
                >
                  🏖️ Destinations
                </Button>
                <Button 
                  variant={selectedCategory === "objections" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("objections")}
                >
                  🛡️ Objections
                </Button>
                <Button 
                  variant={selectedCategory === "profiles" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("profiles")}
                >
                  👤 Profiles
                </Button>
                <Button 
                  variant={selectedCategory === "pricing" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("pricing")}
                >
                  💰 Pricing
                </Button>
              </div>

              {/* Knowledge Items */}
              {knowledgeLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse bg-gray-200 h-20 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredKnowledge.map((item: AIKnowledge) => (
                    <div key={item.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-lg">{getCategoryIcon(item.category)}</span>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {item.title}
                            </h3>
                            <Badge variant="outline">
                              {item.category}
                              {item.subcategory && ` > ${item.subcategory}`}
                            </Badge>
                            <Badge className={getEffectivenessColor(item.effectiveness)}>
                              {item.effectiveness}% effective
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {item.content.substring(0, 200)}...
                          </p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Used {item.usageCount} times</span>
                            <span>Priority: {item.priority}</span>
                            {item.keywords && <span>Keywords: {item.keywords}</span>}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteKnowledgeMutation.mutate(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Detection Tab */}
        <TabsContent value="profiles" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Profile Detection Engine
              </CardTitle>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Profile Rule
              </Button>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                {/* Cultural Seeker Profile Example */}
                <div className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        👤 Cultural Seeker
                      </h3>
                      <Badge className="bg-purple-100 text-purple-800">94% accuracy</Badge>
                    </div>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Keywords:</h4>
                      <div className="flex flex-wrap gap-1">
                        {["authentic", "local", "traditional", "culture"].map(keyword => (
                          <Badge key={keyword} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Phrases:</h4>
                      <div className="text-gray-600 dark:text-gray-300">
                        "real experience", "not touristy", "local insights"
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Behaviors:</h4>
                      <div className="text-gray-600 dark:text-gray-300">
                        Asks about locals, history, traditions
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recommendations:</h4>
                      <div className="text-gray-600 dark:text-gray-300">
                        Salvador (90%), Paraty (85%)
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded border">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">When Detected:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>→ Recommend: Salvador (90%), Paraty (85%)</li>
                      <li>→ Avoid: Luxury resorts, crowded beaches</li>
                      <li>→ Tone: Authentic, insider knowledge</li>
                    </ul>
                  </div>
                </div>

                {/* Adventure Spirit Profile Example */}
                <div className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        🏔️ Adventure Spirit
                      </h3>
                      <Badge className="bg-green-100 text-green-800">89% accuracy</Badge>
                    </div>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Keywords:</h4>
                      <div className="flex flex-wrap gap-1">
                        {["adventure", "hiking", "extreme", "adrenaline"].map(keyword => (
                          <Badge key={keyword} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Phrases:</h4>
                      <div className="text-gray-600 dark:text-gray-300">
                        "off the beaten path", "challenging", "unique experiences"
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded border">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">When Detected:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>→ Recommend: Chapada Diamantina (95%), Rio Adventure (80%)</li>
                      <li>→ Highlight: Hiking, rappelling, cave exploration</li>
                      <li>→ Tone: Exciting, challenge-focused</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Objection Handling Tab */}
        <TabsContent value="objections" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Objection Handling System
              </CardTitle>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Objection Response
              </Button>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                {/* Safety Objection */}
                <div className="border rounded-lg p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        🛡️ "Is Brazil safe?"
                      </h3>
                      <Badge className="bg-red-100 text-red-800">95% resolution rate</Badge>
                    </div>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Triggers:</h4>
                      <div className="flex flex-wrap gap-1">
                        {["safe", "safety", "dangerous", "scared", "crime"].map(trigger => (
                          <Badge key={trigger} variant="outline" className="text-xs">
                            {trigger}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Response Template:</h4>
                      <div className="p-3 bg-white dark:bg-gray-700 rounded border text-sm text-gray-700 dark:text-gray-300">
                        "Great question! Safety is our #1 priority. We've had 500+ guests with zero incidents. 
                        Our guides are locals who know safe routes and areas. We provide 24/7 support and 
                        comprehensive safety briefings. Here's what our recent guests say..."
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Follow-up Actions:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Send safety PDF</Badge>
                        <Badge variant="secondary">Share testimonials</Badge>
                        <Badge variant="secondary">Offer video call</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Objection */}
                <div className="border rounded-lg p-4 bg-gradient-to-r from-yellow-50 to-green-50 dark:from-yellow-900/20 dark:to-green-900/20">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        💰 "Too expensive"
                      </h3>
                      <Badge className="bg-yellow-100 text-yellow-800">78% resolution rate</Badge>
                    </div>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Triggers:</h4>
                      <div className="flex flex-wrap gap-1">
                        {["expensive", "cost", "price", "budget", "cheaper"].map(trigger => (
                          <Badge key={trigger} variant="outline" className="text-xs">
                            {trigger}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Response Template:</h4>
                      <div className="p-3 bg-white dark:bg-gray-700 rounded border text-sm text-gray-700 dark:text-gray-300">
                        "I understand price is important! Our packages include everything - flights, accommodation, 
                        meals, experiences, and local guide. When you break it down, it's actually great value. 
                        We also have flexible payment options and can customize to fit your budget..."
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Follow-up Actions:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Send value breakdown</Badge>
                        <Badge variant="secondary">Offer payment plan</Badge>
                        <Badge variant="secondary">Show alternatives</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversation Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Avg. Messages per Conversation</span>
                    <span className="font-semibold">12.4</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Lead Conversion Rate</span>
                    <span className="font-semibold text-green-600">23.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Response Accuracy</span>
                    <span className="font-semibold text-blue-600">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">User Satisfaction</span>
                    <span className="font-semibold text-purple-600">4.6/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Profile Detections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">👤 Cultural Seeker</span>
                    <div className="text-right">
                      <div className="font-semibold">42%</div>
                      <div className="text-xs text-gray-500">87% convert</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">🏔️ Adventure Spirit</span>
                    <div className="text-right">
                      <div className="font-semibold">28%</div>
                      <div className="text-xs text-gray-500">76% convert</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">🏖️ Beach Lover</span>
                    <div className="text-right">
                      <div className="font-semibold">18%</div>
                      <div className="text-xs text-gray-500">92% convert</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">💎 Luxury Traveler</span>
                    <div className="text-right">
                      <div className="font-semibold">12%</div>
                      <div className="text-xs text-gray-500">95% convert</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Most Common Concerns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded">
                  <div>
                    <span className="font-medium">🛡️ Safety concerns</span>
                    <div className="text-sm text-gray-600 dark:text-gray-300">247 mentions this month</div>
                  </div>
                  <Badge className="bg-red-100 text-red-800">95% resolved</Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <div>
                    <span className="font-medium">💰 Price concerns</span>
                    <div className="text-sm text-gray-600 dark:text-gray-300">189 mentions this month</div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">78% resolved</Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <div>
                    <span className="font-medium">🗣️ Language barrier</span>
                    <div className="text-sm text-gray-600 dark:text-gray-300">156 mentions this month</div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">91% resolved</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}