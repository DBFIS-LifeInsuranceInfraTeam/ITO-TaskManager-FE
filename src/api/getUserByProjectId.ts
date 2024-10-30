import apiClient from '../services/apiClient';

export const getUserByProjectId = async (projectId:string) => {
    try {
      const response = await apiClient.get(`/users/${projectId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching date:", error);
      throw error;
    }
  };
  