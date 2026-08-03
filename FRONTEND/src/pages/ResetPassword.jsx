import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { APP_ROUTES } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tokenFromQuery = searchParams.get("token") || "";
    const { resetPassword } = useAuth();
    const { pushToast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: { token: tokenFromQuery, newPassword: "" } });

    const onSubmit = async (values) => {
        try {
            await resetPassword(values);
            pushToast({
                type: "success",
                title: "Password reset",
                message: "You can now login with your new password.",
            });
            navigate(APP_ROUTES.LOGIN, { replace: true });
        } catch (error) {
            pushToast({
                type: "error",
                title: "Reset failed",
                message: error?.message || "Unable to reset your password.",
            });
        }
    };

    return (
        <section className="mx-auto max-w-lg">
            <div className="glass-panel rounded-3xl p-6 sm:p-8">
                <h1 className="text-3xl font-black text-white">Reset Password</h1>
                <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="token" className="mb-2 block text-sm font-semibold text-slate-100">Reset Token</label>
                        <input id="token" className="glass-input" {...register("token", { required: "Token is required" })} />
                        {errors.token ? <p className="mt-2 text-sm text-rose-300">{errors.token.message}</p> : null}
                    </div>

                    <div>
                        <label htmlFor="newPassword" className="mb-2 block text-sm font-semibold text-slate-100">New Password</label>
                        <input id="newPassword" type="password" className="glass-input" {...register("newPassword", { required: "New password is required", minLength: { value: 8, message: "Minimum 8 characters" } })} />
                        {errors.newPassword ? <p className="mt-2 text-sm text-rose-300">{errors.newPassword.message}</p> : null}
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full rounded-2xl bg-[linear-gradient(90deg,#22d3ee,#0ea5e9,#34d399)] px-5 py-3 font-semibold text-slate-950 disabled:opacity-70">
                        {isSubmitting ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ResetPassword;
