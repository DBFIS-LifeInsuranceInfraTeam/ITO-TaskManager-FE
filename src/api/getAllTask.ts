import apiClient from '../services/apiClient';
import qs from 'qs';



export const getAllTask = async (projectIds: string[], page: number, size: number) => {
  try {
    const response = await apiClient.get(`/tasks`, {
      params: { projectIds, page, size },
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }) // projectIds[]=10&projectIds[]=20 형식으로 직렬화
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};