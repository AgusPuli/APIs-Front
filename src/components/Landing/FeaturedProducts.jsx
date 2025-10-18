import ProductCard from "../Products/ProductCard";
import { Link } from "react-router-dom";

const products = [
  { 
    id: "1", 
    name: "Notebook Lenovo IdeaPad 3", 
    price: 850000,
    images: [
      "https://via.placeholder.com/400x400/3b82f6/ffffff?text=Lenovo+1",
      "https://via.placeholder.com/400x400/60a5fa/ffffff?text=Lenovo+2",
      "https://via.placeholder.com/400x400/93c5fd/ffffff?text=Lenovo+3"
    ],
    category: "Computadoras",
    subcategories: ["Laptops", "Gaming"],
    featured: true,
    colors: ["#000000", "#C0C0C0"],
    storageOptions: ["512GB SSD", "1TB SSD"]
  },
  { 
    id: "2", 
    name: "Mouse Logitech MX Master 3", 
    price: 25000,
    images: [
      "https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Mouse+1",
      "https://via.placeholder.com/400x400/a78bfa/ffffff?text=Mouse+2"
    ],
    category: "Accesorios",
    subcategories: ["Mouse", "Inalámbrico"],
    featured: false,
    colors: ["#000000", "#808080", "#FFFFFF"]
  },
  { 
    id: "3", 
    name: "Auriculares Sony WH-1000XM5", 
    price: 65000,
    images: [
      "https://via.placeholder.com/400x400/ec4899/ffffff?text=Sony+1",
      "https://via.placeholder.com/400x400/f472b6/ffffff?text=Sony+2",
      "https://via.placeholder.com/400x400/f9a8d4/ffffff?text=Sony+3"
    ],
    category: "Audio",
    subcategories: ["Auriculares", "Bluetooth", "Noise Cancelling"],
    featured: true,
    colors: ["#000000", "#C0C0C0", "#FFD700"]
  },
];

export default function FeaturedProducts() {
  return (
    <section id="productos" className="py-16 sm:py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Productos Destacados
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Descubre nuestra selección de los mejores productos tecnológicos del momento
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
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