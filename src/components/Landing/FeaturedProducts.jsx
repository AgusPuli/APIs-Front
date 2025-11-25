import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/slices/productSlice";
import ProductCard from "../Products/ProductCard";
import { Link } from "react-router-dom";

export default function FeaturedProducts() {
  const dispatch = useDispatch();
  
  // ✅ Leer del store de Redux
  const { list: products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    // ✅ Solo cargar si no hay productos
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  // Mostrar solo los primeros 3 productos activos
  const featuredProducts = products
    .filter(p => p.active)
    .slice(0, 3);

  if (loading) {
    return (
      <section className="py-16 text-center text-gray-500">
        Cargando productos...
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <section className="py-16 text-center text-gray-500">
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
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Productos Destacados
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Descubre nuestra selección de los mejores productos tecnológicos del momento
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all shadow-sm"
          >
            <span>Ver Todos los Productos</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}