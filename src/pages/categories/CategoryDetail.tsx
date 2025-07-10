import { useParams } from "react-router-dom";

const CategoryDetail = () => {
  const { categoryId } = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center bg-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Categoría: {categoryId?.toUpperCase()}
      </h1>
      <p className="text-gray-600 max-w-xl">
        Aquí podrás ver los detalles, servicios y recomendaciones de la categoría seleccionada.
      </p>
    </div>
  );
};

export default CategoryDetail;
