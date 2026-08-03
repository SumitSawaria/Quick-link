import { BarChart3, Link2, QrCode, Target } from "lucide-react";

const icons = {
    totalUrls: Link2,
    totalClicks: BarChart3,
    activeUrls: Target,
    qrCodesGenerated: QrCode,
};

const labels = {
    totalUrls: "Total URLs",
    totalClicks: "Total Clicks",
    activeUrls: "Active URLs",
    qrCodesGenerated: "QR Codes Generated",
};

const StatsGrid = ({ summary }) => {
    return (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Dashboard stats">
            {Object.keys(labels).map((key) => {
                const Icon = icons[key];
                return (
                    <article key={key} className="glass-panel rounded-3xl p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-300">{labels[key]}</p>
                            <Icon className="h-5 w-5 text-cyan-200" />
                        </div>
                        <p className="mt-3 text-3xl font-black text-white">{summary?.[key] ?? 0}</p>
                    </article>
                );
            })}
        </section>
    );
};

export default StatsGrid;
