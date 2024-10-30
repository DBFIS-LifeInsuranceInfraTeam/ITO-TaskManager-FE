import apiClient from '../services/apiClient';

export const login = async (userId: string, password: string) => {
    try {
        const response = await apiClient.post(`/auth/login`, { userId, password });
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};