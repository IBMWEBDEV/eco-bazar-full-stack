import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/constants/api';

export async function addToCart(data) {
    const response = await axiosInstance.post(API_ENDPOINTS.cart.ADD_TO_CART, data);
    return response.data;
}

export async function updateCart(id, data) {
    const url = API_ENDPOINTS.cart.UPDATE_CART.replace(':id', id);
    const response = await axiosInstance.post(url, data);
    return response.data;
}

export async function getCart(userId) {
    const url = API_ENDPOINTS.cart.GET_CART.replace(':userId', userId);
    const response = await axiosInstance.get(url);
    return response.data;
}

export async function deleteCartItem(id) {
    const url = API_ENDPOINTS.cart.DELETE_CART_ITEM.replace(':id', id);
    const response = await axiosInstance.delete(url);
    return response.data;
}