import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";

const Register = () => {
    const navigate = useNavigate();
    const { register: registerAccount } = useAuth();
    const { pushToast } = useToast();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: { name: "", email: "", password: "" } });

    const onSubmit = async (values) => {
        try {
            const data = await registerAccount(values);
            pushToast({
                type: "success",
                title: "Registration complete",
                message: data.verification?.token ? "Verification token generated for email flow." : "Welcome aboard",
            });

            if (data.verification?.token) {
                navigate(`${APP_ROUTES.VERIFY_EMAIL}?token=${encodeURIComponent(data.verification.token)}`, { replace: true });
                return;
            }

            navigate(APP_ROUTES.DASHBOARD, { replace: true });
        } catch (error) {
            pushToast({
                type: "error",
                title: "Registration failed",
                message: error?.message || "Unable to create your account.",
            });
        }
    };

    return (
        <section className="mx-auto max-w-lg">
            <div className="glass-panel rounded-3xl p-6 sm:p-8">
                <h1 className="text-3xl font-black text-white">Sign Up</h1>
                <p className="mt-2 text-sm text-slate-300">Create your SaaS account to manage short links professionally.</p>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-100">Full Name</label>
                        <input id="name" className="glass-input" {...register("name", { required: "Name is required" })} />
                        {errors.name ? <p className="mt-2 text-sm text-rose-300">{errors.name.message}</p> : null}
                    </div>

                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-100">Email</label>
                        <input id="email" className="glass-input" {...register("email", { required: "Email is required" })} />
                        {errors.email ? <p className="mt-2 text-sm text-rose-300">{errors.email.message}</p> : null}
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-100">Password</label>
                        <input id="password" type="password" className="glass-input" {...register("password", { required: "Password is required", minLength: { value: 8, message: "Minimum 8 characters" } })} />
                        {errors.password ? <p className="mt-2 text-sm text-rose-300">{errors.password.message}</p> : null}
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full rounded-2xl bg-[linear-gradient(90deg,#22d3ee,#0ea5e9,#34d399)] px-5 py-3 font-semibold text-slate-950 disabled:opacity-70">
                        {isSubmitting ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-5 text-sm text-slate-300">
                    Already registered? <Link className="text-cyan-200 hover:text-cyan-100" to={APP_ROUTES.LOGIN}>Login</Link>
                </p>
            </div>
        </section>
    );
};

export default Register;
