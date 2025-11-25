import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  applyDiscount,
  previewDiscount,
  removeDiscount,
  setPreview,
  clearPreview
} from "../../store/slices/cartSlice";

export default function DiscountCode() {
  const dispatch = useDispatch();
  const { loading, discount, discountCode, total, preview } = useSelector(
    (state) => state.cart
  );

  const [code, setCode] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  const canSend = code.trim().length >= 3 && !loading && !localLoading;
  const isBusy = loading || localLoading;

  // PREVIEW
  const handlePreview = async () => {
    if (!canSend) return;
    setLocalLoading(true);
    try {
      const result = await dispatch(previewDiscount(code)).unwrap();
      dispatch(setPreview(result));
    } finally {
      setLocalLoading(false);
    }
  };

  // APPLY
  const handleApply = async () => {
    if (!canSend) return;
    setLocalLoading(true);
    try {
      await dispatch(applyDiscount(code)).unwrap();
      dispatch(clearPreview());
      setCode("");
    } finally {
      setLocalLoading(false);
    }
  };

  // REMOVE
  const handleRemove = async () => {
    setLocalLoading(true);
    try {
      await dispatch(removeDiscount()).unwrap();
      dispatch(clearPreview());
      setCode("");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5">

      {/* Input */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            Código de descuento
          </p>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Ej: BLACKFRIDAY"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-blue-500"
          />
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-2 sm:w-auto">
          <button
            onClick={handlePreview}
            disabled={!canSend || isBusy}
            className="px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-blue-500 text-blue-600 disabled:text-gray-400 disabled:border-gray-300"
          >
            Previsualizar
          </button>

          <button
            onClick={handleApply}
            disabled={!canSend || isBusy}
            className="px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500"
          >
            Aplicar
          </button>

          {discountCode && (
            <button
              onClick={handleRemove}
              disabled={isBusy}
              className="px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold text-red-600 border border-red-500 hover:bg-red-50 disabled:opacity-50"
            >
              Quitar
            </button>
          )}
        </div>
      </div>

      {/* PREVIEW */}
      {preview && (
        <div className="mt-4 text-sm p-3 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <p className="font-medium text-blue-700 dark:text-blue-300">
            Vista previa del cupón
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
            {preview.code} - {preview.percentage}% (${preview.discountAmount})
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
            Total estimado: ${preview.total}
          </p>
        </div>
      )}

      {/* CUPÓN APLICADO */}
      {discountCode && !preview && (
        <div className="mt-4 text-sm p-3 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <p className="text-green-700 dark:text-green-400 font-medium">
            Cupón activo: {discountCode}
          </p>
          {discount > 0 && (
            <p className="text-xs text-green-700 dark:text-green-300">
              Ahorro: ${discount.toFixed(2)}
            </p>
          )}
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Total actual: ${total.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}
