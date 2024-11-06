import apiClient from '../services/apiClient';
import qs from 'qs';

export const getProjectsByProjectId = async (projectIds: string[]) => {
  try {
    
    const response = await apiClient.get(`/auth/projects/description`, {
      params: {
          projectIds
      },
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }) // projectIds[]=10&projectIds[]=20 형식으로 직렬화
  });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};