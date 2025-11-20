import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import ProductCard from "./ProductCard";
import ProductFilters from "./ProductsFilters";
import SearchBar from "../Header/SearchBar";
import { fetchProducts } from "../../store/slices/productSlice";

export default function ProductsList() {
  const dispatch = useDispatch();

  const { list: products, loading, error } = useSelector((state) => state.products);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 9;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedSubcategory]);

  const filteredProducts = useMemo(() => {
    const listaSegura = products || [];

    return listaSegura.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory
        ? p.category === selectedCategory
        : true;

      const matchesSubcategory = selectedSubcategory
        ? p.subcategories?.includes(selectedSubcategory)
        : true;

      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  }, [products, searchQuery, selectedCategory, selectedSubcategory]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage(Math.max(1, currentPage - 1));
  const handleNext = () => setCurrentPage(Math.min(totalPages, currentPage + 1));

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        <p>Error al cargar productos: {typeof error === 'object' ? JSON.stringify(error) : error}</p>
      </div>
    );
  }

  return (
    <section className="py-8 sm:py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Nuestros Productos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "producto encontrado" : "productos encontrados"}
            </p>
          </div>

          <div className="w-full lg:w-72">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filtros (Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilters
                products={products}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedSubcategory={selectedSubcategory}
                setSelectedSubcategory={setSelectedSubcategory}
              />
            </div>
          </aside>

          {/* Contenido Principal */}
          <div className="flex-1">
            {/* Filtros (Mobile) */}
            <div className="lg:hidden mb-6">
              <ProductFilters
                products={products}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedSubcategory={selectedSubcategory}
                setSelectedSubcategory={setSelectedSubcategory}
              />
            </div>

            {/* Grilla */}
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No se encontraron productos
                </h3>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                    setSelectedSubcategory("");
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-4">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg disabled:opacity-50"
                >
                  <FiChevronLeft />
                </button>
                <span className="px-4 py-2 font-medium text-gray-700 dark:text-white">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg disabled:opacity-50"
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}