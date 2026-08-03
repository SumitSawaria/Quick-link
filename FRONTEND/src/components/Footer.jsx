import { FiGithub, FiLinkedin, FiHeart } from "react-icons/fi";

const Footer = () => {
    return (
        <footer className="border-t border-white/8 bg-slate-950/40">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <p className="flex items-center gap-2">
                    Crafted with <FiHeart className="text-rose-300" /> by Sumit Sawaria
                </p>
                <div className="flex items-center gap-4">
                    <a href="https://github.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-white">
                        <FiGithub /> GitHub
                    </a>
                    <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-white">
                        <FiLinkedin /> LinkedIn
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;