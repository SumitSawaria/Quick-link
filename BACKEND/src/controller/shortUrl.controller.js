import { getshortUrl, incrementShortUrlClick } from "../dao/shortUrl.js";
import {
    getDashboardAnalytics,
    listUserUrls,
    createShortUrlWithoutUser,
    createShortUrlWithUser,
    removeUserUrl,
    updateUserUrlAlias,
} from "../services/shortUrl.service.js";

import wrapAsync from "../utils/tryCatchWrapper.js";

// Create Short URL (Public)
export const createShortUrl = wrapAsync(async (req, res) => {
    const { url } = req.body;

    const shortUrl = await createShortUrlWithoutUser(url);

    res.status(200).json({
        success: true,
        shortUrl: `${process.env.APP_URL}/${shortUrl}`,
    });
});

// Create Custom Short URL
export const createCustomShortUrl = wrapAsync(async (req, res) => {
    const { url, slug } = req.body;

    const shortUrl = await createShortUrlWithoutUser(url, slug);

    res.status(200).json({
        success: true,
        shortUrl: `${process.env.APP_URL}/${shortUrl}`,
    });
});

// Create Short URL (Authenticated User)
export const createShortUrlAuth = wrapAsync(async (req, res) => {
    const { url, slug } = req.body;
    const userId = req.user?._id;

    const shortUrl = await createShortUrlWithUser(url, userId, slug);

    res.status(200).json({
        success: true,
        shortUrl: `${process.env.APP_URL}/${shortUrl}`,
    });
});

// Redirect to Original URL
export const redirectFromShortUrl = wrapAsync(async (req, res) => {
    const { shorturl } = req.params;

    const url = await incrementShortUrlClick(shorturl);

    if (!url) {
        return res.status(404).json({
            success: false,
            message: "Short URL Not Found",
        });
    }

    res.redirect(url.full_url);
});

export const myUrls = wrapAsync(async (req, res) => {
    const data = await listUserUrls(req.user._id, req.query);

    res.status(200).json({
        success: true,
        ...data,
    });
});

export const updateUrl = wrapAsync(async (req, res) => {
    const updated = await updateUserUrlAlias(req.user._id, req.params.id, req.body.slug);

    res.status(200).json({
        success: true,
        message: "Alias updated successfully",
        item: updated,
    });
});

export const deleteUrl = wrapAsync(async (req, res) => {
    await removeUserUrl(req.user._id, req.params.id);

    res.status(200).json({
        success: true,
        message: "URL deleted successfully",
    });
});

export const urlAnalyticsSummary = wrapAsync(async (req, res) => {
    const analytics = await getDashboardAnalytics(req.user._id);

    res.status(200).json({
        success: true,
        data: analytics,
    });
});
