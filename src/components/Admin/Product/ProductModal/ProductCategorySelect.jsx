// src/components/Admin/Product/ProductModal/ProductCategorySelect.jsx
import { useEffect, useState } from "react";

export default function CategorySelect({
  categories,
  category,
  setCategory,
  subcategories,
  setSubcategories,
}) {
  const [availableSubcategories, setAvailableSubcategories] = useState([]);

  useEffect(() => {
    if (category) {
      const subs = category.groups?.map((g) => g.name) || [];
      setAvailableSubcategories(subs);
      setSubcategories([]);
    } else {
      setAvailableSubcategories([]);
      setSubcategories([]);
    }
  }, [category, setSubcategories]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Categoría */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Categoría
        </label>
        <select
          value={category?.id || ""}
          onChange={(e) => {
            const cat = categories.find((c) => c.id === e.target.value) || null;
            setCategory(cat);
          }}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          required
        >
          <option value="">Seleccionar Categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategorías */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Subcategorías (mantén Ctrl/Cmd para múltiple)
        </label>
        <select
          multiple
          value={subcategories}
          onChange={(e) =>
            setSubcategories(Array.from(e.target.selectedOptions, (o) => o.value))
          }
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
          disabled={availableSubcategories.length === 0}
          size={4}
        >
          {availableSubcategories.length > 0 ? (
            availableSubcategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))
          ) : (
            <option disabled>Selecciona una categoría primero</option>
          )}
        </select>
        {availableSubcategories.length === 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Selecciona una categoría para ver subcategorías
          </p>
        )}
      </div>
    </div>
  );
}