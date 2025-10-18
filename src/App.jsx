// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/products";
import ProductPage from "./pages/productPage";
import FAQPage from "./pages/faq";
import ContactPage from "./pages/contact";
import Login from "./pages/Login";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { SessionProvider } from "./components/Context/SessionContext";
import { CartProvider } from "./components/Context/CartContext";
import { Toaster } from "react-hot-toast";

import "./index.css";

export default function App() {
  return (
    <SessionProvider>
      <CartProvider>
        <BrowserRouter>
          {/* ✅ Header visible en todas las páginas */}
          <Header />

          <main className="min-h-screen">
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
            </Routes>
          </main>

          {/* ✅ Footer y toasts globales */}
          <Footer />
          <Toaster position="top-right" />
        </BrowserRouter>
      </CartProvider>
    </SessionProvider>
  );
}
