import { useState, useEffect } from "react";
import ProductTable from "./ProductTable";
import CreateProductModal from "./ProductModal/ProductCreateModal";
import EditProductModal from "./ProductModal/EditProductModal";
import DeleteProductModal from "./ProductModal/DeleteProductModal";
import { useSession } from "../../Context/SessionContext";
import { FiPlus } from "react-icons/fi";

export default function ProductSection() {
  const { token } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // 📡 Obtener todos los productos desde el backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/products", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const data = await res.json();

      // ✅ Soporta tanto Page<Product> como List<Product>
      const array = Array.isArray(data) ? data : data.content || [];

      // 🧩 Normaliza la categoría
      const normalized = array.map((p) => ({
        ...p,
        category:
          typeof p.category === "object"
            ? p.category?.name || "Sin categoría"
            : p.category || "Sin categoría",
      }));

      setProducts(normalized);
    } catch (err) {
      console.error("Error al obtener productos:", err);
      alert("Error al cargar los productos ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  // ✅ Crear nuevo producto (refresca lista automáticamente)
  const handleProductCreated = async () => {
    setShowCreateModal(false);
    await fetchProducts(); // 🔁 vuelve a cargar productos reales
    alert("Producto creado exitosamente ✅");
  };

  // ✏️ Actualizar producto
  const handleProductUpdated = async () => {
    setEditProduct(null);
    await fetchProducts();
    alert("Producto actualizado exitosamente ✅");
  };

  // ❌ Eliminar producto
  const handleProductDelete = async () => {
    if (!deleteProduct) return;
    setDeleting(true);

    try {
      const res = await fetch(
        `http://localhost:8080/products/${deleteProduct.id}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      await fetchProducts();
      setDeleteProduct(null);
      alert("Producto eliminado exitosamente ✅");
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      alert("Error al eliminar el producto ❌");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      {/* 🧭 Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Productos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona los productos del catálogo
          </p>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => setShowCreateModal(true)}
        >
          <FiPlus className="w-5 h-5" /> Agregar Producto
        </button>
      </div>

      {/* 📋 Tabla */}
      {loading ? (
        <div className="text-center py-12">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Cargando productos...
          </p>
        </div>
      ) : (
        <ProductTable
          products={products}
          onEdit={(p) => setEditProduct(p)}
          onDelete={(p) => setDeleteProduct(p)}
        />
      )}

      {/* 🧱 Modales */}
      {showCreateModal && (
        <CreateProductModal
          token={token || ""}
          onClose={() => setShowCreateModal(false)}
          onProductCreated={handleProductCreated}
        />
      )}

      {editProduct && (
        <EditProductModal
          token={token || ""}
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onProductUpdated={handleProductUpdated}
        />
      )}

      {deleteProduct && (
        <DeleteProductModal
          productName={deleteProduct.name}
          onClose={() => setDeleteProduct(null)}
          onConfirm={handleProductDelete}
          loading={deleting}
        />
      )}
    </div>
  );
}
