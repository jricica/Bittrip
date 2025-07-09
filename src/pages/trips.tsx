import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { TripCard } from "@/components/ui/trip-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import { fine } from "@/lib/fine";
import { useToast } from "@/hooks/use-toast";
import { Schema } from "@/lib/db-types";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";

// Sample service providers for BitRefill
const serviceProviders = [
  { id: "uber", name: "Uber", category: "transport", logo: "https://via.placeholder.com/40x40?text=Uber" },
  { id: "airbnb", name: "Airbnb", category: "accommodation", logo: "https://via.placeholder.com/40x40?text=Airbnb" },
  { id: "avianca", name: "Avianca", category: "transport", logo: "https://via.placeholder.com/40x40?text=Avianca" },
  { id: "mcdonalds", name: "McDonald's", category: "food", logo: "https://via.placeholder.com/40x40?text=McD" },
  { id: "starbucks", name: "Starbucks", category: "food", logo: "https://via.placeholder.com/40x40?text=SB" },
  { id: "netflix", name: "Netflix", category: "entertainment", logo: "https://via.placeholder.com/40x40?text=Netflix" },
];

// Sample trip templates
const tripTemplates = [
  {
    id: "template_1",
    name: "Fin de semana en la playa",
    description: "Escapada relajante de 3 días a la costa",
    days: 3,
    estimatedBudget: 500,
    categories: [
      { name: "Alojamiento", amount: 250 },
      { name: "Comida", amount: 150 },
      { name: "Transporte", amount: 100 },
    ]
  },
  {
    id: "template_2",
    name: "Aventura en la montaña",
    description: "Senderismo y actividades al aire libre",
    days: 4,
    estimatedBudget: 700,
    categories: [
      { name: "Alojamiento", amount: 300 },
      { name: "Comida", amount: 200 },
      { name: "Transporte", amount: 150 },
      { name: "Actividades", amount: 50 },
    ]
  },
];

const TripsPage = () => {
  const [trips, setTrips] = useState<Schema["trips"][]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: session } = fine.auth.useSession();

  useEffect(() => {
    const fetchTrips = async () => {
      if (!session?.user) return;
      
      try {
        const fetchedTrips = await fine.table("trips")
          .select()
          .eq("userId", session.user.id);
        
        setTrips(fetchedTrips || []);
      } catch (error) {
        console.error("Error fetching trips:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los viajes",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, [toast, session]);

  const handleViewTrip = (tripId: string) => {
    // In a real app, this would navigate to trip details
    toast({
      title: "Ver detalles",
      description: `Viendo detalles del viaje ${tripId}`,
    });
  };

  const handleUseTemplate = (templateId: string) => {
    navigate(`/add-trip?template=${templateId}`);
  };

  const handleBuyGiftCard = (providerId: string) => {
    navigate(`/wallet?provider=${providerId}`);
  };

  const filteredProviders = searchQuery 
    ? serviceProviders.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : serviceProviders;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mis Viajes</h1>
          <Button onClick={() => navigate("/add-trip")}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Viaje
          </Button>
        </div>
        
        <Tabs defaultValue="trips">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="trips">Mis Viajes</TabsTrigger>
            <TabsTrigger value="templates">Plantillas</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trips">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-48 animate-pulse rounded-lg bg-muted"></div>
                ))}
              </div>
            ) : trips.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    id={trip.id!}
                    name={trip.name}
                    startDate={trip.startDate}
                    endDate={trip.endDate}
                    budget={trip.budget}
                    status={trip.status || "planned"}
                    onView={handleViewTrip}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <p className="mb-4 text-muted-foreground">No tienes viajes guardados</p>
                <Button onClick={() => navigate("/add-trip")}>Crear un viaje</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="templates">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tripTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{template.days} días</span>
                        <span className="font-medium">{formatCurrency(template.estimatedBudget)}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {template.categories.map((category, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{category.name}</span>
                            <span className="text-sm font-medium">{formatCurrency(category.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      Usar plantilla
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="services">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar servicios..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-6">
              {Object.entries(
                filteredProviders.reduce((acc, provider) => {
                  acc[provider.category] = [...(acc[provider.category] || []), provider];
                  return acc;
                }, {} as Record<string, typeof serviceProviders>)
              ).map(([category, providers]) => (
                <div key={category}>
                  <h3 className="mb-3 text-lg font-medium capitalize">{category}</h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {providers.map((provider) => (
                      <Card key={provider.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="mb-3 flex items-center justify-center">
                            <img 
                              src={provider.logo} 
                              alt={provider.name} 
                              className="h-12 w-auto object-contain" 
                            />
                          </div>
                          <h4 className="mb-2 text-center text-sm font-medium">{provider.name}</h4>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleBuyGiftCard(provider.id)}
                          >
                            Comprar Gift Card
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
              
              {filteredProviders.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <p className="text-muted-foreground">No se encontraron servicios</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default TripsPage;