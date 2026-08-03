import { useQuery } from "@tanstack/react-query";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import SectionHeader from "../components/common/SectionHeader";
import Loading from "../components/Loading";
import { getAnalyticsSummaryApi } from "../api/url.api";

const Analytics = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["analytics"],
        queryFn: getAnalyticsSummaryApi,
    });

    const analytics = data?.data;
    const topUrls = (analytics?.topUrls || []).map((item) => ({
        name: item.short_url,
        clicks: item.clicks,
    }));

    const trend = [
        { name: "Total", clicks: analytics?.summary?.totalClicks || 0 },
        { name: "Daily", clicks: analytics?.dailyClicks || 0 },
        { name: "Weekly", clicks: analytics?.weeklyClicks || 0 },
    ];

    const recentUrls = (analytics?.recentUrls || []).slice(0, 8).map((item) => ({
        name: item.short_url,
        clicks: item.clicks,
    }));

    if (isLoading) {
        return <Loading label="Loading analytics" />;
    }

    const summaryCards = [
        { label: "Total Clicks", value: analytics?.summary?.totalClicks || 0, accent: "from-cyan-400/20 to-sky-400/10" },
        { label: "Daily Clicks", value: analytics?.dailyClicks || 0, accent: "from-emerald-400/20 to-teal-400/10" },
        { label: "Weekly Clicks", value: analytics?.weeklyClicks || 0, accent: "from-violet-400/20 to-indigo-400/10" },
        { label: "Active URLs", value: analytics?.summary?.activeUrls || 0, accent: "from-amber-400/20 to-orange-400/10" },
    ];

    return (
        <div className="space-y-6">
            <SectionHeader
                title="Analytics"
                subtitle="Track total clicks, daily and weekly patterns, top performers, and recent activity."
            />

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => (
                    <article key={card.label} className={`rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${card.accent} p-5 shadow-lg shadow-slate-950/20`}>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-300">{card.label}</p>
                        <p className="mt-4 text-3xl font-black text-white">{card.value}</p>
                    </article>
                ))}
            </section>

            <section className="grid gap-5 xl:grid-cols-2">
                <article className="glass-panel rounded-[1.75rem] p-5">
                    <h2 className="text-xl font-bold text-white">Clicks Overview</h2>
                    <p className="mt-1 text-sm text-slate-300">Total, daily, and weekly click performance in one chart.</p>
                    <div className="mt-4 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trend}>
                                <defs>
                                    <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.5} />
                                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)" }} />
                                <Area type="monotone" dataKey="clicks" stroke="#22d3ee" fill="url(#clickGradient)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className="glass-panel rounded-[1.75rem] p-5">
                    <h2 className="text-xl font-bold text-white">Top Performing URLs</h2>
                    <p className="mt-1 text-sm text-slate-300">Your strongest links by total click count.</p>
                    <div className="mt-4 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topUrls}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)" }} />
                                <Bar dataKey="clicks" fill="#34d399" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </article>
            </section>

            <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
                <article className="glass-panel rounded-[1.75rem] p-5">
                    <h2 className="text-xl font-bold text-white">Most Recent Clicks</h2>
                    <p className="mt-1 text-sm text-slate-300">Recent URL activity available in your account.</p>
                    <div className="mt-4 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={recentUrls}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)" }} />
                                <Legend />
                                <Line type="monotone" dataKey="clicks" stroke="#f472b6" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className="glass-panel rounded-[1.75rem] p-5">
                    <h2 className="text-xl font-bold text-white">Recent Activity Feed</h2>
                    <p className="mt-1 text-sm text-slate-300">A readable view of the most recent URLs and their current totals.</p>
                    <div className="mt-4 space-y-3">
                        {(analytics?.recentUrls || []).slice(0, 8).map((item) => (
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
            </section>
        </div>
    );
};

export default Analytics;
