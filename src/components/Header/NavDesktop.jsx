import { Link } from "react-router-dom";

export default function NavDesktop({ pathname }) {
  const navItems = [
    { name: "Inicio", href: "/" },
    { name: "Productos", href: "/products" },
    { name: "Sobre nosotros", href: "/faq" },
    { name: "Contacto", href: "/contact" },
  ];

  return (
    <nav className="flex items-center gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              isActive 
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" 
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {item.name}
            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}