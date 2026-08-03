export const normalizeUrl = (value) => {
    const trimmed = value.trim();

    if (!trimmed) {
        return "";
    }

    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }

    return `https://${trimmed}`;
};

export const isValidUrl = (value) => {
    const candidate = normalizeUrl(value);

    if (!candidate) {
        return false;
    }

    try {
        const parsed = new URL(candidate);
        return Boolean(parsed.hostname);
    } catch {
        return false;
    }
};

export const sanitizeSlug = (value) => value.trim().replace(/\s+/g, "-");

export const isValidSlug = (value) => /^[a-zA-Z0-9_-]+$/.test(value);

export const formatDate = (value) =>
    new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));

export const getTodayKey = () => new Date().toDateString();