import { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

export default function ProductReviews({ product }) {
  const [visibleCount, setVisibleCount] = useState(2);

if (!product.reviews || product.reviews.length === 0) {
  return <p className="text-gray-500 dark:text-gray-400">No hay reseñas para este producto</p>;
}


  const avgRating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  const loadMore = () => setVisibleCount((prev) => prev + 2);

  return (
    <div className="py-10">
      <h2 className="text-xl font-bold mb-6">Reseñas de clientes</h2>
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <div className="flex flex-col items-center gap-2 md:w-1/4">
          <p className="text-5xl font-bold">{avgRating.toFixed(1)}</p>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) =>
              i < Math.round(avgRating) ? <AiFillStar key={i} className="text-primary" /> : <AiOutlineStar key={i} className="text-primary" />
            )}
          </div>
          <p className="text-sm text-gray-500">{`Basado en ${product.reviews.length} reseñas`}</p>
        </div>

        <div className="flex-1 space-y-4">
          {product.reviews.slice(0, visibleCount).map((r, i) => (
            <div key={i} className="flex gap-4">
              <img src={r.avatar} alt={r.user} className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{r.user}</p>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, j) =>
                      j < r.rating ? <AiFillStar key={j} className="text-primary" /> : <AiOutlineStar key={j} className="text-primary" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500">{r.date}</p>
                <p className="mt-2 text-gray-600">{r.comment}</p>
              </div>
            </div>
          ))}

          {visibleCount < product.reviews.length && (
            <button onClick={loadMore} className="mt-4 text-primary font-medium hover:underline">
              Ver más reseñas
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
