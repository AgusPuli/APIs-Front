import ProductsList from "../components/Products/ProductList";

export default function Products() {
  // Ya no necesitamos lógica aquí. 
  // ProductList se encarga de conectarse a Redux, filtrar y paginar.
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ProductsList />
    </div>
  );
}