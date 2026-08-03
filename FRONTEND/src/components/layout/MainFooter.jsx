import { Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../constants/routes";

const footerGroups = [
    {
        title: "Quick Links",
        items: [
            { label: "Home", to: APP_ROUTES.HOME },
            { label: "Features", to: APP_ROUTES.FEATURES },
            { label: "Dashboard", to: APP_ROUTES.DASHBOARD },
            { label: "FAQ", to: APP_ROUTES.FAQ },
            { label: "Pricing (Coming Soon)", to: APP_ROUTES.HOME },
        ],
    },
    {
        title: "Resources",
        items: [
            { label: "Documentation", to: APP_ROUTES.FEATURES },
            { label: "API Docs", to: APP_ROUTES.FEATURES },
            { label: "Blog", to: APP_ROUTES.FEATURES },
            { label: "GitHub Repository", href: "https://github.com/" },
        ],
    },
    {
        title: "Features",
        items: [
            { label: "URL Shortening", to: APP_ROUTES.FEATURES },
            { label: "Custom Alias", to: APP_ROUTES.FEATURES },
            { label: "QR Code Generator", to: APP_ROUTES.FEATURES },
            { label: "Click Analytics", to: APP_ROUTES.ANALYTICS },
            { label: "URL History", to: APP_ROUTES.MY_URLS },
        ],
    },
    {
        title: "Support",
        items: [
            { label: "Contact", to: APP_ROUTES.FAQ },
            { label: "Help Center", to: APP_ROUTES.FAQ },
            { label: "Report Bug", to: APP_ROUTES.FAQ },
            { label: "Feedback", to: APP_ROUTES.FAQ },
        ],
    },
    {
        title: "Legal",
        items: [
            { label: "Privacy Policy", to: APP_ROUTES.FAQ },
            { label: "Terms & Conditions", to: APP_ROUTES.FAQ },
            { label: "Cookie Policy", to: APP_ROUTES.FAQ },
        ],
    },
];

const MainFooter = () => {
    return (
        <footer className="mt-16 border-t border-white/8 bg-slate-950/45">
            <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_2fr] lg:px-8">
                <div className="space-y-5">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">URL Shortener</p>
                        <h3 className="mt-2 text-3xl font-black text-white">Original SaaS for link management.</h3>
                    </div>
                    <p className="max-w-md text-sm leading-6 text-slate-300">
                        Crafted with a premium dark glassmorphism system, responsive interactions, and a product-first structure for real-world portfolio use.
                    </p>
                    <p className="text-sm text-slate-300">Built with ❤️ by Sumit Sawaria</p>
                    <p className="text-xs text-slate-400">Copyright © 2026</p>
                    <p className="text-xs text-slate-400">All Rights Reserved</p>

                    <div className="flex items-center gap-3 pt-2">
                        <a href="https://github.com/" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white" aria-label="GitHub">
                            <Github className="h-4 w-4" />
                        </a>
                        <a href="https://linkedin.com/" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white" aria-label="LinkedIn">
                            <Linkedin className="h-4 w-4" />
                        </a>
                        <a href="https://x.com/" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white" aria-label="X">
                            <Twitter className="h-4 w-4" />
                        </a>
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {footerGroups.map((group) => (
                        <div key={group.title}>
                            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200/80">{group.title}</h4>
                            <ul className="mt-3 space-y-2 text-sm text-slate-300">
                                {group.items.map((item) => (
                                    <li key={item.label}>
                                        {item.href ? (
                                            <a href={item.href} target="_blank" rel="noreferrer" className="transition hover:text-white">
                                                {item.label}
                                            </a>
                                        ) : (
                                            <Link to={item.to} className="transition hover:text-white">
                                                {item.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default MainFooter;
