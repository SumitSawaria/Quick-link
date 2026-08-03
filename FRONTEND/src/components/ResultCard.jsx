import { motion } from "framer-motion";
import { FiCheckCircle, FiCopy, FiExternalLink, FiShare2 } from "react-icons/fi";

const ActionButton = ({ icon: Icon, label, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-cyan-400/40 hover:bg-white/12"
        aria-label={label}
    >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
    </button>
);

const ResultCard = ({ result, onCopy, onOpen, onShare }) => {
    if (!result) {
        return null;
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="glass-panel rounded-4xl p-5 sm:p-6"
            aria-labelledby="result-title"
        >
            <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                    <FiCheckCircle className="h-5 w-5" />
                </span>
                <div>
                    <h2 id="result-title" className="text-xl font-bold text-white">
                        Short URL created
                    </h2>
                    <p className="text-sm text-slate-300">Copy, open, share, or generate a QR code instantly.</p>
                </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Original URL</p>
                    <p className="mt-2 break-all text-sm text-slate-100">{result.originalUrl}</p>
                </div>

                <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/8 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200/70">Short URL</p>
                    <a
                        href={result.shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 block break-all text-sm font-semibold text-cyan-100 transition hover:text-white"
                    >
                        {result.shortUrl}
                    </a>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                <ActionButton icon={FiCopy} label="Copy" onClick={() => onCopy(result.shortUrl)} />
                <ActionButton icon={FiExternalLink} label="Open" onClick={() => onOpen(result.shortUrl)} />
                <ActionButton icon={FiShare2} label="Share" onClick={() => onShare(result.shortUrl)} />
            </div>
        </motion.section>
    );
};

export default ResultCard;