import apiClient from '../services/apiClient';
import qs from 'qs';

export const getAllProjects = async () => {
  try {
    const response = await apiClient.get(`/auth/projects`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};