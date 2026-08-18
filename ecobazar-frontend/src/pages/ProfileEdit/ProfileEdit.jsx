import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile, updateProfile } from "@/services/authService";

export default function ProfileEdit() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        profile: null,
    });

    const [userId, setUserId] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [profilePreview, setProfilePreview] = useState("");
    const [loading, setLoading] = useState(false);

    // Get existing profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();

                console.log("PROFILE RESPONSE:", response);

                if (response.success) {
                    const user = response.user;

                    setUserId(user._id);

                    setFormData({
                        firstName: user.firstName || "",
                        lastName: user.lastName || "",
                        phoneNumber: user.phoneNumber || "",
                        profile: null,
                    });

                    if (user.profile) {
                        setProfilePreview(
                            `${import.meta.env.VITE_API_URL}${user.profile}`
                        );
                    }
                }
            } catch (error) {
                console.error("PROFILE ERROR:", error);
            }
        };

        fetchProfile();
    }, []);

    // Text input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // Profile image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        // Only image files
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        // Maximum 5MB
        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB.");
            return;
        }

        setProfileImage(file);

        const previewURL = URL.createObjectURL(file);
        setProfilePreview(previewURL);
    };

    // Submit profile
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            alert("User information not loaded yet.");
            return;
        }

        try {
            setLoading(true);

            const data = new FormData();

            data.append("firstName", formData.firstName);
            data.append("lastName", formData.lastName);
            data.append("phoneNumber", formData.phoneNumber);

            if (profileImage) {
                data.append("profile", profileImage);
            }

            const response = await updateProfile(data);

            console.log("UPDATE PROFILE RESPONSE:", response);

            if (response.success) {
                alert("Profile updated successfully");

                if (response.user?.profile) {
                    setProfilePreview(
                        `${import.meta.env.VITE_API_URL}${response.user.profile}`
                    );
                }

                setProfileImage(null);
            } else {
                alert(response.message || "Profile update failed");
            }

        } catch (error) {
            console.error("UPDATE PROFILE ERROR:", error);

            alert(
                error.response?.data?.message ||
                error.friendlyMessage ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light px-md py-section-gap">
            <div className="w-full max-w-3xl mx-auto">

                {/* Page Header */}
                <div className="mb-lg">
                    <h1 className="text-2xl font-bold text-title">
                        Edit Profile
                    </h1>

                    <p className="text-sm mt-sm text-text-muted">
                        Update your personal information.
                    </p>
                </div>

                {/* Edit Profile Card */}
                <div className="rounded-card bg-background shadow-card p-lg">

                    <form onSubmit={handleSubmit}>

                        {/* Profile Image */}
                        <div className="flex flex-col items-center mb-lg">

                            <div className="flex items-center justify-center w-32 h-32 overflow-hidden text-4xl font-bold text-white rounded-full mb-md bg-primary">

                                {profilePreview ? (
                                    <img
                                        src={profilePreview}
                                        alt="Profile"
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    formData.firstName
                                        ? formData.firstName
                                            .charAt(0)
                                            .toUpperCase()
                                        : "U"
                                )}

                            </div>

                            <label
                                htmlFor="profile"
                                className="font-medium text-white cursor-pointer px-lg py-sm rounded-card bg-primary hover:bg-primary-hover"
                            >
                                Choose Profile Image
                            </label>

                            <input
                                id="profile"
                                name="profile"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            {profileImage && (
                                <p className="text-xs mt-sm text-text-muted">
                                    {profileImage.name}
                                </p>
                            )}

                            <p className="text-xs mt-xs text-text-muted">
                                Maximum size: 5MB
                            </p>

                        </div>

                        {/* First Name */}
                        <div className="mb-lg">
                            <label
                                htmlFor="firstName"
                                className="block text-sm font-medium text-title mb-xs"
                            >
                                First Name
                            </label>

                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter your first name"
                                className="w-full border outline-none border-border rounded-card px-md py-sm focus:border-primary"
                            />
                        </div>

                        {/* Last Name */}
                        <div className="mb-lg">
                            <label
                                htmlFor="lastName"
                                className="block text-sm font-medium text-title mb-xs"
                            >
                                Last Name
                            </label>

                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter your last name"
                                className="w-full border outline-none border-border rounded-card px-md py-sm focus:border-primary"
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="mb-lg">
                            <label
                                htmlFor="phoneNumber"
                                className="block text-sm font-medium text-title mb-xs"
                            >
                                Phone Number
                            </label>

                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="text"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                className="w-full border outline-none border-border rounded-card px-md py-sm focus:border-primary"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-md">

                            <Link
                                to="/profile"
                                className="flex-1 font-medium text-center border border-border rounded-card px-lg py-sm text-title"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 font-medium text-white rounded-card bg-primary px-lg py-sm hover:bg-primary-hover disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>

                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}