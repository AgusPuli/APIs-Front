// src/components/Admin/Discount/DiscountSection.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDiscounts, createDiscount } from "../../../store/slices/discountSlice";
import DiscountTable from "./DiscountTable";
import CreateDiscountModal from "./CreateDiscountModal";

export default function DiscountSection() {
    const dispatch = useDispatch();
    const { list: discounts, loading, error } = useSelector((state) => state.discounts);
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => {
        dispatch(fetchDiscounts());
    }, [dispatch]);

    const handleCreate = async (payload) => {
        try {
            console.log("📤 DiscountSection sending payload:", payload);
            await dispatch(createDiscount(payload)).unwrap();
            console.log("✅ Discount created in DiscountSection");
            setShowCreate(false);
        } catch (e) {
            console.error("❌ Error in DiscountSection:", e);
            alert(e || "No se pudo crear el cupón");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cupones</h2>
                <button
                    className="px-4 py-2 rounded-lg bg-black dark:bg-blue-600 text-white hover:opacity-90 transition-opacity"
                    onClick={() => setShowCreate(true)}
                >
                    + Crear cupón
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                    {error}
                </div>
            )}

            {/* Tabla - SIN PROPS, usa Redux internamente */}
            <DiscountTable />

            {/* Modal crear */}
            {showCreate && (
                <CreateDiscountModal
                    onClose={() => setShowCreate(false)}
                    onSave={handleCreate}
                />
            )}
        </div>
    );
}