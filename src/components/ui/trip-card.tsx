import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface TripCardProps {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: string;
  onView?: (id: string) => void;
}

export function TripCard({ id, name, startDate, endDate, budget, status, onView }: TripCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'planned':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{name}</CardTitle>
          <Badge className={getStatusColor(status)}>
            {status === 'completed' ? 'Completado' : status === 'active' ? 'Activo' : 'Planeado'}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-1 text-sm">
          <DollarSign className="h-4 w-4" />
          <span>Presupuesto: {formatCurrency(budget)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => onView && onView(id)}
        >
          Ver detalles
        </Button>
      </CardFooter>
    </Card>
  );
}