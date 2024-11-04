import qs from "qs";
import apiClient from '../services/apiClient';


export const getStatisticsByProjectId = async (projectIds: string[], month?: string) => {
    try {
        const response = await apiClient.get(`/statistics`, {
            params: {
                projectIds, // 배열로 전달
                ...(month && { month }) // month가 있으면 추가
            },
            paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }) // projectIds[]=10&projectIds[]=20 형식으로 직렬화
        });
        
        return response.data;
    } catch (error) {
        console.error("Error fetching statistics:", error);
        throw error;
    }
};