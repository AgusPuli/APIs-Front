// src/components/Admin/Discount/api.js
const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

const authHeaders = () => {
  const token = localStorage.getItem("jwt"); // 👈 CAMBIO CLAVE
  console.log("[DISCOUNT] token leído para Authorization:", token?.slice(0, 20), "..."); // debug
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const DiscountAPI = {
  async list() {
    console.log("[DISCOUNT] llamando list()");
    const res = await fetch(`${API}/admin/discounts`, {
      headers: { ...authHeaders() },
    });
    if (!res.ok) throw new Error(`Error ${res.status} al listar cupones`);
    return res.json();
  },
  async create(payload) {
    console.log("[DISCOUNT] llamando create()", payload);
    const res = await fetch(`${API}/admin/discounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async remove(id) {
    console.log("[DISCOUNT] llamando remove()", id);
    const res = await fetch(`${API}/admin/discounts/${id}`, {
      method: "DELETE",
      headers: { ...authHeaders() },
    });
    if (!res.ok) throw new Error(await res.text());
    return true;
  },
};
