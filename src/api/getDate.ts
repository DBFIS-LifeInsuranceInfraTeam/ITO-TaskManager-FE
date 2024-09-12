import apiClient from '../services/apiClient';

export const getDate = async () => {
  try {
    const response = await apiClient.get(`/date`);
    return response.data;
  } catch (error) {
    throw error;
  }
};