import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/constants/api';

export async function getAllProducts() {
    const response = await axiosInstance.get(API_ENDPOINTS.products.ALL_PRODUCTS);
    return response.data;
}

export async function getProductById(id) {
    const url = API_ENDPOINTS.products.SINGLE_PRODUCT.replace(':id', id);
    const response = await axiosInstance.get(url);
    return response.data;
}

export async function createProduct(formData) {
    const response = await axiosInstance.post(
        API_ENDPOINTS.products.CREATE_PRODUCT,
        formData, { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
}

export async function updateProduct(id, formData) {
    const url = API_ENDPOINTS.products.UPDATE_PRODUCT.replace(':id', id);
    const response = await axiosInstance.put(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
}

export async function deleteProduct(id) {
    const url = API_ENDPOINTS.products.DELETE_PRODUCT.replace(':id', id);
    const response = await axiosInstance.delete(url);
    return response.data;
}