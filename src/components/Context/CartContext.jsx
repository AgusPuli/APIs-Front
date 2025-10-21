import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "./SessionContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useSession();
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Obtener carrito y userId del backend
  const fetchCart = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/carts/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al obtener carrito");

      const data = await res.json();
      setItems(data.items || []);
      setUserId(data.userId || null);
      localStorage.setItem("cartItems", JSON.stringify(data.items || []));
    } catch (err) {
      console.error("Error al obtener carrito:", err);
      setItems([]);
      setUserId(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Agregar item localmente
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

  // 🔹 Actualizar cantidad desde los botones (+ / -)
  const updateQuantity = async (productId, newQuantity, action = "add") => {
    try {
      if (!token || !userId) return;

      if (action === "add") {
        // ➕ Agregar una unidad más usando /carts/add
        const payload = {
          userId,
          item: { productId, quantity: 1 },
        };

        const res = await fetch("http://localhost:8080/carts/add", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Error al agregar producto");
      } else if (action === "remove") {
        // ➖ Disminuir cantidad o eliminar si llega a 0
        if (newQuantity <= 0) {
          await removeItem(productId);
          return;
        }

        const res = await fetch(
          `http://localhost:8080/carts/${userId}/item/${productId}/decrease`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Error al disminuir producto");
      }

      // 🔁 Refrescar carrito actualizado
      await fetchCart();
    } catch (err) {
      console.error("Error al actualizar cantidad:", err);
    }
  };

  // 🔹 Eliminar item completamente
  const removeItem = async (productId) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));

    try {
      if (!token || !userId) return;

      const res = await fetch(
        `http://localhost:8080/carts/${userId}/item/${productId}`,
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

  // 🔁 Sincronizar con localStorage
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(items));
    } else {
      localStorage.removeItem("cartItems");
    }
  }, [items]);

  // 🔁 Cargar carrito al iniciar sesión
  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        items,
        userId,
        loading,
        fetchCart,
        addItem,
        updateQuantity,
        removeItem,
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
