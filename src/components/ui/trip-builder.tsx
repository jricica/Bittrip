import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { MapPin, Clock, DollarSign, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Activity {
  id: string;
  name: string;
  time?: string;
  location?: string;
  cost?: number;
  category: string;
}

interface TripDay {
  id: string;
  date: string;
  description?: string;
  activities: Activity[];
}

interface TripBuilderProps {
  initialDays?: TripDay[];
  onSave?: (days: TripDay[]) => void;
}

export function TripBuilder({ initialDays, onSave }: TripBuilderProps) {
  const [days, setDays] = useState<TripDay[]>(initialDays || []);
  const [newActivityDay, setNewActivityDay] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    category: "other"
  });

  const addDay = () => {
    const today = new Date();
    const newDay: TripDay = {
      id: `day_${Date.now()}`,
      date: today.toISOString().split('T')[0],
      activities: []
    };
    setDays([...days, newDay]);
  };

  const removeDay = (dayId: string) => {
    setDays(days.filter(day => day.id !== dayId));
  };

  const updateDay = (dayId: string, updates: Partial<TripDay>) => {
    setDays(days.map(day => 
      day.id === dayId ? { ...day, ...updates } : day
    ));
  };

  const startAddingActivity = (dayId: string) => {
    setNewActivityDay(dayId);
    setNewActivity({ category: "other" });
  };

  const cancelAddingActivity = () => {
    setNewActivityDay(null);
    setNewActivity({ category: "other" });
  };

  const saveActivity = () => {
    if (!newActivityDay || !newActivity.name) return;
    
    const activity: Activity = {
      id: `activity_${Date.now()}`,
      name: newActivity.name,
      time: newActivity.time,
      location: newActivity.location,
      cost: newActivity.cost,
      category: newActivity.category || "other"
    };
    
    setDays(days.map(day => 
      day.id === newActivityDay 
        ? { ...day, activities: [...day.activities, activity] } 
        : day
    ));
    
    setNewActivityDay(null);
    setNewActivity({ category: "other" });
  };

  const removeActivity = (dayId: string, activityId: string) => {
    setDays(days.map(day => 
      day.id === dayId 
        ? { ...day, activities: day.activities.filter(a => a.id !== activityId) } 
        : day
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const getTotalCost = () => {
    return days.reduce((total, day) => 
      total + day.activities.reduce((dayTotal, activity) => 
        dayTotal + (activity.cost || 0), 0), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Constructor de Viaje</h2>
        <Button onClick={() => onSave && onSave(days)} variant="outline">
          Guardar
        </Button>
      </div>
      
      <div className="space-y-4">
        {days.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="mb-4 text-center text-muted-foreground">
                No hay días en tu itinerario. Agrega un día para comenzar a planificar.
              </p>
              <Button onClick={addDay}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Día
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {days.length} {days.length === 1 ? 'día' : 'días'} • Costo total: {formatCurrency(getTotalCost())}
              </p>
              <Button onClick={addDay} size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Día
              </Button>
            </div>
            
            {days.map((day) => (
              <Card key={day.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {formatDate(day.date)}
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeDay(day.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {day.description && (
                    <p className="text-sm text-muted-foreground">{day.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  {day.activities.length > 0 ? (
                    <Timeline>
                      {day.activities.map((activity, index) => (
                        <TimelineItem
                          key={activity.id}
                          title={activity.name}
                          time={activity.time}
                          description={
                            <>
                              {activity.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {activity.location}
                                </span>
                              )}
                              {activity.cost !== undefined && activity.cost > 0 && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  {formatCurrency(activity.cost)}
                                </span>
                              )}
                            </>
                          }
                          icon={<Clock className="h-4 w-4" />}
                          isLast={index === day.activities.length - 1}
                        />
                      ))}
                    </Timeline>
                  ) : (
                    <p className="py-2 text-center text-sm text-muted-foreground">
                      No hay actividades para este día
                    </p>
                  )}
                  
                  {newActivityDay === day.id ? (
                    <div className="mt-4 space-y-3 rounded-md border p-3">
                      <div className="space-y-1">
                        <Label htmlFor={`activity-name-${day.id}`}>Nombre de la actividad</Label>
                        <Input
                          id={`activity-name-${day.id}`}
                          value={newActivity.name || ''}
                          onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                          placeholder="Visita al museo"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor={`activity-time-${day.id}`}>Hora</Label>
                          <Input
                            id={`activity-time-${day.id}`}
                            value={newActivity.time || ''}
                            onChange={(e) => setNewActivity({...newActivity, time: e.target.value})}
                            placeholder="10:00 AM"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`activity-cost-${day.id}`}>Costo</Label>
                          <Input
                            id={`activity-cost-${day.id}`}
                            type="number"
                            value={newActivity.cost || ''}
                            onChange={(e) => setNewActivity({...newActivity, cost: parseFloat(e.target.value) || 0})}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor={`activity-location-${day.id}`}>Ubicación</Label>
                        <Input
                          id={`activity-location-${day.id}`}
                          value={newActivity.location || ''}
                          onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                          placeholder="Dirección o lugar"
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={cancelAddingActivity}>
                          Cancelar
                        </Button>
                        <Button onClick={saveActivity} disabled={!newActivity.name}>
                          Guardar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      className="mt-4 w-full" 
                      variant="outline"
                      onClick={() => startAddingActivity(day.id)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Actividad
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}