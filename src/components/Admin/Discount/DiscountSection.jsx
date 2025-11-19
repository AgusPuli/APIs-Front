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

    // Obtener token del localStorage
    const getToken = () => localStorage.getItem("jwt");

    useEffect(() => {
        const token = getToken();
        dispatch(fetchDiscounts(token));
    }, [dispatch]);

    const handleCreate = async (payload) => {
        try {
            const token = getToken();
            await dispatch(createDiscount({ form: payload, token })).unwrap();
            setShowCreate(false);
            // Redux ya actualiza automáticamente la lista
        } catch (e) {
            alert(e || "No se pudo crear el cupón");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cupones</h2>
                <button
                    className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
                    onClick={() => setShowCreate(true)}
                >
                    + Crear cupón
                </button>
            </div>

            {/* Estados */}
            {loading && (
                <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow">Cargando…</div>
            )}
            {error && (
                <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">
                    {error}
                </div>
            )}

            {/* Tabla */}
            {!loading && !error && <DiscountTable discounts={discounts} />}

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
