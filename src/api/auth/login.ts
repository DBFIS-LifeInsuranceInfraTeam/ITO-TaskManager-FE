import apiClient from '../apiClient';

export const login = async (userId: string, password: string) => {

    try {
        const response = await apiClient.post(`/auth/login`, { userId, password });
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