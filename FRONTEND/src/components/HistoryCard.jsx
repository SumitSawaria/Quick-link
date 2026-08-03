import { motion } from "framer-motion";
import { FiCopy, FiTrash2, FiDownload } from "react-icons/fi";
import { formatDate } from "../utils/url";

const HistoryCard = ({ item, onCopy, onShowQr, onDelete }) => {
    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="glass-panel rounded-[1.75rem] p-4"
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Original</p>
                    <p className="break-all text-sm text-white">{item.originalUrl}</p>
                    <p className="text-xs text-slate-400">{formatDate(item.createdAt)}</p>
                </div>

                <div className="min-w-0 rounded-2xl border border-cyan-400/20 bg-cyan-400/8 px-4 py-3 lg:max-w-[45%]">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200/70">Short URL</p>
                    <p className="mt-1 break-all text-sm font-semibold text-cyan-100">{item.shortUrl}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => onCopy(item.shortUrl)}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/12"
                    >
                        <FiCopy className="h-4 w-4" />
                        Copy
                    </button>
                    <button
                        type="button"
                        onClick={() => onShowQr(item)}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/12"
                    >
                        <FiDownload className="h-4 w-4" />
                        QR
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm font-medium text-rose-100 transition hover:bg-rose-400/15"
                    >
                        <FiTrash2 className="h-4 w-4" />
                        Delete
                    </button>
                </div>
            </div>
        </motion.article>
    );
};

export default HistoryCard;