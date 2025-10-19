// src/components/Admin/Product/ProductSection.jsx
import { useState, useEffect } from "react";
import ProductTable from "./ProductTable";
import CreateProductModal from "./ProductModal/ProductCreateModal";
import EditProductModal from "./ProductModal/EditProductModal";
import ProductDetailsModal from "./ProductDetailsModal";
import { useSession } from "../../Context/SessionContext";
import { FiPlus } from "react-icons/fi";
import { mockProducts } from "./types";

export default function ProductSection() {
  const { token } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/products", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : mockProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const handleProductCreated = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
    setShowCreateModal(false);
    alert("Producto creado exitosamente");
  };

  const handleProductUpdated = (updated) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    setEditProduct(null);
    alert("Producto actualizado exitosamente");
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteProduct?.id) return;
    setDeleting(true);
    
    try {
      const res = await fetch(`http://localhost:8080/api/products/${deleteProduct.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
      setDeleteProduct(null);
      alert("Producto eliminado exitosamente");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error al eliminar el producto");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Productos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona el catálogo de productos
          </p>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => setShowCreateModal(true)}
        >
          <FiPlus className="w-5 h-5" /> Agregar Producto
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando productos...</p>
        </div>
      ) : (
        <ProductTable
          products={products}
          onEdit={(p) => setEditProduct(p)}
          onView={(p) => setViewingProduct(p)}
          onDelete={(p) => setDeleteProduct(p)}
        />
      )}

      {/* Modals */}
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

      {viewingProduct && (
        <ProductDetailsModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Eliminar Producto
            </h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              ¿Estás seguro de que deseas eliminar{" "}
              <strong className="text-gray-900 dark:text-white">{deleteProduct.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteProduct(null)}
                className="px-6 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirmed}
                disabled={deleting}
                className="px-6 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}