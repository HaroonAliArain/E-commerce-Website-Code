import api from "../../services/api";

export const fetchAllProducts = async () => {
    const response = await api.get("/api/products"); 
    return response.data;
};

export const fetchProductById = async (productId) => {
    const response = await api.get(`/api/products/${productId}`);
    return response.data;
};

export const searchProducts = async (keyword) => {
    const response = await api.get(`/api/products/search?keyword=${keyword}`);
    return response.data;
};
