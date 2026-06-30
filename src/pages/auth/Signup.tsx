import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Signup = () => {
    const navigate = useNavigate();
    const { signUp } = useAuth();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignup = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        setLoading(true);

        const { error } = await signUp(
            form.email,
            form.password,
            form.fullName
        );

        setLoading(false);

        if (error) {
            alert(error.message);
            return;
        }

        alert(
            "Account created successfully.\n\nPlease verify your email before logging in."
        );

        navigate("/auth/login");
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">

            <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/60 p-8">

                <h1 className="text-3xl font-bold text-white text-center">
                    Create Account
                </h1>

                <p className="text-slate-400 text-center mt-2">
                    Join SiteCrafters Client Portal
                </p>

                <form
                    onSubmit={handleSignup}
                    className="mt-8 space-y-5"
                >

                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        required
                        value={form.fullName}
                        onChange={handleChange}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-500"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-500"
                    />

                    <div className="relative">

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            required
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 pr-12 text-white outline-none focus:border-cyan-500"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                            className="absolute right-3 top-3 text-slate-400"
                        >
                            {showPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>

                    </div>

                    <div className="relative">

                        <input
                            type={showConfirm ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            required
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 pr-12 text-white outline-none focus:border-cyan-500"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirm(!showConfirm)
                            }
                            className="absolute right-3 top-3 text-slate-400"
                        >
                            {showConfirm ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>

                    </div>

                    <button
                        disabled={loading}
                        className="w-full rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>

                <p className="mt-6 text-center text-slate-400">
                    Already have an account?{" "}
                    <Link
                        to="/auth/login"
                        className="text-cyan-400 hover:underline"
                    >
                        Login
                    </Link>
                </p>

            </div>

        </div>
    );
};

export default Signup;