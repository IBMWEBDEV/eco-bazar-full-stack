import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '@/services/authService';

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setSuccess('');
        if (
            !formData.firstName.trim() ||
            !formData.lastName.trim() ||
            !formData.email.trim() ||
            !formData.password.trim() ||
            !formData.confirmPassword.trim()
        ) {
            setError('Please fill all fields.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!formData.terms) {
            setError('Please accept the Terms & Conditions.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Password does not match');
            return;
        }

        try {
            setLoading(true);

            const response = await registerUser(formData);

            if (response.success) {
                setSuccess(response.message);

                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                'Registration failed'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background-light px-md py-section-gap">
            <div className="w-full max-w-lg rounded-card bg-background p-lg shadow-card">

                <Link
                    to="/"
                    className="block text-2xl font-bold text-center mb-lg text-primary"
                >
                    EcoBazar
                </Link>

                <h1 className="text-2xl font-semibold text-center mb-lg">
                    Create Account
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-md"
                >
                    <input
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="border rounded-card px-md py-sm"
                    />

                    <input
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="border rounded-card px-md py-sm"
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border rounded-card px-md py-sm"
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="border rounded-card px-md py-sm"
                    />

                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="border rounded-card px-md py-sm"
                    />

                    <label className="flex items-center gap-sm">
                        <input
                            type="checkbox"
                            name="terms"
                            checked={formData.terms}
                            onChange={handleChange}
                        />

                        <span>I agree to Terms & Conditions</span>
                    </label>

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
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <p className="text-sm text-center mt-lg">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-primary"
                    >
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Register;