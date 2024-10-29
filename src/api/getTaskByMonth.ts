import apiClient from '../services/apiClient';

export const getTaskByMonth = async (year: number, month: number) => { 
    try {
      const response = await apiClient.get(`/tasks/monthly`, {
        params: {
          year,
          month
        }
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks by month:", error);
      throw error;
    }
  };
