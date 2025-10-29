import { useState } from "react";
import { useLocation } from "react-router-dom";
import Logo from "./Header/Logo";
import NavDesktop from "./Header/NavDesktop";
import SearchBar from "./Header/SearchBar";
import CartButton from "./Header/CartButton";
import MobileMenu from "./Header/MobileMenu";
import UserProfileButton from "./Header/UserProfileButton";
import { useSession } from "./Context/SessionContext"; 

export default function Header({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  products,
}) {
  const location = useLocation();
  const pathname = location.pathname;
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const showSearch = pathname === "/products";

  // Antes: const { isLoggedIn, logout } = useSession();
  // Ahora también leemos user y loading para ocultar el carrito si es ADMIN
  const { isLoggedIn, logout, user, loading } = useSession();

  // Normaliza el rol para soportar "ADMIN" o "ROLE_ADMIN"
  const isAdmin = (user?.role ?? "").replace(/^ROLE_/, "") === "ADMIN";

  return (
    <header className="sticky top-0 z-50 glass-effect shadow-sm bg-[#0D1029]">
      <div className="border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo y título */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-shrink-0">
              <Logo />
              <h1 className="hidden sm:block text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                TechGadget
              </h1>
            </div>

            {/* Navegación de escritorio */}
            <div className="hidden lg:flex flex-1 justify-center px-8">
              <NavDesktop pathname={pathname} />
            </div>

            {/* Botones de acción */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Oculta el carrito si está cargando la sesión o si es ADMIN */}
              {!loading && !isAdmin && <CartButton />}

              {/* Botón de usuario solo en desktop */}
              <div className="hidden md:flex">
                <UserProfileButton
                  isLoggedIn={isLoggedIn}
                  logout={logout}
                />
              </div>

              {/* Botón de menú hamburguesa para móvil */}
              <button
                className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Abrir menú"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        setOpen={setMobileMenuOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSubcategory={selectedSubcategory}
        setSelectedSubcategory={setSelectedSubcategory}
        products={products}
        pathname={pathname}
        isLoggedIn={isLoggedIn}
        logout={logout}
      />
    </header>
  );
}
