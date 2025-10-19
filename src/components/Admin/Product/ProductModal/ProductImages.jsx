// src/components/Admin/Product/ProductModal/ProductImages.jsx
import { FiPlus, FiTrash } from "react-icons/fi";

export default function ProductImages({ images, setImages }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        URLs de Imágenes
      </label>
      <div className="space-y-2">
        {images.map((img, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="url"
              value={img}
              onChange={(e) => {
                const newImgs = [...images];
                newImgs[idx] = e.target.value;
                setImages(newImgs);
              }}
              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <button
              type="button"
              onClick={() => setImages(images.filter((_, i) => i !== idx))}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Eliminar imagen"
            >
              <FiTrash size={20} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setImages([...images, ""])}
        className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <FiPlus size={18} /> Agregar Imagen
      </button>
    </div>
  );
}