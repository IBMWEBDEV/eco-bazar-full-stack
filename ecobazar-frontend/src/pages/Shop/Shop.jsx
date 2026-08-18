import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ShoppingCart,
    Search,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Eye,
    PackageOpen,
} from 'lucide-react';

import { getAllProducts } from '@/services/productService';
import { addToCart } from '@/services/cartService';
import { useAuth } from '@/context/AuthContext';


export default function Shop() {

    // ==========================================
    // AUTH
    // ==========================================

    const { user, isAuthenticated, loading: authLoading } = useAuth();


    // ==========================================
    // STATE
    // ==========================================

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    const [search, setSearch] = useState('');

    const [category, setCategory] = useState('all');

    const [addingProduct, setAddingProduct] = useState(null);

    const [successProduct, setSuccessProduct] = useState(null);


    // ==========================================
    // USER ID
    // ==========================================

    const userId =
        user?._id ||
        user?.id ||
        user?.userId;


    // ==========================================
    // FETCH PRODUCTS
    // ==========================================

    const fetchProducts = useCallback(async () => {

        try {

            setLoading(true);
            setError('');

            const response = await getAllProducts();

            /*
             * Backend response structure may be:
             * { products: [...] }
             * or
             * { product: [...] }
             * or directly [...]
             */

            const productData =
                response?.products ||
                response?.product ||
                response?.data ||
                response ||
                [];

            setProducts(
                Array.isArray(productData)
                    ? productData
                    : []
            );

        } catch (error) {

            setError(
                error?.friendlyMessage ||
                error?.response?.data?.message ||
                'Failed to load products.'
            );

        } finally {

            setLoading(false);
        }

    }, []);


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        fetchProducts();

    }, [fetchProducts]);


    // ==========================================
    // CATEGORIES
    // ==========================================

    const categories = useMemo(() => {

        const uniqueCategories = [
            ...new Set(
                products
                    .map((product) => product?.category)
                    .filter(Boolean)
            ),
        ];

        return uniqueCategories;

    }, [products]);


    // ==========================================
    // FILTER PRODUCTS
    // ==========================================

    const filteredProducts = useMemo(() => {

        const searchValue =
            search.trim().toLowerCase();


        return products.filter((product) => {

            const title =
                String(product?.title || '')
                    .toLowerCase();

            const brand =
                String(product?.brand || '')
                    .toLowerCase();

            const productCategory =
                String(product?.category || '')
                    .toLowerCase();


            const matchesSearch =
                !searchValue ||
                title.includes(searchValue) ||
                brand.includes(searchValue) ||
                productCategory.includes(searchValue);


            const matchesCategory =
                category === 'all' ||
                product?.category === category;


            return (
                matchesSearch &&
                matchesCategory
            );

        });

    }, [products, search, category]);


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
    // ADD TO CART
    // ==========================================

    const handleAddToCart = async (product) => {

        if (!isAuthenticated || !userId) {

            setError(
                'Please login before adding products to your cart.'
            );

            return;
        }


        if (!product?._id) {

            setError(
                'Product information is missing.'
            );

            return;
        }


        if (
            product?.stock !== undefined &&
            Number(product.stock) <= 0
        ) {

            setError(
                'This product is currently out of stock.'
            );

            return;
        }


        try {

            setError('');

            setSuccessProduct(null);

            setAddingProduct(product._id);


            const response = await addToCart({

                proid: product._id,

                userid: userId,

            });


            if (!response?.success) {

                setError(
                    response?.message ||
                    'Failed to add product to cart.'
                );

                return;
            }


            setSuccessProduct(product._id);


            setTimeout(() => {

                setSuccessProduct(null);

            }, 2500);


        } catch (error) {

            setError(
                error?.friendlyMessage ||
                error?.response?.data?.message ||
                'Failed to add product to cart.'
            );

        } finally {

            setAddingProduct(null);
        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading || authLoading) {

        return (

            <div className="flex items-center justify-center min-h-screen bg-gray-50">

                <div className="text-center">

                    <Loader2
                        className="w-10 h-10 mx-auto mb-4 text-green-600 animate-spin"
                    />

                    <p className="text-gray-600">
                        Loading products...
                    </p>

                </div>

            </div>
        );
    }


    // ==========================================
    // MAIN UI
    // ==========================================

    return (

        <div className="min-h-screen px-4 py-10 bg-gray-50">

            <div className="mx-auto max-w-7xl">


                {/* ==========================================
                    HEADER
                ========================================== */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-gray-900">
                        Shop
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Discover products and add your favorites to cart.
                    </p>

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
                            className="ml-auto text-red-700"
                        >
                            ×
                        </button>

                    </div>
                )}


                {/* ==========================================
                    SEARCH + CATEGORY
                ========================================== */}

                <div className="p-4 mb-8 bg-white border border-gray-100 shadow-sm rounded-2xl">

                    <div className="flex flex-col gap-4 md:flex-row">


                        {/* SEARCH */}

                        <div className="relative flex-1">

                            <Search
                                className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-4 top-1/2"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search products..."
                                className="w-full py-3 pl-12 pr-4 text-gray-900 border border-gray-200 outline-none rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />

                        </div>


                        {/* CATEGORY */}

                        <select
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value)
                            }
                            className="px-4 py-3 text-gray-700 bg-white border border-gray-200 outline-none rounded-xl focus:border-green-500"
                        >

                            <option value="all">
                                All Categories
                            </option>

                            {categories.map((item) => (

                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>

                            ))}

                        </select>

                    </div>

                </div>


                {/* ==========================================
                    RESULT COUNT
                ========================================== */}

                <div className="flex items-center justify-between mb-5">

                    <p className="text-sm text-gray-500">

                        Showing{' '}

                        <span className="font-semibold text-gray-900">
                            {filteredProducts.length}
                        </span>{' '}

                        products

                    </p>

                </div>


                {/* ==========================================
                    EMPTY PRODUCTS
                ========================================== */}

                {filteredProducts.length === 0 ? (

                    <div className="p-12 text-center bg-white border border-gray-100 shadow-sm rounded-2xl">

                        <PackageOpen
                            className="w-12 h-12 mx-auto mb-4 text-gray-400"
                        />

                        <h2 className="text-xl font-semibold text-gray-900">
                            No Products Found
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Try another search or category.
                        </p>

                    </div>

                ) : (

                    /* ==========================================
                       PRODUCT GRID
                    ========================================== */

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                        {filteredProducts.map((product) => {

                            const image =
                                getProductImage(product);

                            const price =
                                Number(product?.price || 0);

                            const finalPrice =
                                getProductPrice(product);

                            const hasDiscount =
                                finalPrice < price;

                            const isAdding =
                                addingProduct === product._id;

                            const isSuccess =
                                successProduct === product._id;

                            const outOfStock =
                                product?.stock !== undefined &&
                                Number(product.stock) <= 0;


                            return (

                                <div
                                    key={product._id}
                                    className="flex flex-col overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl"
                                >


                                    {/* PRODUCT IMAGE */}

                                    <div className="relative h-56 overflow-hidden bg-gray-100">

                                        {image ? (

                                            <img
                                                src={image}
                                                alt={product?.title || 'Product'}
                                                className="object-cover w-full h-full transition duration-300 hover:scale-105"
                                            />

                                        ) : (

                                            <div className="flex items-center justify-center w-full h-full">

                                                <PackageOpen className="w-12 h-12 text-gray-400" />

                                            </div>

                                        )}


                                        {/* DISCOUNT */}

                                        {hasDiscount && (

                                            <span className="absolute px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-full top-3 left-3">

                                                Sale

                                            </span>

                                        )}


                                        {/* STOCK */}

                                        {outOfStock && (

                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">

                                                <span className="px-4 py-2 font-semibold text-white rounded-lg bg-black/70">

                                                    Out of Stock

                                                </span>

                                            </div>

                                        )}

                                    </div>


                                    {/* PRODUCT INFO */}

                                    <div className="flex flex-col flex-1 p-5">


                                        {product?.category && (

                                            <p className="mb-1 text-xs font-medium text-green-600 uppercase">

                                                {product.category}

                                            </p>

                                        )}


                                        <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">

                                            {product?.title || 'Untitled Product'}

                                        </h2>


                                        {product?.brand && (

                                            <p className="mt-1 text-sm text-gray-500">

                                                {product.brand}

                                            </p>

                                        )}


                                        {/* PRICE */}

                                        <div className="flex items-center gap-2 mt-4">

                                            <span className="text-xl font-bold text-green-600">

                                                ৳ {finalPrice.toLocaleString('en-BD')}

                                            </span>


                                            {hasDiscount && (

                                                <span className="text-sm text-gray-400 line-through">

                                                    ৳ {price.toLocaleString('en-BD')}

                                                </span>

                                            )}

                                        </div>


                                        {/* ACTIONS */}

                                        <div className="grid grid-cols-2 gap-2 mt-5">


                                            {/* DETAILS */}

                                            <a
                                                href={`/product/${product._id}`}
                                                className="flex items-center justify-center gap-2 px-3 py-2.5 font-medium text-gray-700 transition border border-gray-300 rounded-lg hover:bg-gray-50"
                                            >

                                                <Eye className="w-4 h-4" />

                                                Details

                                            </a>


                                            {/* ADD TO CART */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleAddToCart(product)
                                                }
                                                disabled={
                                                    isAdding ||
                                                    outOfStock
                                                }
                                                className="flex items-center justify-center gap-2 px-3 py-2.5 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                            >

                                                {isAdding ? (

                                                    <Loader2 className="w-4 h-4 animate-spin" />

                                                ) : isSuccess ? (

                                                    <CheckCircle2 className="w-4 h-4" />

                                                ) : (

                                                    <ShoppingCart className="w-4 h-4" />

                                                )}


                                                {isSuccess
                                                    ? 'Added'
                                                    : 'Add Cart'}

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>

        </div>
    );
}