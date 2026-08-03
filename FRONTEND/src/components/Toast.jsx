import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheckCircle, FiAlertTriangle, FiX } from "react-icons/fi";

const iconMap = {
    success: FiCheckCircle,
    error: FiAlertTriangle,
    info: FiAlertTriangle,
};

const Toast = ({ toast, onClose }) => {
    return (
        <div className="pointer-events-none fixed right-4 top-4 z-50 w-[min(92vw,24rem)]">
            <AnimatePresence>
                {toast ? (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: -20, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="pointer-events-auto glass-panel flex items-start gap-3 rounded-2xl p-4 text-sm text-slate-100 shadow-2xl"
                    >
                        {React.createElement(iconMap[toast.type] || FiCheckCircle, {
                            className: `mt-0.5 h-5 w-5 ${toast.type === "error" ? "text-rose-300" : "text-emerald-300"}`,
                        })}
                        <div className="flex-1">
                            <p className="font-semibold">{toast.title}</p>
                            <p className="mt-1 text-slate-300">{toast.message}</p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full p-1 text-slate-300 transition hover:bg-white/10 hover:text-white"
                            aria-label="Close notification"
                        >
                            <FiX className="h-4 w-4" />
                        </button>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
};

export default Toast;