import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TripCard } from "@/components/ui/trip-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LogOut, Settings, User, Bell, Moon, Sun, Loader2 } from "lucide-react";
import { fine } from "@/lib/fine";
import { useToast } from "@/hooks/use-toast";
import { Schema } from "@/lib/db-types";

const ProfilePage = () => {
  const [pastTrips, setPastTrips] = useState<Schema["trips"][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: session } = fine.auth.useSession();
  
  useEffect(() => {
    const fetchPastTrips = async () => {
      if (!session?.user) return;
      
      try {
        const fetchedTrips = await fine.table("trips")
          .select()
          .eq("userId", session.user.id)
          .eq("status", "completed");
        
        setPastTrips(fetchedTrips || []);
      } catch (error) {
        console.error("Error fetching past trips:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los viajes anteriores",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPastTrips();
    
    // Check if dark mode is enabled
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, [toast, session]);
  
  const handleLogout = async () => {
    try {
      await fine.auth.signOut();
      navigate("/");
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión",
        variant: "destructive",
      });
    }
  };
  
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  
  const handleViewTrip = (tripId: string) => {
    // In a real app, this would navigate to trip details
    toast({
      title: "Ver detalles",
      description: `Viendo detalles del viaje ${tripId}`,
    });
  };
  
  if (!session?.user) {
    return (
      <AppLayout>
        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Iniciar sesión</CardTitle>
              <CardDescription>Debes iniciar sesión para ver tu perfil</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate("/login")}>
                Iniciar sesión
              </Button>
            </CardFooter>
          </Card>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">Mi Perfil</h1>
        
        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={session.user.image || undefined} alt={session.user.name} />
                  <AvatarFallback>
                    {session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{session.user.name}</h2>
                  <p className="text-sm text-muted-foreground">{session.user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="trips">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="trips">Viajes Anteriores</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trips">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-48 animate-pulse rounded-lg bg-muted"></div>
                ))}
              </div>
            ) : pastTrips.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pastTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    id={trip.id!}
                    name={trip.name}
                    startDate={trip.startDate}
                    endDate={trip.endDate}
                    budget={trip.budget}
                    status="completed"
                    onView={handleViewTrip}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">No tienes viajes anteriores</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias</CardTitle>
                <CardDescription>Administra tus preferencias de la aplicación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    <Label htmlFor="dark-mode">Modo oscuro</Label>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={isDarkMode}
                    onCheckedChange={toggleDarkMode}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <Label htmlFor="notifications">Notificaciones</Label>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="pt-2">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;