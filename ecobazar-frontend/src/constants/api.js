export const API_ENDPOINTS = {
    // ==========================================
    // AUTH
    // ==========================================
    auth: {
        REGISTER: '/registration',
        LOGIN: '/login',
        FORGOT_PASSWORD: '/forgotPassword',
        RESET_PASSWORD: '/resetpassword/:token',
        VERIFY_EMAIL: '/verifyemail/:token',
        RESEND_VERIFICATION_EMAIL: '/resendVerificationEmail',
    },

    // ==========================================
    // USERS
    // ==========================================
    users: {
        ALL_USERS: '/allusers',
        SINGLE_USER: '/singleuser/:id',
        UPDATE_USER: '/update/:id',
        DELETE_USER: '/deleteuser/:id',
    },

    // ==========================================
    // PRODUCTS
    // ==========================================
    products: {
        ALL_PRODUCTS: '/allproduct',
        SINGLE_PRODUCT: '/singleproduct/:id',
        CREATE_PRODUCT: '/createproduct',
        UPDATE_PRODUCT: '/updateproduct/:id',
        DELETE_PRODUCT: '/deleteproduct/:id',
    },

    // ==========================================
    // CATEGORIES
    // ==========================================
    categories: {},

    // ==========================================
    // CART
    // ==========================================
    cart: {
        ADD_TO_CART: '/cart/create',
        UPDATE_CART: '/cart/update/:id',
        GET_CART: '/cart/:userId',
        DELETE_CART_ITEM: '/cart/:id',
    },

    // ==========================================
    // WISHLIST
    // ==========================================
    wishlist: {},

    // ==========================================
    // ORDERS & PAYMENT
    // ==========================================
    orders: {
        GET_ORDERS: '/getorders/:userid',
        CREATE_PAYMENT: '/payment',
    },

    // ==========================================
    // ADDRESS
    // ==========================================
    address: {
        GET_ADDRESSES: '/address',
        ADD_ADDRESS: '/address',
        UPDATE_ADDRESS: '/address/:id',
        DELETE_ADDRESS: '/address/:id',
        SET_DEFAULT_ADDRESS: '/address/:id/default',
    },
};

export default API_ENDPOINTS;