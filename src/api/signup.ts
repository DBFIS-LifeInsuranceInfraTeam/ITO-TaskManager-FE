import apiClient from '../services/apiClient';

interface UserSignupData {
    userId: string;
    name: string;
    password: string;
    unit: string;
    projectId: string;
    email: string;
    phoneNumber: string;
    photo: string | null;
    position: string;
    admin: boolean;
}

export const signup = async (UserSignupData: UserSignupData) => {
    try {
        const response = await apiClient.post(`/auth/signup`, UserSignupData);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};