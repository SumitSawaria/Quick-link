import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./src/config/mongo.config.js";
import auth_routes from "./src/routes/auth.routes.js";
import shortUrlRoutes from "./src/routes/shortUrl.route.js";
import { redirectFromShortUrl } from "./src/controller/shortUrl.controller.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import { optionalAuth } from "./src/middleware/auth.middleware.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "https://quick-link-lake.vercel.app",
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(optionalAuth);

app.use("/api/auth", auth_routes);
app.use("/api", shortUrlRoutes);

app.get("/:shorturl", redirectFromShortUrl);

app.use(errorHandler);

app.listen(3000, () => {
    connectDB();
    console.log("Server is running on http://localhost:3000");
});
