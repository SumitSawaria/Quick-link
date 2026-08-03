import { Link } from "react-router-dom";

const About = () => {
    return (
        <main className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-5xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
            <section className="glass-panel rounded-[2.5rem] p-8 sm:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200/80">About</p>
                <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">Built for fast URL shortening workflows.</h1>
                <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                    This frontend is wired to the current Node, Express, and MongoDB backend and focuses on a clean, scalable user experience: React 19, Vite, Tailwind CSS, React Query, Framer Motion, React Router DOM, React Icons, and QR generation.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                    <Link to="/" className="rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.01]">
                        Back to Home
                    </Link>
                    <a href="https://github.com/" target="_blank" rel="noreferrer" className="rounded-2xl border border-white/10 bg-white/8 px-5 py-3 font-semibold text-slate-100 transition hover:bg-white/12">
                        GitHub
                    </a>
                </div>
            </section>
        </main>
    );
};

export default About;