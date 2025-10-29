// src/components/User/Sidebar.jsx
import { useState } from "react";
import { FiUser, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";

// Icono Home igual al del sidebar de Admin
const HomeIcon = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

export default function Sidebar({ currentSection, setSection }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "inicio", label: "Inicio", icon: HomeIcon }, // nuevo
    { id: "orders", label: "Mis Pedidos", icon: FiShoppingCart },
    { id: "profile", label: "Mi Perfil", icon: FiUser },
  ];

  return (
    <>
      {/* Botón menú móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay móvil */}
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
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gradient">Mi Cuenta</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestiona tus datos y pedidos
          </p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              // Inicio se renderiza como enlace externo a "/"
              if (item.id === "inicio") {
                return (
                  <li key={item.id}>
                    <a
                      href="/"
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsOpen(false)}
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
      </aside>
    </>
  );
}
