import { useQuery } from "@tanstack/react-query";
import { useDeferredValue, useMemo, useState } from "react";
import { ArrowUpRight, BarChart3, Clock3, Rocket, ShieldCheck } from "lucide-react";
import SectionHeader from "../components/common/SectionHeader";
import StatsGrid from "../components/dashboard/StatsGrid";
import Pagination from "../components/dashboard/Pagination";
import UrlTable from "../components/dashboard/UrlTable";
import { getAnalyticsSummaryApi } from "../api/url.api";
import { useToast } from "../context/ToastContext";
import Loading from "../components/Loading";
import { downloadQrAsPng } from "../utils/qr";
import { useAuth } from "../hooks/useAuth";

const PAGE_SIZE = 5;

const Dashboard = () => {
    const { user } = useAuth();
    const { pushToast } = useToast();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const deferredSearch = useDeferredValue(search);
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["dashboard-analytics"],
        queryFn: getAnalyticsSummaryApi,
    });

    const summary = data?.data?.summary || {};

    const recent = useMemo(
        () =>
            (data?.data?.recentUrls || []).map((item) => ({
                ...item,
                short_url_full: `${window.location.origin}/${item.short_url}`,
            })),
        [data?.data?.recentUrls]
    );

    const filteredRecent = useMemo(() => {
        const query = deferredSearch.trim().toLowerCase();

        if (!query) {
            return recent;
        }

        return recent.filter((item) => [item.full_url, item.short_url, item.status, String(item.clicks)].join(" ").toLowerCase().includes(query));
    }, [deferredSearch, recent]);

    const paginatedRecent = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredRecent.slice(start, start + PAGE_SIZE);
    }, [filteredRecent, page]);

    const quickStats = [
        { label: "Active URLs", value: summary.activeUrls ?? 0, icon: ShieldCheck, tone: "text-emerald-200" },
        { label: "QR Codes", value: summary.qrCodesGenerated ?? 0, icon: BarChart3, tone: "text-cyan-200" },
        { label: "Recent Clicks", value: data?.data?.weeklyClicks ?? 0, icon: Clock3, tone: "text-sky-200" },
        { label: "Launch Ready", value: "SaaS", icon: Rocket, tone: "text-violet-200" },
    ];

    if (isLoading) {
        return <Loading label="Loading dashboard" />;
    }

    return (
        <div className="space-y-6">
            <section className="glass-panel overflow-hidden rounded-[2rem] p-6 sm:p-8">
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div className="space-y-4">
                        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Dashboard</p>
                        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                            Welcome back, {user?.name || "creator"}.
                        </h1>
                        <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                            Monitor short-link performance, review recent activity, and manage your growth workflow from one polished workspace.
                        </p>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <button type="button" onClick={() => refetch()} className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,#22d3ee,#0ea5e9,#34d399)] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]">
                                Refresh Dashboard
                                <ArrowUpRight className="h-4 w-4" />
                            </button>
                            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/8 px-4 py-3 text-sm text-slate-200">
                                Persistent session enabled
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {quickStats.map((item) => {
                            const Icon = item.icon;

                            return (
                                <article key={item.label} className="rounded-3xl border border-white/10 bg-slate-950/35 p-4 shadow-lg shadow-slate-950/20">
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="text-sm text-slate-300">{item.label}</p>
                                        <Icon className={`h-5 w-5 ${item.tone}`} />
                                    </div>
                                    <p className="mt-4 text-3xl font-black text-white">{item.value}</p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <SectionHeader title="Overview" subtitle="Your top-level URL metrics and operational snapshot." />

            <StatsGrid summary={summary} />

            <section className="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
                <article className="glass-panel rounded-[1.75rem] p-5">
                    <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                    <p className="mt-1 text-sm text-slate-300">Latest URL updates and click activity overview.</p>

                    <div className="mt-4 grid gap-3">
                        {recent.slice(0, 3).map((item) => (
                            <div key={item._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <p className="text-sm font-semibold text-white">{item.short_url}</p>
                                <p className="mt-1 text-sm text-slate-300 break-all">{item.full_url}</p>
                                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                                    <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1">{item.clicks} clicks</span>
                                    <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 capitalize">{item.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="glass-panel rounded-[1.75rem] p-5">
                    <h2 className="text-xl font-bold text-white">Quick Metrics</h2>
                    <p className="mt-1 text-sm text-slate-300">A compact view for operational monitoring.</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Daily clicks</p>
                            <p className="mt-3 text-3xl font-black text-white">{data?.data?.dailyClicks || 0}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Weekly clicks</p>
                            <p className="mt-3 text-3xl font-black text-white">{data?.data?.weeklyClicks || 0}</p>
                        </div>
                    </div>
                    <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/8 p-4 text-sm text-cyan-100">
                        The analytics page contains the full chart experience, while this panel keeps the essentials visible at a glance.
                    </div>
                </article>
            </section>

            <section className="space-y-4">
                <SectionHeader
                    title="URL History"
                    subtitle="Search recent links and manage copies or QR exports from the dashboard."
                    action={
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => {
                                setPage(1);
                                setSearch(event.target.value);
                            }}
                            placeholder="Search history"
                            className="glass-input sm:min-w-[16rem]"
                        />
                    }
                />

                <UrlTable
                    items={paginatedRecent}
                    onCopy={async (value) => {
                        await navigator.clipboard.writeText(value);
                        pushToast({ type: "success", title: "Copied", message: value });
                    }}
                    onDelete={async () => {
                        pushToast({ type: "info", title: "Open My URLs", message: "Delete actions are managed on My URLs page." });
                    }}
                    onEdit={() => {
                        pushToast({ type: "info", title: "Open My URLs", message: "Alias edit is available on My URLs page." });
                    }}
                    onDownloadQr={(value) => downloadQrAsPng(value, pushToast)}
                />

                <Pagination page={page} totalPages={Math.max(1, Math.ceil(filteredRecent.length / PAGE_SIZE))} onPageChange={setPage} />
            </section>
        </div>
    );
};

export default Dashboard;
