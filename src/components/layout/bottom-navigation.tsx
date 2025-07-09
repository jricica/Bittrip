import { Home, Plane, PlusCircle, Wallet, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const location = useLocation();
  
  const tabs = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Plane, label: "Viajes", path: "/trips" },
    { icon: PlusCircle, label: "Agregar", path: "/add-trip" },
    { icon: Wallet, label: "Wallet", path: "/wallet" },
    { icon: User, label: "Usuario", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-2">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={cn(
              "flex flex-col items-center justify-center px-3 py-1",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <tab.icon className={cn("h-6 w-6", isActive ? "text-primary" : "text-muted-foreground")} />
            <span className="text-xs">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}