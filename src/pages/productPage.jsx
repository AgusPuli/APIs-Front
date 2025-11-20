import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchProductById } from "../store/slices/productSlice.js";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductInfo from "../components/ProductPage/ProductInfo";
import ProductSpecs from "../components/ProductPage/ProductSpecs";
import ProductReviews from "../components/ProductPage/ProductReviews";

export default function ProductPage() {
    const { productId } = useParams();
    const dispatch = useDispatch();

    // Redux: Obtener producto y usuario
    const { selected: product, loadingSelected, error } = useSelector(
        (state) => state.products
    );
    const { user } = useSelector((state) => state.user);

    // Verificar si es administrador
    const isAdmin = user?.role === "ADMIN";

    // Estados locales
    const [imageUrl, setImageUrl] = useState("/placeholder.jpg");
    const [specs, setSpecs] = useState(null);

    // Mock de resenas (se mantiene igual que tu original)
    const reviewsMock = [
        {
            user: "Juan",
            rating: 5,
            comment: "Excelente producto!",
            date: "2025-10-18",
        },
        {
            user: "Maria",
            rating: 4,
            comment: "Muy bueno, lo recomiendo.",
            date: "2025-10-17",
        },
    ];

    // 1. Cargar producto desde Redux
    useEffect(() => {
        if (productId) {
            dispatch(fetchProductById(productId));
        }
    }, [productId, dispatch]);

    // 2. Generar especificaciones cuando llega el producto
    useEffect(() => {
        if (!product) return;

        setSpecs({
            Precio: `$${product.price?.toLocaleString("es-AR")}`,
            Stock: product.stock ?? 0,
            Categoria: product.category?.name || product.category || "Sin categoria",
        });
    }, [product]);

    // 3. Cargar imagen (Logica original con fetch para obtener blob)
    // Nota: Podrias usar URL directa como en ProductCard, pero mantengo tu logica aqui
    useEffect(() => {
        let isMounted = true;
        async function fetchImage() {
            try {
                const res = await fetch(
                    `http://localhost:8080/products/${productId}/image/raw`
                );

                if (!res.ok) throw new Error("No image");

                const blob = await res.blob();
                if (isMounted) {
                    setImageUrl(URL.createObjectURL(blob));
                }
            } catch {
                if (isMounted) {
                    setImageUrl("/placeholder.jpg");
                }
            }
        }

        if (productId) fetchImage();

        return () => {
            isMounted = false;
        };
    }, [productId]);

    // Estado de carga
    if (loadingSelected) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-600 dark:text-gray-400">Cargando producto...</p>
            </div>
        );
    }

    // Estado de error
    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-red-500">Producto no encontrado.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
            {/* Header opcional si no esta en App.jsx */}
            {/* <Header /> */}

            {/* Banner para Administradores */}
            {isAdmin && (
                <div className="bg-gray-800 text-white text-center py-3 px-4 text-sm font-medium">
                    Modo Administrador: La compra esta deshabilitada para tu cuenta.
                </div>
            )}

            {/* Banner para producto inactivo */}
            {!product.active && !isAdmin && (
                <div className="container mx-auto px-4 pt-6">
                    <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg border border-yellow-200 text-center">
                        Este producto no esta disponible actualmente.
                    </div>
                </div>
            )}

            <section className="flex-grow py-12 sm:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:flex lg:gap-12">

                    {/* Columna Izquierda: Imagen */}
                    <div className="lg:w-1/2 mb-8 lg:mb-0">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-auto rounded-lg object-cover aspect-square"
                                onError={(e) => (e.target.src = "/placeholder.jpg")}
                            />
                        </div>
                    </div>

                    {/* Columna Derecha: Informacion */}
                    <div className="lg:w-1/2 flex flex-col gap-6">

                        {/* Info Principal */}
                        <ProductInfo
                            product={product}
                            // Logica: Puede comprar si esta activo Y NO es admin
                            canBuy={product.active === true && !isAdmin}
                        />

                        {/* Especificaciones */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <ProductSpecs product={{ specifications: specs }} />
                        </div>

                        {/* Resenas */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <ProductReviews
                                product={{
                                    reviews: reviewsMock,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}