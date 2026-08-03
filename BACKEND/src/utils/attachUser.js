import { findUserById } from "../dao/user.dao.js";
import { verifyToken } from "./helper.js";

export const attachUser = async (req, res, next) => {

    console.log("Cookies:", req.cookies);

    const token = req.cookies?.accessToken;

    console.log("Token:", token);

    if (!token) return next();

    try {

        const decoded = verifyToken(token);
        console.log("Decoded Token:", decoded);

        const user = await findUserById(decoded.id);
        console.log("User:", user);

        if (!user) return next();

        req.user = user;

        next();

    } catch (error) {
        console.log(error);
        next();
    }
};