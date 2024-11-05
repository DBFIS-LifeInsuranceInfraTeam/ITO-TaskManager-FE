import qs from 'qs';
import apiClient from '../services/apiClient';

export const getUserByProjectId = async (projectIds:string[]|string) => {
    // try {
    //   const response = await apiClient.get(`/users/${projectId}`);
    //   return response.data;
    // } catch (error) {
    //   console.error("Error fetching date:", error);
    //   throw error;
    // }


  
  try {
    const response = await apiClient.get(`/users`, {
      params: {projectIds},
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }) // projectIds[]=10&projectIds[]=20 형식으로 직렬화
  });

    return response.data;
  } catch (error) {
    console.error("Error fetching users by project IDs:", error);
    throw error;
  }
  };