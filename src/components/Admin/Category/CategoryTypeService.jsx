import api from "../config/axiosConfig";

export async function fetchCategoryTypes() {
  const { data } = await api.get('/categories/types');
  return data;
}