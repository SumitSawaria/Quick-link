import { Link, NavLink } from "react-router-dom";
import { FiGithub, FiMoon, FiSun, FiLink } from "react-icons/fi";
import { motion } from "framer-motion";

const navLinkClass = ({ isActive }) =>
    [
        "rounded-full px-4 py-2 text-sm font-medium transition",
        isActive ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white",
    ].join(" ");

const Navbar = ({ theme, onToggleTheme }) => {
    return (
        <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="sticky top-0 z-40 border-b border-white/8 bg-slate-950/55 backdrop-blur-xl"
        >
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-3 text-white">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/30">
                        <FiLink className="h-5 w-5" />
                    </span>
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200/80">Quick Link</p>
                        <p className="text-lg font-bold">URL Shortener</p>
                    </div>
                </Link>

                <nav className="hidden items-center gap-2 md:flex" aria-label="Primary">
                    <NavLink to="/" className={navLinkClass} end>
                        Home
                    </NavLink>
                    <NavLink to="/about" className={navLinkClass}>
                        About
                    </NavLink>
                    <a
                        href="https://github.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                        <span className="inline-flex items-center gap-2">
                            <FiGithub className="h-4 w-4" /> GitHub
                        </span>
                    </a>
                </nav>

                <button
                    type="button"
                    onClick={onToggleTheme}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/40 hover:bg-white/12"
                    aria-label="Toggle dark mode"
                >
                    {theme === "dark" ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
                    <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
                </button>
            </div>
        </motion.header>
    );
};

export default Navbar;