// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/products";
import ProductPage from "./pages/productPage";
import FAQPage from "./pages/faq";
import ContactPage from "./pages/contact";
import Login from "./pages/Login";
import Admin from "./pages/admin";
import Cart from "./pages/cart";
import User from "./pages/user";
import Checkout from "./pages/checkout";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { SessionProvider } from "./components/Context/SessionContext";
import { CartProvider } from "./components/Context/CartContext";
import { Toaster } from "react-hot-toast";

import "./index.css";

function AppLayout() {
  const location = useLocation();
  
  // Ocultar Header y Footer en rutas de admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Header visible solo si NO estás en admin */}
      {!isAdminRoute && <Header />}

      <main className={isAdminRoute ? "" : "min-h-screen"}>
        <Routes>
          {/* 🏠 Página principal */}
          <Route path="/" element={<Home />} />

          {/* 🛒 Catálogo general */}
          <Route path="/products" element={<Products />} />

          {/* 📦 Página de producto individual */}
          <Route path="/product/:productId" element={<ProductPage />} />

          {/* ❓ Preguntas frecuentes */}
          <Route path="/faq" element={<FAQPage />} />

          {/* 📞 Contacto */}
          <Route path="/contact" element={<ContactPage />} />

          {/* 🔐 Inicio de sesión */}
          <Route path="/login" element={<Login />} />

          {/* 👨‍💼 Panel de administración */}
          <Route path="/admin" element={<Admin />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/user" element={<User />} />

          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>

      {/* Footer visible solo si NO estás en admin */}
      {!isAdminRoute && <Footer />}
      
      {/* Toasts globales siempre visibles */}
      <Toaster position="top-right" />
    </>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <CartProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </CartProvider>
    </SessionProvider>
  );
}