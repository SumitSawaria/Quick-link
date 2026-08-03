const Pagination = ({ page, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-between gap-3 pt-4">
            <button
                type="button"
                onClick={() => onPageChange(Math.max(page - 1, 1))}
                disabled={page === 1}
                className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-60"
            >
                Previous
            </button>
            <p className="text-sm text-slate-300">
                Page {page} of {totalPages}
            </p>
            <button
                type="button"
                onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                disabled={page === totalPages}
                className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-60"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
