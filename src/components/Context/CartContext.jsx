import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useSession } from "./SessionContext";

const CartContext = createContext();

export function CartProvider({ children }) {
    const { token, backendOffline } = useSession();

    const [items, setItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [lastPreview, setLastPreview] = useState(null);
    const [loadingDiscount, setLoadingDiscount] = useState(false);

    const fetchCart = async () => {
        if (!token) {
            setItems([]);
            setAppliedCoupon(null);
            setLastPreview(null);
            setLoading(false);
            return;
        }

        if (backendOffline) {
            console.warn("⚠ Backend offline — usando carrito local");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const res = await fetch("http://localhost:8080/carts/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("No se pudo obtener carrito");

            const data = await res.json();
            setItems(data.items || []);
            setUserId(data.userId || null);

            localStorage.setItem("cartItems", JSON.stringify(data.items || []));
        } catch (err) {
            console.error("Error obteniendo carrito:", err);
        } finally {
            setLoading(false);
        }
    };

    const addItem = (item) => {
        setItems((p) => [...p, item]);
    };

    const updateQuantity = async (productId, newQuantity, action = "add") => {
        if (!token || !userId || backendOffline) {
            console.warn("⚠ Acción de carrito offline — solo local");
            setItems((p) =>
                p.map((i) =>
                    i.productId === productId ? { ...i, quantity: newQuantity } : i
                )
            );
            return;
        }

        try {
            if (action === "add") {
                await fetch("http://localhost:8080/carts/add", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId,
                        item: { productId, quantity: 1 },
                    }),
                });
            } else if (action === "remove") {
                await fetch(
                    `http://localhost:8080/carts/${userId}/item/${productId}/decrease`,
                    {
                        method: "PUT",
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            }

            await fetchCart();
        } catch (e) {
            console.log("Error server — manteniendo valores locales");
        }
    };

    const removeItem = async (productId) => {
        setItems((p) => p.filter((i) => i.productId !== productId));

        if (backendOffline || !token || !userId) return;

        try {
            await fetch(
                `http://localhost:8080/carts/${userId}/item/${productId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        } catch {}
    };

    const clearCart = async () => {
        setItems([]);

        if (!token || !userId || backendOffline) return;

        try {
            await fetch(`http://localhost:8080/carts/${userId}/clear`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch {}
    };

    const subtotal = useMemo(() => {
        return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    }, [items]);

    const discountAmount = useMemo(
        () => appliedCoupon?.discountAmount || 0,
        [appliedCoupon]
    );

    const total = subtotal - discountAmount;

    useEffect(() => {
        fetchCart();
    }, [token, backendOffline]);

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
                clearCart,
                subtotal,
                discountAmount,
                total,
                appliedCoupon,
                lastPreview,
                loadingDiscount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
