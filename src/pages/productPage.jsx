// src/pages/ProductPage.jsx
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductGallery from "../components/ProductPage/ProductGallery";
import ProductInfo from "../components/ProductPage/ProductInfo";
import ProductSpecs from "../components/ProductPage/ProductSpecs";
import ProductReviews from "../components/ProductPage/ProductReviews";

export default function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:8080/api/products/${productId}`);
        if (!res.ok) throw new Error("Error fetching product");
        const data = await res.json();
        const normalized = {
          ...data,
          images: data.images || (data.images ? [data.images] : []),
        };
        setProduct(normalized);
      } catch (err) {
        console.error(err);
        // fallback genérico
        setProduct({
          id: "0",
          name: "Producto Genérico",
          price: 99.99,
          images: [
            "https://via.placeholder.com/600x600",
            "https://via.placeholder.com/600x600/ff0000",
            "https://via.placeholder.com/600x600/00ff00",
          ],
          description: "Descripción genérica",
          specifications: { Peso: "1kg", Dimensiones: "10x10x10cm" },
          colors: ["black", "white", "red"],
          storageOptions: ["128GB", "256GB"],
            reviews: [
    { user: "Juan", rating: 5, comment: "Excelente producto!", date: "2025-10-18", avatar: "https://via.placeholder.com/40" },
    { user: "María", rating: 4, comment: "Muy bueno, lo recomiendo", date: "2025-10-17", avatar: "https://via.placeholder.com/40" },
  ],
        });
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  if (loading)
    return <p className="text-center py-20 text-gray-500">Cargando producto...</p>;
  if (!product)
    return <p className="text-center py-20 text-red-500">Producto no encontrado</p>;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:flex lg:gap-12">
          {/* Left: Gallery */}
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <ProductGallery product={product} />
          </div>

          {/* Right: Info + Specs + Reviews */}
          <div className="lg:w-1/2 flex flex-col gap-6">
            <ProductInfo product={product} />

            {product.specifications && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <ProductSpecs product={product} />
              </div>
            )}

            {product.reviews && product.reviews.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <ProductReviews product={product} />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
