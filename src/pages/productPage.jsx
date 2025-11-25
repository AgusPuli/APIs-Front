import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../store/slices/productSlice.js";

import Header from "../components/Header"; // Ajustar ruta si es necesario
import Footer from "../components/Footer";       // Ajustar ruta si es necesario
import ProductInfo from "../components/ProductPage/ProductInfo";
import ProductSpecs from "../components/ProductPage/ProductSpecs";
import ProductReviews from "../components/ProductPage/ProductReviews";

export default function ProductPage() {
    const { productId } = useParams();
    const dispatch = useDispatch();

    // Redux
    const { selected: product, loadingSelected, error } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.user);

    const isAdmin = user?.role === "ADMIN";
    const [specs, setSpecs] = useState(null);

    // Reviews Mock
    const reviewsMock = [
        { user: "Juan", rating: 5, comment: "Excelente producto!", date: "2025-10-18" },
        { user: "Maria", rating: 4, comment: "Muy bueno, lo recomiendo.", date: "2025-10-17" },
    ];

    // 1. Cargar producto
    useEffect(() => {
        if (productId) dispatch(fetchProductById(productId));
    }, [productId, dispatch]);

    // 2. Generar Specs
    useEffect(() => {
        if (!product) return;
        setSpecs({
            Precio: `$${product.price?.toLocaleString("es-AR")}`,
            Stock: product.stock ?? 0,
            Categoria: product.category?.name || product.category || "Sin categoria",
        });
    }, [product]);

    // 3. URL Imagen Directa (Evita bucles de fetch)
    const API_URL = "http://localhost:8080";
    const imageUrl = product ? `${API_URL}/products/${product.id}/image/raw` : "/placeholder.jpg";

    if (loadingSelected) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-red-500 text-lg">Producto no encontrado.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
            {/* <Header /> */}

            {/* Banner Admin */}
            {isAdmin && (
                <div className="bg-gray-800 text-white text-center py-3 px-4 text-sm font-medium sticky top-0 z-10">
                    🔒 Modo Administrador: Vista de solo lectura
                </div>
            )}

            {/* Banner Inactivo */}
            {!product.active && !isAdmin && (
                <div className="container mx-auto px-4 pt-6">
                    <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg border border-yellow-200 text-center">
                        Este producto no está disponible actualmente.
                    </div>
                </div>
            )}

            <section className="flex-grow py-12 sm:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:flex lg:gap-12">
                    
                    {/* Imagen */}
                    <div className="lg:w-1/2 mb-8 lg:mb-0">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-24">
                            <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-auto rounded-lg object-cover aspect-square"
                                loading="lazy"
                                onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.jpg"; }}
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="lg:w-1/2 flex flex-col gap-6">
                        {/* El componente ProductInfo maneja su propia lógica de compra */}
                        <ProductInfo product={product} />

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <ProductSpecs product={{ specifications: specs }} />
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <ProductReviews product={{ reviews: reviewsMock }} />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}