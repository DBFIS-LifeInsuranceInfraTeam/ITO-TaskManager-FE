import apiClient from '../services/apiClient';

export const signup = async (id: string, password: string) => {
    try {
        const response = await apiClient.post(`/auth/signup`, { id, password });
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};