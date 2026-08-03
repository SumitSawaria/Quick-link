import { motion } from "framer-motion";

const Stat = ({ label, value }) => (
    <div className="rounded-3xl border border-white/10 bg-white/8 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">{label}</p>
        <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
);

const StatsCard = ({ totalCount, todayCount, historyCount }) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="glass-panel rounded-4xl p-5 sm:p-6"
            aria-labelledby="stats-title"
        >
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 id="stats-title" className="text-xl font-bold text-white">
                        Statistics
                    </h2>
                    <p className="text-sm text-slate-300">A quick snapshot of your history activity.</p>
                </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <Stat label="Total URLs created" value={totalCount} />
                <Stat label="Today's URLs" value={todayCount} />
                <Stat label="History count" value={historyCount} />
            </div>
        </motion.section>
    );
};

export default StatsCard;