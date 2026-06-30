import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const ForgotPassword = () => {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await forgotPassword(email);

        setLoading(false);

        if (error) {
            alert(error.message);
            return;
        }

        setSubmitted(true);
    };

    if (submitted) {
        return (
            <main className="min-h-screen bg-black flex items-center justify-center px-6 py-12">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 via-black to-cyan-950/20" />

                <div className="relative z-10 w-full max-w-md">
                    <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-green-400" />
                        </div>

                        <h1 className="text-3xl font-bold text-white mb-3">
                            Check Your Email
                        </h1>

                        <p className="text-slate-400 mb-6">
                            We've sent a password reset link to <span className="text-cyan-400">{email}</span>
                        </p>

                        <Link
                            to="/auth/login"
                            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
                        >
                            <ArrowLeft size={18} />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black flex items-center justify-center px-6 py-12">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 via-black to-cyan-950/20" />

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white">
                            Reset Password
                        </h1>

                        <p className="text-slate-400 mt-3">
                            Enter your email and we'll send you a reset link.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                required
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl bg-slate-800 border border-slate-700 py-3 pl-11 pr-4 text-white outline-none focus:border-cyan-500 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-purple-600 hover:to-cyan-600 transition duration-500 disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-slate-400">
                        <Link
                            to="/auth/login"
                            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
                        >
                            <ArrowLeft size={18} />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ForgotPassword;