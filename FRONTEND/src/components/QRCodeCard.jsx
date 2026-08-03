import { useMemo, useRef } from "react";
import QRCode from "react-qr-code";
import { motion } from "framer-motion";
import { FiCopy, FiDownload, FiShare2 } from "react-icons/fi";

const QRCodeCard = ({ url, onCopy, onShare, onNotify }) => {
    const qrContainerRef = useRef(null);

    const fileName = useMemo(() => {
        try {
            const parsed = new URL(url);
            const slug = parsed.pathname.replaceAll("/", "-").replace(/^-+/, "") || "short-url";
            return `${slug}.png`;
        } catch {
            return "short-url.png";
        }
    }, [url]);

    const handleDownload = async () => {
        const svg = qrContainerRef.current?.querySelector("svg");
        if (!svg) {
            onNotify?.({ type: "error", title: "QR code unavailable", message: "Try again after the code renders." });
            return;
        }

        const clone = svg.cloneNode(true);
        clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        const serialized = new XMLSerializer().serializeToString(clone);
        const svgBlob = new Blob([serialized], { type: "image/svg+xml;charset=utf-8" });
        const svgUrl = URL.createObjectURL(svgBlob);

        const canvas = document.createElement("canvas");
        const size = 1024;
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext("2d");
        const image = new Image();

        image.onload = () => {
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, size, size);
            context.drawImage(image, 0, 0, size, size);
            URL.revokeObjectURL(svgUrl);

            canvas.toBlob((blob) => {
                if (!blob) {
                    onNotify?.({ type: "error", title: "Download failed", message: "Unable to export the QR code." });
                    return;
                }

                const downloadUrl = URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = downloadUrl;
                anchor.download = fileName;
                anchor.click();
                URL.revokeObjectURL(downloadUrl);
                onNotify?.({ type: "success", title: "QR downloaded", message: "Your PNG file is ready." });
            }, "image/png");
        };

        image.onerror = () => {
            URL.revokeObjectURL(svgUrl);
            onNotify?.({ type: "error", title: "Download failed", message: "Unable to render the QR code." });
        };

        image.src = svgUrl;
    };

    if (!url) {
        return null;
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="glass-panel rounded-4xl p-5 sm:p-6"
            aria-labelledby="qr-title"
        >
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 id="qr-title" className="text-xl font-bold text-white">
                        QR Code
                    </h2>
                    <p className="text-sm text-slate-300">Scan or download the PNG for sharing.</p>
                </div>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                    Auto generated
                </span>
            </div>

            <div ref={qrContainerRef} className="mt-5 grid place-items-center rounded-[1.75rem] bg-white p-5">
                <QRCode value={url} size={220} fgColor="#0f172a" bgColor="#ffffff" />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={() => onCopy(url)}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
                >
                    <FiCopy className="h-4 w-4" />
                    Copy URL
                </button>
                <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/40 hover:bg-white/12"
                >
                    <FiDownload className="h-4 w-4" />
                    Download PNG
                </button>
                <button
                    type="button"
                    onClick={() => onShare(url)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/40 hover:bg-white/12"
                >
                    <FiShare2 className="h-4 w-4" />
                    Share
                </button>
            </div>
        </motion.section>
    );
};

export default QRCodeCard;