import api from "../../services/api";

export const createOrderAPI = async (orderData) => {
  const response = await api.post("/api/orders", orderData);
  return response.data;
};

export const fetchMyOrdersAPI = async () => {
  const response = await api.get("/api/orders/myorders");
  return response.data;
};

export const fetchAllOrdersAPI = async () => {
  const response = await api.get("/api/orders/allorders");
  return response.data;
};

export const updateOrderStatusAPI = async (orderId, statusData) => {
  const response = await api.put(`/api/orders/${orderId}/status`, statusData);
  return response.data;
};

export const fetchOrderByIdAPI = async (orderId) => {
  const response = await api.get(`/api/orders/${orderId}`);
  return response.data;
};

export const deleteOrderAPI = async (orderId) => {
  const response = await api.delete(`/api/orders/${orderId}`);
  return response.data;
};
