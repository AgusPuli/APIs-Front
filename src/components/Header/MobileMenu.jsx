import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import ProductFilters from "../Products/ProductsFilters";

export default function MobileMenu({
  isOpen,
  setOpen,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  products,
  pathname,
  isLoggedIn,
  logout
}) {
  const navItems = [
    { name: "Inicio", href: "/", icon: "🏠" },
    { name: "Productos", href: "/products", icon: "🛍️" },
    { name: "Sobre nosotros", href: "/faq", icon: "ℹ️" },
    { name: "Contacto", href: "/contact", icon: "📧" },
  ];

  const showSearch = pathname === "/products";
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" 
          onClick={() => setOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-out shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header del menú */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-center gap-3">
            <Logo size="h-8 w-8" />
            <h1 className="text-lg font-bold text-gradient">TechGadget</h1>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800 transition-colors"
            aria-label="Cerrar menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sección de perfil */}
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <button
            className="flex items-center justify-between w-full text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                <FaUserCircle className="w-6 h-6" />
              </div>
              <span className="font-medium">Mi Cuenta</span>
            </div>
            <FiChevronDown className={`w-5 h-5 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown de perfil */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${profileOpen ? "max-h-40 mt-3" : "max-h-0"}`}>
            <div className="flex flex-col bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {!isLoggedIn ? (
                <Link 
                  to="/login" 
                  className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium" 
                  onClick={() => setOpen(false)}
                >
                  🔐 Iniciar Sesión
                </Link>
              ) : (
                <>
                  <Link 
                    to="/dashboard" 
                    className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium border-b border-gray-100 dark:border-gray-800" 
                    onClick={() => setOpen(false)}
                  >
                    📊 Dashboard
                  </Link>
                  <button
                    className="text-left w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                    onClick={() => { 
                      logout(); 
                      setOpen(false); 
                    }}
                  >
                    🚪 Cerrar Sesión
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Búsqueda y filtros */}
        {showSearch && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 space-y-4 bg-gray-50 dark:bg-gray-800/50">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <ProductFilters
              products={products}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSubcategory={selectedSubcategory}
              setSelectedSubcategory={setSelectedSubcategory}
            />
          </div>
        )}

        {/* Navegación */}
        <nav className="flex flex-col p-4 gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                to={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
                onClick={() => setOpen(false)}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer del menú */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            © 2024 TechGadget
          </p>
        </div>
      </div>
    </>
  );
}