import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/constants/api';

export async function createPayment(data) {
    const response = await axiosInstance.post(API_ENDPOINTS.orders.CREATE_PAYMENT, data);
    return response.data;
}

export async function getOrders(userId) {
    const url = API_ENDPOINTS.orders.GET_ORDERS.replace(':userid', userId);
    const response = await axiosInstance.get(url);
    return response.data;
}