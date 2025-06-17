import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Package, Calendar, DollarSign, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AdminSidebar from "@/components/admin-sidebar";

interface TravelPackage {
  id: number;
  name: string;
  destinationId: number;
  durationDays: number;
  basePrice: string;
  includedServices: string;
  highlights: string;
  itinerary: string;
  maxGroupSize: string;
  markupPercentage: string;
  status: string;
  createdAt: string;
}

interface Destination {
  id: number;
  name: string;
}

export default function PackagesAdmin() {
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    destinationId: "",
    durationDays: "",
    basePrice: "",
    includedServices: "",
    highlights: "",
    itinerary: "",
    maxGroupSize: "",
    markupPercentage: "",
    status: "active"
  });
  const { toast } = useToast();

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["/api/packages"],
  });

  const { data: destinations = [] } = useQuery({
    queryKey: ["/api/destinations"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/packages", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Pacote criado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao criar pacote", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await apiRequest("PUT", `/api/packages/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Pacote atualizado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar pacote", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/packages/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      toast({ title: "Pacote removido com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao remover pacote", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      destinationId: "",
      durationDays: "",
      basePrice: "",
      includedServices: "",
      highlights: "",
      itinerary: "",
      maxGroupSize: "",
      markupPercentage: "",
      status: "active"
    });
    setSelectedPackage(null);
  };

  const handleEdit = (pkg: TravelPackage) => {
    setSelectedPackage(pkg);
    setFormData({
      name: pkg.name,
      destinationId: pkg.destinationId.toString(),
      durationDays: pkg.durationDays.toString(),
      basePrice: pkg.basePrice,
      includedServices: pkg.includedServices,
      highlights: pkg.highlights,
      itinerary: pkg.itinerary,
      maxGroupSize: pkg.maxGroupSize,
      markupPercentage: pkg.markupPercentage,
      status: pkg.status
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      destinationId: parseInt(formData.destinationId),
      durationDays: parseInt(formData.durationDays)
    };
    
    if (selectedPackage) {
      updateMutation.mutate({ id: selectedPackage.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const getDestinationName = (destinationId: number) => {
    const destination = destinations.find((d: Destination) => d.id === destinationId);
    return destination?.name || "Destino não encontrado";
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciar Pacotes</h1>
              <p className="text-gray-600 mt-2">Administre todos os pacotes de viagem disponíveis</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Pacote
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {selectedPackage ? "Editar Pacote" : "Criar Novo Pacote"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                      <TabsTrigger value="details">Detalhes</TabsTrigger>
                      <TabsTrigger value="itinerary">Itinerário</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nome do Pacote</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="destinationId">Destino</Label>
                          <Select value={formData.destinationId} onValueChange={(value) => setFormData({ ...formData, destinationId: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um destino" />
                            </SelectTrigger>
                            <SelectContent>
                              {destinations.map((dest: Destination) => (
                                <SelectItem key={dest.id} value={dest.id.toString()}>
                                  {dest.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="durationDays">Duração (dias)</Label>
                          <Input
                            id="durationDays"
                            type="number"
                            value={formData.durationDays}
                            onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="basePrice">Preço Base (R$)</Label>
                          <Input
                            id="basePrice"
                            value={formData.basePrice}
                            onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                            placeholder="2500"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Ativo</SelectItem>
                              <SelectItem value="inactive">Inativo</SelectItem>
                              <SelectItem value="draft">Rascunho</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="maxGroupSize">Tamanho Máximo do Grupo</Label>
                          <Input
                            id="maxGroupSize"
                            value={formData.maxGroupSize}
                            onChange={(e) => setFormData({ ...formData, maxGroupSize: e.target.value })}
                            placeholder="12"
                          />
                        </div>
                        <div>
                          <Label htmlFor="markupPercentage">Markup (%)</Label>
                          <Input
                            id="markupPercentage"
                            value={formData.markupPercentage}
                            onChange={(e) => setFormData({ ...formData, markupPercentage: e.target.value })}
                            placeholder="25"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="includedServices">Serviços Inclusos</Label>
                        <Textarea
                          id="includedServices"
                          value={formData.includedServices}
                          onChange={(e) => setFormData({ ...formData, includedServices: e.target.value })}
                          placeholder="Hospedagem, Transporte, Guia turístico..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="highlights">Destaques do Pacote</Label>
                        <Textarea
                          id="highlights"
                          value={formData.highlights}
                          onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                          placeholder="Cristo Redentor, Pão de Açúcar, Praia de Copacabana..."
                          rows={3}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="itinerary" className="space-y-4">
                      <div>
                        <Label htmlFor="itinerary">Itinerário Detalhado</Label>
                        <Textarea
                          id="itinerary"
                          value={formData.itinerary}
                          onChange={(e) => setFormData({ ...formData, itinerary: e.target.value })}
                          placeholder="Dia 1: Chegada e check-in&#10;Dia 2: City tour pelo Centro Histórico&#10;Dia 3: Cristo Redentor e Pão de Açúcar..."
                          rows={8}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {selectedPackage ? "Atualizar" : "Criar"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg: TravelPackage) => (
              <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Package className="mr-2 h-4 w-4" />
                      {pkg.name}
                    </span>
                    <Badge variant={pkg.status === 'active' ? 'default' : 'secondary'}>
                      {pkg.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-3 w-3 text-green-600" />
                    <span className="text-sm font-medium">{getDestinationName(pkg.destinationId)}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3 text-blue-600" />
                      <span>{pkg.durationDays} dias</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="mr-1 h-3 w-3 text-green-600" />
                      <span>R$ {pkg.basePrice}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-1">Destaques:</p>
                    <p className="line-clamp-2">{pkg.highlights}</p>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-1">Inclui:</p>
                    <p className="line-clamp-2">{pkg.includedServices}</p>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(pkg)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(pkg.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {packages.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum pacote encontrado
                </h3>
                <p className="text-gray-600">
                  Comece criando seu primeiro pacote de viagem.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}