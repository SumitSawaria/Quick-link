export const shareUrl = async ({ title, text, url }) => {
    if (navigator.share) {
        await navigator.share({ title, text, url });
        return true;
    }

    await navigator.clipboard.writeText(url);
    return false;
};