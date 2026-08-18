import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/constants/api';

export async function registerUser(data) {
    const response = await axiosInstance.post(API_ENDPOINTS.auth.REGISTER, data);
    return response.data;
}

export async function loginUser(data) {
    const response = await axiosInstance.post(API_ENDPOINTS.auth.LOGIN, data);
    return response.data;
}

export async function forgotPassword(data) {
    const response = await axiosInstance.post(API_ENDPOINTS.auth.FORGOT_PASSWORD, data);
    return response.data;
}

export async function resetPassword(token, data) {
    const url = API_ENDPOINTS.auth.RESET_PASSWORD.replace(':token', token);
    const response = await axiosInstance.post(url, data);
    return response.data;
}

export async function verifyEmail(token) {
    const url = API_ENDPOINTS.auth.VERIFY_EMAIL.replace(':token', token);
    const response = await axiosInstance.post(url);
    return response.data;
}

export async function resendVerificationEmail(data) {
    const response = await axiosInstance.post(
        API_ENDPOINTS.auth.RESEND_VERIFICATION_EMAIL,
        data
    );
    return response.data;
}
export async function getProfile() {
    const response = await axiosInstance.get("/profile");
    return response.data;
}

export async function updateProfile(data) {
    const response = await axiosInstance.put("/profile", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}