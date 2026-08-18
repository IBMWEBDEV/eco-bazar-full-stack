import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/constants/api';

export async function getAllUsers() {
    const response = await axiosInstance.get(API_ENDPOINTS.users.ALL_USERS);
    return response.data;
}

export async function getUserById(id) {
    const url = API_ENDPOINTS.users.SINGLE_USER.replace(':id', id);
    const response = await axiosInstance.get(url);
    return response.data;
}

export async function updateUser(id, data) {
    const url = API_ENDPOINTS.users.UPDATE_USER.replace(':id', id);
    const response = await axiosInstance.post(url, data);
    return response.data;
}

export async function deleteUser(id) {
    const url = API_ENDPOINTS.users.DELETE_USER.replace(':id', id);
    const response = await axiosInstance.delete(url);
    return response.data;
}