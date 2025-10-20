import { useState } from "react";
import {
  FiGrid,
  FiPackage,
  FiFolder,
  FiShoppingCart,
  FiTag,
  FiSettings,
  FiMenu,
  FiX,
} from "react-icons/fi";

// --- SVG Icon Components (replaces react-icons) ---

const PackageIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);

const FolderIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
);

const ShoppingCartIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
);

const HomeIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);

const MenuIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);

const XIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);


export default function Sidebar({ currentSection, setSection }) {
  const [isOpen, setIsOpen] = useState(false);

  // 🧩 Menú completo, incluyendo Cupones
  const menuItems = [

    { id: "dashboard", label: "Dashboard", icon: FiGrid },
    { id: "products", label: "Productos", icon: FiPackage },
    { id: "categories", label: "Categorías", icon: FiFolder },
    { id: "orders", label: "Pedidos", icon: FiShoppingCart },
    { id: "discounts", label: "Cupones", icon: FiTag }, // 👈 antes decía "coupons"
    { id: "settings", label: "Configuración", icon: FiSettings },

    { id: "products", label: "Productos", icon: PackageIcon },
    { id: "categories", label: "Categorías", icon: FolderIcon },
    { id: "orders", label: "Pedidos", icon: ShoppingCartIcon },
    { id: "inicio", label: "Inicio", icon: HomeIcon },
  ];

  return (
    <>
      {/* Botón menú móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
      >
        {isOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
      </button>


      {/* Overlay en móvil */}
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gradient">Admin Panel</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            TechGadget Management
          </p>
        </div>

        {/* Menú principal */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              // If the item is "Inicio", render a link. Otherwise, render a button.
              if (item.id === 'inicio') {
                return (
                  <li key={item.id}>
                    <a
                      href="/"
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              }

              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setSection(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            © 2024 TechGadget Admin
          </p>
        </div>
      </aside>
    </>
  );
}