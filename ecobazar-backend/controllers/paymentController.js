const axios = require('axios');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');


// ======================================================
// CREATE PAYMENT
// ======================================================

const paymentController = async(req, res) => {

    const {
        userId,
        cus_name,
        cus_email,
        cus_add1,
        cus_add2,
        cus_city,
        cus_state,
        cus_postcode,
        cus_phone,
    } = req.body;


    try {

        // ==================================================
        // VALIDATE USER
        // ==================================================

        if (!userId) {

            return res.status(400).json({
                success: false,
                message: 'User ID is required',
            });

        }


        // ==================================================
        // GET CART
        // ==================================================

        const cart = await Cart
            .find({ user: userId })
            .populate('product');


        if (!cart || cart.length === 0) {

            return res.status(400).json({
                success: false,
                message: 'Your cart is empty',
            });

        }


        // ==================================================
        // CALCULATE TOTAL
        // ==================================================

        let totalPrice = 0;

        const products = [];


        cart.forEach((item) => {

            if (!item.product) {
                return;
            }


            products.push({
                title: item.product.title,
                price: item.product.price,
                sku: item.product.sku,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
            });


            totalPrice += Number(
                item.totalPrice || 0
            );

        });


        if (totalPrice <= 0) {

            return res.status(400).json({
                success: false,
                message: 'Invalid cart total',
            });

        }


        // ==================================================
        // UNIQUE TRANSACTION ID
        // ==================================================

        const tranId =
            `ECOBAZAR_${Date.now()}_${Math.floor(
                Math.random() * 10000
            )}`;


        // ==================================================
        // AAMARPAY PAYMENT DATA
        // ==================================================

        const paymentData = {

            store_id: 'aamarpaytest',

            tran_id: tranId,

            success_url: 'http://localhost:5000/payment/success',

            fail_url: 'http://localhost:5000/payment/fail',

            cancel_url: 'http://localhost:5000/payment/cancel',

            amount: totalPrice,

            currency: 'BDT',

            signature_key: 'dbb74894e82415a2f7ff0ec3a97e4183',

            desc: 'EcoBazar Order Payment',

            cus_name,
            cus_email,
            cus_add1,
            cus_add2,
            cus_city,
            cus_state,
            cus_postcode,

            cus_country: 'Bangladesh',

            cus_phone,

            type: 'json',
        };


        console.log(
            'AamarPay Payment Request:',
            paymentData
        );


        // ==================================================
        // SEND REQUEST TO AAMARPAY
        // ==================================================

        const response = await axios.post(
            'https://sandbox.aamarpay.com/jsonpost.php',
            paymentData, {
                headers: {
                    'Content-Type': 'application/json',
                },

                timeout: 30000,
            }
        );


        console.log(
            'AamarPay Response:',
            response.data
        );


        // ==================================================
        // CHECK PAYMENT URL
        // ==================================================

        if (!response.data ||
            response.data.result !== 'true' ||
            !response.data.payment_url
        ) {

            return res.status(400).json({

                success: false,

                message: 'AamarPay payment could not be started.',

                gatewayResponse: response.data,

            });

        }


        // ==================================================
        // CREATE PENDING ORDER
        // ==================================================

        const order = new Order({

            user: userId,

            products: products,

            totalPrice: totalPrice,

            tranid: tranId,

            status: 'pending',

        });


        await order.save();


        console.log(
            'Pending Order Created:',
            order._id
        );


        // ==================================================
        // RESPONSE TO FRONTEND
        // ==================================================

        return res.status(200).json({

            success: true,

            message: 'Payment initialized successfully',

            payment_url: response.data.payment_url,

            tranid: tranId,

        });


    } catch (error) {

        let errorMessage =
            error.message;


        if (
            error.response &&
            error.response.data
        ) {

            errorMessage =
                error.response.data;

        }


        console.error(
            'AamarPay Payment Error:',
            errorMessage
        );


        return res.status(500).json({

            success: false,

            message: 'Payment request failed',

            error: errorMessage,

        });

    }

};



