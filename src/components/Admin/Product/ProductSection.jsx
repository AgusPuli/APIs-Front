import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, toggleProductActive } from "../../../store/slices/productSlice";
import ProductTable from "./ProductTable";
import CreateProductModal from "./ProductModal/ProductCreateModal";
import EditProductModal from "./ProductModal/EditProductModal";
import ToggleActiveModal from "./ProductModal/ToggleActiveModal";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast"; // Usamos toast en lugar de alert para mejor UX

export default function ProductSection() {
  const dispatch = useDispatch();

  // Redux state
  const { list: products, loading, error } = useSelector((state) => state.products);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [toggleTarget, setToggleTarget] = useState(null);

  // Cargar productos al iniciar (Ya no pasamos token, el Thunk lo busca solo)
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Callback para creación exitosa
  const handleProductCreated = () => {
    setShowCreateModal(false);
    // Recargamos la lista para ver el nuevo producto
    dispatch(fetchProducts());
    toast.success("Producto creado exitosamente");
  };

  // Callback para actualización
  const handleProductUpdated = () => {
    setEditProduct(null);
    dispatch(fetchProducts());
    toast.success("Producto actualizado exitosamente");
  };

  // Abrir modal de activar/desactivar
  const openToggleModal = (product, nextActive) => {
    setToggleTarget({ product, nextActive });
  };

  // Confirmar toggle
  const handleConfirmToggle = () => {
    if (!toggleTarget) return;

    const { product, nextActive } = toggleTarget;

    // Ya no pasamos token
    dispatch(toggleProductActive({
        productId: product.id,
        active: nextActive
    }))
      .unwrap()
      .then(() => {
        setToggleTarget(null);
        toast.success(nextActive ? "Producto habilitado" : "Producto deshabilitado");
        // Actualizamos la lista para reflejar cambios visuales si es necesario
        dispatch(fetchProducts());
      })
      .catch((err) => {
        console.error("Error toggle:", err);
        toast.error("No se pudo cambiar el estado");
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
          className="btn-primary flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setShowCreateModal(true)}
        >
          <FiPlus className="w-5 h-5" /> Agregar Producto
        </button>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando productos...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">
            <p>Error: {typeof error === 'object' ? JSON.stringify(error) : error}</p>
            <button onClick={() => dispatch(fetchProducts())} className="mt-4 text-blue-600 underline">Reintentar</button>
        </div>
      ) : (
        <ProductTable
          products={products}
          onEdit={(p) => setEditProduct(p)}
          onToggle={(p, nextActive) => openToggleModal(p, nextActive)}
        />
      )}

      {/* Modales sin token */}
      {showCreateModal && (
        <CreateProductModal
          onClose={() => setShowCreateModal(false)}
          onProductCreated={handleProductCreated}
        />
      )}

      {editProduct && (
        <EditProductModal
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
          loading={loading}
        />
      )}
    </div>
  );
}