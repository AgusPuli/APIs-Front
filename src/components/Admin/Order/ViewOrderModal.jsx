import { useState } from "react";
import {
    FiX,
    FiPackage,
    FiUser,
    FiMail,
    FiCalendar,
    FiTag,
    FiSave,
} from "react-icons/fi";

export default function ViewOrderModal({ order, onClose, onStatusChange }) {
    const [status, setStatus] = useState(order.status);
    const [isSaving, setIsSaving] = useState(false);

    const statusColors = {
        Pendiente:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        Procesando:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        Completado:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        Cancelado:
            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };

    const handleSaveStatus = async () => {
        setIsSaving(true);

        try {
            // 🔧 Aquí podrías hacer un fetch PUT al backend
            // await fetch(`/api/orders/${order.id}/status`, { method: "PUT", body: JSON.stringify({ status }) });

            // Simulación de guardado
            await new Promise((r) => setTimeout(r, 800));

            if (onStatusChange) onStatusChange(order.id, status);
            alert(`Estado del pedido actualizado a "${status}"`);
        } catch (error) {
            console.error("Error al actualizar estado:", error);
            alert("Error al actualizar el estado. Intenta nuevamente.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            Pedido #{order.id}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Creado el {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Info general */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4 space-y-2">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                                <FiUser /> Cliente
                            </div>
                            <p className="text-gray-900 dark:text-white">{order.customer}</p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4 space-y-2">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                                <FiMail /> Email
                            </div>
                            <p className="text-gray-900 dark:text-white break-all">
                                {order.email}
                            </p>
                        </div>

                        {/* Estado editable */}
                        <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4 space-y-2">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                                <FiTag /> Estado
                            </div>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className={`w-full rounded-lg px-3 py-2 text-sm font-semibold border-none focus:ring-2 focus:ring-blue-500 transition appearance-none
    ${statusColors[status]} bg-gray-800 text-white`}
                            >
                                <option value="Pendiente">Pendiente</option>
                                <option value="Procesando">Procesando</option>
                                <option value="Completado">Completado</option>
                                <option value="Cancelado">Cancelado</option>
                            </select>

                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4 space-y-2">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                                <FiCalendar /> Total
                            </div>
                            <p className="text-green-600 dark:text-green-400 text-lg font-bold">
                                ${order.total.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Productos */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                            <FiPackage /> Productos
                        </h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/40 px-4 py-3 rounded-lg"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-gray-900 dark:text-white font-medium">
                                            {item.name}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Cantidad: {item.quantity}
                                        </span>
                                    </div>
                                    <span className="text-gray-900 dark:text-white font-semibold">
                                        ${item.price.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">
                        <button
                            onClick={onClose}
                            className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cerrar
                        </button>
                        <button
                            onClick={handleSaveStatus}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:bg-blue-400"
                        >
                            <FiSave />
                            {isSaving ? "Guardando..." : "Guardar cambios"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
