import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react";
import { API_URL } from "@/lib/api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Forgot Password State
    const [isForgot, setIsForgot] = useState(false);
    const [forgotStep, setForgotStep] = useState(1); // 1: Email & New Pass, 2: OTP
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data);
                navigate("/browse");
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            console.error("Login Error:", err);
            // Try to extract text from response if JSON failed, or just show the error message
            let errMsg = "Network error or server is offline.";
            // Since we can't easily distinguish 502/empty body from generic fetch error here without more logic, 
            // checking the message is a reasonable heuristic.
            if (err.message && err.message.includes("Unexpected end of JSON")) {
                errMsg = "Server Error: Empty response (Backend might be offline)";
            } else if (err.message) {
                errMsg = err.message;
            }
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotSendOtp = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/forgot-password-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMsg(`OTP sent to ${email}`);
                setForgotStep(2);
            } else {
                setError(data.message || "Failed to send OTP");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMsg("Password reset successfully! Redirecting...");
                // Keep loading true to prevent double clicks during timeout
                setTimeout(() => {
                    setIsForgot(false);
                    setForgotStep(1);
                    setPassword("");
                    setSuccessMsg("Your password has been changed Successfully");
                    setError(""); // Ensure no residual errors
                    setLoading(false); // Reset loading only after redirect
                }, 2000);
            } else {
                setError(data.message || "Failed to reset password");
                setLoading(false);
            }
        } catch (err) {
            setError("Network error. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px]" />

            <div className="w-full max-w-md relative z-10 animate-fade-up">
                <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    <div className="text-center mb-8">
                        <h1 className="font-display text-3xl font-bold mb-2">
                            {isForgot ? (forgotStep === 1 ? "Reset Password" : "Verify OTP") : "Welcome Back"}
                        </h1>
                        <p className="text-muted-foreground">
                            {isForgot
                                ? (forgotStep === 1 ? "Enter your email and new password" : "Enter the OTP sent to your email")
                                : "Sign in to continue listening"}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {successMsg && (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-3 rounded-lg mb-6 text-sm text-center">
                            {successMsg}
                        </div>
                    )}

                    {!isForgot ? (
                        /* LOGIN FORM */
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5 ml-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 ml-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                                    placeholder="Enter your password"
                                />
                                <div className="flex justify-end mt-1">
                                    <button
                                        type="button"
                                        onClick={() => { setIsForgot(true); setError(""); setSuccessMsg(""); }}
                                        className="text-xs text-primary hover:underline"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="hero"
                                className="w-full h-12 text-base mt-2"
                                disabled={loading}
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                    ) : (
                        /* FORGOT PASSWORD FORM */
                        <form onSubmit={forgotStep === 1 ? handleForgotSendOtp : handleResetPassword} className="space-y-4">
                            {forgotStep === 1 ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 ml-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 ml-1">New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 ml-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="hero"
                                        className="w-full h-12 text-base mt-2"
                                        disabled={loading}
                                    >
                                        {loading ? "Sending OTP..." : "Get OTP"}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 ml-1">Enter OTP</label>
                                        <input
                                            type="text"
                                            required
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50 text-center tracking-widest text-xl"
                                            placeholder="XXXXXX"
                                        />
                                        <p className="text-xs text-muted-foreground mt-2 text-center">
                                            OTP sent to {email}
                                        </p>
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="hero"
                                        className="w-full h-12 text-base mt-2"
                                        disabled={loading}
                                    >
                                        {loading ? "Verifying..." : "Verify & Update Password"}
                                    </Button>
                                </>
                            )}
                        </form>
                    )}

                    <div className="text-center mt-6">
                        {isForgot ? (
                            <button
                                onClick={() => { setIsForgot(false); setForgotStep(1); setError(""); }}
                                className="text-sm text-muted-foreground hover:text-white transition-colors"
                            >
                                Cancel and back to Login
                            </button>
                        ) : (
                            <p className="text-muted-foreground text-sm">
                                Don't have an account?{" "}
                                <Link to="/register" className="text-primary hover:underline font-medium">
                                    Create Account
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
