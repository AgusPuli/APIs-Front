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
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
          Categoría
        </h3>
        <select
          className="w-full rounded border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark p-2 text-sm sm:text-base"
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
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
            Subcategoría
          </h3>
          <select
            className="w-full rounded border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark p-2 text-sm sm:text-base"
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
