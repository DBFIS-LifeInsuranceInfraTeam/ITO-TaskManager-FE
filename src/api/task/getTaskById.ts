import apiClient from '../apiClient';

export const getTaskById = async (taskId:string) => {
  try {
    const response = await apiClient.get(`/tasks/${taskId}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching date:", error);
    throw error;
  }
};
