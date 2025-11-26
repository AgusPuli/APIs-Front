import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../store/slices/productSlice";
import ProductCard from "../Products/ProductCard";
import { Link } from "react-router-dom";

export default function FeaturedProducts() {
  const dispatch = useDispatch();
  
  // ✅ Obtener productos de Redux
  const { list: allProducts, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filtrar solo los primeros 3 productos activos
  const featuredProducts = (allProducts || [])
    .filter(p => p.active && p.stock > 0)
    .slice(0, 3);

  if (loading) {
    return (
      <section className="py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Cargando productos...</p>
      </section>
    );
  }

  if (!featuredProducts.length) {
    return (
      <section className="py-16 text-center text-gray-500 dark:text-gray-400">
        No hay productos disponibles
      </section>
    );
  }

  return (
    <section
      id="productos"
      className="py-16 sm:py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Productos Destacados
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Descubre nuestra selección de productos más populares
          </p>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA Ver más */}
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Ver Todos los Productos
          </Link>
        </div>
      </div>
    </section>
  );
}