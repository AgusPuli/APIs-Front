import { useState, useEffect } from "react";

export default function ProductDetailContainer({ productId, children }) {
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
          reviews: [],
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  if (loading) return <p className="text-center py-10">Cargando producto...</p>;
  if (!product) return <p className="text-center py-10">Producto no encontrado</p>;

  return <>{children(product)}</>;
}
