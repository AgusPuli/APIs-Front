import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
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
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </SessionProvider>
  );
}