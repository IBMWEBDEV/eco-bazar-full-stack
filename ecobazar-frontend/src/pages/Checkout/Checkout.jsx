import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    MapPin,
    Plus,
    CheckCircle2,
    ShoppingBag,
    CreditCard,
    Loader2,
    AlertCircle,
    User,
    Phone,
    Mail,
    ArrowLeft,
    Trash2,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';

import { getCart } from '@/services/cartService';

import { getAddresses } from '@/services/addressService';

import axiosInstance from '@/api/axios';

import { API_ENDPOINTS } from '@/constants/api';


export default function Checkout() {

    const navigate = useNavigate();

    const {
        user,
        isAuthenticated,
        loading: authLoading,
    } = useAuth();


    // ==========================================
    // STATE
    // ==========================================

    const [cartItems, setCartItems] = useState([]);

    const [cartTotal, setCartTotal] = useState(0);

    const [addresses, setAddresses] = useState([]);

    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const [loading, setLoading] = useState(true);

    const [paymentLoading, setPaymentLoading] = useState(false);

    const [error, setError] = useState('');

    const [success, setSuccess] = useState('');


    // ==========================================
    // USER ID
    // ==========================================

    const userId =
        user?._id ||
        user?.id ||
        user?.userId;


    // ==========================================
    // USER INFORMATION
    // ==========================================

    const customerName =
        user?.name ||
        user?.fullName ||
        '';

    const customerEmail =
        user?.email ||
        '';

    const customerPhone =
        user?.phone ||
        '';


    // ==========================================
    // FETCH CHECKOUT DATA
    // ==========================================

    const fetchCheckoutData = useCallback(async () => {

        if (!userId) {
            setLoading(false);
            return;
        }


        try {

            setLoading(true);
            setError('');


            const [
                cartResponse,
                addressResponse,
            ] = await Promise.all([

                getCart(userId),

                getAddresses(),

            ]);


            // ==========================================
            // CART
            // ==========================================

            const cart =
                cartResponse?.cart || [];

            const total =
                Number(
                    cartResponse?.totalPrice || 0
                );


            setCartItems(cart);

            setCartTotal(total);


            // ==========================================
            // ADDRESSES
            // ==========================================

            const addressList =
                addressResponse?.addresses || [];


            setAddresses(addressList);


            // ==========================================
            // SELECT DEFAULT ADDRESS
            // ==========================================

            const defaultAddress =
                addressList.find(
                    (address) =>
                        address?.isDefault === true
                );


            if (defaultAddress) {

                setSelectedAddressId(
                    defaultAddress._id
                );

            } else if (addressList.length > 0) {

                setSelectedAddressId(
                    addressList[0]._id
                );

            }


        } catch (error) {

            setError(
                error?.friendlyMessage ||
                error?.response?.data?.message ||
                'Failed to load checkout information.'
            );

        } finally {

            setLoading(false);
        }

    }, [userId]);


    // ==========================================
    // LOAD CHECKOUT
    // ==========================================

    useEffect(() => {

        if (!authLoading) {
            fetchCheckoutData();
        }

    }, [authLoading, fetchCheckoutData]);


    // ==========================================
    // SELECTED ADDRESS
    // ==========================================

    const selectedAddress = useMemo(() => {

        return addresses.find(
            (address) =>
                address._id === selectedAddressId
        );

    }, [
        addresses,
        selectedAddressId,
    ]);


    // ==========================================
    // PRODUCT IMAGE
    // ==========================================

    const getProductImage = (product) => {

        if (!product?.images?.length) {
            return null;
        }


        const mainImage =
            product.images.find(
                (image) =>
                    image?.isMain === true
            );


        return (
            mainImage?.url ||
            product.images[0]?.url ||
            null
        );
    };


    // ==========================================
    // PAYMENT
    // ==========================================

    const handlePayment = async () => {

        setError('');
        setSuccess('');

        console.log('========== PAYMENT START ==========');
        console.log('User ID:', userId);
        console.log('Cart Items:', cartItems);
        console.log('Selected Address:', selectedAddress);


        // ==========================================
        // CART VALIDATION
        // ==========================================

        if (!cartItems.length) {

            setError('Your cart is empty.');

            return;
        }


        // ==========================================
        // ADDRESS VALIDATION
        // ==========================================

        if (!selectedAddress) {

            setError(
                'Please select a delivery address.'
            );

            return;
        }


        // ==========================================
        // USER VALIDATION
        // ==========================================

        if (!userId) {

            setError(
                'User information is missing. Please login again.'
            );

            return;
        }


        try {

            setPaymentLoading(true);


            // ==========================================
            // PAYMENT DATA
            // ==========================================

            const paymentData = {

                userId,

                cus_name:
                    selectedAddress.fullName ||
                    customerName,

                cus_email:
                    customerEmail,

                cus_add1:
                    selectedAddress.address,

                cus_add2:
                    selectedAddress.area || '',

                cus_city:
                    selectedAddress.city,

                cus_state:
                    selectedAddress.area || '',

                cus_postcode:
                    selectedAddress.postalCode,

                cus_phone:
                    selectedAddress.phone ||
                    customerPhone,

            };


            console.log(
                'PAYMENT DATA:',
                paymentData
            );


            // ==========================================
            // SEND PAYMENT REQUEST
            // ==========================================

            const response =
                await axiosInstance.post(
                    API_ENDPOINTS.orders.CREATE_PAYMENT,
                    paymentData
                );


            console.log(
                'RAW PAYMENT RESPONSE:',
                response
            );


            console.log(
                'PAYMENT RESPONSE DATA:',
                response?.data
            );


            const paymentResponse =
                response?.data;


            // ==========================================
            // FIND PAYMENT URL
            // ==========================================

            const paymentDataFromBackend =
                paymentResponse?.payment ||
                paymentResponse?.data ||
                paymentResponse;


            const paymentUrl =
                paymentDataFromBackend?.payment_url ||
                paymentDataFromBackend?.paymentUrl ||
                paymentDataFromBackend?.redirect_url ||
                paymentDataFromBackend?.redirectUrl ||
                paymentDataFromBackend?.url ||
                paymentDataFromBackend?.payment_url;


            console.log(
                'PAYMENT URL:',
                paymentUrl
            );


            // ==========================================
            // REDIRECT TO PAYMENT
            // ==========================================

            if (paymentUrl) {

                console.log(
                    'Redirecting to payment:',
                    paymentUrl
                );

                window.location.href =
                    paymentUrl;

                return;
            }


            // ==========================================
            // PAYMENT ERROR
            // ==========================================

            if (
                paymentResponse?.success === false
            ) {

                setError(
                    paymentResponse?.message ||
                    'Payment could not be started.'
                );

                return;
            }


            // ==========================================
            // NO PAYMENT URL
            // ==========================================

            console.warn(
                'Payment URL was not found in response.'
            );


            setError(
                'Payment gateway did not return a payment URL. Please check the browser console.'
            );


        } catch (error) {

            console.error(
                'PAYMENT ERROR:',
                error
            );


            console.error(
                'PAYMENT ERROR RESPONSE:',
                error?.response?.data
            );


            setError(
                error?.friendlyMessage ||
                error?.response?.data?.message ||
                'Payment request failed. Please try again.'
            );


        } finally {

            setPaymentLoading(false);

        }

    };

    // ==========================================
    // AUTH LOADING
    // ==========================================

    if (authLoading) {

        return (

            <div className="flex items-center justify-center min-h-screen bg-gray-50">

                <div className="text-center">

                    <Loader2
                        className="w-10 h-10 mx-auto mb-4 text-green-600 animate-spin"
                    />

                    <p className="text-gray-600">
                        Checking your account...
                    </p>

                </div>

            </div>
        );
    }


    // ==========================================
    // LOGIN REQUIRED
    // ==========================================

    if (!isAuthenticated || !userId) {

        return (

            <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">

                <div className="w-full max-w-md p-8 text-center bg-white border border-gray-100 shadow-sm rounded-2xl">

                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-5 bg-green-100 rounded-full">

                        <User className="w-8 h-8 text-green-600" />

                    </div>


                    <h1 className="mb-2 text-2xl font-bold text-gray-900">
                        Login Required
                    </h1>


                    <p className="mb-6 text-gray-500">
                        Please login to continue with checkout.
                    </p>


                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="w-full py-3 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                    >
                        Go to Login
                    </button>

                </div>

            </div>
        );
    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="flex items-center justify-center min-h-screen bg-gray-50">

                <div className="text-center">

                    <Loader2
                        className="w-10 h-10 mx-auto mb-4 text-green-600 animate-spin"
                    />

                    <p className="text-gray-600">
                        Preparing your checkout...
                    </p>

                </div>

            </div>
        );
    }


    // ==========================================
    // EMPTY CART
    // ==========================================

    if (!cartItems.length) {

        return (

            <div className="min-h-screen px-4 py-16 bg-gray-50">

                <div className="max-w-xl p-10 mx-auto text-center bg-white border border-gray-100 shadow-sm rounded-2xl">

                    <ShoppingBag
                        className="mx-auto mb-5 text-gray-400 w-14 h-14"
                    />


                    <h1 className="mb-2 text-2xl font-bold text-gray-900">
                        Your Cart is Empty
                    </h1>


                    <p className="mb-6 text-gray-500">
                        Add some products before continuing to checkout.
                    </p>


                    <button
                        type="button"
                        onClick={() => navigate('/shop')}
                        className="px-6 py-3 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                    >
                        Continue Shopping
                    </button>

                </div>

            </div>
        );
    }


    // ==========================================
    // MAIN CHECKOUT
    // ==========================================

    return (

        <div className="min-h-screen px-4 py-10 bg-gray-50">

            <div className="mx-auto max-w-7xl">


                {/* ==========================================
                    HEADER
                ========================================== */}

                <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h1 className="text-3xl font-bold text-gray-900">
                            Checkout
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Complete your delivery information and payment.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() => navigate('/cart')}
                        className="inline-flex items-center gap-2 px-4 py-2 font-medium text-gray-700 transition border border-gray-300 rounded-lg hover:bg-white"
                    >

                        <ArrowLeft className="w-4 h-4" />

                        Back to Cart

                    </button>

                </div>


                {/* ==========================================
                    ERROR
                ========================================== */}

                {error && (

                    <div className="flex items-center gap-3 px-4 py-3 mb-6 text-red-700 border border-red-200 rounded-xl bg-red-50">

                        <AlertCircle className="w-5 h-5 shrink-0" />

                        <span className="font-medium">
                            {error}
                        </span>

                        <button
                            type="button"
                            onClick={() => setError('')}
                            className="ml-auto text-lg"
                        >
                            ×
                        </button>

                    </div>
                )}


                {/* ==========================================
                    SUCCESS
                ========================================== */}

                {success && (

                    <div className="flex items-center gap-3 px-4 py-3 mb-6 text-green-700 border border-green-200 rounded-xl bg-green-50">

                        <CheckCircle2 className="w-5 h-5 shrink-0" />

                        <span className="font-medium">
                            {success}
                        </span>

                    </div>
                )}


                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">


                    {/* ==========================================
                        LEFT SIDE
                    ========================================== */}

                    <div className="space-y-6 lg:col-span-2">


                        {/* ==========================================
                            DELIVERY ADDRESS
                        ========================================== */}

                        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">

                            <div className="flex items-center justify-between mb-6">

                                <div className="flex items-center gap-3">

                                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">

                                        <MapPin className="w-5 h-5 text-green-600" />

                                    </div>


                                    <div>

                                        <h2 className="text-xl font-bold text-gray-900">
                                            Delivery Address
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            Select where you want your order delivered.
                                        </p>

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate('/profile/address')
                                    }
                                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold text-green-600 transition rounded-lg hover:bg-green-50"
                                >

                                    <Plus className="w-4 h-4" />

                                    Add Address

                                </button>

                            </div>


                            {addresses.length === 0 ? (

                                <div className="p-6 text-center border border-gray-300 border-dashed rounded-xl">

                                    <MapPin className="w-8 h-8 mx-auto mb-3 text-gray-400" />

                                    <p className="mb-4 font-medium text-gray-700">
                                        You don't have any saved address.
                                    </p>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate('/profile/address')
                                        }
                                        className="px-5 py-2.5 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700"
                                    >
                                        Add Delivery Address
                                    </button>

                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {addresses.map((address) => {

                                        const selected =
                                            selectedAddressId ===
                                            address._id;


                                        return (

                                            <button
                                                key={address._id}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedAddressId(
                                                        address._id
                                                    )
                                                }
                                                className={`w-full p-4 text-left border rounded-xl transition ${selected
                                                    ? 'border-green-500 bg-green-50 ring-2 ring-green-100'
                                                    : 'border-gray-200 hover:border-green-300'
                                                    }`}
                                            >

                                                <div className="flex gap-4">

                                                    {/* RADIO */}

                                                    <div className="pt-1">

                                                        <div
                                                            className={`flex items-center justify-center w-5 h-5 border-2 rounded-full ${selected
                                                                ? 'border-green-600'
                                                                : 'border-gray-300'
                                                                }`}
                                                        >

                                                            {selected && (

                                                                <div className="w-2.5 h-2.5 bg-green-600 rounded-full" />

                                                            )}

                                                        </div>

                                                    </div>


                                                    {/* ADDRESS */}

                                                    <div className="flex-1">

                                                        <div className="flex flex-wrap items-center gap-2">

                                                            <h3 className="font-semibold text-gray-900">

                                                                {address.fullName}

                                                            </h3>


                                                            {address.isDefault && (

                                                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">

                                                                    <CheckCircle2 className="w-3 h-3" />

                                                                    Default

                                                                </span>

                                                            )}

                                                        </div>


                                                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">

                                                            <Phone className="w-4 h-4" />

                                                            {address.phone}

                                                        </div>


                                                        <p className="mt-2 text-sm leading-6 text-gray-600">

                                                            {address.address},

                                                            {' '}

                                                            {address.area},

                                                            {' '}

                                                            {address.city}

                                                            {' '}

                                                            - {address.postalCode}

                                                        </p>

                                                    </div>

                                                </div>

                                            </button>
                                        );
                                    })}

                                </div>

                            )}

                        </div>


                        {/* ==========================================
                            CUSTOMER INFORMATION
                        ========================================== */}

                        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">

                            <div className="flex items-center gap-3 mb-6">

                                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">

                                    <User className="w-5 h-5 text-green-600" />

                                </div>


                                <div>

                                    <h2 className="text-xl font-bold text-gray-900">
                                        Customer Information
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Your account information.
                                    </p>

                                </div>

                            </div>


                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">


                                <div className="p-4 bg-gray-50 rounded-xl">

                                    <div className="flex items-center gap-2 mb-1 text-sm text-gray-500">

                                        <User className="w-4 h-4" />

                                        Name

                                    </div>

                                    <p className="font-semibold text-gray-900">
                                        {customerName || 'Not available'}
                                    </p>

                                </div>


                                <div className="p-4 bg-gray-50 rounded-xl">

                                    <div className="flex items-center gap-2 mb-1 text-sm text-gray-500">

                                        <Mail className="w-4 h-4" />

                                        Email

                                    </div>

                                    <p className="font-semibold text-gray-900 break-all">
                                        {customerEmail || 'Not available'}
                                    </p>

                                </div>


                                <div className="p-4 bg-gray-50 rounded-xl sm:col-span-2">

                                    <div className="flex items-center gap-2 mb-1 text-sm text-gray-500">

                                        <Phone className="w-4 h-4" />

                                        Phone

                                    </div>

                                    <p className="font-semibold text-gray-900">
                                        {selectedAddress?.phone || customerPhone || 'Not available'}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ==========================================
                            ORDER ITEMS
                        ========================================== */}

                        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">

                            <div className="flex items-center gap-3 mb-6">

                                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">

                                    <ShoppingBag className="w-5 h-5 text-green-600" />

                                </div>


                                <div>

                                    <h2 className="text-xl font-bold text-gray-900">
                                        Your Order
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        {cartItems.length} product{cartItems.length !== 1 ? 's' : ''} in your cart.
                                    </p>

                                </div>

                            </div>


                            <div className="space-y-4">

                                {cartItems.map((item) => {

                                    const product =
                                        item?.product;

                                    const image =
                                        getProductImage(product);


                                    return (

                                        <div
                                            key={item._id}
                                            className="flex gap-4 p-4 border border-gray-100 rounded-xl"
                                        >

                                            <div className="flex items-center justify-center w-20 h-20 overflow-hidden bg-gray-100 rounded-lg shrink-0">

                                                {image ? (

                                                    <img
                                                        src={image}
                                                        alt={
                                                            product?.title ||
                                                            'Product'
                                                        }
                                                        className="object-cover w-full h-full"
                                                    />

                                                ) : (

                                                    <ShoppingBag className="text-gray-400 w-7 h-7" />

                                                )}

                                            </div>


                                            <div className="flex-1 min-w-0">

                                                <h3 className="font-semibold text-gray-900 truncate">

                                                    {product?.title ||
                                                        'Product'}

                                                </h3>


                                                <p className="mt-1 text-sm text-gray-500">

                                                    Quantity:
                                                    {' '}
                                                    {item.quantity}

                                                </p>


                                                <p className="mt-2 font-semibold text-green-600">

                                                    ৳ {Number(
                                                        item.totalPrice || 0
                                                    ).toLocaleString('en-BD')}

                                                </p>

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>

                        </div>

                    </div>


                    {/* ==========================================
                        RIGHT SIDE — SUMMARY
                    ========================================== */}

                    <div>

                        <div className="sticky p-6 bg-white border border-gray-100 shadow-sm rounded-2xl top-6">

                            <h2 className="mb-6 text-xl font-bold text-gray-900">
                                Order Summary
                            </h2>


                            {/* SUBTOTAL */}

                            <div className="flex items-center justify-between py-3 text-gray-600">

                                <span>
                                    Subtotal
                                </span>

                                <span className="font-medium text-gray-900">

                                    ৳ {cartTotal.toLocaleString('en-BD')}

                                </span>

                            </div>


                            {/* DELIVERY */}

                            <div className="flex items-center justify-between py-3 text-gray-600">

                                <span>
                                    Delivery Charge
                                </span>

                                <span className="font-medium text-gray-900">

                                    Calculated by store

                                </span>

                            </div>


                            <div className="my-4 border-t border-gray-200" />


                            {/* TOTAL */}

                            <div className="flex items-center justify-between">

                                <span className="text-lg font-bold text-gray-900">
                                    Order Total
                                </span>

                                <span className="text-2xl font-bold text-green-600">

                                    ৳ {cartTotal.toLocaleString('en-BD')}

                                </span>

                            </div>


                            {/* SELECTED ADDRESS */}

                            {selectedAddress && (

                                <div className="p-4 mt-6 bg-gray-50 rounded-xl">

                                    <div className="flex items-center gap-2 mb-2">

                                        <MapPin className="w-4 h-4 text-green-600" />

                                        <span className="text-sm font-semibold text-gray-900">
                                            Delivering To
                                        </span>

                                    </div>


                                    <p className="text-sm font-medium text-gray-900">
                                        {selectedAddress.fullName}
                                    </p>


                                    <p className="mt-1 text-sm leading-5 text-gray-600">

                                        {selectedAddress.address},

                                        {' '}

                                        {selectedAddress.city}

                                        {' '}

                                        - {selectedAddress.postalCode}

                                    </p>

                                </div>

                            )}


                            {/* PAYMENT BUTTON */}

                            <button
                                type="button"
                                onClick={handlePayment}
                                disabled={
                                    paymentLoading ||
                                    !selectedAddress
                                }
                                className="flex items-center justify-center w-full gap-2 py-3.5 mt-6 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >

                                {paymentLoading ? (

                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />

                                        Processing Payment...
                                    </>

                                ) : (

                                    <>
                                        <CreditCard className="w-5 h-5" />

                                        Proceed to Payment
                                    </>

                                )}

                            </button>


                            <p className="mt-4 text-xs leading-5 text-center text-gray-500">

                                Your payment will be processed securely through the available payment gateway.

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}