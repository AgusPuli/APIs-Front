import { useState } from "react";
import { FiTrash } from "react-icons/fi";

export default function ProductImages({ images, setImages }) {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImages([file]); // Guardamos el File en el estado
      setPreview(URL.createObjectURL(file)); // Mostramos vista previa
    }
  };

  const handleRemove = () => {
    setImages([]);
    setPreview(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Imagen del producto
      </label>

      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900 focus:outline-none"
        />
        {images.length > 0 && (
          <button
            type="button"
            onClick={handleRemove}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Eliminar imagen"
          >
            <FiTrash size={20} />
          </button>
        )}
      </div>

      {preview && (
        <div className="mt-3">
          <img
            src={preview}
            alt="Vista previa"
            className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-700"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Vista previa de la imagen seleccionada
          </p>
        </div>
      )}
    </div>
  );
}
