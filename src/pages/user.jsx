import { useState } from "react";
import SidebarUser from "../components/User/SideBar.jsx";
import UserOrdersSection from "../components/User/UserOrders/UserOrdersSection.jsx";

export default function User() {
  const [section, setSection] = useState("orders");

  const userData = JSON.parse(localStorage.getItem("user"));
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <SidebarUser
        currentSection={section}
        setSection={setSection}
        onLogout={handleLogout}
      />

      <main className="flex-1 ml-0 lg:ml-64 p-6 sm:p-10 transition-all">
        {section === "orders" && <UserOrdersSection />}
        {section === "profile" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">👤 Mi Perfil</h2>
            {userData ? (
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p>
                  <strong>Nombre:</strong> {userData.name ?? "Sin nombre"}
                </p>
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
                <p>
                  <strong>Rol:</strong> {userData.role ?? "Usuario"}
                </p>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No se encontró información del usuario.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
