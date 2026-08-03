import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import QRCode from "react-qr-code";

const DEFAULT_FILE_NAME = "short-url-qr.png";

const notify = (pushToast, toast) => {
    if (typeof pushToast === "function") {
        pushToast(toast);
    }
};

export const downloadQrAsPng = async (value, pushToast) => {
    if (!value) {
        notify(pushToast, {
            type: "error",
            title: "QR download failed",
            message: "No URL was provided.",
        });
        return false;
    }

    try {
        const svgMarkup = renderToStaticMarkup(
            React.createElement(QRCode, {
                value,
                size: 220,
                fgColor: "#0f172a",
                bgColor: "#ffffff",
            })
        );
        const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
        const svgUrl = URL.createObjectURL(svgBlob);

        const image = new Image();
        image.crossOrigin = "anonymous";

        await new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = reject;
            image.src = svgUrl;
        });

        const size = 1024;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        const context = canvas.getContext("2d");
        if (!context) {
            throw new Error("Canvas context unavailable");
        }

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, size, size);
        context.drawImage(image, 0, 0, size, size);
        URL.revokeObjectURL(svgUrl);

        const fileBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
        if (!fileBlob) {
            throw new Error("PNG generation failed");
        }

        const downloadUrl = URL.createObjectURL(fileBlob);
        const anchor = document.createElement("a");
        anchor.href = downloadUrl;
        anchor.download = DEFAULT_FILE_NAME;
        anchor.click();
        URL.revokeObjectURL(downloadUrl);

        notify(pushToast, {
            type: "success",
            title: "QR downloaded",
            message: "Your PNG file is ready.",
        });

        return true;
    } catch (error) {
        notify(pushToast, {
            type: "error",
            title: "QR download failed",
            message: error?.message || "Unable to export the QR code.",
        });
        return false;
    }
};