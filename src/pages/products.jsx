import { useEffect, useState } from "react";
import ProductsList from "../components/Products/ProductList";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // URL correcta (coincide con tu backend)
        const res = await fetch("http://localhost:8080/products");
        if (!res.ok) throw new Error(`Error al obtener productos: ${res.status}`);

        const data = await res.json();

        // Maneja Page<ProductResponse> o List<ProductResponse>
        const array = Array.isArray(data) ? data : data.content || [];

        // Normalización mínima
        const normalized = array.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock,
          category: p.category?.name || "Sin categoría",
          images: ["/placeholder.jpg"],
          subcategories: [],
          colors: [],
          storageOptions: [],
          featured: false,
        }));

        setProducts(normalized);
      } catch (err) {
        console.error("❌ Error obteniendo productos:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Resetear página cuando cambian filtros o búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedSubcategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Cargando productos...
          </p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          No hay productos disponibles en la base de datos.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ProductsList
        products={products}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSubcategory={selectedSubcategory}
        setSelectedSubcategory={setSelectedSubcategory}
        itemsPerPage={9}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
