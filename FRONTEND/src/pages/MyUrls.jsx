import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import SectionHeader from "../components/common/SectionHeader";
import Pagination from "../components/dashboard/Pagination";
import UrlTable from "../components/dashboard/UrlTable";
import Loading from "../components/Loading";
import { deleteUrlApi, getMyUrlsApi, updateUrlAliasApi } from "../api/url.api";
import { useToast } from "../context/ToastContext";
import { useDebounce } from "../hooks/useDebounce";
import { downloadQrAsPng } from "../utils/qr";

const MyUrls = () => {
    const queryClient = useQueryClient();
    const { pushToast } = useToast();
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [page, setPage] = useState(1);
    const [editingItem, setEditingItem] = useState(null);
    const debouncedSearch = useDebounce(search);

    const editForm = useForm({
        defaultValues: {
            slug: "",
        },
    });

    const query = useQuery({
        queryKey: ["my-urls", debouncedSearch, sortBy, sortOrder, page],
        queryFn: () =>
            getMyUrlsApi({
                page,
                limit: 10,
                search: debouncedSearch,
                sortBy,
                sortOrder,
            }),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUrlApi,
        onSuccess: () => {
            pushToast({ type: "success", title: "Deleted", message: "URL deleted successfully." });
            queryClient.invalidateQueries({ queryKey: ["my-urls"] });
        },
        onError: (error) => {
            pushToast({ type: "error", title: "Delete failed", message: error.message || "Unable to delete the URL." });
        },
    });

    const editMutation = useMutation({
        mutationFn: updateUrlAliasApi,
        onSuccess: () => {
            pushToast({ type: "success", title: "Updated", message: "Alias updated successfully." });
            setEditingItem(null);
            editForm.reset({ slug: "" });
            queryClient.invalidateQueries({ queryKey: ["my-urls"] });
        },
        onError: (error) => {
            pushToast({ type: "error", title: "Update failed", message: error.message || "Unable to update the alias." });
        },
    });

    const rows = useMemo(
        () =>
            (query.data?.items || []).map((item) => ({
                ...item,
                short_url_full: `${window.location.origin}/${item.short_url}`,
            })),
        [query.data?.items]
    );

    const openEditor = (item) => {
        setEditingItem(item);
        editForm.reset({ slug: item.short_url || "" });
    };

    const closeEditor = () => {
        setEditingItem(null);
        editForm.reset({ slug: "" });
    };

    const handleCopy = async (value) => {
        await navigator.clipboard.writeText(value);
        pushToast({ type: "success", title: "Copied", message: value });
    };

    const onSearchChange = (event) => {
        setPage(1);
        setSearch(event.target.value);
    };

    const onSubmitEdit = editForm.handleSubmit((values) => {
        if (!editingItem) {
            return;
        }

        editMutation.mutate({ id: editingItem._id, slug: values.slug.trim() });
    });

    if (query.isLoading) {
        return <Loading label="Loading your URLs" />;
    }

    return (
        <div className="space-y-6">
            <SectionHeader
                title="My URLs"
                subtitle="Search, sort, edit aliases, delete URLs, and manage QR downloads in one place."
                action={
                    <div className="grid gap-2 sm:grid-cols-3">
                        <input
                            type="search"
                            value={search}
                            onChange={onSearchChange}
                            placeholder="Search URLs"
                            className="glass-input sm:min-w-[14rem]"
                        />
                        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="glass-input sm:w-auto">
                            <option value="createdAt">Created Date</option>
                            <option value="clicks">Clicks</option>
                            <option value="last_accessed_at">Last Accessed</option>
                        </select>
                        <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className="glass-input sm:w-auto">
                            <option value="desc">Desc</option>
                            <option value="asc">Asc</option>
                        </select>
                    </div>
                }
            />

            {editingItem ? (
                <section className="glass-panel rounded-[1.75rem] p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/75">Editing alias</p>
                            <h2 className="mt-2 text-xl font-bold text-white">{editingItem.short_url}</h2>
                            <p className="mt-1 text-sm text-slate-300 break-all">{editingItem.full_url}</p>
                        </div>
                        <button type="button" onClick={closeEditor} className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/12">
                            Cancel
                        </button>
                    </div>

                    <form className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={onSubmitEdit}>
                        <input
                            className="glass-input"
                            placeholder="custom-alias"
                            {...editForm.register("slug", {
                                required: "Alias is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9_-]+$/,
                                    message: "Use only letters, numbers, underscores, or hyphens.",
                                },
                            })}
                        />
                        <button type="submit" disabled={editMutation.isPending} className="rounded-2xl bg-[linear-gradient(90deg,#22d3ee,#0ea5e9,#34d399)] px-5 py-3 font-semibold text-slate-950 disabled:opacity-70">
                            {editMutation.isPending ? "Updating..." : "Save Alias"}
                        </button>
                    </form>
                    {editForm.formState.errors.slug ? <p className="mt-2 text-sm text-rose-300">{editForm.formState.errors.slug.message}</p> : null}
                </section>
            ) : null}

            <UrlTable
                items={rows}
                onCopy={handleCopy}
                onDelete={(id) => deleteMutation.mutate(id)}
                onEdit={openEditor}
                onDownloadQr={(value) => downloadQrAsPng(value, pushToast)}
            />

            <Pagination
                page={query.data?.pagination?.page || 1}
                totalPages={query.data?.pagination?.totalPages || 1}
                onPageChange={setPage}
            />
        </div>
    );
};

export default MyUrls;
