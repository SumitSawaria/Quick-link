import axiosInstance from "./axiosInstance";

export const registerApi = async (payload) => {
    const { data } = await axiosInstance.post("/api/auth/register", payload);
    return data;
};

export const loginApi = async (payload) => {
    const { data } = await axiosInstance.post("/api/auth/login", payload);
    return data;
};

export const logoutApi = async () => {
    const { data } = await axiosInstance.post("/api/auth/logout");
    return data;
};

export const meApi = async () => {
    const { data } = await axiosInstance.get("/api/auth/me");
    return data;
};

export const forgotPasswordApi = async (email) => {
    const { data } = await axiosInstance.post("/api/auth/forgot-password", { email });
    return data;
};

export const resetPasswordApi = async ({ token, newPassword }) => {
    const { data } = await axiosInstance.post("/api/auth/reset-password", { token, newPassword });
    return data;
};

export const verifyEmailApi = async (token) => {
    const { data } = await axiosInstance.get(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
    return data;
};

export const updateProfileApi = async (payload) => {
    const { data } = await axiosInstance.put("/api/auth/profile", payload);
    return data;
};

export const changePasswordApi = async (payload) => {
    const { data } = await axiosInstance.post("/api/auth/change-password", payload);
    return data;
};
