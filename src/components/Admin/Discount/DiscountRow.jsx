// src/components/Admin/Discount/DiscountRow.jsx
export default function DiscountRow({ discount }) {
    const { code, percentage, active, startsAt, endsAt } = discount;

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-AR");
    };

    return (
        <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{code}</td>
            <td className="px-6 py-3">{percentage}%</td>
            <td className="px-6 py-3">
                {active ? (
                    <span className="text-green-600 font-medium">Activo</span>
                ) : (
                    <span className="text-red-600 font-medium">Inactivo</span>
                )}
            </td>
            <td className="px-6 py-3">{formatDate(startsAt)}</td>
            <td className="px-6 py-3">{formatDate(endsAt)}</td>
        </tr>
    );
}

