import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "./SessionContext"; // ajustá la ruta según tu proyecto

const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener carrito");
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addItem = (item) => {
    setItems((prev) => {
      const exist = prev.find(
        (i) =>
          i.productId === item.productId &&
          i.selectedColor === item.selectedColor &&
          i.selectedStorage === item.selectedStorage
      );
      if (exist) {
        return prev.map((i) => (i === exist ? { ...i, quantity: i.quantity + item.quantity } : i));
      } else {
        return [...prev, item];
      }
    });
  };

  const updateQuantity = async (id, quantity) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));

    try {
      if (!token) return;
      if (quantity <= 0) {
        removeItem(id);
        return;
      }
      const res = await fetch(`http://localhost:8080/api/cart/items/${id}?quantity=${quantity}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudo actualizar la cantidad");
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      if (!token) return;
      const res = await fetch(`http://localhost:8080/api/cart/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudo eliminar el producto");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <CartContext.Provider value={{ items, loading, fetchCart, addItem, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}
