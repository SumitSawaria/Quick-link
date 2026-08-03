import { AnimatePresence, motion } from "framer-motion";
import { Github, LogOut, Menu, Moon, Sun, UserCircle2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AUTH_NAV_ITEMS, GUEST_NAV_ITEMS } from "../../constants/navigation";
import { APP_ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { useToast } from "../../context/ToastContext";

const getInitials = (name) => {
    if (!name) {
        return "U";
    }

    return (
        name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() || "")
            .join("") || "U"
    );
};

const MainNavbar = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { pushToast } = useToast();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = useMemo(() => (isAuthenticated ? AUTH_NAV_ITEMS : GUEST_NAV_ITEMS), [isAuthenticated]);

    const handleLogout = async () => {
        await logout();
        pushToast({
            type: "success",
            title: "Signed out",
            message: "You have been logged out successfully.",
        });
        navigate(APP_ROUTES.HOME);
    };

    const resolveIcon = (label) => {
        if (label === "GitHub") {
            return <Github className="h-4 w-4" />;
        }

        if (label === "Profile") {
            return <UserCircle2 className="h-4 w-4" />;
        }

        return null;
    };

    return (
        <motion.header
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-40 border-b border-white/8 bg-slate-950/55 backdrop-blur-xl"
        >
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <Link to={APP_ROUTES.HOME} className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/30">
                        U
                    </span>
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/85">Platform</p>
                        <p className="text-lg font-bold text-white">URL Shortener</p>
                    </div>
                </Link>

                <nav className="hidden items-center gap-2 lg:flex" aria-label="Main navigation">
                    {navItems.map((item) => {
                        if (item.href) {
                            return (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                                >
                                    <span className="inline-flex items-center gap-2">
                                        {resolveIcon(item.label)}
                                        {item.label}
                                    </span>
                                </a>
                            );
                        }

                        return (
                            <NavLink
                                key={item.label}
                                to={item.to}
                                className={({ isActive }) =>
                                    [
                                        "rounded-full px-4 py-2 text-sm font-medium transition",
                                        isActive ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white",
                                    ].join(" ")
                                }
                                end={item.to === APP_ROUTES.HOME}
                            >
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 text-slate-100 transition hover:bg-white/12"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>

                    <button
                        type="button"
                        onClick={() => setMobileOpen((current) => !current)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 text-slate-100 transition hover:bg-white/12 lg:hidden"
                        aria-label="Toggle navigation menu"
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </button>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <Link
                                to={APP_ROUTES.PROFILE}
                                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-3 py-2 text-sm text-slate-100 transition hover:bg-white/12"
                            >
                                <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 text-xs font-black text-slate-950">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user?.name || "User avatar"} className="h-full w-full object-cover" />
                                    ) : (
                                        getInitials(user?.name)
                                    )}
                                </span>
                                <span className="hidden text-left sm:block">
                                    <span className="block text-[0.65rem] uppercase tracking-[0.25em] text-slate-400">Account</span>
                                    <span className="block font-medium text-white">{user?.name || "Profile"}</span>
                                </span>
                            </Link>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-300/10 px-3 py-2 text-sm text-rose-100 transition hover:bg-rose-300/20"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen ? (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.24 }}
                        className="border-t border-white/8 bg-slate-950/90 lg:hidden"
                    >
                        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6 lg:px-8">
                            {navItems.map((item) => {
                                if (item.href) {
                                    return (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200"
                                        >
                                            {item.label}
                                        </a>
                                    );
                                }

                                return (
                                    <NavLink
                                        key={item.label}
                                        to={item.to}
                                        end={item.to === APP_ROUTES.HOME}
                                        className={({ isActive }) =>
                                            [
                                                "rounded-2xl border px-4 py-3 text-sm font-medium transition",
                                                isActive
                                                    ? "border-cyan-400/30 bg-cyan-400/10 text-white"
                                                    : "border-white/8 bg-white/5 text-slate-200 hover:bg-white/8",
                                            ].join(" ")
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                );
                            })}

                            {isAuthenticated ? (
                                <div className="mt-2 grid gap-2 rounded-3xl border border-white/8 bg-white/5 p-3">
                                    <Link
                                        to={APP_ROUTES.PROFILE}
                                        className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100"
                                    >
                                        <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 text-xs font-black text-slate-950">
                                            {user?.avatar ? (
                                                <img src={user.avatar} alt={user?.name || "User avatar"} className="h-full w-full object-cover" />
                                            ) : (
                                                getInitials(user?.name)
                                            )}
                                        </span>
                                        <span>
                                            <span className="block text-xs uppercase tracking-[0.25em] text-slate-400">Signed in as</span>
                                            <span className="block text-base text-white">{user?.name || "Profile"}</span>
                                        </span>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm font-medium text-rose-100 transition hover:bg-rose-300/20"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </motion.header>
    );
};

export default MainNavbar;
