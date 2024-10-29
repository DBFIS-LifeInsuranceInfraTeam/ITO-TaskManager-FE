import apiClient from '../services/apiClient';



export const getAllTask = async () => {
  try {
    const response = await apiClient.get(`/tasks/all`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching date:", error);
    throw error;
  }
};
