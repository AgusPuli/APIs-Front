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
import OrdersPage from "./pages/OrdersPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { SessionProvider } from "./components/Context/SessionContext";
import { CartProvider } from "./components/Context/CartContext";
import { Toaster } from "react-hot-toast";
import PaidOrder from "./pages/PaidOrder";

import "./index.css";
import { AuthProvider } from "./components/Context/AuthContext";

function AppLayout() {
  const location = useLocation();
  
  // Ocultar Header y Footer en rutas de admin y user
  const hideLayout = location.pathname.startsWith("/admin") || location.pathname.startsWith("/user");

  return (
    <>
      {/* Header visible solo si NO estás en admin o user */}
      {!hideLayout && <Header />}

      <main className={hideLayout ? "" : "min-h-screen"}>
       <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/user" element={<User />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<PaidOrder />} />
        </Routes>
        </AuthProvider> 
      </main>

      {/* Footer visible solo si NO estás en admin o user */}
      {!hideLayout && <Footer />}
      
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