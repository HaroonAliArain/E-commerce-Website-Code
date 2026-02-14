import api from "../../services/api";

export const fetchAllCategories = async () => {
  const response = await api.get("/api/categories/all"); 
  return response.data; 
};

export const createCategory = async (name) => {
  const response = await api.post("/api/categories", { name });
  return response.data; 
};

export const updateCategory = async (id, name) => {
  const response = await api.put(`/api/categories/${id}`, { name });
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/api/categories/${id}`);
  return response.data;
};
