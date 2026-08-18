import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "@/services/authService";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getProfile();

                if (response.success) {
                    console.log("PROFILE USER:", response.user);
                    console.log("PROFILE IMAGE:", response.user.profile);

                    setUser(response.user);
                } else {
                    setError(
                        response.message || "Failed to load profile."
                    );
                }
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    err.friendlyMessage ||
                    "Failed to load profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-error">{error}</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>No profile data found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light px-md py-section-gap">
            <div className="w-full max-w-5xl mx-auto">

                {/* Page Header */}
                <div className="mb-lg">
                    <h1 className="text-2xl font-bold text-title">
                        My Profile
                    </h1>

                    <p className="text-sm mt-sm text-text-muted">
                        Manage your account information and profile settings.
                    </p>
                </div>

                {/* Profile Card */}
                <div className="overflow-hidden rounded-card bg-background shadow-card">

                    {/* Profile Header */}
                    <div className="border-b border-border p-lg">
                        <div className="flex flex-col gap-lg sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-md">

                                {/* Profile Image */}
                                <div className="flex items-center justify-center w-24 h-24 overflow-hidden text-3xl font-bold text-white rounded-full shrink-0 bg-primary">
                                    {user.profile ? (
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}${user.profile}`}
                                            alt={`${user.firstName || ""} ${user.lastName || ""}`}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        (user.firstName || "U")
                                            .charAt(0)
                                            .toUpperCase()
                                    )}
                                </div>

                                {/* Name */}
                                <div>
                                    <h2 className="text-xl font-semibold text-title">
                                        {user.firstName || ""}{" "}
                                        {user.lastName || ""}
                                    </h2>

                                    <p className="text-sm mt-xs text-text-muted">
                                        {user.email}
                                    </p>

                                    <div className="flex flex-wrap mt-sm gap-sm">

                                        {/* Role */}
                                        <span className="text-xs font-medium capitalize rounded-full bg-background-light px-sm py-xs text-text">
                                            {user.role}
                                        </span>

                                        {/* Verification */}
                                        {user.isVerified ? (
                                            <span className="text-xs font-medium text-green-700 bg-green-100 rounded-full px-sm py-xs">
                                                ✓ Email Verified
                                            </span>
                                        ) : (
                                            <span className="text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full px-sm py-xs">
                                                Email Not Verified
                                            </span>
                                        )}

                                    </div>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <Link
                                to="/profile/edit"
                                className="inline-flex items-center justify-center font-medium text-white transition-colors rounded-card bg-primary px-lg py-sm hover:bg-primary-hover"
                            >
                                Edit Profile
                            </Link>

                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="p-lg">

                        <h3 className="text-lg font-semibold mb-lg text-title">
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-1 gap-lg md:grid-cols-2">

                            {/* First Name */}
                            <div>
                                <p className="text-sm mb-xs text-text-muted">
                                    First Name
                                </p>

                                <p className="font-medium text-title">
                                    {user.firstName || "Not added"}
                                </p>
                            </div>

                            {/* Last Name */}
                            <div>
                                <p className="text-sm mb-xs text-text-muted">
                                    Last Name
                                </p>

                                <p className="font-medium text-title">
                                    {user.lastName || "Not added"}
                                </p>
                            </div>

                            {/* Email */}
                            <div>
                                <p className="text-sm mb-xs text-text-muted">
                                    Email Address
                                </p>

                                <p className="font-medium text-title">
                                    {user.email || "Not available"}
                                </p>
                            </div>

                            {/* Phone */}
                            <div>
                                <p className="text-sm mb-xs text-text-muted">
                                    Phone Number
                                </p>

                                <p className="font-medium text-title">
                                    {user.phoneNumber || "Not added"}
                                </p>
                            </div>

                            {/* Account Role */}
                            <div>
                                <p className="text-sm mb-xs text-text-muted">
                                    Account Role
                                </p>

                                <p className="font-medium capitalize text-title">
                                    {user.role || "user"}
                                </p>
                            </div>

                            {/* Email Status */}
                            <div>
                                <p className="text-sm mb-xs text-text-muted">
                                    Email Status
                                </p>

                                <p
                                    className={
                                        user.isVerified
                                            ? "font-medium text-green-600"
                                            : "font-medium text-yellow-600"
                                    }
                                >
                                    {user.isVerified
                                        ? "Verified"
                                        : "Not Verified"}
                                </p>
                            </div>

                        </div>
                    </div>

                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 mt-lg gap-md sm:grid-cols-2 lg:grid-cols-3">

                    <Link
                        to="/profile/edit"
                        className="transition-shadow rounded-card bg-background p-lg shadow-card hover:shadow-lg"
                    >
                        <h3 className="font-semibold text-title">
                            Edit Profile
                        </h3>

                        <p className="text-sm mt-sm text-text-muted">
                            Update your personal information.
                        </p>
                    </Link>

                    <Link
                        to="/profile/address"
                        className="transition-shadow rounded-card bg-background p-lg shadow-card hover:shadow-lg"
                    >
                        <h3 className="font-semibold text-title">
                            Address
                        </h3>

                        <p className="text-sm mt-sm text-text-muted">
                            Manage your billing and delivery address.
                        </p>
                    </Link>

                    <Link
                        to="/profile/security"
                        className="transition-shadow rounded-card bg-background p-lg shadow-card hover:shadow-lg"
                    >
                        <h3 className="font-semibold text-title">
                            Security
                        </h3>

                        <p className="text-sm mt-sm text-text-muted">
                            Manage your password and account security.
                        </p>
                    </Link>

                </div>

            </div>
        </div>
    );
}