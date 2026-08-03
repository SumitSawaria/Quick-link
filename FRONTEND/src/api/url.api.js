import axiosInstance from "./axiosInstance";

export const createPublicShortUrlApi = async ({ url, slug }) => {
    const endpoint = slug ? "/api/custom" : "/api/create";
    const body = slug ? { url, slug } : { url };
    const { data } = await axiosInstance.post(endpoint, body);

    return {
        success: Boolean(data.success),
        shortUrl: data?.data?.shortUrl || data.shortUrl,
        message: data.message || "Short URL created",
    };
};

export const createUserShortUrlApi = async ({ url, slug }) => {
    const { data } = await axiosInstance.post("/api/urls", { url, slug });
    return {
        success: Boolean(data.success),
        shortUrl: data?.data?.shortUrl || data.shortUrl,
        message: data.message || "Short URL created",
    };
};

export const getMyUrlsApi = async (params) => {
    const { data } = await axiosInstance.get("/api/urls/my", { params });
    return data;
};

export const updateUrlAliasApi = async ({ id, slug }) => {
    const { data } = await axiosInstance.patch(`/api/urls/${id}`, { slug });
    return data;
};

export const deleteUrlApi = async (id) => {
    const { data } = await axiosInstance.delete(`/api/urls/${id}`);
    return data;
};

export const getAnalyticsSummaryApi = async () => {
    const { data } = await axiosInstance.get("/api/urls/analytics/summary");
    return data;
};
