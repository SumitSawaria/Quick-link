import urlSchema from "../models/shortUrl.model.js";
import { ConflictError } from "../utils/errorHandler.js";

export const saveShortUrl = async (
    shortUrl,
    longUrl,
    userId
) => {
    try {
        const newUrl = new urlSchema({
            full_url: longUrl,
            short_url: shortUrl,
            user: userId,
        });
        await newUrl.save();
        return newUrl;
    } catch (err) {
        throw new ConflictError(err);
    }
};

export const getshortUrl = async (shorturl) => {
    return await urlSchema
        .findOne({
            short_url: shorturl,
        })
        .populate("user");
};

export const getCustomShortUrl = async (slug) => {
    return await urlSchema.findOne({
        short_url: slug,
    });
};

export const incrementShortUrlClick = async (shorturl) => {
    return await urlSchema.findOneAndUpdate(
        { short_url: shorturl, status: "active" },
        {
            $inc: { clicks: 1 },
            $set: { last_accessed_at: new Date() },
            $push: {
                click_events: {
                    $each: [new Date()],
                    $slice: -500,
                },
            },
        },
        { new: true }
    );
};

export const getUserUrls = async ({ userId, search, sortBy, sortOrder, skip, limit }) => {
    const query = { user: userId };

    if (search) {
        query.$or = [
            { full_url: { $regex: search, $options: "i" } },
            { short_url: { $regex: search, $options: "i" } },
        ];
    }

    const [items, total] = await Promise.all([
        urlSchema
            .find(query)
            .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(limit),
        urlSchema.countDocuments(query),
    ]);

    return { items, total };
};

export const getUrlByIdForUser = async (urlId, userId) => {
    return await urlSchema.findOne({ _id: urlId, user: userId });
};

export const updateUrlAlias = async (urlId, userId, alias) => {
    return await urlSchema.findOneAndUpdate(
        { _id: urlId, user: userId },
        { short_url: alias },
        { new: true }
    );
};

export const deleteUrlByIdForUser = async (urlId, userId) => {
    return await urlSchema.findOneAndDelete({ _id: urlId, user: userId });
};

export const getUserUrlStats = async (userId) => {
    const [summary] = await urlSchema.aggregate([
        { $match: { user: userId } },
        {
            $group: {
                _id: null,
                totalUrls: { $sum: 1 },
                totalClicks: { $sum: "$clicks" },
                activeUrls: {
                    $sum: {
                        $cond: [{ $eq: ["$status", "active"] }, 1, 0],
                    },
                },
                qrCodesGenerated: { $sum: 1 },
            },
        },
    ]);

    return (
        summary || {
            totalUrls: 0,
            totalClicks: 0,
            activeUrls: 0,
            qrCodesGenerated: 0,
        }
    );
};

export const getTopPerformingUrls = async (userId, limit = 5) => {
    return await urlSchema.find({ user: userId }).sort({ clicks: -1 }).limit(limit);
};

export const getRecentUrls = async (userId, limit = 5) => {
    return await urlSchema.find({ user: userId }).sort({ createdAt: -1 }).limit(limit);
};