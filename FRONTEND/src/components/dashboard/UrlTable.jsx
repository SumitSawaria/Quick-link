import { Copy, Download, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "../../utils/url";

const statusStyles = {
    active: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
    archived: "border-amber-400/20 bg-amber-400/10 text-amber-100",
    default: "border-white/10 bg-white/8 text-slate-100",
};

const ActionButton = ({ icon: Icon, label, tone = "default", onClick }) => {
    const toneClass =
        tone === "danger"
            ? "border-rose-300/20 bg-rose-300/10 text-rose-100 hover:bg-rose-300/20"
            : "border-white/10 bg-white/8 text-slate-100 hover:bg-white/12";

    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${toneClass}`}
            aria-label={label}
        >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
        </button>
    );
};

const UrlRow = ({ item, onCopy, onDelete, onEdit, onDownloadQr }) => {
    const shortUrl = item.short_url_full || item.short_url;
    const statusClass = statusStyles[item.status] || statusStyles.default;

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-[1.75rem] p-4 transition hover:border-white/15"
        >
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)_auto] xl:items-center">
                <div className="space-y-3 min-w-0">
                    <div>
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-400">Original URL</p>
                        <p className="mt-2 break-words text-sm leading-6 text-slate-100">{item.full_url}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 font-medium text-cyan-100">
                            Created {formatDate(item.createdAt)}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 font-medium text-slate-200">
                            Last accessed {item.last_accessed_at ? formatDate(item.last_accessed_at) : "Never"}
                        </span>
                    </div>
                </div>

                <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/8 p-4">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-cyan-200/70">Short URL</p>
                    <a
                        href={shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-2 break-all text-sm font-semibold text-cyan-100 transition hover:text-white"
                    >
                        {shortUrl}
                        <ExternalLink className="h-4 w-4" />
                    </a>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className={[`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize`, statusClass].join(" ")}>
                            {item.status || "active"}
                        </span>
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-semibold text-slate-100">
                            {item.clicks ?? 0} clicks
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 xl:justify-end">
                    <ActionButton icon={Copy} label="Copy" onClick={() => onCopy(shortUrl)} />
                    <ActionButton icon={Download} label="QR" onClick={() => onDownloadQr(shortUrl)} />
                    <ActionButton icon={Pencil} label="Edit" onClick={() => onEdit(item)} />
                    <ActionButton icon={Trash2} label="Delete" tone="danger" onClick={() => onDelete(item._id)} />
                </div>
            </div>
        </motion.article>
    );
};

const UrlTable = ({ items = [], onCopy, onDelete, onEdit, onDownloadQr }) => {
    if (!items.length) {
        return (
            <div className="glass-panel rounded-[1.75rem] p-8 text-center text-slate-300">
                <h3 className="text-lg font-semibold text-white">No URLs found</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                    Create a new link or clear your search filters to see URLs appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="hidden xl:block">
                <div className="glass-panel overflow-x-auto rounded-[1.75rem] p-2">
                    <table className="min-w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-300">
                                <th className="px-3 py-3 font-medium">Original URL</th>
                                <th className="px-3 py-3 font-medium">Short URL</th>
                                <th className="px-3 py-3 font-medium">Clicks</th>
                                <th className="px-3 py-3 font-medium">Created</th>
                                <th className="px-3 py-3 font-medium">Last Accessed</th>
                                <th className="px-3 py-3 font-medium">Status</th>
                                <th className="px-3 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item._id} className="border-b border-white/5 text-slate-100 last:border-0">
                                    <td className="max-w-[18rem] truncate px-3 py-3">{item.full_url}</td>
                                    <td className="max-w-[12rem] truncate px-3 py-3">{item.short_url_full || item.short_url}</td>
                                    <td className="px-3 py-3">{item.clicks}</td>
                                    <td className="px-3 py-3">{formatDate(item.createdAt)}</td>
                                    <td className="px-3 py-3">{item.last_accessed_at ? formatDate(item.last_accessed_at) : "-"}</td>
                                    <td className="px-3 py-3 capitalize">{item.status}</td>
                                    <td className="px-3 py-3">
                                        <div className="flex flex-wrap gap-2">
                                            <button type="button" onClick={() => onCopy(item.short_url_full || item.short_url)} className="rounded-full border border-white/10 p-2 hover:bg-white/10" aria-label="Copy URL">
                                                <Copy className="h-4 w-4" />
                                            </button>
                                            <button type="button" onClick={() => onDownloadQr(item.short_url_full || item.short_url)} className="rounded-full border border-white/10 p-2 hover:bg-white/10" aria-label="Download QR">
                                                <Download className="h-4 w-4" />
                                            </button>
                                            <button type="button" onClick={() => onEdit(item)} className="rounded-full border border-white/10 p-2 hover:bg-white/10" aria-label="Edit alias">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button type="button" onClick={() => onDelete(item._id)} className="rounded-full border border-rose-300/20 p-2 text-rose-200 hover:bg-rose-300/20" aria-label="Delete URL">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid gap-4 xl:hidden">
                {items.map((item) => (
                    <UrlRow key={item._id} item={item} onCopy={onCopy} onDelete={onDelete} onEdit={onEdit} onDownloadQr={onDownloadQr} />
                ))}
            </div>
        </div>
    );
};

export default UrlTable;
