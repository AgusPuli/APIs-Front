import React from "react";

export default function ProductFilters({
  products = [],
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
}) {
  // Categorías únicas
  const categories = Array.from(
    new Set((products || []).map((p) => p.category).filter(Boolean))
  );

  // Subcategorías según categoría seleccionada
  const subcategories =
    selectedCategory && (products || []).length
      ? Array.from(
          new Set(
            (products || [])
              .filter((p) => p.category === selectedCategory && p.subcategories)
              .flatMap((p) => p.subcategories)
          )
        )
      : [];

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          Categoría
        </h3>
        <select
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-900 
                     text-gray-800 dark:text-gray-100 
                     p-2.5 text-sm sm:text-base 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Todas</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {subcategories.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Subcategoría
          </h3>
          <select
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-900 
                       text-gray-800 dark:text-gray-100 
                       p-2.5 text-sm sm:text-base 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
          >
            <option value="">Todas</option>
            {subcategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
