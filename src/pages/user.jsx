// src/pages/User.jsx
import { useState } from "react";
import Sidebar from "../components/User/UserSidebar";
import OrdersSection from "../components/User/UserOrdersSection";
import ProfileSection from "../components/User/ProfileSection";

export default function User() {
  const [section, setSection] = useState("orders");

  const renderSection = () => {
    switch (section) {
      case "orders":
        return <OrdersSection />;
      case "profile":
        return <ProfileSection />;
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
