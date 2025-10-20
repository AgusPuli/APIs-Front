// src/pages/Admin.jsx
import { useState } from "react";
import Sidebar from "../components/Admin/Sidebar";
import ProductSection from "../components/Admin/Product/ProductSection";
import CategorySection from "../components/Admin/Category/CategorySection";
import OrderSection from "../components/Admin/Order/OrderSection";
import DiscountSection from "../components/Admin/Discount/DiscountSection"; // ✅

export default function Admin() {
  const [section, setSection] = useState("products");

  const renderSection = () => {
    switch (section) {
      case "dashboard":
        return <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">📊 Dashboard Overview</h2>
          <p className="text-gray-600 dark:text-gray-400">Bienvenido al panel de administración</p>
        </div>;
      case "products":
        return <ProductSection />;
      case "categories":
        return <CategorySection />;
      case "orders":
        return <OrderSection />;
      case "discounts":            // ← el Sidebar debe llamar setSection("discounts")
        return <DiscountSection />;
      case "settings":
        return <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">⚙️ Settings Section</h2>
          <p className="text-gray-600 dark:text-gray-400">Configuración del sistema (próximamente)</p>
        </div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar currentSection={section} setSection={setSection} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-0 lg:ml-64">
        {renderSection()}
      </main>
    </div>
  );
}
