import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import {
    createUser,
    findUserByEmail,
    findUserById,
    updateUserById,
} from "../dao/user.dao.js";
import {
    BadRequestError,
    ConflictError,
    UnauthorizedError,
} from "../utils/errorHandler.js";
import {
    createRandomToken,
    hashToken,
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from "../utils/helper.js";

const sanitizeUser = (user) => {
    const json = user.toObject ? user.toObject() : user;
    delete json.password;
    delete json.refreshTokenHash;
    delete json.resetPasswordTokenHash;
    delete json.resetPasswordExpiresAt;
    delete json.emailVerificationTokenHash;
    delete json.emailVerificationExpiresAt;
    return json;
};

const createSessionTokens = async (user) => {
    const accessToken = signAccessToken({ id: user._id.toString() });
    const refreshToken = signRefreshToken({ id: user._id.toString() });
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await updateUserById(user._id, { refreshTokenHash });

    return { accessToken, refreshToken };
};

export const registerUser = async ({ name, email, password }) => {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new ConflictError("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const emailVerificationToken = createRandomToken();
    const emailVerificationTokenHash = hashToken(emailVerificationToken);

    const newUser = await createUser({
        name,
        email,
        password: passwordHash,
        emailVerificationTokenHash,
        emailVerificationExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    const tokens = await createSessionTokens(newUser);

    return {
        ...tokens,
        user: sanitizeUser(newUser),
        emailVerificationToken,
    };
};

export const loginUser = async ({ email, password }) => {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new UnauthorizedError("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid credentials");
    }

    const tokens = await createSessionTokens(user);

    return {
        ...tokens,
        user: sanitizeUser(user),
    };
};

export const logoutUser = async (userId) => {
    await updateUserById(userId, { refreshTokenHash: null });
};

export const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new UnauthorizedError("Refresh token missing");
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await findUserById(decoded.id);

    if (!user || !user.refreshTokenHash) {
        throw new UnauthorizedError("Invalid refresh token");
    }

    const tokenMatches = await bcrypt.compare(refreshToken, user.refreshTokenHash);

    if (!tokenMatches) {
        throw new UnauthorizedError("Invalid refresh token");
    }

    const tokens = await createSessionTokens(user);

    return {
        ...tokens,
        user: sanitizeUser(user),
    };
};

export const getCurrentUser = async (userId) => {
    const user = await findUserById(userId);

    if (!user) {
        throw new UnauthorizedError("User not found");
    }

    return sanitizeUser(user);
};

export const updateProfile = async (userId, { name, avatar }) => {
    const user = await updateUserById(userId, {
        ...(name ? { name } : {}),
        ...(avatar ? { avatar } : {}),
    });

    return sanitizeUser(user);
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
    const user = await findUserById(userId);

    if (!user) {
        throw new UnauthorizedError("User not found");
    }

    const matches = await bcrypt.compare(currentPassword, user.password);

    if (!matches) {
        throw new UnauthorizedError("Current password is incorrect");
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await updateUserById(userId, { password: passwordHash, refreshTokenHash: null });
};

export const createPasswordResetToken = async (email) => {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const resetToken = createRandomToken();
    const resetPasswordTokenHash = hashToken(resetToken);

    await updateUserById(user._id, {
        resetPasswordTokenHash,
        resetPasswordExpiresAt: new Date(Date.now() + 1000 * 60 * 30),
    });

    return resetToken;
};

export const resetPassword = async ({ token, newPassword }) => {
    const tokenHash = hashToken(token);

    const foundUser = await User.findOne({
        resetPasswordTokenHash: tokenHash,
        resetPasswordExpiresAt: { $gt: new Date() },
    });

    if (!foundUser) {
        throw new BadRequestError("Reset token is invalid or expired");
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    foundUser.password = passwordHash;
    foundUser.resetPasswordTokenHash = null;
    foundUser.resetPasswordExpiresAt = null;
    foundUser.refreshTokenHash = null;
    await foundUser.save();
};

export const verifyEmailToken = async (token) => {
    const tokenHash = hashToken(token);
    const user = await User.findOne({
        emailVerificationTokenHash: tokenHash,
        emailVerificationExpiresAt: { $gt: new Date() },
    });

    if (!user) {
        throw new BadRequestError("Email verification token is invalid or expired");
    }

    user.isEmailVerified = true;
    user.emailVerificationTokenHash = null;
    user.emailVerificationExpiresAt = null;
    await user.save();

    return sanitizeUser(user);
};