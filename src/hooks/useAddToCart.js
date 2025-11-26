// src/hooks/useAddToCart.js
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import toast from "react-hot-toast";

/**
 * Custom hook para manejar agregar al carrito
 * Usa Redux matcher para manejar success/error (sin try-catch)
 */
export default function useAddToCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, token } = useSelector((state) => state.user);
  const { items: cartItems } = useSelector((state) => state.cart);

  const isAdmin = user?.role === "ADMIN";

  /**
   * Agregar producto al carrito
   * El thunk maneja el error, aquí solo validamos UI
   */
  const addToCartHandler = async (product, quantity = 1) => {
    // ✅ Validaciones de UI (antes de dispatch)
    if (!token) {
      toast.error("Debes iniciar sesión para agregar al carrito");
      navigate("/login");
      return false;
    }

    if (isAdmin) {
      toast.error("Los administradores no pueden realizar compras");
      return false;
    }

    if (!product.active) {
      toast.error("Este producto no está disponible");
      return false;
    }

    if (product.stock === 0) {
      toast.error("Producto sin stock");
      return false;
    }

    // Validación de stock máximo (preventiva)
    const existingItem = cartItems.find(
      item => item.productId === product.id || item.id === product.id
    );
    const currentQty = existingItem ? existingItem.quantity : 0;
    
    if (currentQty + quantity > product.stock) {
      toast.error(`No puedes agregar más. Stock disponible: ${product.stock}`);
      return false;
    }

    // ✅ Dispatch sin try-catch - Redux maneja el error
    const result = await dispatch(addToCart({ 
      productId: product.id, 
      quantity 
    }));

    // ✅ Usar matcher de Redux para detectar éxito/error
    if (addToCart.fulfilled.match(result)) {
      toast.success("Producto agregado al carrito");
      return true;
    } else {
      // result.payload contiene el mensaje de error del rejectWithValue
      const errorMessage = result.payload || "Error al agregar al carrito";
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    addToCart: addToCartHandler,
    canAddToCart: !isAdmin && !!token,
    isAdmin
  };
}