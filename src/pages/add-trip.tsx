import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TripBuilder } from "@/components/ui/trip-builder";
import { BudgetPlanner } from "@/components/ui/budget-planner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { fine } from "@/lib/fine";
import { useToast } from "@/hooks/use-toast";
import { generateId, getDaysBetweenDates } from "@/lib/utils";
import { Schema } from "@/lib/db-types";

interface BudgetCategory {
  id: string;
  name: string;
  percentage: number;
  amount: number;
}

const AddTripPage = () => {
  const [tripName, setTripName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [budget, setBudget] = useState(1000);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [tripDays, setTripDays] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { data: session } = fine.auth.useSession();
  
  // Get template ID from URL if present
  const searchParams = new URLSearchParams(location.search);
  const templateId = searchParams.get("template");
  
  useEffect(() => {
    if (templateId) {
      setIsLoadingTemplate(true);
      // In a real app, this would fetch the template from the database
      // For now, we'll simulate loading a template
      setTimeout(() => {
        if (templateId === "template_1") {
          setTripName("Fin de semana en la playa");
          setDescription("Escapada relajante de 3 días a la costa");
          setBudget(500);
          
          const start = new Date();
          const end = new Date();
          end.setDate(end.getDate() + 2); // 3 days
          setStartDate(start);
          setEndDate(end);
          
          // Generate sample days
          const days = [];
          for (let i = 0; i < 3; i++) {
            const date = new Date(start);
            date.setDate(date.getDate() + i);
            days.push({
              id: `day_${i}`,
              date: date.toISOString().split('T')[0],
              description: i === 0 ? "Día de llegada" : i === 2 ? "Día de salida" : "Día de playa",
              activities: []
            });
          }
          setTripDays(days);
        }
        setIsLoadingTemplate(false);
      }, 1000);
    }
  }, [templateId]);
  
  const handleBudgetChange = (categories: BudgetCategory[]) => {
    setBudgetCategories(categories);
  };
  
  const handleSaveTrip = async () => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para guardar un viaje",
        variant: "destructive",
      });
      return;
    }
    
    if (!tripName || !startDate || !endDate) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create trip
      const tripId = generateId();
      const trip: Schema["trips"] = {
        id: tripId,
        name: tripName,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        budget: budget,
        userId: session.user.id,
        status: "planned",
      };
      
      await fine.table("trips").insert(trip);
      
      // Create trip days
      for (const day of tripDays) {
        const tripDay: Schema["tripDays"] = {
          id: day.id,
          tripId: tripId,
          date: day.date,
          description: day.description,
        };
        
        await fine.table("tripDays").insert(tripDay);
        
        // Create activities for each day
        for (const activity of day.activities) {
          const activityData: Schema["activities"] = {
            id: activity.id,
            tripDayId: day.id,
            name: activity.name,
            time: activity.time,
            location: activity.location,
            cost: activity.cost || 0,
            category: activity.category,
          };
          
          await fine.table("activities").insert(activityData);
        }
      }
      
      toast({
        title: "Viaje creado",
        description: "Tu viaje ha sido guardado exitosamente",
      });
      
      navigate("/trips");
    } catch (error) {
      console.error("Error saving trip:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el viaje",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateInitialDays = () => {
    if (!startDate || !endDate) return [];
    
    const days = [];
    const dayCount = getDaysBetweenDates(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
    
    for (let i = 0; i < dayCount; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      days.push({
        id: `day_${generateId()}`,
        date: date.toISOString().split('T')[0],
        activities: []
      });
    }
    
    setTripDays(days);
  };
  
  useEffect(() => {
    if (startDate && endDate && !templateId) {
      generateInitialDays();
    }
  }, [startDate, endDate]);
  
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">Crear Nuevo Viaje</h1>
        
        {isLoadingTemplate ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <span>Cargando plantilla...</span>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="trip-name">Nombre del viaje</Label>
                    <Input
                      id="trip-name"
                      placeholder="Ej. Vacaciones de verano"
                      value={tripName}
                      onChange={(e) => setTripName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="trip-description">Descripción (opcional)</Label>
                    <Textarea
                      id="trip-description"
                      placeholder="Describe tu viaje..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Fecha de inicio</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? (
                              format(startDate, "PPP", { locale: es })
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Fecha de fin</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? (
                              format(endDate, "PPP", { locale: es })
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            disabled={(date) => date < (startDate || new Date())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="trip-budget">Presupuesto total (USD)</Label>
                    <Input
                      id="trip-budget"
                      type="number"
                      min="0"
                      step="10"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <BudgetPlanner totalBudget={budget} onBudgetChange={handleBudgetChange} />
            
            <TripBuilder initialDays={tripDays} onSave={setTripDays} />
            
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => navigate("/trips")}>
                Cancelar
              </Button>
              <Button onClick={handleSaveTrip} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Viaje"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AddTripPage;