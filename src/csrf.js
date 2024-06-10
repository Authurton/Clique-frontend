import axiosInstance from './axiosInstance';

export const getCsrfToken = async () => {
    const response = await axiosInstance.get('/api/csrf-token/');
    return response.data.csrfToken;
};
