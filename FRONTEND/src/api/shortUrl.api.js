import axiosInstance from "./axiosInstance";

const unwrapResponse = (payload) => {
    const root = payload?.data ?? payload ?? {};

    return {
        success: Boolean(root.success),
        message: root.message || "Short URL created",
        shortUrl: root?.data?.shortUrl || root.shortUrl || "",
    };
};

export const createShortUrl = async ({ url, slug }) => {
    const endpoint = slug ? "/api/custom" : "/api/create";
    const body = slug ? { url, slug } : { url };

    const { data } = await axiosInstance.post(endpoint, body);
    return unwrapResponse(data);
};
