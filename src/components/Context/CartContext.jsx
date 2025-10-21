<<<<<<< HEAD
// src/components/Context/CartContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSession } from "./SessionContext"; // ajustá la ruta si difiere
=======
import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "./SessionContext";
>>>>>>> 8f7ea54a9368e9bad5c3e40630f485f434ad34e3

const CartContext = createContext();

export function CartProvider({ children }) {
<<<<<<< HEAD
  const { token, user } = useSession(); // { id, role, ... }
=======
  const { token } = useSession();
>>>>>>> 8f7ea54a9368e9bad5c3e40630f485f434ad34e3
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  // 🎟️ Descuentos
  // appliedCoupon: último cupón confirmado por el servidor
  // lastPreview: último cálculo de preview (no guardado)
  // loadingDiscount: spinner para acciones de cupón
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discountAmount, message, ... }
  const [lastPreview, setLastPreview] = useState(null);
  const [loadingDiscount, setLoadingDiscount] = useState(false);

  const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // =========================
  // 🔢 Totales
  // =========================
  const subtotal = useMemo(
    () =>
      items.reduce(
        (acc, it) => acc + Number(it.price || 0) * Number(it.quantity || 0),
        0
      ),
    [items]
  );

  const discountAmount = useMemo(
    () => Number(appliedCoupon?.discountAmount || 0),
    [appliedCoupon]
  );

  const total = useMemo(
    () => Math.max(0, subtotal - discountAmount),
    [subtotal, discountAmount]
  );

  const hasCoupon = Boolean(appliedCoupon?.code);

  // =========================
  // 📥 Obtener carrito
  // =========================
=======
  // 🔹 Obtener carrito y userId del backend
>>>>>>> 8f7ea54a9368e9bad5c3e40630f485f434ad34e3
  const fetchCart = async () => {
    if (!token) {
      setItems([]);
      setAppliedCoupon(null);
      setLastPreview(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
<<<<<<< HEAD
      const r = await fetch(`${API}/carts/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) {
        console.error("Error al obtener carrito. Status:", r.status);
        throw new Error(await r.text());
      }
      const data = await r.json();

      // Esperado: { items: [...], coupon?: { code, discountAmount, ... } }
      setItems(Array.isArray(data.items) ? data.items : []);

      if (data.coupon && typeof data.coupon === "object") {
        setAppliedCoupon(data.coupon);
      }
      // Si el back no envía cupón, no forzamos a null para no romper UX
    } catch (e) {
      console.error("fetchCart:", e);
      setItems([]);
      // no tocamos appliedCoupon
=======
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
>>>>>>> 8f7ea54a9368e9bad5c3e40630f485f434ad34e3
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // =========================
  // ➕ Agregar item (solo UI)
  // =========================
=======
  // 🔹 Agregar item localmente
>>>>>>> 8f7ea54a9368e9bad5c3e40630f485f434ad34e3
  const addItem = (item) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i.productId === item.productId &&
          i.selectedColor === item.selectedColor &&
          i.selectedStorage === item.selectedStorage
      );
<<<<<<< HEAD
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          quantity: Number(copy[idx].quantity || 0) + Number(item.quantity || 0),
        };
        return copy;
=======
      if (exist) {
        return prev.map((i) =>
          i === exist ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        return [...prev, item];
>>>>>>> 8f7ea54a9368e9bad5c3e40630f485f434ad34e3
      }
      return [...prev, item];
    });
  };

<<<<<<< HEAD
  // =========================
  // 🔁 Actualizar cantidad
  // =========================
  const updateQuantity = async (productId, quantity) => {
    // Optimista
    setItems((prev) =>
      prev.map((it) =>
        it.productId === productId ? { ...it, quantity: Number(quantity) } : it
      )
    );

    try {
      if (!token || !user?.id) return;
      const r = await fetch(
        `${API}/carts/${user.id}/item/${productId}?quantity=${encodeURIComponent(
          quantity
        )}`,
        {
          method: "PUT",
=======
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
>>>>>>> 8f7ea54a9368e9bad5c3e40630f485f434ad34e3
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
<<<<<<< HEAD
        }
      );
      if (!r.ok) throw new Error(await r.text());
      // Refrescamos por si el back recalcula totales/desc.
      await fetchCart();
    } catch (e) {
      console.error("updateQuantity:", e);
    }
  };

  // =========================
  // 🗑️ Eliminar item
  // =========================
=======
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
>>>>>>> 8f7ea54a9368e9bad5c3e40630f485f434ad34e3
  const removeItem = async (productId) => {
    // Optimista
    setItems((prev) => prev.filter((it) => it.productId !== productId));

    try {
<<<<<<< HEAD
      if (!token || !user?.id) return;
      const r = await fetch(`${API}/carts/${user.id}/item/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) throw new Error(await r.text());
      await fetchCart();
    } catch (e) {
      console.error("removeItem:", e);
    }
  };

  // =========================
  // 🎟️ CUPONES
  // =========================

  // PREVIEW: calcula descuento pero NO guarda
  const previewCode = async (code) => {
    if (!token) throw new Error("No autenticado");
    setLoadingDiscount(true);
    try {
      const r = await fetch(`${API}/cart/discounts/preview`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: String(code || "").trim().toUpperCase() }),
      });
      if (!r.ok) throw new Error(await r.text());
      const data = await r.json(); // { code, discountAmount, message, ... }
      setLastPreview(data);
      return data;
    } finally {
      setLoadingDiscount(false);
    }
  };

  // APPLY: valida y guarda en el carrito
  const applyCode = async (code) => {
    if (!token) throw new Error("No autenticado");
    setLoadingDiscount(true);
    try {
      const r = await fetch(`${API}/cart/discounts/apply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: String(code || "").trim().toUpperCase() }),
      });
      if (!r.ok) throw new Error(await r.text());
      const data = await r.json(); // { code, discountAmount, message, ... }
      setAppliedCoupon(data);
      setLastPreview(null);
      await fetchCart(); // por si cambian precios por ítem/total en el back
      return data;
    } finally {
      setLoadingDiscount(false);
    }
  };

  // CLEAR: quita cupón del carrito
  const clearCode = async () => {
    if (!token) throw new Error("No autenticado");
    setLoadingDiscount(true);
    try {
      const r = await fetch(`${API}/cart/discounts`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) throw new Error(await r.text());
      setAppliedCoupon(null);
      setLastPreview(null);
      await fetchCart();
    } finally {
      setLoadingDiscount(false);
    }
  };

  // =========================
  // 🚀 Auto-carga al loguearse
  // =========================
=======
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
>>>>>>> 8f7ea54a9368e9bad5c3e40630f485f434ad34e3
  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        // Carrito
        items,
        userId,
        loading,
        fetchCart,
        addItem,
        updateQuantity,
        removeItem,
<<<<<<< HEAD

        // Totales
        subtotal,
        discountAmount,
        total,

        // Cupones
        hasCoupon,
        appliedCoupon,
        lastPreview,
        loadingDiscount,
        previewCode,
        applyCode,
        clearCode,

        // Info de usuario útil para UI
        role: user?.role || "USER",
=======
>>>>>>> 8f7ea54a9368e9bad5c3e40630f485f434ad34e3
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
