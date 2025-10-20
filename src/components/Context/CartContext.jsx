// src/components/Context/CartContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSession } from "./SessionContext"; // ajustá la ruta si difiere

const CartContext = createContext();

export function CartProvider({ children }) {
  const { token, user } = useSession(); // { id, role, ... }
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ➕ Agregar item (solo UI)
  // =========================
  const addItem = (item) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i.productId === item.productId &&
          i.selectedColor === item.selectedColor &&
          i.selectedStorage === item.selectedStorage
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          quantity: Number(copy[idx].quantity || 0) + Number(item.quantity || 0),
        };
        return copy;
      }
      return [...prev, item];
    });
  };

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
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
  const removeItem = async (productId) => {
    // Optimista
    setItems((prev) => prev.filter((it) => it.productId !== productId));

    try {
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
  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        // Carrito
        items,
        loading,
        fetchCart,
        addItem,
        updateQuantity,
        removeItem,

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
