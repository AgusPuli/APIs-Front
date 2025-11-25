import { memo } from "react";
import { Link, useNavigate } from "react-router-dom"; // 👈 Importar useNavigate
import { FiEye, FiShoppingCart, FiLock } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import toast from "react-hot-toast";

function ProductCard({ product }) {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // 👈 Usar navigate para la redirección
    
    // 1. Leer Usuario (para rol) y Carrito (para validar stock)
    const { user, token } = useSelector((state) => state.user); // 👈 Agregar token
    const { items: cartItems } = useSelector((state) => state.cart);

    const isAdmin = user?.role === "ADMIN";
    const API_URL = "http://localhost:8080";
    const imageUrl = `${API_URL}/products/${product.id}/image/raw`;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // 1. Validación de Autenticación
        if (!token) {
            toast.error("Debes iniciar sesión para agregar al carrito.");
            navigate("/login");
            return;
        }

        // 2. Validación de Admin
        if (isAdmin) {
            toast.error("Los administradores no pueden realizar compras.");
            return;
        }

        // 3. Validación de Stock Máximo (Local - Preventiva)
        const existingItem = cartItems.find(item => item.id === product.id); // Ojo con el ID aquí (productId vs id)
        const currentQty = existingItem ? existingItem.quantity : 0;
        const maxStock = product.stock || 0;

        if (currentQty + 1 > maxStock) {
            toast.error(`No puedes agregar más. Stock máximo: ${maxStock}`);
            return;
        }

        // 4. Disparar acción al Backend
        try {
            // Usamos unwrap() para que si falla, salte al catch
            await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
            toast.success("Agregado al carrito");
        } catch (errMessage) {
            // 🛑 CORRECCIÓN AQUÍ:
            // 'errMessage' es el string que devolvió rejectWithValue(err.message) en el slice.
            console.error("Error addToCart:", errMessage);
            
            // Mostramos el mensaje real si existe, o uno genérico si no
            if (typeof errMessage === 'string' && errMessage.includes("stock")) {
                 toast.error("Sin stock suficiente.");
            } else {
                 toast.error(errMessage || "Error al agregar al carrito.");
            }
        }
    };

    const isActive = Boolean(product?.active);
    const isOutOfStock = product?.stock === 0;

    return (
        <div className={`group relative bg-white dark:bg-gray-800 rounded-xl transition-all duration-300 overflow-hidden border flex flex-col ${isActive ? "hover:shadow-xl border-gray-100 dark:border-gray-700" : "opacity-70 grayscale border-gray-300 dark:border-gray-600"}`}>
            
            {/* Imagen */}
            <div className="relative w-full aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                    src={imageUrl}
                    alt={product.name}
                    loading="lazy"
                    className="absolute top-0 left-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        if (e.target.src.includes("placeholder")) return;
                        e.target.onerror = null;
                        e.target.src = "/placeholder.jpg";
                    }}
                />
                
                {/* Statuses... */}
                {!isActive && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">No disponible</span>
                    </div>
                )}
                {isOutOfStock && isActive && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
                        Sin stock
                    </div>
                )}
                {isAdmin && (
                    <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md flex items-center gap-1">
                        <FiLock size={10} /> Admin
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.category}</p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            ${product.price?.toLocaleString("es-AR")}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Link to={`/product/${product.id}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium">
                            <FiEye size={18} />
                            <span className="text-sm">Ver</span>
                        </Link>
                        
                        {/* Botón de Agregar */}
                        <button 
                            onClick={handleAddToCart} 
                            // Deshabilitar si no activo, sin stock o si es admin
                            disabled={!isActive || isOutOfStock || isAdmin} 
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-md ${
                                isActive && !isOutOfStock && !isAdmin
                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700" 
                                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            {isAdmin ? <FiLock size={18} /> : <FiShoppingCart size={18} />}
                            <span className="text-sm">
                                {isAdmin 
                                    ? "Admin" 
                                    : !isActive 
                                        ? "No disp." 
                                        : isOutOfStock 
                                            ? "Sin stock" 
                                            : "Agregar"
                                }
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(ProductCard);