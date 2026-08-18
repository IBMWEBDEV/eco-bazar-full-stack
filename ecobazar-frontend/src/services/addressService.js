import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/constants/api';


// ==========================================
// GET MY ADDRESSES
// ==========================================

export async function getAddresses() {
    const response = await axiosInstance.get(
        API_ENDPOINTS.address.GET_ADDRESSES
    );

    return response.data;
}


// ==========================================
// ADD ADDRESS
// ==========================================

export async function addAddress(data) {
    const response = await axiosInstance.post(
        API_ENDPOINTS.address.ADD_ADDRESS,
        data
    );

    return response.data;
}


// ==========================================
// UPDATE ADDRESS
// ==========================================

export async function updateAddress(id, data) {
    const url = API_ENDPOINTS.address.UPDATE_ADDRESS.replace(
        ':id',
        id
    );

    const response = await axiosInstance.put(
        url,
        data
    );

    return response.data;
}


// ==========================================
// DELETE ADDRESS
// ==========================================

export async function deleteAddress(id) {
    const url = API_ENDPOINTS.address.DELETE_ADDRESS.replace(
        ':id',
        id
    );

    const response = await axiosInstance.delete(url);

    return response.data;
}


// ==========================================
// SET DEFAULT ADDRESS
// ==========================================

export async function setDefaultAddress(id) {
    const url =
        API_ENDPOINTS.address.SET_DEFAULT_ADDRESS.replace(
            ':id',
            id
        );

    const response = await axiosInstance.put(url);

    return response.data;
}