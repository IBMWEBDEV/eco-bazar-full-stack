import { useCallback, useEffect, useMemo, useState } from 'react';

import {
    Package,
    RefreshCw,
    Loader2,
    AlertCircle,
    ShoppingBag,
    CalendarDays,
    Hash,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    Clock3,
    XCircle,
    ReceiptText,
    Copy,
    Check,
    ArrowRight,
    Store,
    CreditCard
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/constants/api';


// ==================================================
// ORDERS PAGE
// ==================================================

export default function Orders() {

    const navigate = useNavigate();

    const {
        user,
        isAuthenticated,
        loading: authLoading,
    } = useAuth();


    // ==================================================
    // STATE
    // ==================================================

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    const [expandedOrder, setExpandedOrder] = useState(null);

    const [copiedOrderId, setCopiedOrderId] = useState(null);


    // ==================================================
    // USER ID
    // ==================================================

    const userId =
        user?._id ||
        user?.id ||
        user?.userId;


    // ==================================================
    // FETCH ORDERS
    // ==================================================

    const fetchOrders = useCallback(async () => {

        if (!userId) {

            setOrders([]);

            setLoading(false);

            return;
        }


        try {

            setLoading(true);

            setError('');


            const url =
                API_ENDPOINTS.orders.GET_ORDERS.replace(
                    ':userid',
                    userId
                );


            const response =
                await axiosInstance.get(url);


            const responseData =
                response?.data;


            if (responseData?.success === false) {

                throw new Error(
                    responseData?.message ||
                    'Failed to load your orders.'
                );
            }


            setOrders(
                Array.isArray(responseData?.data)
                    ? responseData.data
                    : []
            );


        } catch (error) {

            console.error(
                'Orders loading error:',
                error
            );


            setOrders([]);


            setError(
                error?.friendlyMessage ||
                error?.response?.data?.message ||
                error?.message ||
                'Failed to load your orders.'
            );


        } finally {

            setLoading(false);
        }

    }, [userId]);


    // ==================================================
    // LOAD ORDERS
    // ==================================================

    useEffect(() => {

        if (
            !authLoading &&
            isAuthenticated
        ) {

            fetchOrders();
        }

    }, [
        authLoading,
        isAuthenticated,
        fetchOrders,
    ]);


    // ==================================================
    // STATUS CONFIG
    // ==================================================

    const getStatusConfig = (status) => {

        switch (status) {

            case 'approved':

                return {
                    label: 'Approved',
                    description: 'Payment successful',
                    className:
                        'bg-green-100 text-green-700 border-green-200',
                    icon: CheckCircle2,
                };


            case 'pending':

                return {
                    label: 'Pending',
                    description: 'Payment is being processed',
                    className:
                        'bg-yellow-100 text-yellow-700 border-yellow-200',
                    icon: Clock3,
                };


            case 'reject':

                return {
                    label: 'Rejected',
                    description: 'Payment was unsuccessful',
                    className:
                        'bg-red-100 text-red-700 border-red-200',
                    icon: XCircle,
                };


            default:

                return {
                    label: 'Unknown',
                    description: 'Status unavailable',
                    className:
                        'bg-gray-100 text-gray-700 border-gray-200',
                    icon: Clock3,
                };
        }
    };


    // ==================================================
    // FORMAT DATE
    // ==================================================

    const formatDate = (date) => {

        if (!date) {
            return 'N/A';
        }


        const parsedDate =
            new Date(date);


        if (Number.isNaN(parsedDate.getTime())) {
            return 'N/A';
        }


        return parsedDate.toLocaleDateString(
            'en-BD',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }
        );
    };


    // ==================================================
    // FORMAT TIME
    // ==================================================

    const formatTime = (date) => {

        if (!date) {
            return '';
        }


        const parsedDate =
            new Date(date);


        if (Number.isNaN(parsedDate.getTime())) {
            return '';
        }


        return parsedDate.toLocaleTimeString(
            'en-BD',
            {
                hour: '2-digit',
                minute: '2-digit',
            }
        );
    };


    // ==================================================
    // COPY ORDER ID
    // ==================================================

    const handleCopyOrderId = async (orderId) => {

        if (!orderId) {
            return;
        }


        try {

            await navigator.clipboard.writeText(
                orderId
            );


            setCopiedOrderId(orderId);


            setTimeout(() => {

                setCopiedOrderId(null);

            }, 1800);


        } catch (error) {

            console.error(
                'Failed to copy order ID:',
                error
            );
        }
    };


    // ==================================================
    // TOGGLE DETAILS
    // ==================================================

    const toggleOrderDetails = (orderId) => {

        setExpandedOrder(
            expandedOrder === orderId
                ? null
                : orderId
        );
    };


    // ==================================================
    // ORDER STATISTICS
    // ==================================================

    const statistics = useMemo(() => {

        const approved =
            orders.filter(
                (order) =>
                    order?.status === 'approved'
            ).length;


        const pending =
            orders.filter(
                (order) =>
                    order?.status === 'pending'
            ).length;


        const rejected =
            orders.filter(
                (order) =>
                    order?.status === 'reject'
            ).length;


        return {
            total: orders.length,
            approved,
            pending,
            rejected,
        };

    }, [orders]);


    // ==================================================
    // AUTH LOADING
    // ==================================================

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


    // ==================================================
    // LOGIN REQUIRED
    // ==================================================

    if (!isAuthenticated || !userId) {

        return (

            <div className="min-h-screen px-4 py-16 bg-gray-50">

                <div className="max-w-md p-8 mx-auto text-center bg-white border border-gray-100 shadow-sm rounded-2xl">

                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-5 bg-green-100 rounded-full">

                        <Package className="w-8 h-8 text-green-600" />

                    </div>


                    <h1 className="mb-2 text-2xl font-bold text-gray-900">
                        Login Required
                    </h1>


                    <p className="mb-6 text-gray-500">
                        Please login to view your orders.
                    </p>


                    <button
                        type="button"
                        onClick={() =>
                            navigate('/login')
                        }
                        className="w-full py-3 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                    >
                        Go to Login
                    </button>

                </div>

            </div>
        );
    }


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (

            <div className="flex items-center justify-center min-h-screen bg-gray-50">

                <div className="text-center">

                    <Loader2
                        className="w-10 h-10 mx-auto mb-4 text-green-600 animate-spin"
                    />

                    <p className="text-gray-600">
                        Loading your orders...
                    </p>

                </div>

            </div>
        );
    }


    // ==================================================
    // ERROR
    // ==================================================

    if (error) {

        return (

            <div className="min-h-screen px-4 py-16 bg-gray-50">

                <div className="max-w-xl p-8 mx-auto text-center bg-white border border-red-100 shadow-sm rounded-2xl">

                    <div className="flex items-center justify-center mx-auto mb-5 bg-red-100 rounded-full w-14 h-14">

                        <AlertCircle className="text-red-600 w-7 h-7" />

                    </div>


                    <h1 className="mb-2 text-2xl font-bold text-gray-900">
                        Unable to Load Orders
                    </h1>


                    <p className="mb-6 text-gray-500">
                        {error}
                    </p>


                    <button
                        type="button"
                        onClick={fetchOrders}
                        className="inline-flex items-center gap-2 px-5 py-3 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                    >

                        <RefreshCw className="w-4 h-4" />

                        Try Again

                    </button>

                </div>

            </div>
        );
    }


    // ==================================================
    // EMPTY ORDERS
    // ==================================================

    if (!orders.length) {

        return (

            <div className="min-h-screen px-4 py-16 bg-gray-50">

                <div className="max-w-xl p-10 mx-auto text-center bg-white border border-gray-100 shadow-sm rounded-2xl">

                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-5 bg-gray-100 rounded-full">

                        <ShoppingBag className="w-8 h-8 text-gray-400" />

                    </div>


                    <h1 className="mb-2 text-2xl font-bold text-gray-900">
                        No Orders Yet
                    </h1>


                    <p className="mb-6 text-gray-500">
                        You haven't placed any orders yet.
                    </p>


                    <button
                        type="button"
                        onClick={() =>
                            navigate('/shop')
                        }
                        className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                    >

                        Start Shopping

                        <ArrowRight className="w-4 h-4" />

                    </button>

                </div>

            </div>
        );
    }


    // ==================================================
    // MAIN ORDERS PAGE
    // ==================================================

    return (

        <div className="min-h-screen px-4 py-10 bg-gray-50">

            <div className="max-w-6xl mx-auto">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="flex flex-col gap-5 mb-8 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <div className="flex items-center gap-3">

                            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">

                                <Package className="w-6 h-6 text-green-600" />

                            </div>


                            <div>

                                <h1 className="text-3xl font-bold text-gray-900">
                                    My Orders
                                </h1>

                                <p className="mt-1 text-sm text-gray-500">
                                    View and track your recent orders.
                                </p>

                            </div>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={fetchOrders}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 font-semibold text-gray-700 transition bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:text-green-600 disabled:opacity-50"
                    >

                        <RefreshCw
                            className={`w-4 h-4 ${loading
                                ? 'animate-spin'
                                : ''
                                }`}
                        />

                        Refresh

                    </button>

                </div>


                {/* ==================================================
                    STATISTICS
                ================================================== */}

                <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">


                    {/* TOTAL */}

                    <div className="flex items-center gap-4 p-5 bg-white border border-gray-100 shadow-sm rounded-xl">

                        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">

                            <Package className="w-6 h-6 text-green-600" />

                        </div>


                        <div>

                            <p className="text-sm text-gray-500">
                                Total Orders
                            </p>

                            <p className="mt-1 text-2xl font-bold text-gray-900">
                                {statistics.total}
                            </p>

                        </div>

                    </div>


                    {/* APPROVED */}

                    <div className="flex items-center gap-4 p-5 bg-white border border-gray-100 shadow-sm rounded-xl">

                        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">

                            <CheckCircle2 className="w-6 h-6 text-green-600" />

                        </div>


                        <div>

                            <p className="text-sm text-gray-500">
                                Approved
                            </p>

                            <p className="mt-1 text-2xl font-bold text-gray-900">
                                {statistics.approved}
                            </p>

                        </div>

                    </div>


                    {/* PENDING */}

                    <div className="flex items-center gap-4 p-5 bg-white border border-gray-100 shadow-sm rounded-xl">

                        <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full">

                            <Clock3 className="w-6 h-6 text-yellow-600" />

                        </div>


                        <div>

                            <p className="text-sm text-gray-500">
                                Pending
                            </p>

                            <p className="mt-1 text-2xl font-bold text-gray-900">
                                {statistics.pending}
                            </p>

                        </div>

                    </div>


                    {/* REJECTED */}

                    <div className="flex items-center gap-4 p-5 bg-white border border-gray-100 shadow-sm rounded-xl">

                        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">

                            <XCircle className="w-6 h-6 text-red-600" />

                        </div>


                        <div>

                            <p className="text-sm text-gray-500">
                                Rejected
                            </p>

                            <p className="mt-1 text-2xl font-bold text-gray-900">
                                {statistics.rejected}
                            </p>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    ORDER LIST
                ================================================== */}

                <div className="space-y-5">

                    {orders.map((order) => {

                        const isExpanded =
                            expandedOrder ===
                            order._id;


                        const status =
                            getStatusConfig(
                                order.status
                            );


                        const StatusIcon =
                            status.icon;


                        const productCount =
                            Array.isArray(order.products)
                                ? order.products.length
                                : 0;


                        return (

                            <div
                                key={order._id}
                                className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl"
                            >


                                {/* ==================================================
                                    ORDER HEADER
                                ================================================== */}

                                <div className="p-5 sm:p-6">

                                    <div className="space-y-6">


                                        {/* ORDER BASIC INFORMATION */}

                                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">


                                            {/* ORDER ID */}

                                            <div className="flex gap-3">

                                                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg shrink-0">

                                                    <Hash className="w-5 h-5 text-gray-500" />

                                                </div>


                                                <div className="min-w-0">

                                                    <p className="text-xs text-gray-500">
                                                        Order ID
                                                    </p>


                                                    <div className="flex items-center gap-2 mt-1">

                                                        <p className="font-semibold text-gray-900 break-all">
                                                            {order.tranid}
                                                        </p>


                                                        <button
                                                            type="button"
                                                            title="Copy Order ID"
                                                            onClick={() =>
                                                                handleCopyOrderId(
                                                                    order.tranid
                                                                )
                                                            }
                                                            className="flex items-center justify-center p-1.5 text-gray-400 transition rounded hover:bg-gray-100 hover:text-green-600 shrink-0"
                                                        >

                                                            {copiedOrderId === order.tranid ? (

                                                                <Check className="w-4 h-4 text-green-600" />

                                                            ) : (

                                                                <Copy className="w-4 h-4" />

                                                            )}

                                                        </button>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* DATE */}

                                            <div className="flex gap-3">

                                                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg shrink-0">

                                                    <CalendarDays className="w-5 h-5 text-gray-500" />

                                                </div>


                                                <div>

                                                    <p className="text-xs text-gray-500">
                                                        Order Date
                                                    </p>


                                                    <p className="mt-1 font-semibold text-gray-900">
                                                        {formatDate(
                                                            order.createdAt
                                                        )}
                                                    </p>


                                                    <p className="text-xs text-gray-400">
                                                        {formatTime(
                                                            order.createdAt
                                                        )}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* TOTAL */}

                                            <div>

                                                <p className="text-xs text-gray-500">
                                                    Total Amount
                                                </p>


                                                <p className="mt-1 text-xl font-bold text-green-600">

                                                    ৳{' '}

                                                    {Number(
                                                        order.totalPrice || 0
                                                    ).toLocaleString(
                                                        'en-BD'
                                                    )}

                                                </p>

                                            </div>

                                        </div>


                                        {/* DIVIDER */}

                                        <div className="border-t border-gray-100" />


                                        {/* STATUS + PRODUCT COUNT + BUTTON */}

                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


                                            <div className="flex flex-wrap items-center gap-5">


                                                {/* STATUS */}

                                                <div>

                                                    <p className="mb-2 text-xs text-gray-500">
                                                        Payment Status
                                                    </p>


                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold border rounded-full ${status.className}`}
                                                    >

                                                        <StatusIcon className="w-4 h-4" />

                                                        {status.label}

                                                    </span>

                                                </div>


                                                {/* PRODUCTS */}

                                                <div>

                                                    <p className="mb-2 text-xs text-gray-500">
                                                        Items
                                                    </p>


                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-full">

                                                        <ShoppingBag className="w-4 h-4" />

                                                        {productCount}{' '}
                                                        {productCount === 1
                                                            ? 'Product'
                                                            : 'Products'}

                                                    </div>

                                                </div>

                                            </div>


                                            {/* VIEW DETAILS */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleOrderDetails(
                                                        order._id
                                                    )
                                                }
                                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 font-semibold text-gray-700 transition border border-gray-200 rounded-lg hover:border-green-300 hover:text-green-600 hover:bg-green-50"
                                            >

                                                {isExpanded
                                                    ? 'Hide Details'
                                                    : 'View Details'}


                                                {isExpanded ? (

                                                    <ChevronUp className="w-4 h-4" />

                                                ) : (

                                                    <ChevronDown className="w-4 h-4" />

                                                )}

                                            </button>

                                        </div>

                                    </div>

                                </div>


                                {/* ==================================================
                                    EXPANDED ORDER DETAILS
                                ================================================== */}

                                {isExpanded && (

                                    <div className="px-5 pb-6 sm:px-6">

                                        <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50">


                                            {/* DETAILS HEADER */}

                                            <div className="flex items-center justify-between gap-4 mb-5">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">

                                                        <ReceiptText className="w-5 h-5 text-green-600" />

                                                    </div>


                                                    <div>

                                                        <h2 className="font-bold text-gray-900">
                                                            Order Details
                                                        </h2>

                                                        <p className="text-sm text-gray-500">
                                                            Complete order and payment information
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* ==================================================
                                                ORDER INFORMATION
                                            ================================================== */}

                                            <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2">


                                                {/* TRANSACTION ID */}

                                                <div className="p-4 bg-white border border-gray-100 rounded-xl">

                                                    <div className="flex items-center gap-2 mb-2">

                                                        <Hash className="w-4 h-4 text-gray-400" />

                                                        <p className="text-xs font-medium text-gray-500">
                                                            Transaction / Order ID
                                                        </p>

                                                    </div>


                                                    <p className="font-semibold text-gray-900 break-all">
                                                        {order.tranid || 'N/A'}
                                                    </p>

                                                </div>


                                                {/* DATE */}

                                                <div className="p-4 bg-white border border-gray-100 rounded-xl">

                                                    <div className="flex items-center gap-2 mb-2">

                                                        <CalendarDays className="w-4 h-4 text-gray-400" />

                                                        <p className="text-xs font-medium text-gray-500">
                                                            Order Date
                                                        </p>

                                                    </div>


                                                    <p className="font-semibold text-gray-900">
                                                        {formatDate(
                                                            order.createdAt
                                                        )}
                                                    </p>


                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {formatTime(
                                                            order.createdAt
                                                        )}
                                                    </p>

                                                </div>


                                                {/* PAYMENT STATUS */}

                                                <div className="p-4 bg-white border border-gray-100 rounded-xl">

                                                    <div className="flex items-center gap-2 mb-2">

                                                        <CreditCard className="w-4 h-4 text-gray-400" />

                                                        <p className="text-xs font-medium text-gray-500">
                                                            Payment Status
                                                        </p>

                                                    </div>


                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-full ${status.className}`}
                                                    >

                                                        <StatusIcon className="w-3.5 h-3.5" />

                                                        {status.label}

                                                    </span>


                                                    <p className="mt-2 text-xs text-gray-500">
                                                        {status.description}
                                                    </p>

                                                </div>


                                                {/* ORDER TOTAL */}

                                                <div className="p-4 bg-white border border-gray-100 rounded-xl">

                                                    <div className="flex items-center gap-2 mb-2">

                                                        <ReceiptText className="w-4 h-4 text-gray-400" />

                                                        <p className="text-xs font-medium text-gray-500">
                                                            Order Total
                                                        </p>

                                                    </div>


                                                    <p className="text-xl font-bold text-green-600">

                                                        ৳{' '}

                                                        {Number(
                                                            order.totalPrice || 0
                                                        ).toLocaleString(
                                                            'en-BD'
                                                        )}

                                                    </p>

                                                </div>

                                            </div>


                                            {/* ==================================================
                                                ORDERED PRODUCTS
                                            ================================================== */}

                                            <div className="flex items-center gap-2 mb-4">

                                                <ShoppingBag className="w-5 h-5 text-green-600" />

                                                <h3 className="font-bold text-gray-900">
                                                    Ordered Products
                                                </h3>

                                            </div>


                                            {Array.isArray(order.products) &&
                                                order.products.length > 0 ? (

                                                <div className="space-y-3">

                                                    {order.products.map(
                                                        (
                                                            product,
                                                            index
                                                        ) => {

                                                            const quantity =
                                                                Number(
                                                                    product?.quantity ||
                                                                    0
                                                                );


                                                            const unitPrice =
                                                                Number(
                                                                    product?.price ||
                                                                    0
                                                                );


                                                            const total =
                                                                Number(
                                                                    product?.totalPrice ||
                                                                    0
                                                                );


                                                            return (

                                                                <div
                                                                    key={`${order._id}-${product?.sku || index}`}
                                                                    className="p-4 bg-white border border-gray-100 rounded-xl"
                                                                >

                                                                    <div className="flex flex-col gap-4">


                                                                        {/* PRODUCT HEADER */}

                                                                        <div className="flex items-start gap-3">

                                                                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-50 shrink-0">

                                                                                <Store className="w-5 h-5 text-green-600" />

                                                                            </div>


                                                                            <div className="min-w-0">

                                                                                <h4 className="font-semibold text-gray-900">
                                                                                    {product?.title ||
                                                                                        'Product'}
                                                                                </h4>


                                                                                <p className="mt-1 text-sm text-gray-500 break-all">
                                                                                    SKU:{' '}
                                                                                    {product?.sku ||
                                                                                        'N/A'}
                                                                                </p>

                                                                            </div>

                                                                        </div>


                                                                        {/* PRODUCT PRICING */}

                                                                        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">


                                                                            {/* PRICE */}

                                                                            <div>

                                                                                <p className="text-xs text-gray-400">
                                                                                    Unit Price
                                                                                </p>


                                                                                <p className="mt-1 font-semibold text-gray-900">

                                                                                    ৳{' '}

                                                                                    {unitPrice.toLocaleString(
                                                                                        'en-BD'
                                                                                    )}

                                                                                </p>

                                                                            </div>


                                                                            {/* QUANTITY */}

                                                                            <div>

                                                                                <p className="text-xs text-gray-400">
                                                                                    Quantity
                                                                                </p>


                                                                                <p className="mt-1 font-semibold text-gray-900">
                                                                                    {quantity}
                                                                                </p>

                                                                            </div>


                                                                            {/* TOTAL */}

                                                                            <div className="text-right">

                                                                                <p className="text-xs text-gray-400">
                                                                                    Item Total
                                                                                </p>


                                                                                <p className="mt-1 font-bold text-green-600">

                                                                                    ৳{' '}

                                                                                    {total.toLocaleString(
                                                                                        'en-BD'
                                                                                    )}

                                                                                </p>

                                                                            </div>

                                                                        </div>

                                                                    </div>

                                                                </div>
                                                            );
                                                        }
                                                    )}

                                                </div>

                                            ) : (

                                                <div className="p-6 text-center bg-white border border-gray-100 rounded-xl">

                                                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-gray-300" />

                                                    <p className="text-sm text-gray-500">
                                                        No product details available.
                                                    </p>

                                                </div>

                                            )}


                                            {/* ==================================================
                                                TOTAL
                                            ================================================== */}

                                            <div className="flex items-center justify-between gap-4 p-5 mt-5 bg-white border border-green-100 rounded-xl">

                                                <div>

                                                    <p className="font-bold text-gray-900">
                                                        Order Total
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Final amount for this order
                                                    </p>

                                                </div>


                                                <p className="text-2xl font-bold text-green-600">

                                                    ৳{' '}

                                                    {Number(
                                                        order.totalPrice || 0
                                                    ).toLocaleString(
                                                        'en-BD'
                                                    )}

                                                </p>

                                            </div>


                                            {/* ==================================================
                                                ACTIONS
                                            ================================================== */}

                                            <div className="flex flex-col gap-3 mt-5 sm:flex-row sm:justify-end">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate('/shop')
                                                    }
                                                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 font-semibold text-gray-700 transition bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:text-green-600"
                                                >

                                                    <ShoppingBag className="w-4 h-4" />

                                                    Continue Shopping

                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                )}

                            </div>
                        );
                    })}

                </div>

            </div>

        </div>
    );
}