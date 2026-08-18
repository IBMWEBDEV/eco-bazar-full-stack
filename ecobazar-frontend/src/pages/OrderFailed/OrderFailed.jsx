import {
    XCircle,
    RefreshCw,
    ShoppingCart,
    Home,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';


export default function OrderFailed() {

    const navigate = useNavigate();


    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50">

            <div className="w-full max-w-2xl p-8 text-center bg-white border border-gray-100 shadow-sm sm:p-12 rounded-2xl">

                {/* Failed Icon */}

                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full">

                    <XCircle className="text-red-600 w-11 h-11" />

                </div>


                {/* Title */}

                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">

                    Payment Failed

                </h1>


                {/* Description */}

                <p className="max-w-lg mx-auto mt-4 leading-7 text-gray-500">

                    Unfortunately, your payment could not be completed. Your order has not been successfully paid.

                </p>


                {/* Warning */}

                <div className="p-4 mt-8 text-left border border-red-200 bg-red-50 rounded-xl">

                    <div className="flex items-center gap-3">

                        <XCircle className="w-5 h-5 text-red-600 shrink-0" />

                        <div>

                            <p className="font-semibold text-red-800">

                                Payment Not Completed

                            </p>

                            <p className="mt-1 text-sm text-red-700">

                                Please try again or use another payment method.

                            </p>

                        </div>

                    </div>

                </div>


                {/* Buttons */}

                <div className="flex flex-col gap-3 mt-8 sm:flex-row sm:justify-center">

                    <button
                        type="button"
                        onClick={() => navigate('/checkout')}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                    >

                        <RefreshCw className="w-5 h-5" />

                        Try Payment Again

                    </button>


                    <button
                        type="button"
                        onClick={() => navigate('/cart')}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-gray-700 transition border border-gray-300 rounded-lg hover:bg-gray-50"
                    >

                        <ShoppingCart className="w-5 h-5" />

                        View Cart

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