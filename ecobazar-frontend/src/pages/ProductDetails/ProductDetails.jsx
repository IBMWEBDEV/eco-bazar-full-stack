import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Check,
    ChevronLeft,
    ChevronRight,
    Heart,
    Loader2,
    Minus,
    Package,
    Plus,
    ShoppingCart,
    Star,
    Truck,
} from 'lucide-react';

import { Link, useNavigate, useParams } from 'react-router-dom';

import { getProductById } from '@/services/productService';
import { addToCart } from '@/services/cartService';
import { useAuth } from '@/context/AuthContext';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        user,
        isAuthenticated,
        loading: authLoading,
    } = useAuth();

    // ==========================================
    // STATE
    // ==========================================

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cartLoading, setCartLoading] = useState(false);

    const [error, setError] = useState('');
    const [cartMessage, setCartMessage] = useState('');

    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // ==========================================
    // USER ID
    // ==========================================

    const userId =
        user?._id ||
        user?.id ||
        user?.userId;

    // ==========================================
    // FETCH PRODUCT
    // ==========================================

    const fetchProduct = useCallback(async () => {
        if (!id) {
            setError('Product ID is missing.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError('');
            setCartMessage('');
            setSelectedImageIndex(0);
            setQuantity(1);

            const response = await getProductById(id);

            /*
             * Backend / Axios response can be:
             *
             * Axios response:
             * {
             *   data: product
             * }
             *
             * API response:
             * {
             *   product: product
             * }
             *
             * Direct:
             * product
             */

            const responseData = response?.data ?? response;

            const productData =
                responseData?.product ??
                responseData?.data ??
                responseData;

            if (!productData || !productData._id) {
                throw new Error('Product not found.');
            }

            setProduct(productData);
        } catch (err) {
            console.error('Product Details Error:', err);

            setError(
                err?.friendlyMessage ||
                err?.response?.data?.message ||
                err?.message ||
                'Failed to load product details.'
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    // ==========================================
    // LOAD PRODUCT
    // ==========================================

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    // ==========================================
    // PRODUCT IMAGES
    // ==========================================

    const productImages = useMemo(() => {
        if (!Array.isArray(product?.images)) {
            return [];
        }

        return product.images
            .map((image) => {
                if (typeof image === 'string') {
                    return image;
                }

                return (
                    image?.url ||
                    image?.secure_url ||
                    image?.path ||
                    ''
                );
            })
            .filter(Boolean);
    }, [product]);

    const selectedImage =
        productImages[selectedImageIndex] ||
        productImages[0] ||
        null;

    // ==========================================
    // PRICE
    // ==========================================

    const regularPrice = Number(product?.price || 0);

    const discountPrice = Number(
        product?.discountPrice || 0
    );

    const hasDiscount =
        discountPrice > 0 &&
        discountPrice < regularPrice;

    const finalPrice = hasDiscount
        ? discountPrice
        : regularPrice;

    const discountPercentage =
        hasDiscount && regularPrice > 0
            ? Math.round(
                ((regularPrice - discountPrice) /
                    regularPrice) *
                100
            )
            : 0;

    // ==========================================
    // STOCK
    // ==========================================

    const stock = Number(product?.stock || 0);

    const isOutOfStock = stock <= 0;

    // ==========================================
    // QUANTITY
    // ==========================================

    const decreaseQuantity = () => {
        setQuantity((current) => {
            const currentNumber = Number(current) || 1;

            return Math.max(1, currentNumber - 1);
        });
    };

    const increaseQuantity = () => {
        setQuantity((current) => {
            const currentNumber = Number(current) || 1;

            if (stock > 0) {
                return Math.min(
                    stock,
                    currentNumber + 1
                );
            }

            return currentNumber + 1;
        });
    };

    const handleQuantityChange = (event) => {
        const value = event.target.value;

        if (value === '') {
            setQuantity('');
            return;
        }

        const numericValue = Number(value);

        if (
            Number.isNaN(numericValue) ||
            numericValue < 1
        ) {
            setQuantity(1);
            return;
        }

        const integerValue = Math.floor(numericValue);

        if (stock > 0) {
            setQuantity(
                Math.min(
                    stock,
                    integerValue
                )
            );
        } else {
            setQuantity(integerValue);
        }
    };

    // ==========================================
    // IMAGE NAVIGATION
    // ==========================================

    const previousImage = () => {
        if (!productImages.length) {
            return;
        }

        setSelectedImageIndex((current) =>
            current === 0
                ? productImages.length - 1
                : current - 1
        );
    };

    const nextImage = () => {
        if (!productImages.length) {
            return;
        }

        setSelectedImageIndex((current) =>
            current === productImages.length - 1
                ? 0
                : current + 1
        );
    };

    // ==========================================
    // ADD TO CART
    // ==========================================

    const handleAddToCart = async () => {
        setError('');
        setCartMessage('');

        if (!isAuthenticated || !userId) {
            navigate('/login', {
                state: {
                    from: `/product/${id}`,
                },
            });

            return;
        }

        if (!product?._id) {
            setError(
                'Product information is unavailable.'
            );

            return;
        }

        if (isOutOfStock) {
            setError(
                'This product is currently out of stock.'
            );

            return;
        }

        const finalQuantity =
            Number(quantity) || 1;

        if (
            finalQuantity < 1 ||
            finalQuantity > stock
        ) {
            setError(
                `Please select a quantity between 1 and ${stock}.`
            );

            return;
        }

        try {
            setCartLoading(true);

            const cartData = {
                userId,
                productId: product._id,
                quantity: finalQuantity,
            };

            await addToCart(cartData);

            setCartMessage(
                'Product added to your cart successfully.'
            );
        } catch (err) {
            console.error(
                'Add To Cart Error:',
                err
            );

            setError(
                err?.friendlyMessage ||
                err?.response?.data?.message ||
                err?.message ||
                'Failed to add product to cart.'
            );
        } finally {
            setCartLoading(false);
        }
    };

    // ==========================================
    // BUY NOW
    // ==========================================

    const handleBuyNow = async () => {
        setError('');
        setCartMessage('');

        if (!isAuthenticated || !userId) {
            navigate('/login', {
                state: {
                    from: `/product/${id}`,
                },
            });

            return;
        }

        if (!product?._id) {
            setError(
                'Product information is unavailable.'
            );

            return;
        }

        if (isOutOfStock) {
            setError(
                'This product is currently out of stock.'
            );

            return;
        }

        const finalQuantity =
            Number(quantity) || 1;

        if (
            finalQuantity < 1 ||
            finalQuantity > stock
        ) {
            setError(
                `Please select a quantity between 1 and ${stock}.`
            );

            return;
        }

        try {
            setCartLoading(true);

            const cartData = {
                userId,
                productId: product._id,
                quantity: finalQuantity,
            };

            await addToCart(cartData);

            navigate('/cart');
        } catch (err) {
            console.error(
                'Buy Now Error:',
                err
            );

            setError(
                err?.friendlyMessage ||
                err?.response?.data?.message ||
                err?.message ||
                'Failed to add product to cart.'
            );
        } finally {
            setCartLoading(false);
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading || authLoading) {
        return (
            <div
                className="flex items-center justify-center min-h-screen px-4 bg-gray-50"
                aria-live="polite"
                aria-busy="true"
            >
                <div className="text-center">
                    <Loader2
                        className="w-10 h-10 mx-auto mb-4 text-green-600 animate-spin"
                        aria-hidden="true"
                    />

                    <p className="font-medium text-gray-600">
                        Loading product...
                    </p>
                </div>
            </div>
        );
    }

    // ==========================================
    // ERROR / PRODUCT NOT FOUND
    // ==========================================

    if (error && !product) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
                <div
                    className="w-full max-w-lg p-8 text-center bg-white border border-gray-100 shadow-sm rounded-2xl"
                    role="alert"
                >
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-5 bg-red-100 rounded-full">
                        <AlertCircle
                            className="w-8 h-8 text-red-600"
                            aria-hidden="true"
                        />
                    </div>

                    <h1 className="mb-2 text-2xl font-bold text-gray-900">
                        Unable to Load Product
                    </h1>

                    <p className="mb-6 text-gray-500">
                        {error}
                    </p>

                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={fetchProduct}
                            className="px-6 py-3 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Try Again
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/shop')}
                            className="px-6 py-3 font-semibold text-gray-700 transition border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        >
                            Back to Shop
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // MAIN
    // ==========================================

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ==========================================
                BREADCRUMB
            ========================================== */}

            <div className="px-4 py-5 bg-white border-b border-gray-100">
                <div className="mx-auto max-w-7xl">
                    <nav
                        aria-label="Breadcrumb"
                        className="flex items-center gap-2 text-sm text-gray-500"
                    >
                        <Link
                            to="/"
                            className="transition hover:text-green-600"
                        >
                            Home
                        </Link>

                        <span aria-hidden="true">/</span>

                        <Link
                            to="/shop"
                            className="transition hover:text-green-600"
                        >
                            Shop
                        </Link>

                        <span aria-hidden="true">/</span>

                        <span className="font-medium text-gray-900 truncate">
                            {product?.title}
                        </span>
                    </nav>
                </div>
            </div>

            {/* ==========================================
                PRODUCT SECTION
            ========================================== */}

            <main className="px-4 py-10">
                <div className="mx-auto max-w-7xl">
                    {/* BACK BUTTON */}

                    <button
                        type="button"
                        onClick={() => navigate('/shop')}
                        className="inline-flex items-center gap-2 mb-8 text-sm font-semibold text-gray-600 transition rounded-md hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        <ArrowLeft
                            className="w-4 h-4"
                            aria-hidden="true"
                        />

                        Back to Shop
                    </button>

                    {/* ERROR BANNER */}

                    {error && product && (
                        <div
                            className="flex items-center gap-3 px-4 py-3 mb-6 text-red-700 border border-red-200 rounded-xl bg-red-50"
                            role="alert"
                        >
                            <AlertCircle
                                className="w-5 h-5 shrink-0"
                                aria-hidden="true"
                            />

                            <span className="font-medium">
                                {error}
                            </span>

                            <button
                                type="button"
                                onClick={() => setError('')}
                                aria-label="Dismiss error"
                                className="ml-auto text-lg leading-none transition rounded hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* CART SUCCESS */}

                    {cartMessage && (
                        <div
                            className="flex flex-col gap-3 px-4 py-3 mb-6 text-green-700 border border-green-200 rounded-xl bg-green-50 sm:flex-row sm:items-center"
                            role="status"
                            aria-live="polite"
                        >
                            <div className="flex items-center gap-3">
                                <Check
                                    className="w-5 h-5 shrink-0"
                                    aria-hidden="true"
                                />

                                <span className="font-medium">
                                    {cartMessage}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate('/cart')}
                                className="font-semibold rounded sm:ml-auto hover:underline focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                View Cart
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                        {/* ==========================================
                            IMAGE GALLERY
                        ========================================== */}

                        <section aria-label="Product images">
                            <div className="relative overflow-hidden bg-white border border-gray-100 shadow-sm aspect-square rounded-2xl">
                                {selectedImage ? (
                                    <img
                                        src={selectedImage}
                                        alt={
                                            product?.title ||
                                            'Product'
                                        }
                                        className="object-contain w-full h-full p-6 sm:p-8"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full">
                                        <Package
                                            className="w-24 h-24 text-gray-300"
                                            aria-hidden="true"
                                        />
                                    </div>
                                )}

                                {/* DISCOUNT */}

                                {hasDiscount && (
                                    <div className="absolute top-5 left-5 px-3 py-1.5 text-sm font-bold text-white bg-red-500 rounded-full">
                                        -{discountPercentage}%
                                    </div>
                                )}

                                {/* IMAGE ARROWS */}

                                {productImages.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={previousImage}
                                            aria-label="Previous product image"
                                            className="absolute flex items-center justify-center w-10 h-10 transition -translate-y-1/2 bg-white border border-gray-200 rounded-full shadow-sm left-4 top-1/2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <ChevronLeft
                                                className="w-5 h-5 text-gray-700"
                                                aria-hidden="true"
                                            />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={nextImage}
                                            aria-label="Next product image"
                                            className="absolute flex items-center justify-center w-10 h-10 transition -translate-y-1/2 bg-white border border-gray-200 rounded-full shadow-sm right-4 top-1/2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <ChevronRight
                                                className="w-5 h-5 text-gray-700"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* THUMBNAILS */}

                            {productImages.length > 1 && (
                                <div className="flex gap-3 pb-1 mt-4 overflow-x-auto">
                                    {productImages.map(
                                        (image, index) => (
                                            <button
                                                key={`${image}-${index}`}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedImageIndex(
                                                        index
                                                    )
                                                }
                                                aria-label={`View product image ${index + 1}`}
                                                aria-pressed={
                                                    selectedImageIndex ===
                                                    index
                                                }
                                                className={`w-20 h-20 shrink-0 overflow-hidden bg-white rounded-lg border-2 transition focus:outline-none focus:ring-2 focus:ring-green-500 ${selectedImageIndex ===
                                                    index
                                                    ? 'border-green-600'
                                                    : 'border-gray-200 hover:border-green-300'
                                                    }`}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${product?.title || 'Product'} ${index + 1}`}
                                                    loading="lazy"
                                                    className="object-contain w-full h-full p-1"
                                                />
                                            </button>
                                        )
                                    )}
                                </div>
                            )}
                        </section>

                        {/* ==========================================
                            PRODUCT INFORMATION
                        ========================================== */}

                        <section>
                            {/* BRAND */}

                            {product?.brand && (
                                <p className="mb-3 text-sm font-semibold tracking-wide text-green-600 uppercase">
                                    {typeof product.brand === 'object'
                                        ? product.brand.name
                                        : product.brand}
                                </p>
                            )}

                            {/* TITLE */}

                            <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                                {product?.title}
                            </h1>

                            {/* RATING */}

                            <div className="flex flex-wrap items-center gap-3 mt-4">
                                <div
                                    className="flex items-center gap-1"
                                    aria-label="5 out of 5 stars"
                                >
                                    {[1, 2, 3, 4, 5].map(
                                        (star) => (
                                            <Star
                                                key={star}
                                                className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                                aria-hidden="true"
                                            />
                                        )
                                    )}
                                </div>

                                <span className="text-sm text-gray-500">
                                    Customer reviews
                                </span>
                            </div>

                            {/* PRICE */}

                            <div className="flex flex-wrap items-center gap-3 py-6 mt-5 border-t border-b border-gray-200">
                                <span className="text-3xl font-bold text-green-600">
                                    ৳{' '}
                                    {finalPrice.toLocaleString(
                                        'en-BD'
                                    )}
                                </span>

                                {hasDiscount && (
                                    <>
                                        <span className="text-lg text-gray-400 line-through">
                                            ৳{' '}
                                            {regularPrice.toLocaleString(
                                                'en-BD'
                                            )}
                                        </span>

                                        <span className="px-2.5 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full">
                                            Save {discountPercentage}%
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* DESCRIPTION */}

                            {product?.description && (
                                <div className="mt-6">
                                    <h2 className="mb-2 text-lg font-bold text-gray-900">
                                        Description
                                    </h2>

                                    <p className="leading-7 text-gray-600 whitespace-pre-line">
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            {/* PRODUCT META */}

                            <div className="grid grid-cols-1 gap-3 mt-6 sm:grid-cols-2">
                                {product?.sku && (
                                    <div className="p-4 bg-white border border-gray-200 rounded-xl">
                                        <p className="text-xs font-medium text-gray-500 uppercase">
                                            SKU
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {product.sku}
                                        </p>
                                    </div>
                                )}

                                <div className="p-4 bg-white border border-gray-200 rounded-xl">
                                    <p className="text-xs font-medium text-gray-500 uppercase">
                                        Availability
                                    </p>

                                    <p
                                        className={`mt-1 font-semibold ${isOutOfStock
                                            ? 'text-red-600'
                                            : 'text-green-600'
                                            }`}
                                    >
                                        {isOutOfStock
                                            ? 'Out of Stock'
                                            : `${stock} in stock`}
                                    </p>
                                </div>
                            </div>

                            {/* QUANTITY */}

                            {!isOutOfStock && (
                                <div className="mt-7">
                                    <p
                                        id="quantity-label"
                                        className="mb-3 text-sm font-semibold text-gray-900"
                                    >
                                        Quantity
                                    </p>

                                    <div
                                        className="flex items-center overflow-hidden border border-gray-300 rounded-lg w-fit"
                                        role="group"
                                        aria-labelledby="quantity-label"
                                    >
                                        <button
                                            type="button"
                                            onClick={decreaseQuantity}
                                            disabled={
                                                Number(quantity) <= 1
                                            }
                                            aria-label="Decrease quantity"
                                            className="flex items-center justify-center transition w-11 h-11 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <Minus
                                                className="w-4 h-4"
                                                aria-hidden="true"
                                            />
                                        </button>

                                        <input
                                            type="number"
                                            min="1"
                                            max={stock}
                                            value={quantity}
                                            onChange={
                                                handleQuantityChange
                                            }
                                            inputMode="numeric"
                                            aria-label="Quantity"
                                            className="font-semibold text-center border-gray-300 outline-none w-14 h-11 border-x focus:ring-2 focus:ring-green-500"
                                        />

                                        <button
                                            type="button"
                                            onClick={increaseQuantity}
                                            disabled={
                                                Number(quantity) >=
                                                stock
                                            }
                                            aria-label="Increase quantity"
                                            className="flex items-center justify-center transition w-11 h-11 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <Plus
                                                className="w-4 h-4"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>

                                    <p className="mt-2 text-xs text-gray-500">
                                        Maximum {stock} item
                                        {stock !== 1 ? 's' : ''}{' '}
                                        available.
                                    </p>
                                </div>
                            )}

                            {/* ACTION BUTTONS */}

                            <div className="flex flex-col gap-3 mt-7 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={
                                        cartLoading ||
                                        isOutOfStock
                                    }
                                    className="flex items-center justify-center flex-1 gap-2 px-6 py-3.5 font-bold text-green-700 transition border-2 border-green-600 rounded-lg hover:bg-green-50 disabled:text-gray-400 disabled:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    {cartLoading ? (
                                        <Loader2
                                            className="w-5 h-5 animate-spin"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <ShoppingCart
                                            className="w-5 h-5"
                                            aria-hidden="true"
                                        />
                                    )}

                                    {isOutOfStock
                                        ? 'Out of Stock'
                                        : 'Add to Cart'}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleBuyNow}
                                    disabled={
                                        cartLoading ||
                                        isOutOfStock
                                    }
                                    className="flex items-center justify-center flex-1 gap-2 px-6 py-3.5 font-bold text-white transition bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    {cartLoading ? (
                                        <Loader2
                                            className="w-5 h-5 animate-spin"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <ArrowRight
                                            className="w-5 h-5"
                                            aria-hidden="true"
                                        />
                                    )}

                                    Buy Now
                                </button>

                                <button
                                    type="button"
                                    aria-label="Add to wishlist"
                                    className="flex items-center justify-center w-full h-12 transition border border-gray-300 rounded-lg sm:w-12 hover:text-red-500 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                                >
                                    <Heart
                                        className="w-5 h-5"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>

                            {/* BENEFITS */}

                            <div className="grid grid-cols-1 gap-3 mt-8">
                                <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50">
                                        <Truck
                                            className="w-5 h-5 text-green-600"
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Fast Delivery
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Reliable delivery service.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50">
                                        <Package
                                            className="w-5 h-5 text-green-600"
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Quality Products
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Carefully selected products.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}