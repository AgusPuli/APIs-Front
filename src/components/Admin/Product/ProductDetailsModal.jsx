// src/components/Admin/Product/ProductDetailsModal.jsx
import { FiX, FiStar } from "react-icons/fi";

export default function ProductDetailsModal({ product, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {product.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {product.category || "Sin categoría"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Cerrar"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Imagen principal */}
            <div>
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400">
                  Sin imagen
                </div>
              )}

              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {product.images.slice(1).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Miniatura ${i}`}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-700 hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Info principal */}
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  ${product.price?.toFixed(2)}
                </p>
                {product.featured && (
                  <div className="flex items-center gap-1 text-amber-500">
                    <FiStar className="fill-current" />
                    <span className="text-sm font-medium">Destacado</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Descripción</h4>
                <p className="text-sm leading-relaxed">
                  {product.description || "Sin descripción disponible."}
                </p>
              </div>

              {product.subcategories && product.subcategories.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Subcategorías</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.subcategories.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-sm"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Colores</h4>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {product.storageOptions && product.storageOptions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Opciones de Almacenamiento
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.storageOptions.map((opt, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium"
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Especificaciones
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                {Object.entries(product.specifications).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between text-sm border-b border-gray-200 dark:border-gray-600 py-2"
                  >
                    <span className="font-medium text-gray-600 dark:text-gray-400">{k}</span>
                    <span className="text-gray-900 dark:text-white">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Reseñas de Clientes
              </h3>
              <div className="space-y-3">
                {product.reviews.map((r, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-700/30"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {r.avatar && (
                        <img
                          src={r.avatar}
                          alt={r.user}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {r.user}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {r.date} — ⭐ {r.rating}/5
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}