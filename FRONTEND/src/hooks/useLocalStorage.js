import { useEffect, useState } from "react";

const getStoredValue = (key, initialValue) => {
    if (typeof window === "undefined") {
        return initialValue;
    }

    try {
        const stored = window.localStorage.getItem(key);
        return stored ? JSON.parse(stored) : initialValue;
    } catch {
        return initialValue;
    }
};

export const useLocalStorage = (key, initialValue) => {
    const [value, setValue] = useState(() => getStoredValue(key, initialValue));

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // Ignore storage failures.
        }
    }, [key, value]);

    return [value, setValue];
};