import express from "express";
import {
    createShortUrl,
    createCustomShortUrl,
    createShortUrlAuth,
    deleteUrl,
    myUrls,
    updateUrl,
    urlAnalyticsSummary,
} from "../controller/shortUrl.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", createShortUrl);
router.post("/custom", createCustomShortUrl);
router.post("/create-auth", requireAuth, createShortUrlAuth);

router.post("/urls", requireAuth, createShortUrlAuth);
router.get("/urls/my", requireAuth, myUrls);
router.patch("/urls/:id", requireAuth, updateUrl);
router.delete("/urls/:id", requireAuth, deleteUrl);
router.get("/urls/analytics/summary", requireAuth, urlAnalyticsSummary);

export default router;