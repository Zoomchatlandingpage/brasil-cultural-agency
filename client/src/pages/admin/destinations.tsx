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
import { Plus, Edit, Trash2, MapPin, Calendar, DollarSign, Users, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AdminSidebar from "@/components/admin-sidebar";

interface Destination {
  id: number;
  name: string;
  description: string;
  status: string;
  bestMonths: string;
  idealProfiles: string;
  priceRangeMin: string;
  priceRangeMax: string;
  sellingPoints: string;
  mainImageUrl: string;
  airportCodes: string;
  hotelSearchTerms: string;
  createdAt: string;
}

export default function DestinationsAdmin() {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    bestMonths: "",
    idealProfiles: "",
    priceRangeMin: "",
    priceRangeMax: "",
    sellingPoints: "",
    mainImageUrl: "",
    airportCodes: "",
    hotelSearchTerms: ""
  });
  const { toast } = useToast();

  const { data: destinations = [], isLoading } = useQuery({
    queryKey: ["/api/destinations"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/destinations", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/destinations"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Destino criado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao criar destino", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await apiRequest("PUT", `/api/destinations/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/destinations"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Destino atualizado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar destino", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/destinations/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/destinations"] });
      toast({ title: "Destino removido com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao remover destino", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "active",
      bestMonths: "",
      idealProfiles: "",
      priceRangeMin: "",
      priceRangeMax: "",
      sellingPoints: "",
      mainImageUrl: "",
      airportCodes: "",
      hotelSearchTerms: ""
    });
    setSelectedDestination(null);
  };

  const handleEdit = (destination: Destination) => {
    setSelectedDestination(destination);
    setFormData({
      name: destination.name,
      description: destination.description,
      status: destination.status,
      bestMonths: destination.bestMonths,
      idealProfiles: destination.idealProfiles,
      priceRangeMin: destination.priceRangeMin,
      priceRangeMax: destination.priceRangeMax,
      sellingPoints: destination.sellingPoints,
      mainImageUrl: destination.mainImageUrl,
      airportCodes: destination.airportCodes,
      hotelSearchTerms: destination.hotelSearchTerms
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDestination) {
      updateMutation.mutate({ id: selectedDestination.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Gerenciar Destinos</h1>
              <p className="text-gray-600 mt-2">Administre todos os destinos de viagem disponíveis</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Destino
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {selectedDestination ? "Editar Destino" : "Criar Novo Destino"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                      <TabsTrigger value="details">Detalhes</TabsTrigger>
                      <TabsTrigger value="technical">Técnico</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nome do Destino</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="mainImageUrl">URL da Imagem Principal</Label>
                        <Input
                          id="mainImageUrl"
                          value={formData.mainImageUrl}
                          onChange={(e) => setFormData({ ...formData, mainImageUrl: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="priceRangeMin">Preço Mínimo (R$)</Label>
                          <Input
                            id="priceRangeMin"
                            value={formData.priceRangeMin}
                            onChange={(e) => setFormData({ ...formData, priceRangeMin: e.target.value })}
                            placeholder="1500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="priceRangeMax">Preço Máximo (R$)</Label>
                          <Input
                            id="priceRangeMax"
                            value={formData.priceRangeMax}
                            onChange={(e) => setFormData({ ...formData, priceRangeMax: e.target.value })}
                            placeholder="3500"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="bestMonths">Melhores Meses</Label>
                        <Input
                          id="bestMonths"
                          value={formData.bestMonths}
                          onChange={(e) => setFormData({ ...formData, bestMonths: e.target.value })}
                          placeholder="Mar-Mai, Set-Nov"
                        />
                      </div>
                      <div>
                        <Label htmlFor="idealProfiles">Perfis Ideais</Label>
                        <Input
                          id="idealProfiles"
                          value={formData.idealProfiles}
                          onChange={(e) => setFormData({ ...formData, idealProfiles: e.target.value })}
                          placeholder="Cultural,Aventura,Família"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sellingPoints">Pontos de Venda</Label>
                        <Textarea
                          id="sellingPoints"
                          value={formData.sellingPoints}
                          onChange={(e) => setFormData({ ...formData, sellingPoints: e.target.value })}
                          placeholder="Cristo Redentor, Pão de Açúcar, Copacabana..."
                          rows={2}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="technical" className="space-y-4">
                      <div>
                        <Label htmlFor="airportCodes">Códigos de Aeroporto</Label>
                        <Input
                          id="airportCodes"
                          value={formData.airportCodes}
                          onChange={(e) => setFormData({ ...formData, airportCodes: e.target.value })}
                          placeholder="GIG,SDU"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hotelSearchTerms">Termos de Busca de Hotéis</Label>
                        <Input
                          id="hotelSearchTerms"
                          value={formData.hotelSearchTerms}
                          onChange={(e) => setFormData({ ...formData, hotelSearchTerms: e.target.value })}
                          placeholder="Copacabana,Ipanema,Santa Teresa"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {selectedDestination ? "Atualizar" : "Criar"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination: Destination) => (
              <Card key={destination.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={destination.mainImageUrl || '/api/placeholder/400/240'}
                    alt={destination.name}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant={destination.status === 'active' ? 'default' : 'secondary'}>
                      {destination.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      {destination.name}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {destination.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <DollarSign className="mr-1 h-3 w-3 text-green-600" />
                      <span>R$ {destination.priceRangeMin} - {destination.priceRangeMax}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3 text-blue-600" />
                      <span>{destination.bestMonths}</span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Users className="mr-1 h-3 w-3 text-purple-600" />
                    <span className="text-sm">{destination.idealProfiles}</span>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(destination)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(destination.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {destinations.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum destino encontrado
                </h3>
                <p className="text-gray-600">
                  Comece criando seu primeiro destino de viagem.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}