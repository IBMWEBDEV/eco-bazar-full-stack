import { useCallback, useEffect, useState } from 'react';
import {
    ShoppingCart,
    Minus,
    Plus,
    Trash2,
    Loader2,
    AlertCircle,
    CheckCircle2,
    ShoppingBag,
    ArrowRight,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import {
    getCart,
    updateCart,
    deleteCartItem,
} from '@/services/cartService';


export default function Cart() {

    // ==========================================
    // AUTH
    // ==========================================

    const { user, isAuthenticated, loading: authLoading } = useAuth();


    // ==========================================
    // STATE
    // ==========================================

    const [cartItems, setCartItems] = useState([]);

    const [totalPrice, setTotalPrice] = useState(0);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    const [success, setSuccess] = useState('');

    const [actionLoading, setActionLoading] = useState(null);


    // ==========================================
    // USER ID
    // ==========================================

    const userId =
        user?._id ||
        user?.id ||
        user?.userId;


    // ==========================================
    // CLEAR MESSAGES
    // ==========================================

    const clearMessages = () => {
        setError('');
        setSuccess('');
    };


    // ==========================================
    // GET CART
    // ==========================================

    const fetchCart = useCallback(async () => {

        if (!userId) {
            setCartItems([]);
            setTotalPrice(0);
            setLoading(false);
            return;
        }


        try {

            setLoading(true);
            setError('');


            const response = await getCart(userId);


            setCartItems(response?.cart || []);

            setTotalPrice(
                Number(response?.totalPrice || 0)
            );


        } catch (error) {

            setError(
                error?.friendlyMessage ||
                error?.response?.data?.message ||
                'Failed to load your cart.'
            );

        } finally {

            setLoading(false);
        }

    }, [userId]);


    // ==========================================
    // INITIAL CART LOAD
    // ==========================================

    useEffect(() => {

        if (!authLoading) {
            fetchCart();
        }

    }, [authLoading, fetchCart]);


    // ==========================================
    // UPDATE QUANTITY
    // ==========================================

    const handleQuantity = async (item, type) => {

        clearMessages();


        // ==========================================
        // PREVENT QUANTITY BELOW 1
        // ==========================================

        if (
            type === 'minus' &&
            Number(item.quantity) <= 1
        ) {
            return;
        }


        const productId =
            item?.product?._id;


        if (!productId) {

            setError(
                'Product information is missing.'
            );

            return;
        }


        const loadingKey =
            `${item._id}-${type}`;


        setActionLoading(loadingKey);


        try {

            const response = await updateCart(
                productId,
                { type }
            );


            if (!response?.success) {

                setError(
                    response?.message ||
                    'Failed to update cart.'
                );

                return;
            }


            setSuccess(
                type === 'plus'
                    ? 'Quantity increased.'
                    : 'Quantity decreased.'
            );


            // Reload cart from backend
            await fetchCart();


        } catch (error) {

            setError(
                error?.friendlyMessage ||
                error?.response?.data?.message ||
                'Failed to update cart.'
            );

        } finally {

            setActionLoading(null);
        }
    };


    // ==========================================
    // DELETE CART ITEM
    // ==========================================

    const handleDelete = async (item) => {

        clearMessages();


        const confirmed = window.confirm(
            'Are you sure you want to remove this product from your cart?'
        );


        if (!confirmed) {
            return;
        }


        setActionLoading(
            `delete-${item._id}`
        );


        try {

            const response =
                await deleteCartItem(item._id);


            if (!response?.success) {

                setError(
                    response?.message ||
                    'Failed to remove product.'
                );

                return;
            }


            setSuccess(
                'Product removed from cart.'
            );


            await fetchCart();


        } catch (error) {

            setError(
                error?.friendlyMessage ||
                error?.response?.data?.message ||
                'Failed to remove product.'
            );

        } finally {

            setActionLoading(null);
        }
    };


    // ==========================================
    // PRODUCT IMAGE
    // ==========================================

    const getProductImage = (product) => {

        if (!product?.images?.length) {
            return null;
        }


        const mainImage =
            product.images.find(
                (image) => image?.isMain === true
            );


        return (
            mainImage?.url ||
            product.images[0]?.url ||
            null
        );
    };


    // ==========================================
    // PRODUCT PRICE
    // ==========================================

    const getProductPrice = (product) => {

        const price =
            Number(product?.price || 0);

        const discountPrice =
            Number(product?.discountPrice || 0);


        if (
            discountPrice > 0 &&
            discountPrice < price
        ) {
            return discountPrice;
        }


        return price;
    };


    // ==========================================
    // CALCULATE DELIVERY
    // ==========================================

    const deliveryCharge =
        cartItems.length > 0
            ? 60
            : 0;


    // ==========================================
    // GRAND TOTAL
    // ==========================================

    const grandTotal =
        Number(totalPrice) +
        Number(deliveryCharge);


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
    // NOT AUTHENTICATED
    // ==========================================

    if (!isAuthenticated || !userId) {

        return (

            <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">

                <div className="w-full max-w-md p-8 text-center bg-white border border-gray-100 shadow-sm rounded-2xl">

                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-5 bg-green-100 rounded-full">

                        <ShoppingCart className="w-8 h-8 text-green-600" />

                    </div>


                    <h1 className="mb-2 text-2xl font-bold text-gray-900">
                        Please Login
                    </h1>


                    <p className="text-gray-500">
                        Please login to view your shopping cart.
                    </p>

                </div>

            </div>
        );
    }


    // ==========================================
    // LOADING CART
    // ==========================================

    if (loading) {

        return (

            <div className="flex items-center justify-center min-h-screen bg-gray-50">

                <div className="text-center">

                    <Loader2
                        className="w-10 h-10 mx-auto mb-4 text-green-600 animate-spin"
                    />

                    <p className="text-gray-600">
                        Loading your cart...
                    </p>

                </div>

            </div>
        );
    }


    // ==========================================
    // EMPTY CART
    // ==========================================

    if (cartItems.length === 0) {

        return (

            <div className="min-h-screen px-4 py-16 bg-gray-50">

                <div className="max-w-xl mx-auto">

                    <div className="p-10 text-center bg-white border border-gray-100 shadow-sm rounded-2xl">

                        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full">

                            <ShoppingBag className="w-10 h-10 text-green-600" />

                        </div>


                        <h1 className="mb-2 text-3xl font-bold text-gray-900">
                            Your Cart is Empty
                        </h1>


                        <p className="text-gray-500 mb-7">
                            You haven't added any products to your cart yet.
                        </p>


                        <a
                            href="/shop"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                        >

                            Continue Shopping

                            <ArrowRight className="w-5 h-5" />

                        </a>

                    </div>

                </div>

            </div>
        );
    }


    // ==========================================
    // MAIN CART UI
    // ==========================================

    return (

        <div className="min-h-screen px-4 py-10 bg-gray-50">

            <div className="mx-auto max-w-7xl">


                {/* ==========================================
                    HEADER
                ========================================== */}

                <div className="mb-8">

                    <div className="flex items-center gap-3">

                        <div className="flex items-center justify-center bg-green-100 rounded-full w-11 h-11">

                            <ShoppingCart className="w-6 h-6 text-green-600" />

                        </div>


                        <div>

                            <h1 className="text-3xl font-bold text-gray-900">
                                Shopping Cart
                            </h1>

                            <p className="mt-1 text-gray-500">
                                Review your products before checkout
                            </p>

                        </div>

                    </div>

                </div>


                {/* ==========================================
                    SUCCESS MESSAGE
                ========================================== */}

                {success && (

                    <div className="flex items-center gap-3 px-4 py-3 mb-6 text-green-700 border border-green-200 rounded-xl bg-green-50">

                        <CheckCircle2 className="w-5 h-5 shrink-0" />

                        <span className="font-medium">
                            {success}
                        </span>

                        <button
                            type="button"
                            onClick={() => setSuccess('')}
                            className="ml-auto text-green-700"
                        >
                            ×
                        </button>

                    </div>
                )}


                {/* ==========================================
                    ERROR MESSAGE
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
                            className="ml-auto text-red-700"
                        >
                            ×
                        </button>

                    </div>
                )}


                {/* ==========================================
                    CART GRID
                ========================================== */}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">


                    {/* ==========================================
                        CART ITEMS
                    ========================================== */}

                    <div className="space-y-4 lg:col-span-2">

                        {cartItems.map((item) => {

                            const product =
                                item?.product;


                            const image =
                                getProductImage(product);


                            const productPrice =
                                getProductPrice(product);


                            const itemTotal =
                                Number(item?.totalPrice || 0);


                            const minusLoading =
                                actionLoading ===
                                `${item._id}-minus`;


                            const plusLoading =
                                actionLoading ===
                                `${item._id}-plus`;


                            const deleteLoading =
                                actionLoading ===
                                `delete-${item._id}`;


                            return (

                                <div
                                    key={item._id}
                                    className="p-5 bg-white border border-gray-100 shadow-sm rounded-2xl"
                                >

                                    <div className="flex flex-col gap-5 sm:flex-row">


                                        {/* ==========================================
                                            PRODUCT IMAGE
                                        ========================================== */}

                                        <div className="flex items-center justify-center w-full overflow-hidden bg-gray-100 rounded-xl sm:w-32 sm:h-32 shrink-0">

                                            {image ? (

                                                <img
                                                    src={image}
                                                    alt={product?.title || 'Product'}
                                                    className="object-cover w-full h-full"
                                                />

                                            ) : (

                                                <ShoppingBag className="w-10 h-10 text-gray-400" />

                                            )}

                                        </div>


                                        {/* ==========================================
                                            PRODUCT INFO
                                        ========================================== */}

                                        <div className="flex flex-col flex-1">


                                            <div className="flex items-start justify-between gap-4">

                                                <div>

                                                    <h2 className="text-lg font-semibold text-gray-900">
                                                        {product?.title || 'Product'}
                                                    </h2>


                                                    {product?.brand && (

                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {product.brand}
                                                        </p>

                                                    )}


                                                    <p className="mt-2 font-medium text-green-600">

                                                        ৳ {productPrice.toLocaleString('en-BD')}

                                                    </p>

                                                </div>


                                                {/* DELETE */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(item)
                                                    }
                                                    disabled={deleteLoading}
                                                    aria-label="Remove product"
                                                    title="Remove product"
                                                    className="p-2 text-red-600 transition rounded-lg hover:bg-red-50 disabled:opacity-50"
                                                >

                                                    {deleteLoading ? (

                                                        <Loader2 className="w-5 h-5 animate-spin" />

                                                    ) : (

                                                        <Trash2 className="w-5 h-5" />

                                                    )}

                                                </button>

                                            </div>


                                            {/* ==========================================
                                                BOTTOM
                                            ========================================== */}

                                            <div className="flex flex-col gap-4 pt-5 mt-auto sm:flex-row sm:items-end sm:justify-between">


                                                {/* QUANTITY */}

                                                <div>

                                                    <p className="mb-2 text-xs font-medium tracking-wide text-gray-500 uppercase">
                                                        Quantity
                                                    </p>


                                                    <div className="inline-flex items-center overflow-hidden border border-gray-300 rounded-lg">


                                                        {/* MINUS */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleQuantity(
                                                                    item,
                                                                    'minus'
                                                                )
                                                            }
                                                            disabled={
                                                                Number(item.quantity) <= 1 ||
                                                                minusLoading ||
                                                                plusLoading
                                                            }
                                                            aria-label="Decrease quantity"
                                                            className="flex items-center justify-center w-10 h-10 text-gray-700 transition hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
                                                        >

                                                            {minusLoading ? (

                                                                <Loader2 className="w-4 h-4 animate-spin" />

                                                            ) : (

                                                                <Minus className="w-4 h-4" />

                                                            )}

                                                        </button>


                                                        {/* QUANTITY NUMBER */}

                                                        <div className="flex items-center justify-center w-12 h-10 text-sm font-semibold text-gray-900 border-gray-300 border-x">

                                                            {item.quantity}

                                                        </div>


                                                        {/* PLUS */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleQuantity(
                                                                    item,
                                                                    'plus'
                                                                )
                                                            }
                                                            disabled={
                                                                plusLoading ||
                                                                minusLoading
                                                            }
                                                            aria-label="Increase quantity"
                                                            className="flex items-center justify-center w-10 h-10 text-gray-700 transition hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
                                                        >

                                                            {plusLoading ? (

                                                                <Loader2 className="w-4 h-4 animate-spin" />

                                                            ) : (

                                                                <Plus className="w-4 h-4" />

                                                            )}

                                                        </button>

                                                    </div>

                                                </div>


                                                {/* ITEM TOTAL */}

                                                <div className="sm:text-right">

                                                    <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                                        Item Total
                                                    </p>


                                                    <p className="mt-1 text-xl font-bold text-gray-900">

                                                        ৳ {itemTotal.toLocaleString('en-BD')}

                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>


                    {/* ==========================================
                        ORDER SUMMARY
                    ========================================== */}

                    <div className="lg:col-span-1">

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

                                    ৳ {Number(totalPrice).toLocaleString('en-BD')}

                                </span>

                            </div>


                            {/* DELIVERY */}

                            <div className="flex items-center justify-between py-3 text-gray-600">

                                <span>
                                    Delivery Charge
                                </span>

                                <span className="font-medium text-gray-900">

                                    ৳ {deliveryCharge.toLocaleString('en-BD')}

                                </span>

                            </div>


                            {/* DIVIDER */}

                            <div className="my-3 border-t border-gray-200" />


                            {/* GRAND TOTAL */}

                            <div className="flex items-center justify-between py-3">

                                <span className="text-lg font-bold text-gray-900">
                                    Total
                                </span>

                                <span className="text-2xl font-bold text-green-600">

                                    ৳ {grandTotal.toLocaleString('en-BD')}

                                </span>

                            </div>


                            {/* CHECKOUT */}

                            <a
                                href="/checkout"
                                className="flex items-center justify-center w-full gap-2 py-3.5 mt-5 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                            >

                                Proceed to Checkout

                                <ArrowRight className="w-5 h-5" />

                            </a>


                            {/* CONTINUE SHOPPING */}

                            <a
                                href="/shop"
                                className="flex items-center justify-center w-full py-3 mt-3 font-medium text-gray-700 transition border border-gray-300 rounded-lg hover:bg-gray-50"
                            >

                                Continue Shopping

                            </a>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}