import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '@/services/authService';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setSuccess('');

        if (!email.trim()) {
            setError('Please enter your email.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setError('Please enter a valid email.');
            return;
        }

        try {
            setLoading(true);

            const response = await forgotPassword({ email });

            if (response.success) {
                setSuccess(response.message);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.friendlyMessage ||
                'Something went wrong.'
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
                    className="block text-2xl font-bold text-center mb-lg text-primary"
                >
                    EcoBazar
                </Link>

                <h1 className="text-2xl font-semibold text-center mb-md">
                    Forgot Password
                </h1>

                <p className="text-sm text-center mb-lg text-text-muted">
                    Enter your email address and we'll send you a password reset link.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-md">

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded-card border-border px-md py-sm"
                    />

                    {error && (
                        <p className="text-sm text-error">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="text-sm text-success">
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="text-white rounded-card bg-primary py-sm"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                </form>

                <p className="text-sm text-center mt-lg">
                    <Link
                        to="/login"
                        className="text-primary"
                    >
                        Back to Login
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default ForgotPassword;