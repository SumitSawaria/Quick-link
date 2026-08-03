import { FiArrowRight, FiZap } from "react-icons/fi";
import { motion } from "framer-motion";
import Loading from "./Loading";

const UrlForm = ({
    values,
    errors,
    isSubmitting,
    onChange,
    onSubmit,
    onKeyDown,
}) => {
    return (
        <motion.form
            onSubmit={onSubmit}
            onKeyDown={onKeyDown}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="glass-panel rounded-4xl p-5 sm:p-6"
            aria-label="Shorten URL form"
        >
            <div className="grid gap-4">
                <div>
                    <label htmlFor="url" className="mb-2 block text-sm font-semibold text-slate-100">
                        Original URL
                    </label>
                    <input
                        id="url"
                        name="url"
                        type="url"
                        inputMode="url"
                        autoComplete="url"
                        placeholder="https://example.com"
                        value={values.url}
                        onChange={onChange}
                        className="glass-input"
                        aria-invalid={Boolean(errors.url)}
                        aria-describedby={errors.url ? "url-error" : undefined}
                    />
                    {errors.url ? (
                        <p id="url-error" className="mt-2 text-sm text-rose-300">
                            {errors.url}
                        </p>
                    ) : null}
                </div>

                <div>
                    <label htmlFor="slug" className="mb-2 block text-sm font-semibold text-slate-100">
                        Optional Custom Short URL
                    </label>
                    <div className="flex w-full items-center overflow-hidden rounded-2xl border border-white/10 bg-white/8 focus-within:border-cyan-400/70 focus-within:ring-2 focus-within:ring-cyan-400/20">
                        <span className="shrink-0 border-r border-white/12 px-4 text-sm text-slate-400" aria-hidden="true">
                            yourslug/
                        </span>
                        <input
                            id="slug"
                            name="slug"
                            type="text"
                            autoComplete="off"
                            placeholder={values.slug ? "" : "myportfolio"}
                            value={values.slug}
                            onChange={onChange}
                            className="w-full bg-transparent px-4 py-3 text-slate-50 outline-none placeholder:text-slate-400"
                            aria-invalid={Boolean(errors.slug)}
                            aria-describedby={errors.slug ? "slug-error" : undefined}
                        />
                    </div>
                    {errors.slug ? (
                        <p id="slug-error" className="mt-2 text-sm text-rose-300">
                            {errors.slug}
                        </p>
                    ) : (
                        <p className="mt-2 text-sm text-slate-400">
                            Leave this empty for a random code.
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-[linear-gradient(90deg,#22d3ee,#0ea5e9,#34d399)] px-5 py-3.5 font-semibold text-slate-950 transition hover:scale-[1.01] hover:shadow-lg hover:shadow-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isSubmitting ? <Loading label="Generating short URL" compact /> : <FiZap className="h-5 w-5" />}
                    <span>{isSubmitting ? "Generating" : "Create Short URL"}</span>
                    <FiArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
                </button>
            </div>
        </motion.form>
    );
};

export default UrlForm;
