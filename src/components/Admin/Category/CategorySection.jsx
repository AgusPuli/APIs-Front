// src/components/Admin/Category/CategorySection.jsx
import { useState, useEffect } from "react";
import CategoryTable from "./CategoryTable";
import CreateCategoryModal from "./CreateCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import { useSession } from "../../Context/SessionContext";
import { FiPlus } from "react-icons/fi";

const mockCategories = [
  {
    id: "1",
    name: "Electrónica",
    description: "Dispositivos y accesorios tecnológicos",
    groups: [
      { id: "g1", name: "Smartphones" },
      { id: "g2", name: "Laptops" },
      { id: "g3", name: "Audio" },
    ],
  },
  {
    id: "2",
    name: "Gaming",
    description: "Productos para gamers",
    groups: [
      { id: "g4", name: "Consolas" },
      { id: "g5", name: "Accesorios" },
    ],
  },
];

export default function CategorySection() {
  const { token } = useSession();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/categories", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (!res.ok) throw new Error("Failed to fetch");
      
      const data = await res.json();
      setCategories(data?.length ? data : mockCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories(mockCategories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  // Handle create
  const handleCategoryCreated = (newCategory) => {
    console.log("Categoría creada:", newCategory);
    setCategories((prev) => [...prev, newCategory]);
    setShowCreateModal(false);
    alert("Categoría creada exitosamente");
  };

  // Handle edit
  const handleCategoryUpdated = (updated) => {
    console.log("Categoría actualizada:", updated);
    setCategories((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setEditCategory(null);
    alert("Categoría actualizada exitosamente");
  };

  // Handle delete
  const handleCategoryDelete = async () => {
    if (!deleteCategory) return;
    setDeleting(true);

    try {
      const res = await fetch(
        `http://localhost:8080/api/categories/${deleteCategory.id}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      setCategories((prev) =>
        prev.filter((c) => c.id !== deleteCategory.id)
      );
      setDeleteCategory(null);
      alert("Categoría eliminada exitosamente");
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert("Error al eliminar la categoría");
    } finally {
      setDeleting(false);
    }
  };

  console.log("Estado actual:", {
    showCreateModal,
    editCategory,
    deleteCategory
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Categorías
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona las categorías de productos
          </p>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => {
            console.log("Botón crear clickeado");
            setShowCreateModal(true);
          }}
        >
          <FiPlus className="w-5 h-5" /> Agregar Categoría
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando categorías...</p>
        </div>
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={(c) => {
            console.log("Editar:", c);
            setEditCategory(c);
          }}
          onDelete={(c) => {
            console.log("Eliminar:", c);
            setDeleteCategory(c);
          }}
        />
      )}

      {/* Modals - Siempre renderizar cuando están activos */}
      {showCreateModal && (
        <CreateCategoryModal
          token={token || ""}
          onClose={() => setShowCreateModal(false)}
          onCategoryCreated={handleCategoryCreated}
        />
      )}

      {editCategory && (
        <EditCategoryModal
          token={token || ""}
          category={editCategory}
          onClose={() => setEditCategory(null)}
          onCategoryUpdated={handleCategoryUpdated}
        />
      )}

      {deleteCategory && (
        <DeleteCategoryModal
          categoryName={deleteCategory.name}
          onClose={() => setDeleteCategory(null)}
          onConfirm={handleCategoryDelete}
          loading={deleting}
        />
      )}
    </div>
  );
}