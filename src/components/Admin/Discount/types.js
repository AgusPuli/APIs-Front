// src/components/Admin/Discount/types.js
export const DEFAULT_DISCOUNT = {
  code: "",
  type: "percentage", // 'percentage' | 'fixed'
  amount: 10,
  minOrder: 0,
  startDate: "",
  endDate: "",
  usageLimit: undefined,
  perUserLimit: undefined,
  active: true,
};

export function validateDiscount(d) {
  const e = {};
  if (!d.code || d.code.trim().length < 3) e.code = "Código mínimo 3 caracteres";
  if (!["percentage", "fixed"].includes(d.type)) e.type = "Tipo inválido";
  if (d.type === "percentage") {
    if (d.amount <= 0 || d.amount > 100) e.amount = "Porcentaje 1–100";
  } else if (d.amount <= 0) e.amount = "Monto > 0";
  if (d.startDate && d.endDate && d.startDate > d.endDate) e.endDate = "Rango inválido";
  return e;
}
