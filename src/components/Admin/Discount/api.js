// src/components/Admin/Discount/api.js
const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

const authHeaders = () => {
  const token = localStorage.getItem("jwt");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const DiscountAPI = {
  async list() {
    const res = await fetch(`${API}/admin/discounts`, {
      headers: { ...authHeaders() },
    });
    if (!res.ok) throw new Error(`Error ${res.status} al listar cupones`);
    return res.json();
  },

  async create(payload) {
    // Estructura esperada por el backend:
    // {
    //   code: string,
    //   percentage: number,
    //   active: boolean,
    //   startsAt: string (ISO date),
    //   endsAt: string (ISO date)
    // }
    const res = await fetch(`${API}/admin/discounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Error ${res.status} al crear cupón`);
    }
    return res.json();
  },
};
