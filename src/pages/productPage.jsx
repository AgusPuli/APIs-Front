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

    // 🔹 Redux
    const { selected: product, loadingSelected, error } = useSelector(
        (state) => state.products
    );

    // 🔹 Imagen local
    const [imageUrl, setImageUrl] = useState("/placeholder.jpg");

    // 🔹 Especificaciones (como en el viejo)
    const [specs, setSpecs] = useState(null);

    // 🔹 Reseñas mock (como en el viejo)
    const reviewsMock = [
        {
            user: "Juan",
            rating: 5,
            comment: "Excelente producto!",
            date: "2025-10-18",
        },
        {
            user: "María",
            rating: 4,
            comment: "Muy bueno, lo recomiendo.",
            date: "2025-10-17",
        },
    ];

    // 🧠 Traer producto desde Redux
    useEffect(() => {
        if (productId) {
            dispatch(fetchProductById(productId));
        }
    }, [productId, dispatch]);

    // 🧠 Crear especificaciones cuando llega el producto
    useEffect(() => {
        if (!product) return;

        setSpecs({
            Precio: `$${product.price?.toLocaleString("es-AR")}`,
            Stock: product.stock ?? 0,
            Categoría: product.category?.name || "Sin categoría",
        });
    }, [product]);

    // 🧠 Cargar imagen RAW
    useEffect(() => {
        async function fetchImage() {
            try {
                const res = await fetch(
                    `http://localhost:8080/products/${productId}/image/raw`
                );

                if (!res.ok) throw new Error("No image");

                const blob = await res.blob();
                setImageUrl(URL.createObjectURL(blob));
            } catch {
                setImageUrl("/placeholder.jpg");
            }
        }

        if (productId) fetchImage();
    }, [productId]);

    // LOADING
    if (loadingSelected) {
        return (
            <p className="text-center py-20 text-gray-500">
                Cargando producto...
            </p>
        );
    }

    // ERROR
    if (error || !product) {
        return (
            <p className="text-center py-20 text-red-500">
                Producto no encontrado.
            </p>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">

            {/* Banner inactivo */}
            {!product.active && (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 p-3 text-yellow-800 dark:text-yellow-200">
                        Este producto no está disponible actualmente.
                    </div>
                </div>
            )}

            <section className="py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:flex lg:gap-12">

                    {/* Imagen */}
                    <div className="lg:w-1/2 mb-8 lg:mb-0">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                            <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-auto rounded-lg object-cover"
                                onError={(e) => (e.target.src = "/placeholder.jpg")}
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="lg:w-1/2 flex flex-col gap-6">

                        <ProductInfo
                            product={product}
                            canBuy={product.active === true}
                        />

                        {/* 🔹 ESPECIFICACIONES (como antes) */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                            <ProductSpecs product={{ specifications: specs }} />
                        </div>

                        {/* 🔹 RESEÑAS MOCK (como antes) */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
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
