import apiClient from '../services/apiClient';

interface UserSignupData {
    id: string;
    name: string;
    password: string;
    unit: string;
    project: string;
    email: string;
    phoneNumber: string;
    photo: string | null;
    position: string;
}

export const signup = async (userData: UserSignupData) => {
    try {
        const response = await apiClient.post(`/auth/signup`, userData);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};