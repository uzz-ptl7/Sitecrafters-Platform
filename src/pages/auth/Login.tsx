import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn(email, password);

            // Check if there's an error in the result
            if (result && result.error) {
                setError(result.error.message || "Login failed. Please try again.");
                setLoading(false);
                return;
            }

            // Success - navigate to dashboard
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center px-6 py-12">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 via-black to-cyan-950/20" />

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white">
                            Welcome Back
                        </h1>
                        <p className="text-slate-400 mt-3">
                            Login to your SiteCrafters account.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
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

                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl bg-slate-800 border border-slate-700 py-3 pl-11 pr-12 text-white outline-none focus:border-cyan-500 transition"
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="flex justify-end">
                            <Link
                                to="/auth/forgot-password"
                                className="text-sm text-cyan-400 hover:text-cyan-300"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-purple-600 hover:to-cyan-600 transition duration-500 disabled:opacity-50"
                        >
                            {loading ? "Signing In..." : "Login"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-slate-400">
                        Don't have an account?{" "}
                        <Link
                            to="/auth/signup"
                            className="ml-2 text-cyan-400 hover:text-cyan-300"
                        >
                            Create one
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Login;