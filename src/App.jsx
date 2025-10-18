import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/products";
import ProductPage from "./pages/productPage";
import FAQPage from "./pages/faq";
import ContactPage from "./pages/contact";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { SessionProvider } from "./components/Context/SessionContext";
import { CartProvider } from "./components/Context/CartContext";
import './index.css'

export default function App() {
  return (
    <SessionProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/product/:id" element={<ProductPageWrapper />} /> {/* Ruta dinámica */}
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </SessionProvider>
  );
}

// Wrapper para pasar el id de la URL como prop a ProductPage
import { useParams } from "react-router-dom";
function ProductPageWrapper() {
  const { id } = useParams();
  return <ProductPage productId={id} />;
}
