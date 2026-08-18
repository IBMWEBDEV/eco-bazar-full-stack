const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderModel = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    products: [{
        title: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        sku: {
            type: String,
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        totalPrice: {
            type: Number,
            required: true,
        },
    }, ],

    totalPrice: {
        type: Number,
        required: true,
    },

    tranid: {
        type: String,
        required: true,
        unique: true,
    },

    status: {
        type: String,
        enum: [
            'pending',
            'approved',
            'reject',
            'cancelled',
        ],
        default: 'pending',
    },

    paymentStatus: {
        type: String,
        enum: [
            'pending',
            'paid',
            'failed',
            'cancelled',
        ],
        default: 'pending',
    },

    paymentMethod: {
        type: String,
        default: 'AamarPay',
    },

    paymentTransactionId: {
        type: String,
        default: '',
    },

    paymentTime: {
        type: Date,
        default: null,
    },

    gatewayResponse: {
        type: Object,
        default: {},
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Order', orderModel);