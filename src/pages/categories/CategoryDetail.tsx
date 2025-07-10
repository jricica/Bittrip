import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CategoryInfo {
  title: string;
  description: string;
  image: string;
  items: { name: string; image: string }[];
}

const categories: Record<string, CategoryInfo> = {
  food: {
    title: "FOOD",
    description: "Servicios de comida a domicilio y restaurantes",
    image: "https://via.placeholder.com/150?text=Food",
    items: [
      { name: "Rappi", image: "https://via.placeholder.com/80?text=Rappi" },
      { name: "Uber Eats", image: "https://via.placeholder.com/80?text=UberEats" },
    ],
  },
  transport: {
    title: "TRANSPORT",
    description: "Opciones de movilidad y transporte",
    image: "https://via.placeholder.com/150?text=Transport",
    items: [
      { name: "Uber", image: "https://via.placeholder.com/80?text=Uber" },
      { name: "Bolt", image: "https://via.placeholder.com/80?text=Bolt" },
    ],
  },
  locations: {
    title: "LOCATIONS",
    description: "Hospedaje y sitios para tu estadía",
    image: "https://via.placeholder.com/150?text=Locations",
    items: [
      { name: "Airbnb", image: "https://via.placeholder.com/80?text=Airbnb" },
      { name: "Booking", image: "https://via.placeholder.com/80?text=Booking" },
    ],
  },
  esim: {
    title: "ESIM",
    description: "Tarjetas eSIM para conectarte en todo el mundo",
    image: "https://via.placeholder.com/150?text=eSIM",
    items: [
      { name: "Airalo", image: "https://via.placeholder.com/80?text=Airalo" },
      { name: "Nomad", image: "https://via.placeholder.com/80?text=Nomad" },
    ],
  },
  events: {
    title: "EVENTS",
    description: "Conciertos, tours y actividades locales",
    image: "https://via.placeholder.com/150?text=Events",
    items: [
      { name: "Concerts", image: "https://via.placeholder.com/80?text=Concerts" },
      { name: "Tours", image: "https://via.placeholder.com/80?text=Tours" },
    ],
  },
  popular: {
    title: "POPULAR",
    description: "Plantillas de viaje destacadas",
    image: "https://via.placeholder.com/150?text=Popular",
    items: [
      { name: "Plantillas destacadas", image: "https://via.placeholder.com/80?text=Top" },
    ],
  },
};

const CategoryDetail = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categories[categoryId ?? ""];

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 flex flex-col items-center">
      <h1 className="mb-2 text-3xl font-bold text-gray-800">
        Categoría: {category?.title || categoryId?.toUpperCase()}
      </h1>
      {category && (
        <>
          <p className="mb-6 max-w-md text-center text-gray-600">
            {category.description}
          </p>
          <img
            src={category.image}
            alt={category.title}
            className="mb-6 h-40 w-40 rounded-full object-cover shadow"
          />
          <div className="grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {category.items.map((item) => (
              <Card key={item.name} className="bg-white shadow rounded-lg">
                <CardHeader className="flex flex-col items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="mb-2 h-16 w-16 object-contain"
                  />
                  <CardTitle className="text-lg font-semibold">
                    {item.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    Ver más
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryDetail;
