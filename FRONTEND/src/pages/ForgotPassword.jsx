import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { forgotPassword } = useAuth();
    const { pushToast } = useToast();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: { email: "" } });

    const onSubmit = async ({ email }) => {
        try {
            const data = await forgotPassword(email);
            pushToast({
                type: "success",
                title: "Reset flow ready",
                message: data.resetToken ? "A reset token was generated for the frontend flow." : data.message,
            });

            if (data.resetToken) {
                navigate(`${APP_ROUTES.RESET_PASSWORD}?token=${encodeURIComponent(data.resetToken)}`, { replace: true });
            }
        } catch (error) {
            pushToast({
                type: "error",
                title: "Reset request failed",
                message: error?.message || "Unable to start the reset flow.",
            });
        }
    };

    return (
        <section className="mx-auto max-w-lg">
            <div className="glass-panel rounded-3xl p-6 sm:p-8">
                <h1 className="text-3xl font-black text-white">Forgot Password</h1>
                <p className="mt-2 text-sm text-slate-300">Enter your email to initialize reset-password flow.</p>
                <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-100">Email</label>
                        <input id="email" className="glass-input" {...register("email", { required: "Email is required" })} />
                        {errors.email ? <p className="mt-2 text-sm text-rose-300">{errors.email.message}</p> : null}
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full rounded-2xl bg-[linear-gradient(90deg,#22d3ee,#0ea5e9,#34d399)] px-5 py-3 font-semibold text-slate-950 disabled:opacity-70">
                        {isSubmitting ? "Submitting..." : "Send Reset Link"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ForgotPassword;
