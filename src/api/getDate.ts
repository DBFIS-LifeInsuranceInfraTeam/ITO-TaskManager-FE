import apiClient from '../services/apiClient';

export const getDate = async () => {
  try {
    const response = await apiClient.get(`/current-datetime`);
    console.log(response.data.year);
    return response.data;
  } catch (error) {
    throw error;
  }
};