import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { LogOut, ShieldCheck, UserCircle2 } from "lucide-react";
import SectionHeader from "../components/common/SectionHeader";
import Loading from "../components/Loading";
import { getAnalyticsSummaryApi } from "../api/url.api";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import { formatDate } from "../utils/url";

const Profile = () => {
    const { user, updateProfile, changePassword, logout } = useAuth();
    const { pushToast } = useToast();
    const { data, isLoading } = useQuery({
        queryKey: ["profile-stats"],
        queryFn: getAnalyticsSummaryApi,
    });

    const profileForm = useForm({
        defaultValues: {
            name: user?.name || "",
            avatar: user?.avatar || "",
        },
    });

    const passwordForm = useForm({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
        },
    });

    const profileMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            pushToast({ type: "success", title: "Profile updated", message: "Your account details are saved." });
        },
        onError: (error) => {
            pushToast({ type: "error", title: "Update failed", message: error.message || "Unable to update profile." });
        },
    });

    const passwordMutation = useMutation({
        mutationFn: changePassword,
        onSuccess: () => {
            pushToast({ type: "success", title: "Password changed", message: "Please login again with your new password." });
            logout();
        },
        onError: (error) => {
            pushToast({ type: "error", title: "Password change failed", message: error.message || "Unable to change password." });
        },
    });

    const summary = data?.data?.summary || {};

    if (isLoading) {
        return <Loading label="Loading profile" />;
    }

    const onSubmitProfile = profileForm.handleSubmit((values) => profileMutation.mutate(values));
    const onSubmitPassword = passwordForm.handleSubmit((values) => passwordMutation.mutate(values));

    return (
        <div className="space-y-6">
            <SectionHeader title="Profile" subtitle="Manage your account identity, security, and account usage summary." />

            <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                <article className="glass-panel rounded-[1.75rem] p-5 sm:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                        <div className="relative">
                            <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full border border-white/15 bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 text-2xl font-black text-slate-950 shadow-xl shadow-cyan-500/20">
                                {user?.avatar ? <img src={user.avatar} alt={user?.name || "User avatar"} className="h-full w-full object-cover" /> : <UserCircle2 className="h-10 w-10 text-slate-950" />}
                            </div>
                            {user?.isEmailVerified ? (
                                <span className="absolute -bottom-1 -right-1 inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Verified
                                </span>
                            ) : null}
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Account overview</p>
                            <h2 className="text-3xl font-black text-white">{user?.name}</h2>
                            <p className="text-sm text-slate-300 break-all">{user?.email}</p>
                            <p className="text-xs text-slate-400">Joined {user?.createdAt ? formatDate(user.createdAt) : "-"}</p>

                            <div className="flex flex-wrap gap-2 pt-2 text-xs">
                                <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-slate-200">{summary.totalUrls || 0} total URLs</span>
                                <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-slate-200">{summary.totalClicks || 0} total clicks</span>
                                <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-slate-200">{summary.activeUrls || 0} active URLs</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Total URLs</p>
                            <p className="mt-3 text-3xl font-black text-white">{summary.totalUrls || 0}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Total Clicks</p>
                            <p className="mt-3 text-3xl font-black text-white">{summary.totalClicks || 0}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">QR Codes</p>
                            <p className="mt-3 text-3xl font-black text-white">{summary.qrCodesGenerated || 0}</p>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => logout()}
                            className="inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-300/10 px-4 py-2 text-sm font-medium text-rose-100 transition hover:bg-rose-300/20"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </article>

                <article className="glass-panel rounded-[1.75rem] p-5 sm:p-6">
                    <h3 className="text-xl font-bold text-white">Edit Profile</h3>
                    <form className="mt-4 space-y-3" onSubmit={onSubmitProfile}>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-100" htmlFor="name">
                                Full Name
                            </label>
                            <input
                                id="name"
                                className="glass-input"
                                placeholder="Your name"
                                {...profileForm.register("name", {
                                    required: "Name is required",
                                    minLength: { value: 2, message: "Name must be at least 2 characters" },
                                })}
                            />
                            {profileForm.formState.errors.name ? <p className="mt-2 text-sm text-rose-300">{profileForm.formState.errors.name.message}</p> : null}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-100" htmlFor="avatar">
                                Avatar URL
                            </label>
                            <input
                                id="avatar"
                                className="glass-input"
                                placeholder="https://..."
                                {...profileForm.register("avatar", {
                                    pattern: {
                                        value: /^$|https?:\/\/.+/i,
                                        message: "Avatar must be a valid URL or left blank",
                                    },
                                })}
                            />
                            {profileForm.formState.errors.avatar ? <p className="mt-2 text-sm text-rose-300">{profileForm.formState.errors.avatar.message}</p> : null}
                        </div>

                        <button type="submit" disabled={profileMutation.isPending} className="w-full rounded-2xl bg-[linear-gradient(90deg,#22d3ee,#0ea5e9,#34d399)] px-4 py-3 font-semibold text-slate-950 disabled:opacity-70">
                            {profileMutation.isPending ? "Saving..." : "Save Profile"}
                        </button>
                    </form>
                </article>
            </section>

            <section className="glass-panel rounded-[1.75rem] p-5 sm:p-6">
                <h3 className="text-xl font-bold text-white">Change Password</h3>
                <form className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_auto]" onSubmit={onSubmitPassword}>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-100" htmlFor="currentPassword">
                            Current Password
                        </label>
                        <input
                            id="currentPassword"
                            type="password"
                            className="glass-input"
                            placeholder="Current password"
                            {...passwordForm.register("currentPassword", { required: "Current password is required" })}
                        />
                        {passwordForm.formState.errors.currentPassword ? <p className="mt-2 text-sm text-rose-300">{passwordForm.formState.errors.currentPassword.message}</p> : null}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-100" htmlFor="newPassword">
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            className="glass-input"
                            placeholder="New password"
                            {...passwordForm.register("newPassword", {
                                required: "New password is required",
                                minLength: { value: 8, message: "Password must be at least 8 characters" },
                            })}
                        />
                        {passwordForm.formState.errors.newPassword ? <p className="mt-2 text-sm text-rose-300">{passwordForm.formState.errors.newPassword.message}</p> : null}
                    </div>

                    <button
                        type="submit"
                        disabled={passwordMutation.isPending}
                        className="self-end rounded-2xl bg-[linear-gradient(90deg,#22d3ee,#0ea5e9,#34d399)] px-5 py-3 font-semibold text-slate-950 disabled:opacity-70"
                    >
                        {passwordMutation.isPending ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </section>
        </div>
    );
};

export default Profile;