// ======================================================
// PAYMENT SUCCESS CALLBACK
// ======================================================

const paymentSuccessController = async(
    req,
    res
) => {

    try {

        console.log(
            'AamarPay SUCCESS Callback:',
            req.body
        );


        const {
            mer_txnid,
            tran_id,
            pg_txnid,
            pay_status,
            status_code,
            amount,
            pay_time,
        } = req.body || {};


        const transactionId =
            mer_txnid || tran_id;


        if (!transactionId) {

            return res.redirect(
                'http://localhost:5173/order-failed'
            );

        }


        const order =
            await Order.findOne({
                tranid: transactionId,
            });


        if (!order) {

            return res.redirect(
                'http://localhost:5173/order-failed'
            );

        }


        // ==================================================
        // VERIFY PAYMENT
        // ==================================================

        const gatewayAmount =
            Number(amount);


        const orderAmount =
            Number(order.totalPrice);


        const paymentSuccessful =

            pay_status === 'Successful' &&

            String(status_code) === '2' &&

            gatewayAmount === orderAmount;


        if (!paymentSuccessful) {

            order.status = 'reject';

            await order.save();


            return res.redirect(
                'http://localhost:5173/order-failed'
            );

        }


        // ==================================================
        // APPROVE ORDER
        // ==================================================

        order.status = 'approved';


        await order.save();


        // ==================================================
        // CLEAR CART
        // ==================================================

        await Cart.deleteMany({
            user: order.user,
        });


        // ==================================================
        // REDIRECT FRONTEND
        // ==================================================

        return res.redirect(

            `http://localhost:5173/order-success?tranid=${encodeURIComponent(
                transactionId
            )}`

        );


    } catch (error) {

        console.error(
            'Payment Success Error:',
            error
        );


        return res.redirect(
            'http://localhost:5173/order-failed'
        );

    }

};



// ======================================================
// PAYMENT FAILED CALLBACK
// ======================================================

const paymentFailController = async(
    req,
    res
) => {

    try {

        console.log(
            'AamarPay FAILED Callback:',
            req.body
        );


        const {
            mer_txnid,
            tran_id,
        } = req.body;


        const transactionId =
            mer_txnid || tran_id;


        if (transactionId) {

            const order =
                await Order.findOne({
                    tranid: transactionId,
                });


            if (order) {

                order.status =
                    'reject';


                await order.save();

            }

        }


        return res.redirect(
            'http://localhost:5173/order-failed'
        );


    } catch (error) {

        console.error(
            'Payment Failed Error:',
            error
        );


        return res.redirect(
            'http://localhost:5173/order-failed'
        );

    }

};



// ======================================================
// PAYMENT CANCEL CALLBACK
// ======================================================

const paymentCancelController = async(
    req,
    res
) => {

    try {

        console.log(
            'AamarPay CANCEL Callback'
        );


        return res.redirect(
            'http://localhost:5173/order-failed?cancelled=true'
        );


    } catch (error) {

        console.error(
            'Payment Cancel Error:',
            error
        );


        return res.redirect(
            'http://localhost:5173/order-failed'
        );

    }

};



// ======================================================
// GET MY ORDERS
// ======================================================

const getAllOrdersController = async(
    req,
    res
) => {

    try {

        const {
            userid
        } = req.params;


        const data =
            await Order.find({
                user: userid,
            }).sort({
                createdAt: -1,
            });


        return res.status(200).json({

            success: true,

            data,

        });


    } catch (error) {

        console.error(
            'Get Orders Error:',
            error
        );


        return res.status(500).json({

            success: false,

            message: 'Failed to get orders',

        });

    }

};



// ======================================================
// EXPORT
// ======================================================

module.exports = {

    paymentController,

    paymentSuccessController,

    paymentFailController,

    paymentCancelController,

    getAllOrdersController,

};