import api from "../../services/api";

export const loginUser = async (loginData) => {
    const response = await api.post("/api/auth/login", loginData);
    return response.data;
};

export const registerUser = async (registerData) => {
    const response = await api.post("/api/auth/register", registerData);
    return response.data;
}

export const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");

    const response = await api.get("/api/users/profile", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};
