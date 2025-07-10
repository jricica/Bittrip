import * as React from "react";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { CategoryCard } from "@/components/ui/category-card";
import { TripBuilder } from "@/components/ui/trip-builder";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fine } from "@/lib/fine";
import { useToast } from "@/hooks/use-toast";
import { Schema } from "@/lib/db-types";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [categories, setCategories] = useState<Schema["categories"][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await fine.table("categories").select();
        setCategories(fetchedCategories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las categorías",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const handleCategoryClick = (categoryId: string) => {
    // Redirige a la página de categoría
    navigate(`/categories/${categoryId}`);
  };

  const handleSaveTrip = (days: any) => {
    toast({
      title: "Viaje guardado",
      description: `Tu viaje ha sido guardado con ${days.length} días`,
    });
    navigate("/trips");
  };

  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 px-6 py-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">BitTrip</h1>
        
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Explora Categorías</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-muted"></div>
              ))
            ) : (
              categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  icon={category.icon}
                  onClick={() => handleCategoryClick(category.id!)}
                />
              ))
            )}
          </div>
        </section>
        
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Viajes Sugeridos</h2>
            <Button onClick={() => navigate("/trips")}>
              Ver todos
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
              <p className="mb-4 text-muted-foreground">Descubre viajes populares y ahorra con nuestras plantillas</p>
              <Button onClick={() => navigate("/trips")}>Explorar plantillas</Button>
            </div>
          </div>
        </section>
        
        <section>
          <Tabs defaultValue="builder">
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="builder">Constructor de Viaje</TabsTrigger>
              <TabsTrigger value="saved">Mis Viajes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="builder">
              <TripBuilder onSave={handleSaveTrip} />
            </TabsContent>
            
            <TabsContent value="saved">
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <p className="mb-4 text-muted-foreground">No tienes viajes guardados</p>
                <Button onClick={() => navigate("/add-trip")}>Crear un viaje</Button>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </AppLayout>
  );
};

export default Index;
