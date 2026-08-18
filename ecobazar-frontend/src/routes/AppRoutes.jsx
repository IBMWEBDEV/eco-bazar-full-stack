import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import AccountLayout from "../layouts/AccountLayout";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home/Home";
import Shop from "../pages/Shop/Shop";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import OrderFailed from "../pages/OrderFailed/OrderFailed";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail/VerifyEmail";

import Profile from "../pages/Profile/Profile";
import ProfileEdit from "../pages/ProfileEdit/ProfileEdit";
import ProfileAddress from "../pages/ProfileAddress/ProfileAddress";
import ProfileSecurity from "../pages/ProfileSecurity/ProfileSecurity";
import Orders from "../pages/Orders/Orders";

import NotFound from "../pages/NotFound/NotFound";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Main Layout */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/order-failed" element={<OrderFailed />} />
                </Route>

                {/* Auth Layout */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/verifyemail/:token" element={<VerifyEmail />} />
                </Route>

                {/* Protected Account */}
                <Route
                    element={
                        <ProtectedRoute>
                            <AccountLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/edit" element={<ProfileEdit />} />
                    <Route path="/profile/address" element={<ProfileAddress />} />
                    <Route path="/profile/security" element={<ProfileSecurity />} />
                    <Route path="/my-orders" element={<Orders />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />

            </Routes>
        </BrowserRouter>
    );
}