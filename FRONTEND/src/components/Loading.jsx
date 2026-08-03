import { motion } from "framer-motion";

const Loading = ({ label = "Loading", compact = false }) => {
    if (compact) {
        return (
            <div className="inline-flex items-center gap-3 text-sm text-slate-300" aria-live="polite">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
                <span>{label}</span>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-panel rounded-3xl p-6"
            aria-live="polite"
            aria-busy="true"
        >
            <div className="space-y-4">
                <div className="h-4 w-28 rounded-full bg-white/10" />
                <div className="h-12 rounded-2xl bg-white/10" />
                <div className="grid gap-3 md:grid-cols-2">
                    <div className="h-24 rounded-3xl bg-white/10" />
                    <div className="h-24 rounded-3xl bg-white/10" />
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
                    <span>{label}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default Loading;