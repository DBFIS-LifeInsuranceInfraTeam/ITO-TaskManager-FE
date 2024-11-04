import apiClient from '../services/apiClient';
import qs from 'qs';

export const getTaskByMonth = async (year: number, month: number, projectIds: string[]) => { 
    try {
      const response = await apiClient.get(`/tasks/monthly`, {
        params: {
          year,
          month,
          projectIds
        },
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }) // projectIds[]=10&projectIds[]=20 형식으로 직렬화
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks by month:", error);
      throw error;
    }
  };