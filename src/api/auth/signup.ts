import apiClient from '../apiClient';

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
    admin: false;
}

export const signup = async (UserSignupData: UserSignupData) => {
    try {
        const response = await apiClient.post(`/auth/signup`, UserSignupData);
        console.log(response.data);
        return response.data;
    } catch (error: any) {
        console.error('API 에러:', error.response || error.message);
        // 에러 정보를 클라이언트에 반환
        return {
            success: false,
            error: error.response?.data || 'Unknown error occurred',
        };
    }
};