import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Calendar, CreditCard } from "lucide-react";

interface GiftCardProps {
  id: string;
  provider: string;
  amount: number;
  purchaseDate: string;
  expiryDate?: string;
  tripId?: string;
  onAssign?: (id: string) => void;
}

export function GiftCard({ id, provider, amount, purchaseDate, expiryDate, tripId, onAssign }: GiftCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getProviderLogo = (provider: string) => {
    // In a real app, you would have a mapping of provider logos
    return `https://via.placeholder.com/40x20?text=${provider}`;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={getProviderLogo(provider)} 
              alt={provider} 
              className="h-6 w-auto object-contain" 
            />
            <CardTitle className="text-lg">{provider}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <CreditCard className="h-4 w-4" />
            <span className="font-bold">{formatCurrency(amount)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <CardDescription className="flex items-center gap-1 text-xs">
          <Calendar className="h-3 w-3" />
          <span>Comprado: {formatDate(purchaseDate)}</span>
        </CardDescription>
        {expiryDate && (
          <CardDescription className="flex items-center gap-1 text-xs">
            <Calendar className="h-3 w-3" />
            <span>Expira: {formatDate(expiryDate)}</span>
          </CardDescription>
        )}
      </CardContent>
      {!tripId && onAssign && (
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => onAssign(id)}
          >
            Asignar a viaje
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}