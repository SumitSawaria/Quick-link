import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const { verifyEmail } = useAuth();
    const { pushToast } = useToast();

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            pushToast({
                type: "error",
                title: "Verification failed",
                message: "Missing verification token.",
            });
            return;
        }

        verifyEmail(token)
            .then(() => {
                pushToast({
                    type: "success",
                    title: "Email verified",
                    message: "Your email is now verified.",
                });
            })
            .catch((error) => {
                pushToast({
                    type: "error",
                    title: "Verification failed",
                    message: error.message,
                });
            });
    }, [pushToast, searchParams, verifyEmail]);

    return (
        <section className="mx-auto max-w-2xl rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-slate-950/30">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Verification</p>
            <h1 className="mt-3 text-3xl font-black text-white">Verifying Email</h1>
            <p className="mt-3 text-slate-300">Please wait while we validate your verification token and activate your account.</p>
        </section>
    );
};

export default VerifyEmail;
