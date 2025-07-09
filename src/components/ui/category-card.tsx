import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  Utensils, Car, MapPin, Wifi, Compass, Calendar,
  LucideIcon
} from "lucide-react";

interface CategoryCardProps {
  name: string;
  icon: string;
  onClick?: () => void;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  "utensils": Utensils,
  "car": Car,
  "map-pin": MapPin,
  "wifi": Wifi,
  "compass": Compass,
  "calendar": Calendar,
};

export function CategoryCard({ name, icon, onClick, className }: CategoryCardProps) {
  const IconComponent = iconMap[icon] || Compass;
  
  return (
    <Card 
      className={cn(
        "cursor-pointer overflow-hidden transition-all hover:shadow-md", 
        className
      )}
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center p-4">
        <div className="mb-2 rounded-full bg-primary/10 p-3">
          <IconComponent className="h-6 w-6 text-primary" />
        </div>
        <span className="text-sm font-medium">{name}</span>
      </CardContent>
    </Card>
  );
}