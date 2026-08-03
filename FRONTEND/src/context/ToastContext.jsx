/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const pushToast = useCallback(({ type = "success", title, message }) => {
        setToast({
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            type,
            title,
            message,
        });
    }, []);

    const closeToast = useCallback(() => {
        setToast(null);
    }, []);

    const value = useMemo(
        () => ({ pushToast, closeToast }),
        [pushToast, closeToast]
    );

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Toast toast={toast} onClose={closeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }

    return context;
};
