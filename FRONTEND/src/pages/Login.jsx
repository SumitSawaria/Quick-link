import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const { pushToast } = useToast();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
            rememberMe: true,
        },
    });

    const onSubmit = async (values) => {
        try {
            const data = await login(values);
            pushToast({ type: "success", title: "Welcome back", message: data.user.email });
            navigate(location.state?.from || APP_ROUTES.DASHBOARD, { replace: true });
        } catch (error) {
            pushToast({
                type: "error",
                title: "Login failed",
                message: error?.message || "Unable to sign in with those credentials.",
            });
        }
    };

    return (
        <section className="mx-auto max-w-lg">
            <div className="glass-panel rounded-3xl p-6 sm:p-8">
                <h1 className="text-3xl font-black text-white">Login</h1>
                <p className="mt-2 text-sm text-slate-300">Access your dashboard, links, and analytics.</p>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-100">Email</label>
                        <input id="email" className="glass-input" {...register("email", { required: "Email is required" })} />
                        {errors.email ? <p className="mt-2 text-sm text-rose-300">{errors.email.message}</p> : null}
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-100">Password</label>
                        <input id="password" type="password" className="glass-input" {...register("password", { required: "Password is required" })} />
                        {errors.password ? <p className="mt-2 text-sm text-rose-300">{errors.password.message}</p> : null}
                    </div>

                    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                        <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-transparent accent-cyan-400" {...register("rememberMe")} />
                        <span>Keep me signed in on this device</span>
                    </label>

                    <button type="submit" disabled={isSubmitting} className="w-full rounded-2xl bg-[linear-gradient(90deg,#22d3ee,#0ea5e9,#34d399)] px-5 py-3 font-semibold text-slate-950 disabled:opacity-70">
                        {isSubmitting ? "Signing in..." : "Login"}
                    </button>
                </form>

                <div className="mt-5 flex justify-between text-sm">
                    <Link className="text-cyan-200 hover:text-cyan-100" to={APP_ROUTES.FORGOT_PASSWORD}>Forgot password?</Link>
                    <Link className="text-cyan-200 hover:text-cyan-100" to={APP_ROUTES.REGISTER}>Create account</Link>
                </div>
            </div>
        </section>
    );
};

export default Login;
