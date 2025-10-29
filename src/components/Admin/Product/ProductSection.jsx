// src/components/Admin/Product/ProductSection.jsx
import { useState, useEffect } from "react";
import ProductTable from "./ProductTable";
import CreateProductModal from "./ProductModal/ProductCreateModal";
import EditProductModal from "./ProductModal/EditProductModal";
//  modal para confirmar Habilitar/Deshabilitar
import ToggleActiveModal from "./ProductModal/ToggleActiveModal";
import { useSession } from "../../Context/SessionContext";
import { FiPlus } from "react-icons/fi";

export default function ProductSection() {
  const { token } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Estado del toggle
  const [toggleTarget, setToggleTarget] = useState(null); // { product, nextActive }
  const [toggling, setToggling] = useState(false);

  // Obtener productos
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/products", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const data = await res.json();

      const array = Array.isArray(data) ? data : data.content || [];

      // Normalización de campos
      const normalized = array.map((p) => ({
        ...p,
        category: typeof p.category === "object"
          ? p.category?.name || "Sin categoría"
          : p.category || "Sin categoría",
        active: typeof p.active === "boolean" ? p.active : true,
      }));

      setProducts(normalized);
    } catch (err) {
      console.error("Error al obtener productos:", err);
      alert("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const handleProductCreated = async () => {
    setShowCreateModal(false);
    await fetchProducts();
    alert("Producto creado exitosamente");
  };

  const handleProductUpdated = async () => {
    setEditProduct(null);
    await fetchProducts();
    alert("Producto actualizado exitosamente");
  };

  // Abrir modal de confirmación de toggle
  const openToggleModal = (product, nextActive) => {
    setToggleTarget({ product, nextActive });
  };

  const handleConfirmToggle = async () => {
    if (!toggleTarget) return;
    const { product, nextActive } = toggleTarget;
    setToggling(true);

    try {
      const url = `http://localhost:8080/products/${product.id}/active?active=${nextActive}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        let msg = `Error HTTP ${res.status}`;
        try {
          const data = await res.json();
          msg = data.message || data.error || msg;
        } catch {
          const txt = await res.text();
          if (txt) msg = txt;
        }
        throw new Error(msg);
      }

      await fetchProducts();
      setToggleTarget(null);
      alert(nextActive ? "Producto habilitado" : "Producto deshabilitado");
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert(`No se pudo cambiar el estado: ${err.message}`);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Productos</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gestiona los productos del catálogo</p>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => setShowCreateModal(true)}
        >
          <FiPlus className="w-5 h-5" /> Agregar Producto
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando productos...</p>
        </div>
      ) : (
        <ProductTable
          products={products}
          onEdit={(p) => setEditProduct(p)}
          // Nuevo: callback de toggle
          onToggle={(p, nextActive) => openToggleModal(p, nextActive)}
        />
      )}

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

      {toggleTarget && (
        <ToggleActiveModal
          productName={toggleTarget.product.name}
          targetActive={toggleTarget.nextActive}
          onClose={() => setToggleTarget(null)}
          onConfirm={handleConfirmToggle}
          loading={toggling}
        />
      )}
    </div>
  );
}
