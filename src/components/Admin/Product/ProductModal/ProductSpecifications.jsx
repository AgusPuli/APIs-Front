import { useState, useEffect } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";

export default function ProductSpecifications({ specifications, setSpecifications }) {
  const [specList, setSpecList] = useState([]);

  // Inicializar desde specifications
  useEffect(() => {
    const list = Object.entries(specifications || {}).map(([k, v]) => ({
      id: `spec-${k}`,
      key: k,
      value: v,
    }));
    setSpecList(list);
  }, [specifications]);

  const syncToParent = (list) => {
    const newSpecs = {};
    list.forEach((s) => {
      if (s.key.trim()) newSpecs[s.key] = s.value;
    });
    setSpecifications(newSpecs);
  };

  const updateValue = (id, value) => {
    const newList = specList.map((s) => (s.id === id ? { ...s, value } : s));
    setSpecList(newList);
    syncToParent(newList);
  };

  const updateKey = (id, newKey) => {
    const newList = specList.map((s) => (s.id === id ? { ...s, key: newKey } : s));
    setSpecList(newList);
    syncToParent(newList);
  };

  const removeSpec = (id) => {
    const newList = specList.filter((s) => s.id !== id);
    setSpecList(newList);
    syncToParent(newList);
  };

  const addSpec = () => {
    const id = `spec-${Date.now()}`;
    const newList = [...specList, { id, key: "", value: "" }];
    setSpecList(newList);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Especificaciones
      </label>

      <div className="space-y-2">
        {specList.map((spec) => (
          <div key={spec.id} className="flex gap-2">
            <input
              type="text"
              value={spec.key}
              onChange={(e) => updateKey(spec.id, e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Nombre (ej. Pantalla)"
            />
            <input
              type="text"
              value={spec.value}
              onChange={(e) => updateValue(spec.id, e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Valor (ej. 6.1 pulgadas)"
            />
            <button
              type="button"
              onClick={() => removeSpec(spec.id)}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Eliminar especificación"
            >
              <FiTrash size={20} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addSpec}
        className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <FiPlus size={18} /> Agregar Especificación
      </button>
    </div>
  );
}
