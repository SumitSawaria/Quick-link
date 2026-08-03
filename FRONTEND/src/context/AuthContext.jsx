/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
    changePasswordApi,
    forgotPasswordApi,
    loginApi,
    logoutApi,
    meApi,
    registerApi,
    resetPasswordApi,
    updateProfileApi,
    verifyEmailApi,
} from "../api/auth.api";

const AuthContext = createContext(null);
const AUTH_STATE_KEY = "url-shortener-auth-state";

const readStoredUser = () => {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const raw = window.localStorage.getItem(AUTH_STATE_KEY);
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw);
        return parsed?.user || null;
    } catch {
        return null;
    }
};

const persistUser = (user) => {
    if (typeof window === "undefined") {
        return;
    }

    if (!user) {
        window.localStorage.removeItem(AUTH_STATE_KEY);
        return;
    }

    window.localStorage.setItem(AUTH_STATE_KEY, JSON.stringify({ user }));
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => readStoredUser());
    const [isBootstrapping, setIsBootstrapping] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const bootstrap = async () => {
            setIsBootstrapping(true);

            try {
                const response = await meApi();
                const nextUser = response.user || null;

                if (!isMounted) {
                    return;
                }

                setUser(nextUser);
                persistUser(nextUser);
            } catch {
                if (isMounted) {
                    setUser(null);
                    persistUser(null);
                }
            } finally {
                if (isMounted) {
                    setIsBootstrapping(false);
                }
            }
        };

        void bootstrap();

        return () => {
            isMounted = false;
        };
    }, []);

    const register = useCallback(async (payload) => {
        const data = await registerApi(payload);
        setUser(data.user);
        persistUser(data.user);
        return data;
    }, []);

    const login = useCallback(async (payload) => {
        const data = await loginApi(payload);
        setUser(data.user);
        persistUser(data.user);
        return data;
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutApi();
        } finally {
            setUser(null);
            persistUser(null);
        }
    }, []);

    const refreshUser = useCallback(async () => {
        const data = await meApi();
        setUser(data.user);
        persistUser(data.user);
        return data.user;
    }, []);

    const forgotPassword = useCallback(async (email) => {
        return await forgotPasswordApi(email);
    }, []);

    const resetPassword = useCallback(async (payload) => {
        return await resetPasswordApi(payload);
    }, []);

    const verifyEmail = useCallback(async (token) => {
        const data = await verifyEmailApi(token);
        const nextUser = data.user || null;
        setUser(nextUser);
        persistUser(nextUser);
        return data;
    }, []);

    const updateProfile = useCallback(async (payload) => {
        const data = await updateProfileApi(payload);
        setUser(data.user);
        persistUser(data.user);
        return data;
    }, []);

    const changePassword = useCallback(async (payload) => {
        const data = await changePasswordApi(payload);
        setUser(null);
        return data;
    }, []);

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: Boolean(user),
            isBootstrapping,
            register,
            login,
            logout,
            refreshUser,
            forgotPassword,
            resetPassword,
            verifyEmail,
            updateProfile,
            changePassword,
        }),
        [
            user,
            isBootstrapping,
            register,
            login,
            logout,
            refreshUser,
            forgotPassword,
            resetPassword,
            verifyEmail,
            updateProfile,
            changePassword,
        ]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuthContext must be used within AuthProvider");
    }

    return context;
};
