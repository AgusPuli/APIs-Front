import { useEffect, useState } from "react";
import ProductsList from "../components/Products/ProductList";

const GENERIC_PRODUCTS = [
  {
    id: "1",
    name: "Auriculares inalámbricos Premium",
    price: 149990,
    images: [
      "https://via.placeholder.com/400x400/3b82f6/ffffff?text=Auriculares+1",
      "https://via.placeholder.com/400x400/60a5fa/ffffff?text=Auriculares+2"
    ],
    category: "Audio",
    subcategories: ["Inalámbricos", "Bluetooth"],
    featured: true,
    colors: ["#000000", "#FFFFFF"]
  },
  {
    id: "2",
    name: "Reloj inteligente deportivo",
    price: 99990,
    images: [
      "https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Reloj+1",
      "https://via.placeholder.com/400x400/a78bfa/ffffff?text=Reloj+2"
    ],
    category: "Wearables",
    subcategories: ["Smartwatch", "Fitness"],
    featured: false,
    colors: ["#000000", "#808080"]
  },
  {
    id: "3",
    name: "Teclado Mecánico RGB",
    price: 89990,
    images: [
      "https://via.placeholder.com/400x400/ec4899/ffffff?text=Teclado+1"
    ],
    category: "Accesorios",
    subcategories: ["Teclado", "Gaming"],
    colors: ["#000000"]
  },
  {
    id: "4",
    name: "Monitor 4K 27 pulgadas",
    price: 349990,
    images: [
      "https://via.placeholder.com/400x400/10b981/ffffff?text=Monitor+1"
    ],
    category: "Monitores",
    subcategories: ["4K", "Gaming"],
    featured: true
  },
  {
    id: "5",
    name: "Webcam Full HD",
    price: 59990,
    images: [
      "https://via.placeholder.com/400x400/f59e0b/ffffff?text=Webcam+1"
    ],
    category: "Accesorios",
    subcategories: ["Webcam", "Streaming"]
  },
  {
    id: "6",
    name: "SSD NVMe 1TB",
    price: 129990,
    images: [
      "https://via.placeholder.com/400x400/ef4444/ffffff?text=SSD+1"
    ],
    category: "Almacenamiento",
    subcategories: ["SSD", "NVMe"],
    storageOptions: ["1TB"]
  }
];

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
        const res = await fetch("http://localhost:8080/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        // Normalizar para que todos tengan 'images' como array
        const normalized = data.map((p) => ({
          ...p,
          images: Array.isArray(p.images) ? p.images : p.images ? [p.images] : [],
        }));

        setProducts(normalized);
      } catch (err) {
        console.error("Error fetching products:", err);

        // Usar productos genéricos como fallback
        const normalized = GENERIC_PRODUCTS.map((p) => ({
          ...p,
          images: Array.isArray(p.images) ? p.images : p.images ? [p.images] : [],
        }));

        setProducts(normalized);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Reset page when filters or search change
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