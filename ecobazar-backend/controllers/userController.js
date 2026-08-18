const User = require("../models/userModels");

// Get All Users
let getAllUsersController = async(req, res) => {
    try {
        const users = await User.find({}).select("-password");

        return res.send({
            success: true,
            message: "All user data",
            userdata: users,
        });

    } catch (error) {
        console.error("Get All Users Error:", error);

        return res.status(500).send({
            success: false,
            message: "Failed to get users",
        });
    }
};


// Get Single User
let singleUserDataController = async(req, res) => {
    try {
        const { id } = req.params;

        const userData = await User.findById(id).select("-password");

        if (!userData) {
            return res.send({
                success: false,
                message: "User not found",
            });
        }

        return res.send({
            success: true,
            message: "User data",
            userdata: userData,
        });

    } catch (error) {
        console.error("Single User Error:", error);

        return res.status(500).send({
            success: false,
            message: "Failed to get user data",
        });
    }
};


// Delete User
let deleteUserController = async(req, res) => {
    try {
        const { id } = req.params;

        const userData = await User.findByIdAndDelete(id);

        if (!userData) {
            return res.send({
                success: false,
                message: "User not found",
            });
        }

        return res.send({
            success: true,
            message: "User deleted successfully",
        });

    } catch (error) {
        console.error("Delete User Error:", error);

        return res.status(500).send({
            success: false,
            message: "Failed to delete user",
        });
    }
};


// Update User
let updateUserController = async(req, res) => {
    try {
        const { id } = req.params;

        const userData = await User.findByIdAndUpdate(
            id,
            req.body, {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        if (!userData) {
            return res.send({
                success: false,
                message: "User not found",
            });
        }

        return res.send({
            success: true,
            message: "User updated successfully",
            userdata: userData,
        });

    } catch (error) {
        console.error("Update User Error:", error);

        return res.status(500).send({
            success: false,
            message: "Failed to update user",
        });
    }
};


// Get Profile
let getProfileController = async(req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Profile data",
            user,
        });

    } catch (error) {
        console.error("Profile Error:", error);

        return res.status(500).send({
            success: false,
            message: "Something went wrong",
        });
    }
};


// Update Profile
let updateProfileController = async(req, res) => {
    try {
        const userId = req.user.id;

        const { firstName, lastName, phoneNumber } = req.body;

        const updateData = {};

        // Personal information
        if (firstName !== undefined) {
            updateData.firstName = firstName;
        }

        if (lastName !== undefined) {
            updateData.lastName = lastName;
        }

        if (phoneNumber !== undefined) {
            updateData.phoneNumber = phoneNumber;
        }

        // Profile image
        if (req.file) {
            updateData.profile = `/uploads/profiles/${req.file.filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData, {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });

    } catch (error) {
        console.error("Update Profile Error:", error);

        return res.status(500).send({
            success: false,
            message: "Something went wrong",
        });
    }
};


module.exports = {
    getAllUsersController,
    singleUserDataController,
    deleteUserController,
    updateUserController,
    getProfileController,
    updateProfileController
};