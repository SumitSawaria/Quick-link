import { Link } from "react-router-dom";
import { APP_ROUTES } from "../constants/routes";

const NotFound = () => {
    return (
        <section className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4">
            <div className="glass-panel w-full rounded-4xl p-8 text-center sm:p-10">
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">404</p>
                <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Page not found</h1>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                    The page you are looking for does not exist, was moved, or is unavailable. Use the navigation below to get back into the platform.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        to={APP_ROUTES.HOME}
                        className="rounded-2xl bg-linear-to-r from-cyan-400 via-sky-500 to-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.01]"
                    >
                        Go Home
                    </Link>
                    <Link
                        to={APP_ROUTES.DASHBOARD}
                        className="rounded-2xl border border-white/10 bg-white/8 px-5 py-3 font-semibold text-slate-100 transition hover:bg-white/12"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default NotFound;
