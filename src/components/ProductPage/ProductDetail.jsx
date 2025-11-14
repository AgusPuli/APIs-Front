import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../../../store/slices/productSlice";

export default function ProductDetailContainer({ productId, children }) {
  const dispatch = useDispatch();

  // Obtenemos datos desde Redux
  const product = useSelector((state) => state.products.selected);
  const loading = useSelector((state) => state.products.loadingSelected);
  const error = useSelector((state) => state.products.error);

  // Cargar producto cuando cambia productId
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [productId, dispatch]);

  // Estados UI
  if (loading) return <p className="text-center py-10">Cargando producto...</p>;
  if (error || !product)
    return <p className="text-center py-10">Producto no encontrado</p>;

  // Renderizar hijo pasando el producto cargado
  return <>{children(product)}</>;
}
