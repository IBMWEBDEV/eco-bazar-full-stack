const Address = require("../models/addressModel");

// ==========================================
// ADD ADDRESS
// ==========================================

const addAddressController = async(req, res) => {
    try {
        const userId = req.user.id;

        const {
            fullName,
            phone,
            address,
            city,
            area,
            postalCode,
            isDefault,
        } = req.body;

        // Required field validation
        if (!fullName ||
            !phone ||
            !address ||
            !city ||
            !area ||
            !postalCode
        ) {
            return res.status(400).send({
                success: false,
                message: "Please fill all address fields",
            });
        }

        // If this address is default,
        // remove default from previous addresses
        if (isDefault === true) {
            await Address.updateMany({ userId }, { $set: { isDefault: false } });
        }

        const newAddress = await Address.create({
            userId,
            fullName,
            phone,
            address,
            city,
            area,
            postalCode,
            isDefault: isDefault || false,
        });

        return res.status(201).send({
            success: true,
            message: "Address added successfully",
            address: newAddress,
        });

    } catch (error) {
        console.error("Add Address Error:", error);

        return res.status(500).send({
            success: false,
            message: "Failed to add address",
        });
    }
};


// ==========================================
// GET MY ADDRESSES
// ==========================================

const getMyAddressesController = async(req, res) => {
    try {
        const userId = req.user.id;

        const addresses = await Address.find({ userId }).sort({
            createdAt: -1,
        });

        return res.status(200).send({
            success: true,
            message: "Address data",
            addresses,
        });

    } catch (error) {
        console.error("Get Addresses Error:", error);

        return res.status(500).send({
            success: false,
            message: "Failed to get addresses",
        });
    }
};


// ==========================================
// UPDATE ADDRESS
// ==========================================

const updateAddressController = async(req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const {
            fullName,
            phone,
            address,
            city,
            area,
            postalCode,
            isDefault,
        } = req.body;

        const existingAddress = await Address.findOne({
            _id: id,
            userId,
        });

        if (!existingAddress) {
            return res.status(404).send({
                success: false,
                message: "Address not found",
            });
        }

        // If changing this address to default
        if (isDefault === true) {
            await Address.updateMany({ userId }, { $set: { isDefault: false } });
        }

        const updatedAddress = await Address.findOneAndUpdate({
            _id: id,
            userId,
        }, {
            fullName,
            phone,
            address,
            city,
            area,
            postalCode,
            isDefault: isDefault || false,
        }, {
            new: true,
            runValidators: true,
        });

        return res.status(200).send({
            success: true,
            message: "Address updated successfully",
            address: updatedAddress,
        });

    } catch (error) {
        console.error("Update Address Error:", error);

        return res.status(500).send({
            success: false,
            message: "Failed to update address",
        });
    }
};


// ==========================================
// DELETE ADDRESS
// ==========================================

const deleteAddressController = async(req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const deletedAddress = await Address.findOneAndDelete({
            _id: id,
            userId,
        });

        if (!deletedAddress) {
            return res.status(404).send({
                success: false,
                message: "Address not found",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Address deleted successfully",
        });

    } catch (error) {
        console.error("Delete Address Error:", error);

        return res.status(500).send({
            success: false,
            message: "Failed to delete address",
        });
    }
};


// ==========================================
// SET DEFAULT ADDRESS
// ==========================================

const setDefaultAddressController = async(req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const address = await Address.findOne({
            _id: id,
            userId,
        });

        if (!address) {
            return res.status(404).send({
                success: false,
                message: "Address not found",
            });
        }

        // Remove default from all user's addresses
        await Address.updateMany({ userId }, { $set: { isDefault: false } });

        // Make selected address default
        address.isDefault = true;

        await address.save();

        return res.status(200).send({
            success: true,
            message: "Default address updated successfully",
            address,
        });

    } catch (error) {
        console.error("Set Default Address Error:", error);

        return res.status(500).send({
            success: false,
            message: "Failed to set default address",
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    addAddressController,
    getMyAddressesController,
    updateAddressController,
    deleteAddressController,
    setDefaultAddressController,
};