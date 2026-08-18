import {
    CheckCircle2,
    ShoppingBag,
    ArrowRight,
    Home,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';


export default function OrderSuccess() {

    const navigate = useNavigate();


    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50">

            <div className="w-full max-w-2xl p-8 text-center bg-white border border-gray-100 shadow-sm sm:p-12 rounded-2xl">

                {/* Success Icon */}

                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full">

                    <CheckCircle2 className="text-green-600 w-11 h-11" />

                </div>


                {/* Title */}

                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">

                    Order Successful!

                </h1>


                {/* Description */}

                <p className="max-w-lg mx-auto mt-4 leading-7 text-gray-500">

                    Thank you for your purchase. Your payment was processed successfully and your order has been received.

                </p>


                {/* Status */}

                <div className="p-4 mt-8 text-left border border-green-200 bg-green-50 rounded-xl">

                    <div className="flex items-center gap-3">

                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />

                        <div>

                            <p className="font-semibold text-green-800">

                                Payment Successful

                            </p>

                            <p className="mt-1 text-sm text-green-700">

                                Your order is now being processed.

                            </p>

                        </div>

                    </div>

                </div>


                {/* Buttons */}

                <div className="flex flex-col gap-3 mt-8 sm:flex-row sm:justify-center">

                    <button
                        type="button"
                        onClick={() => navigate('/my-orders')}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                    >

                        <ShoppingBag className="w-5 h-5" />

                        View My Orders

                    </button>


                    <button
                        type="button"
                        onClick={() => navigate('/shop')}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-gray-700 transition border border-gray-300 rounded-lg hover:bg-gray-50"
                    >

                        Continue Shopping

                        <ArrowRight className="w-5 h-5" />

                    </button>

                </div>


                {/* Home */}

                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-gray-500 transition hover:text-green-600"
                >

                    <Home className="w-4 h-4" />

                    Back to Home

                </button>

            </div>

        </div>
    );
}