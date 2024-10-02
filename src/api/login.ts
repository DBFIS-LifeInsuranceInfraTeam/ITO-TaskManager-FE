import apiClient from '../services/apiClient';

export const login = async (id: string, password: string) => {
    try {
        const response = await apiClient.post(`/auth/login`, { id, password });
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};