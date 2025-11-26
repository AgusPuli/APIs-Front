// src/utils/imageUtils.js

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Obtener URL de imagen de producto
 * @param {number} productId - ID del producto
 * @returns {string} URL completa de la imagen
 */
export function getProductImageUrl(productId) {
  if (!productId) return "/placeholder.jpg";
  return `${API_URL}/products/${productId}/image/raw`;
}

/**
 * Handler para error de carga de imagen
 * Fallback a placeholder
 */
export function handleImageError(e) {
  // Evitar loop infinito
  if (e.target.src.includes("placeholder")) return;
  
  e.target.onerror = null;
  e.target.src = "/placeholder.jpg";
}

export default {
  getProductImageUrl,
  handleImageError,
};