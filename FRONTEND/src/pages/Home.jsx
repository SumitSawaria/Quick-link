import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FiAlertCircle, FiClock, FiSearch } from "react-icons/fi";
import Navbar from "../components/Navbar";
import UrlForm from "../components/UrlForm";
import ResultCard from "../components/ResultCard";
import QRCodeCard from "../components/QRCodeCard";
import Loading from "../components/Loading";
import Toast from "../components/Toast";
import StatsCard from "../components/StatsCard";
import HistoryCard from "../components/HistoryCard";
import Footer from "../components/Footer";
import { createShortUrl } from "../api/shortUrl.api";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useTheme } from "../hooks/useTheme";
import {
    formatDate,
    getTodayKey,
    isValidSlug,
    isValidUrl,
    normalizeUrl,
    sanitizeSlug,
} from "../utils/url";
import { shareUrl } from "../utils/share";

const createToastId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const Home = () => {
    const { theme, toggleTheme } = useTheme();
    const [formValues, setFormValues] = useState({ url: "", slug: "" });
    const [formErrors, setFormErrors] = useState({});
    const [result, setResult] = useState(null);
    const [history, setHistory] = useLocalStorage("short-url-history", []);
    const [search, setSearch] = useState("");
    const [toast, setToast] = useState(null);
    const deferredSearch = useDeferredValue(search);

    const mutation = useMutation({
        mutationFn: createShortUrl,
        onSuccess: (response) => {
            const createdAt = new Date().toISOString();
            const shortUrl = response.shortUrl;
            const originalUrl = normalizeUrl(formValues.url);
            const historyItem = {
                id: crypto.randomUUID ? crypto.randomUUID() : createToastId(),
                originalUrl,
                shortUrl,
                slug: formValues.slug.trim(),
                createdAt,
            };

            setResult(historyItem);
            setHistory((currentHistory) => [historyItem, ...currentHistory].slice(0, 10));
            setToast({
                id: createToastId(),
                type: "success",
                title: "Short URL created",
                message: response.message || "Your link is ready to use.",
            });
        },
        onError: (error) => {
            setToast({
                id: createToastId(),
                type: "error",
                title: "Unable to create URL",
                message: error?.message || "Something went wrong.",
            });
        },
    });

    useEffect(() => {
        if (!toast) {
            return undefined;
        }

        const timer = window.setTimeout(() => setToast(null), 3500);
        return () => window.clearTimeout(timer);
    }, [toast]);

    const filteredHistory = useMemo(() => {
        const query = deferredSearch.trim().toLowerCase();

        if (!query) {
            return history;
        }

        return history.filter((item) => {
            return [item.originalUrl, item.shortUrl, item.slug, formatDate(item.createdAt)]
                .join(" ")
                .toLowerCase()
                .includes(query);
        });
    }, [deferredSearch, history]);

    const stats = useMemo(() => {
        const todayKey = getTodayKey();

        return {
            totalCount: history.length,
            todayCount: history.filter((item) => new Date(item.createdAt).toDateString() === todayKey).length,
            historyCount: history.length,
        };
    }, [history]);

    const setField = (name, value) => {
        setFormValues((current) => ({ ...current, [name]: value }));
        setFormErrors((current) => ({ ...current, [name]: "" }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        const nextValue = name === "slug" ? sanitizeSlug(value) : value;
        setField(name, nextValue);
    };

    const validate = useCallback(() => {
        const nextErrors = {};
        const normalizedUrl = normalizeUrl(formValues.url);
        const trimmedSlug = formValues.slug.trim();

        if (!normalizedUrl || !isValidUrl(formValues.url)) {
            nextErrors.url = "Enter a valid URL before generating a short link.";
        }

        if (trimmedSlug && !isValidSlug(trimmedSlug)) {
            nextErrors.slug = "Use only letters, numbers, underscores, or hyphens.";
        }

        setFormErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }, [formValues.slug, formValues.url]);

    const handleSubmit = useCallback(async (event) => {
        event?.preventDefault?.();

        if (!validate()) {
            return;
        }

        mutation.mutate({
            url: normalizeUrl(formValues.url),
            slug: formValues.slug.trim() || undefined,
        });
    }, [formValues.slug, formValues.url, mutation, validate]);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.ctrlKey && event.key === "Enter") {
                event.preventDefault();
                handleSubmit(event);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [handleSubmit]);

    const copyToClipboard = async (value) => {
        try {
            await navigator.clipboard.writeText(value);
            setToast({
                id: createToastId(),
                type: "success",
                title: "Copied to clipboard",
                message: value,
            });
        } catch {
            setToast({
                id: createToastId(),
                type: "error",
                title: "Copy failed",
                message: "Your browser blocked clipboard access.",
            });
        }
    };

    const openUrl = (value) => {
        window.open(value, "_blank", "noopener,noreferrer");
    };

    const handleShare = async (value) => {
        try {
            const usedNativeShare = await shareUrl({
                title: "Short URL",
                text: "Check out this short URL",
                url: value,
            });

            setToast({
                id: createToastId(),
                type: "success",
                title: usedNativeShare ? "Shared successfully" : "Copied for sharing",
                message: value,
            });
        } catch {
            setToast({
                id: createToastId(),
                type: "error",
                title: "Share unavailable",
                message: "Your browser does not support sharing.",
            });
        }
    };

    const handleDeleteHistoryItem = (id) => {
        setHistory((currentHistory) => currentHistory.filter((item) => item.id !== id));
        setToast({
            id: createToastId(),
            type: "success",
            title: "History item deleted",
            message: "The entry was removed from local storage.",
        });
    };

    const handleDeleteAll = () => {
        setHistory([]);
        setToast({
            id: createToastId(),
            type: "success",
            title: "History cleared",
            message: "All saved URLs have been removed.",
        });
    };

    const openHistoryQr = (item) => {
        setResult(item);
        setToast({
            id: createToastId(),
            type: "info",
            title: "QR ready",
            message: "The selected URL is loaded in the QR panel.",
        });
        document.getElementById("qr-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    return (
        <div className="min-h-screen text-slate-100">
            <Navbar theme={theme} onToggleTheme={toggleTheme} />
            <Toast toast={toast} onClose={() => setToast(null)} />

            <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_30%)]" />
                        <div className="glow-orb glow-pulse pointer-events-none absolute left-6 top-6 h-28 w-28 rounded-full bg-cyan-400/25 blur-3xl" />
                        <div className="glow-orb pointer-events-none absolute right-10 top-20 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />

                        <div className="relative space-y-6">
                            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100">
                                <FiClock className="h-4 w-4" /> Fast, beautiful, and persistent
                            </span>
                            <div className="max-w-3xl space-y-4">
                                <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                                    Shorten. Customize. Share.
                                </h1>
                                <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                                    Create clean short URLs, optionally choose a custom slug, generate QR codes, copy instantly, and keep your last 10 links stored locally.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="glass-panel rounded-3xl p-4">
                                    <p className="text-sm font-semibold text-slate-100">Ctrl + Enter</p>
                                    <p className="mt-2 text-sm text-slate-300">Keyboard shortcut for fast generation.</p>
                                </div>
                                <div className="glass-panel rounded-3xl p-4">
                                    <p className="text-sm font-semibold text-slate-100">Theme persistence</p>
                                    <p className="mt-2 text-sm text-slate-300">Dark mode saves automatically in localStorage.</p>
                                </div>
                                <div className="glass-panel rounded-3xl p-4">
                                    <p className="text-sm font-semibold text-slate-100">Responsive UI</p>
                                    <p className="mt-2 text-sm text-slate-300">Glassmorphism layout that scales cleanly on mobile.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <UrlForm
                            values={formValues}
                            errors={formErrors}
                            isSubmitting={mutation.isPending}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            onKeyDown={(event) => {
                                if (event.ctrlKey && event.key === "Enter") {
                                    event.preventDefault();
                                    handleSubmit(event);
                                }
                            }}
                        />
                        {mutation.isPending ? <Loading label="Creating your short URL" /> : null}
                    </div>
                </section>

                <section className="mt-8 grid gap-5">
                    <StatsCard {...stats} />
                    {result ? (
                        <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]" id="qr-section">
                            <ResultCard
                                result={result}
                                onCopy={copyToClipboard}
                                onOpen={openUrl}
                                onShare={handleShare}
                            />
                            <QRCodeCard
                                url={result.shortUrl}
                                onCopy={copyToClipboard}
                                onShare={handleShare}
                                onNotify={setToast}
                            />
                        </div>
                    ) : (
                        <div className="glass-panel rounded-4xl p-6 text-slate-300">
                            <div className="flex items-start gap-3">
                                <FiAlertCircle className="mt-1 h-5 w-5 text-cyan-200" />
                                <div>
                                    <h2 className="text-lg font-bold text-white">Your result will appear here</h2>
                                    <p className="mt-1 text-sm leading-6 text-slate-300">
                                        Create a short URL to reveal the success card, QR code, sharing actions, and local history entry.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                <section className="mt-10 space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Recent URLs</h2>
                            <p className="mt-1 text-sm text-slate-300">Search, copy, open, or delete from your local history.</p>
                        </div>

                        <div className="flex flex-col gap-3 sm:min-w-[20rem] sm:flex-row sm:items-center">
                            <label className="relative flex-1">
                                <span className="sr-only">Search history</span>
                                <FiSearch className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search history"
                                    className="glass-input pl-12"
                                    aria-label="Search previous shortened URLs"
                                />
                            </label>
                            <button
                                type="button"
                                onClick={handleDeleteAll}
                                className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/15"
                                aria-label="Delete all history"
                            >
                                Delete all
                            </button>
                        </div>
                    </div>

                    {filteredHistory.length ? (
                        <div className="space-y-4">
                            {filteredHistory.map((item) => (
                                <HistoryCard
                                    key={item.id}
                                    item={item}
                                    onCopy={copyToClipboard}
                                    onShowQr={openHistoryQr}
                                    onDelete={handleDeleteHistoryItem}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="glass-panel rounded-4xl p-6 text-slate-300">
                            <p className="text-sm">
                                {search ? "No matching history entries were found." : "Your last 10 shortened URLs will appear here."}
                            </p>
                        </div>
                    )}
                </section>

                <section className="mt-10 grid gap-5 lg:grid-cols-2">
                    <div className="glass-panel rounded-4xl p-6">
                        <h2 className="text-2xl font-bold text-white">Accessibility and performance</h2>
                        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                            <li>Keyboard accessible controls with ARIA labels and semantic form structure.</li>
                            <li>React Query mutation for the URL create flow with normalized error handling.</li>
                            <li>Memoized calculations for history search and statistics.</li>
                            <li>Lazy-loaded route for the About page to keep the app shell light.</li>
                        </ul>
                    </div>

                    <div className="glass-panel rounded-4xl p-6">
                        <h2 className="text-2xl font-bold text-white">Backend contract</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                            The frontend uses <span className="font-semibold text-white">POST /api/create</span> for random slugs and{' '}
                            <span className="font-semibold text-white">POST /api/custom</span> when you enter a custom code.
                            No backend change is required for the current API. If your backend later wraps the response as 
                            <span className="font-semibold text-white">{`{ data: { shortUrl } }`}</span>, the client already supports it.
                        </p>
                    </div>
                </section>

                {mutation.isPending ? (
                    <div className="mt-8">
                        <Loading label="Building your link" />
                    </div>
                ) : null}
            </main>

            <Footer />
        </div>
    );
};

export default Home;