import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FaqAccordion = ({ items }) => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="space-y-3">
            {items.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                    <div key={item.question} className="glass-panel overflow-hidden rounded-2xl">
                        <button
                            type="button"
                            onClick={() => setOpenIndex(isOpen ? -1 : index)}
                            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                            aria-expanded={isOpen}
                        >
                            <span className="text-base font-semibold text-white">{item.question}</span>
                            <ChevronDown className={`h-5 w-5 text-slate-300 transition ${isOpen ? "rotate-180" : "rotate-0"}`} />
                        </button>
                        <AnimatePresence initial={false}>
                            {isOpen ? (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <p className="px-5 pb-5 text-sm leading-6 text-slate-300">{item.answer}</p>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
};

export default FaqAccordion;
