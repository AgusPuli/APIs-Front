import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductInfo from "../components/ProductPage/ProductInfo";
import ProductSpecs from "../components/ProductPage/ProductSpecs";
import ProductReviews from "../components/ProductPage/ProductReviews";

export default function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("/placeholder.jpg");

  useEffect(() => {
    if (!productId) {
      console.warn("⚠️ No se recibió productId válido en la URL");
      setLoading(false);
      return;
    }

    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:8080/products/${productId}`);
        if (!res.ok) throw new Error(`Error al obtener producto: ${res.status}`);
        const data = await res.json();

        const normalized = {
          id: data.id,
          name: data.name,
          description: data.description || "Sin descripción disponible.",
          price: data.price || 0,
          stock: data.stock || 0,
          category: data.category?.name || "Sin categoría",
          specifications: {
            Precio: `$${data.price?.toLocaleString("es-AR")}`,
            Stock: data.stock,
            Categoría: data.category?.name,
          },
          reviews: [
            { user: "Juan", rating: 5, comment: "Excelente producto!", date: "2025-10-18" },
            { user: "María", rating: 4, comment: "Muy bueno, lo recomiendo.", date: "2025-10-17" },
          ],
        };

        setProduct(normalized);

        // Cargar imagen principal
        const imgRes = await fetch(`http://localhost:8080/products/${productId}/image/raw`);
        if (imgRes.ok) {
          const blob = await imgRes.blob();
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        } else {
          setImageUrl("/placeholder.jpg");
        }
      } catch (err) {
        console.error("❌ Error cargando producto:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();

    return () => {
      if (imageUrl.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
    };
  }, [productId]);

  if (loading)
    return <p className="text-center py-20 text-gray-500">Cargando producto...</p>;

  if (!product)
    return <p className="text-center py-20 text-red-500">Producto no encontrado.</p>;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      

      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:flex lg:gap-12">
          {/* ✅ Imagen del producto */}
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

          {/* Información */}
          <div className="lg:w-1/2 flex flex-col gap-6">
            <ProductInfo product={product} />

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <ProductSpecs product={product} />
            </div>

            {product.reviews?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <ProductReviews product={product} />
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
