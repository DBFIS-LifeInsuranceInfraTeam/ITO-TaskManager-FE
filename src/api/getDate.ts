import apiClient from '../services/apiClient';

export const getDate = async () => {
  try {
    const response = await apiClient.get(`/current-datetime`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching date:", error);
    throw error;
  }
};
