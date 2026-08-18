import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setIsSubmitting(true);

        try {
            const response = await loginUser({
                email,
                password,
            });

            if (!response.success) {
                throw {
                    response: {
                        data: {
                            message: response.message,
                        },
                    },
                };
            }

            login(response.user, response.token);

            navigate('/');
        } catch (err) {
            setError(
                err.friendlyMessage ||
                err.response?.data?.message ||
                'Login failed. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background-light px-md py-section-gap">
            <div className="w-full max-w-md rounded-card bg-background p-lg shadow-card">
                <Link
                    to="/"
                    className="block text-2xl font-bold text-center mb-lg text-primary"
                >
                    EcoBazar
                </Link>

                <h1 className="text-xl font-semibold text-center mb-lg text-title">
                    Login
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-md">
                    <div className="flex flex-col gap-sm">
                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border rounded-card border-border px-md py-sm"
                        />
                    </div>

                    <div className="flex flex-col gap-sm">
                        <label>Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border rounded-card border-border px-md py-sm"
                        />
                    </div>

                    <div className="text-right">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>

                    <button
                        disabled={isSubmitting}
                        className="w-full text-white bg-primary py-sm rounded-card"
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>

                    {error && (
                        <p className="text-center text-error">
                            {error}
                        </p>
                    )}
                </form>

                <p className="text-center mt-lg">
                    Don't have an account?{' '}
                    <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;