import { findUserById } from "../dao/user.dao.js";
import { UnauthorizedError } from "../utils/errorHandler.js";
import { verifyToken } from "../utils/helper.js";

export const optionalAuth = async (req, res, next) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        return next();
    }

    try {
        const decoded = verifyToken(token);
        const user = await findUserById(decoded.id);

        if (user) {
            req.user = user;
        }

        return next();
    } catch {
        return next();
    }
};

export const requireAuth = async (req, res, next) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        return next(new UnauthorizedError("Authentication required"));
    }

    try {
        const decoded = verifyToken(token);
        const user = await findUserById(decoded.id);

        if (!user) {
            return next(new UnauthorizedError("Invalid session"));
        }

        req.user = user;
        return next();
    } catch {
        return next(new UnauthorizedError("Invalid or expired token"));
    }
};