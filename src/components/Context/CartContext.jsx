import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "./SessionContext"; // Ajustá la ruta si está en otra carpeta

const CartContext = createContext();

export function CartProvider({ children }) {
  const { token, user } = useSession(); // ✅ también traemos user (para rol, email, etc.)
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Obtener carrito del backend
  const fetchCart = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/carts/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Error al obtener carrito, status:", res.status);
        throw new Error("Error al obtener carrito");
      }

      const data = await res.json();
      // 🧠 Aseguramos compatibilidad con backend: mapeamos "items"
      setItems(data.items || []);
    } catch (err) {
      console.error("Error al obtener carrito:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Agregar item al carrito (solo visual por ahora)
  const addItem = (item) => {
    setItems((prev) => {
      const exist = prev.find(
        (i) =>
          i.productId === item.productId &&
          i.selectedColor === item.selectedColor &&
          i.selectedStorage === item.selectedStorage
      );

      if (exist) {
        return prev.map((i) =>
          i === exist ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        return [...prev, item];
      }
    });
  };

  // 🔹 Actualizar cantidad de un item
  const updateQuantity = async (productId, quantity) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );

    try {
      if (!token) return;

      const res = await fetch(
        `http://localhost:8080/carts/${user?.id}/item/${productId}?quantity=${quantity}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("No se pudo actualizar la cantidad");
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Eliminar item del carrito
  const removeItem = async (productId) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));

    try {
      if (!token) return;

      const res = await fetch(
        `http://localhost:8080/carts/${user?.id}/item/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("No se pudo eliminar el producto");
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Cargar carrito automáticamente al loguearse
  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        fetchCart,
        addItem,
        updateQuantity,
        removeItem,
        role: user?.role || "USER", // 👈 rol disponible en el contexto
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}
