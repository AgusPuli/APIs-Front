import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, toggleProductActive } from "../../../store/slices/productSlice";
import ProductTable from "./ProductTable";
import CreateProductModal from "./ProductModal/ProductCreateModal";
import EditProductModal from "./ProductModal/EditProductModal";
import ToggleActiveModal from "./ProductModal/ToggleActiveModal";
import { useSession } from "../../Context/SessionContext";
import { FiPlus } from "react-icons/fi";

export default function ProductSection() {
  const { token } = useSession();
  const dispatch = useDispatch();

  // Redux state
  const { list: products, loading, error } = useSelector((state) => state.products);

  // Modals (local UI only)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [toggleTarget, setToggleTarget] = useState(null);

  // Cargar productos al iniciar
  useEffect(() => {
    if (token) dispatch(fetchProducts(token));
  }, [token, dispatch]);

  // Callback para creación
  const handleProductCreated = () => {
    setShowCreateModal(false);
    dispatch(fetchProducts(token));
    alert("Producto creado exitosamente");
  };

  // Callback para actualización
  const handleProductUpdated = () => {
    setEditProduct(null);
    dispatch(fetchProducts(token));
    alert("Producto actualizado exitosamente");
  };

  // Abrir modal de activar/desactivar
  const openToggleModal = (product, nextActive) => {
    setToggleTarget({ product, nextActive });
  };

  // Confirmar toggle usando Redux
  const handleConfirmToggle = () => {
    if (!toggleTarget) return;

    const { product, nextActive } = toggleTarget;

    dispatch(
      toggleProductActive({
        productId: product.id,
        active: nextActive,
        token: token,
      })
    )
      .unwrap()
      .then(() => {
        setToggleTarget(null);
        alert(nextActive ? "Producto habilitado" : "Producto deshabilitado");
      })
      .catch((err) => {
        console.error("Error toggle:", err);
        alert("No se pudo cambiar el estado");
      });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      {/* Header */}
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

      {/* Contenido */}
      {loading ? (
        <div className="text-center py-12">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando productos...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <ProductTable
          products={products}
          onEdit={(p) => setEditProduct(p)}
          onToggle={(p, nextActive) => openToggleModal(p, nextActive)}
        />
      )}

      {/* Modales */}
      {showCreateModal && (
        <CreateProductModal
          token={token}
          onClose={() => setShowCreateModal(false)}
          onProductCreated={handleProductCreated}
        />
      )}

      {editProduct && (
        <EditProductModal
          token={token}
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
          loading={loading} // usa loading global
        />
      )}
    </div>
  );
}
