import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useSession } from "./SessionContext";
import toast from "react-hot-toast"; // ← IMPORTAR

const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useSession();
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para cupones
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [lastPreview, setLastPreview] = useState(null);
  const [loadingDiscount, setLoadingDiscount] = useState(false);

  // Obtener carrito y userId del backend
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

  // 🔹 Función para verificar stock antes de agregar
  const checkStock = async (productId, requestedQuantity) => {
    try {
      const res = await fetch(`http://localhost:8080/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al verificar stock");

      const product = await res.json();
      return {
        available: product.stock >= requestedQuantity,
        stock: product.stock,
        productName: product.name
      };
    } catch (err) {
      console.error("Error al verificar stock:", err);
      return { available: false, stock: 0 };
    }
  };

  // Agregar item localmente con validación de stock
  const addItem = async (item) => {
    // Calcular cantidad total que se tendría
    const existingItem = items.find(
      (i) =>
        i.productId === item.productId &&
        i.selectedColor === item.selectedColor &&
        i.selectedStorage === item.selectedStorage
    );
    
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const totalQuantity = currentQuantity + item.quantity;

    // Verificar stock
    const stockCheck = await checkStock(item.productId, totalQuantity);
    
    if (!stockCheck.available) {
      toast.error(
        `Stock insuficiente. Solo hay ${stockCheck.stock} unidades disponibles de ${stockCheck.productName || 'este producto'}`,
        { duration: 4000 }
      );
      return false;
    }

    // Si hay stock suficiente, agregar
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.productId === item.productId &&
          i.selectedColor === item.selectedColor &&
          i.selectedStorage === item.selectedStorage
      );
      
      if (existingIndex !== -1) {
        return prev.map((i, idx) =>
          idx === existingIndex 
            ? { ...i, quantity: i.quantity + item.quantity } 
            : i
        );
      } else {
        return [...prev, item];
      }
    });
    
    toast.success("Producto agregado al carrito", { duration: 2000 });
    return true;
  };

  // Actualizar cantidad desde los botones (+ / -)
  const updateQuantity = async (productId, newQuantity, action = "add") => {
    try {
      if (!token || !userId) return;

      if (action === "add") {
        // 🔹 Verificar stock antes de agregar
        const currentItem = items.find(i => i.productId === productId);
        const requestedQuantity = currentItem ? currentItem.quantity + 1 : 1;
        
        const stockCheck = await checkStock(productId, requestedQuantity);
        
        if (!stockCheck.available) {
          toast.error(
            `Stock insuficiente. Solo hay ${stockCheck.stock} unidades disponibles`,
            { duration: 3000 }
          );
          // Refrescar para sincronizar con el backend
          await fetchCart();
          return;
        }

        // Agregar una unidad más usando /carts/add
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

        if (!res.ok) {
          const errorData = await res.json();
          // Refrescar para sincronizar
          await fetchCart();
          throw new Error(errorData.message || "Error al agregar producto");
        }
        
      } else if (action === "remove") {
        // Disminuir cantidad o eliminar si llega a 0
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

      // 🔄 Refrescar carrito actualizado
      await fetchCart();
    } catch (err) {
      console.error("Error al actualizar cantidad:", err);
      toast.error(err.message || "Error al actualizar cantidad");
      // Refrescar para asegurar sincronización
      await fetchCart();
    }
  };

  // 🔹 Eliminar item completamente
  const removeItem = async (productId) => {
    // Optimista
    setItems((prev) => prev.filter((it) => it.productId !== productId));

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
      toast.success("Producto eliminado del carrito");
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar producto");
    }
  };

  // Previsualizar código de descuento
  const previewCode = async (code) => {
    if (!code.trim()) return;
    
    setLoadingDiscount(true);
    try {
      const res = await fetch("http://localhost:8080/cart/discounts/preview", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code.trim() }),
      });

      if (!res.ok) throw new Error("Código inválido");

      const data = await res.json();
      setLastPreview(data);
    } catch (err) {
      console.error("Error al previsualizar:", err);
      setLastPreview({ code, message: "Código no válido", discountAmount: 0 });
    } finally {
      setLoadingDiscount(false);
    }
  };

  // Aplicar código de descuento
  const applyCode = async (code) => {
    if (!code.trim()) return;
    
    setLoadingDiscount(true);
    try {
      const res = await fetch("http://localhost:8080/cart/discounts/apply", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code.trim() }),
      });

      if (!res.ok) throw new Error("No se pudo aplicar el cupón");

      const data = await res.json();
      setAppliedCoupon({ code, discountAmount: data.discountAmount || 0 });
      setLastPreview(null);
      toast.success("Cupón aplicado correctamente");
    } catch (err) {
      console.error("Error al aplicar cupón:", err);
      toast.error("Error al aplicar cupón");
      throw err;
    } finally {
      setLoadingDiscount(false);
    }
  };

  // Calcular subtotal
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  // Calcular descuento
  const discountAmount = useMemo(() => {
    return appliedCoupon?.discountAmount || 0;
  }, [appliedCoupon]);

  // Calcular total
  const total = useMemo(() => {
    return subtotal - discountAmount;
  }, [subtotal, discountAmount]);

  //  Sincronizar con localStorage
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(items));
    } else {
      localStorage.removeItem("cartItems");
    }
  }, [items]);

  //  Cargar carrito al iniciar sesión
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
        
        // Totales
        subtotal,
        discountAmount,
        total,
        
        // Cupones
        appliedCoupon,
        lastPreview,
        loadingDiscount,
        previewCode,
        applyCode,
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