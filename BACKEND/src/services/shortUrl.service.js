import { generateNanoId } from "../utils/helper.js";

import {
    deleteUrlByIdForUser,
    getCustomShortUrl,
    getRecentUrls,
    getTopPerformingUrls,
    getUrlByIdForUser,
    getUserUrls,
    getUserUrlStats,
    saveShortUrl,
    updateUrlAlias,
} from "../dao/shortUrl.js";
import { BadRequestError, NotFoundError } from "../utils/errorHandler.js";

const buildAlias = async (slug) => {
    const shortUrl = slug || generateNanoId(7);
    const exists = await getCustomShortUrl(shortUrl);

    if (exists) {
        throw new BadRequestError("This custom URL already exists");
    }

    return shortUrl;
};

export const createShortUrlWithoutUser = async (
    url,
    slug = null
) => {
    const shortUrl = await buildAlias(slug);

    await saveShortUrl(shortUrl, url, null);

    return shortUrl;
};

export const createShortUrlWithUser = async (
    url,
    userId,
    slug = null
) => {
    const shortUrl = await buildAlias(slug);

    await saveShortUrl(shortUrl, url, userId);

    return shortUrl;
};

export const listUserUrls = async (userId, query) => {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
    const search = query.search?.trim() || "";

    const { items, total } = await getUserUrls({
        userId,
        search,
        sortBy,
        sortOrder,
        skip: (page - 1) * limit,
        limit,
    });

    return {
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const updateUserUrlAlias = async (userId, urlId, alias) => {
    if (!alias || !alias.trim()) {
        throw new BadRequestError("Alias is required");
    }

    const existing = await getCustomShortUrl(alias.trim());

    if (existing && existing._id.toString() !== urlId) {
        throw new BadRequestError("Alias already in use");
    }

    const updated = await updateUrlAlias(urlId, userId, alias.trim());

    if (!updated) {
        throw new NotFoundError("URL not found");
    }

    return updated;
};

export const removeUserUrl = async (userId, urlId) => {
    const deleted = await deleteUrlByIdForUser(urlId, userId);

    if (!deleted) {
        throw new NotFoundError("URL not found");
    }
};

export const getDashboardAnalytics = async (userId) => {
    const [summary, topUrls, recentUrls] = await Promise.all([
        getUserUrlStats(userId),
        getTopPerformingUrls(userId, 5),
        getRecentUrls(userId, 10),
    ]);

    const now = Date.now();
    const dayAgo = now - 1000 * 60 * 60 * 24;
    const weekAgo = now - 1000 * 60 * 60 * 24 * 7;

    let dailyClicks = 0;
    let weeklyClicks = 0;

    topUrls.forEach((url) => {
        (url.click_events || []).forEach((ts) => {
            const time = new Date(ts).getTime();
            if (time >= dayAgo) {
                dailyClicks += 1;
            }
            if (time >= weekAgo) {
                weeklyClicks += 1;
            }
        });
    });

    return {
        summary,
        dailyClicks,
        weeklyClicks,
        topUrls,
        recentUrls,
    };
};

export const getSingleUserUrl = async (userId, urlId) => {
    const item = await getUrlByIdForUser(urlId, userId);

    if (!item) {
        throw new NotFoundError("URL not found");
    }

    return item;
};