export async function fetchCategoryTypes() {
  const res = await fetch("http://localhost:8080/categories/types");
  if (!res.ok) throw new Error("Error cargando tipos de categoría");
  return res.json();
}
