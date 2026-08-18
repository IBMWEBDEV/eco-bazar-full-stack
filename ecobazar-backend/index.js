require('node:dns').setServers(['1.1.1.1', '8.8.8.8']);

const multer = require('multer');
const bcrypt = require('bcrypt');
require('dotenv').config();

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');

const dbConfig = require("./config/dbConfig");
const secureMiddleWare = require("./middleware/secureMiddleWare");

const {
    registrationController,
    loginController,
    forgotPasswordController,
    resetPasswordController,
    resendVerificationEmailController,
    verifyEmailController
} = require('./controllers/authenticationController');

const {
    getAllUsersController,
    singleUserDataController,
    deleteUserController,
    updateUserController,
    getProfileController,
    updateProfileController
} = require('./controllers/userController');

const {
    createProductController,
    getProductController,
    getSingleProductController,
    productDeleteController,
    productUpdateController
} = require('./controllers/productController');

const {
    createCart,
    increDecre,
    prodelete,
    getCart
} = require('./controllers/cartController');

const axios = require('axios');

const {
    paymentController,
    paymentSuccessController,
    paymentFailController,
    paymentCancelController,
    getAllOrdersController
} = require('./controllers/paymentController');


const {
    addAddressController,
    getMyAddressesController,
    updateAddressController,
    deleteAddressController,
    setDefaultAddressController
} = require('./controllers/addressController');


// ==========================================
// MULTER - PRODUCT UPLOAD
// ==========================================

const productStorage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/products');
    },

    filename: (req, file, cb) => {

        const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

        cb(
            null,
            uniqueSuffix + '_' + file.originalname
        );
    }

});

const productUpload = multer({
    storage: productStorage
});


// ==========================================
// MULTER - PROFILE IMAGE UPLOAD
// ==========================================

const profileStorage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/profiles');
    },

    filename: (req, file, cb) => {

        const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

        cb(
            null,
            uniqueSuffix + '_' + file.originalname
        );
    }

});

const profileUpload = multer({
    storage: profileStorage
});


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());

app.use(cors());


// Uploaded files publicly accessible
app.use('/uploads', express.static('uploads'));


// ==========================================
// DATABASE
// ==========================================




// ==========================================
// AUTHENTICATION
// ==========================================

app.post('/registration', registrationController);

app.post('/login', loginController);

app.post('/forgotPassword', forgotPasswordController);

app.post('/resetpassword/:token', resetPasswordController);

app.post(
    '/resendVerificationEmail',
    resendVerificationEmailController
);

app.post(
    '/verifyemail/:token',
    verifyEmailController
);


// ==========================================
// PRODUCT
// ==========================================

app.post(
    '/createproduct',
    productUpload.array('photos', 5),
    createProductController
);

app.get(
    '/allproduct',
    getProductController
);

app.get(
    '/singleproduct/:id',
    getSingleProductController
);

app.delete(
    '/deleteproduct/:id',
    productDeleteController
);

app.put(
    '/updateproduct/:id',
    productUpload.array('photos', 5),
    productUpdateController
);


// ==========================================
// CART
// ==========================================

app.post(
    '/cart/create',
    createCart
);

app.post(
    '/cart/update/:id',
    increDecre
);

app.get(
    '/cart/:userId',
    getCart
);

app.delete(
    '/cart/:id',
    prodelete
);


// ==========================================
// PAYMENT
// ==========================================

// Create Payment
app.post(
    '/payment',
    secureMiddleWare,
    paymentController
);


// AamarPay Success Callback
app.post(
    '/payment/success',
    paymentSuccessController
);


// AamarPay Failed Callback
app.post(
    '/payment/fail',
    paymentFailController
);


// AamarPay Cancel Callback
app.all(
    '/payment/cancel',
    paymentCancelController
);


// Get My Orders
app.get(
    '/getorders/:userid',
    getAllOrdersController
);



// ==========================================
// ADDRESS MANAGEMENT
// ==========================================

// Add Address
app.post(
    '/address',
    secureMiddleWare,
    addAddressController
);

// Get My Addresses
app.get(
    '/address',
    secureMiddleWare,
    getMyAddressesController
);

// Update Address
app.put(
    '/address/:id',
    secureMiddleWare,
    updateAddressController
);

// Delete Address
app.delete(
    '/address/:id',
    secureMiddleWare,
    deleteAddressController
);

// Set Default Address
app.put(
    '/address/:id/default',
    secureMiddleWare,
    setDefaultAddressController
);


// ==========================================
// USER MANAGEMENT
// ==========================================

app.get(
    '/allusers',
    getAllUsersController
);

app.get(
    '/singleuser/:id',
    singleUserDataController
);

app.delete(
    '/deleteuser/:id',
    deleteUserController
);

app.post(
    '/update/:id',
    updateUserController
);


// ==========================================
// PROFILE
// ==========================================

// Get Profile
app.get(
    '/profile',
    secureMiddleWare,
    getProfileController
);


// Update Profile
app.put(
    '/profile',
    secureMiddleWare,
    profileUpload.single('profile'),
    updateProfileController
);


// ==========================================
// SERVER
// ==========================================

let port = process.env.PORT || 5000;

const startServer = async() => {
    try {
        await dbConfig();

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error("Server Start Failed:", error.message);
    }
};

startServer();