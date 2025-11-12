import { useState, useRef, useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function CreateCategoryModal({ token, onClose, onCategoryCreated }) {
  const [types, setTypes] = useState([]); // 🔹 Lista de enums desde el backend
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  // 🔹 Cerrar modal al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // 🔹 Obtener los enums del backend (CategoryType)
  useEffect(() => {
    const fetchCategoryTypes = async () => {
      try {
        const res = await fetch("http://localhost:8080/categories/types");
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setTypes(data);
      } catch (err) {
        console.error("❌ Error al cargar los tipos de categoría:", err);
        setTypes([]);
      }
    };
    fetchCategoryTypes();
  }, []);

  // 🔹 Crear categoría
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          name,         // uno de los valores del enum CategoryType
          description,  // texto ingresado por el usuario
        }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();
      onCategoryCreated(data);
      onClose();
      alert("✅ Categoría creada correctamente");
    } catch (err) {
      console.error("Error al crear la categoría:", err);
      alert("❌ No se pudo crear la categoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Crear Nueva Categoría
          </h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Cerrar"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Formulario */}
        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          {/* Nombre (Enum CategoryType) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre de la Categoría
            </label>
            <select
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            >
              <option value="">Seleccionar Tipo</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Breve descripción de esta categoría"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creando..." : "Guardar Categoría"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
