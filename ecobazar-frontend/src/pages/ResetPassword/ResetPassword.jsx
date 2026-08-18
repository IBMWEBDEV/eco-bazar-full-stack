import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "@/services/authService";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!password.trim() || !confirmPassword.trim()) {
            return setError("Please fill all fields.");
        }

        if (password.length < 6) {
            return setError("Password must be at least 6 characters.");
        }

        if (password !== confirmPassword) {
            return setError("Passwords do not match.");
        }

        try {
            setLoading(true);

            const response = await resetPassword(token, {
                password,
                confirmPassword,
            });

            if (!response.success) {
                return setError(response.message);
            }

            setSuccess(response.message);

            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.friendlyMessage ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background-light px-md py-section-gap">
            <div className="w-full max-w-md rounded-card bg-background p-lg shadow-card">

                <Link
                    to="/login"
                    className="block text-3xl font-bold text-center mb-lg text-primary"
                >
                    EcoBazar
                </Link>

                <h1 className="text-2xl font-semibold text-center mb-md">
                    Reset Password
                </h1>

                <p className="text-sm text-center mb-lg text-text-muted">
                    Enter your new password below.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-md"
                >

                    <div className="flex flex-col gap-sm">

                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border rounded-card border-border px-md py-sm"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                            className="text-xs text-left text-primary"
                        >
                            {showPassword ? "Hide Password" : "Show Password"}
                        </button>

                    </div>

                    <div className="flex flex-col gap-sm">

                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            className="border rounded-card border-border px-md py-sm"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="text-xs text-left text-primary"
                        >
                            {showConfirmPassword
                                ? "Hide Password"
                                : "Show Password"}
                        </button>

                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-100 rounded">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 text-sm text-green-600 bg-green-100 rounded">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="font-semibold text-white transition rounded-card bg-primary py-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading
                            ? "Updating Password..."
                            : "Reset Password"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default ResetPassword;