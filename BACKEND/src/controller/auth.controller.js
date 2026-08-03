import wrapAsync from "../utils/tryCatchWrapper.js";
import {
    changePassword,
    createPasswordResetToken,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    resetPassword,
    updateProfile,
    verifyEmailToken,
} from "../services/auth.service.js";
import { accessCookieOptions, refreshCookieOptions } from "../config/config.js";

const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
};

const clearAuthCookies = (res) => {
    res.clearCookie("accessToken", accessCookieOptions);
    res.clearCookie("refreshToken", refreshCookieOptions);
};

export const register_user = wrapAsync(async (req, res) => {
    const { name, email, password } = req.body;

    const { accessToken, refreshToken, user, emailVerificationToken } = await registerUser({
        name,
        email,
        password,
    });

    setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({
        success: true,
        message: "Registration Successful",
        user,
        verification: {
            emailVerificationRequired: true,
            token: emailVerificationToken,
        },
    });
});

export const login_user = wrapAsync(async (req, res) => {
    const { email, password } = req.body;

    const { accessToken, refreshToken, user } = await loginUser({ email, password });

    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
        success: true,
        message: "Login Success",
        user,
    });
});

export const logout_user = wrapAsync(async (req, res) => {
    if (req.user?._id) {
        await logoutUser(req.user._id);
    }

    clearAuthCookies(res);

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

export const me = wrapAsync(async (req, res) => {
    const user = await getCurrentUser(req.user._id);

    res.status(200).json({
        success: true,
        user,
    });
});

export const refresh = wrapAsync(async (req, res) => {
    const token = req.cookies?.refreshToken;

    const { accessToken, refreshToken, user } = await refreshAccessToken(token);

    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
        success: true,
        message: "Token refreshed",
        user,
    });
});

export const forgot_password = wrapAsync(async (req, res) => {
    const { email } = req.body;
    const resetToken = await createPasswordResetToken(email);

    res.status(200).json({
        success: true,
        message: "If the email exists, a reset link has been generated",
        resetToken,
    });
});

export const reset_password = wrapAsync(async (req, res) => {
    const { token, newPassword } = req.body;

    await resetPassword({ token, newPassword });

    res.status(200).json({
        success: true,
        message: "Password reset successful",
    });
});

export const verify_email = wrapAsync(async (req, res) => {
    const { token } = req.query;
    const user = await verifyEmailToken(token);

    res.status(200).json({
        success: true,
        message: "Email verified successfully",
        user,
    });
});

export const update_profile = wrapAsync(async (req, res) => {
    const { name, avatar } = req.body;
    const user = await updateProfile(req.user._id, { name, avatar });

    res.status(200).json({
        success: true,
        message: "Profile updated",
        user,
    });
});

export const change_password = wrapAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    await changePassword(req.user._id, { currentPassword, newPassword });
    clearAuthCookies(res);

    res.status(200).json({
        success: true,
        message: "Password changed successfully. Please login again.",
    });
});