import qs from 'qs';
import apiClient from '../apiClient';

interface UpdateUserInfoPayload {
  name?: string;
  email?: string;
  phoneNumber?: string;
  position?: string;
  unit?: string;
}

export const updateUserInfo = async (userId: string, payload: UpdateUserInfoPayload) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, payload, {
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }) // projectIds[]=10&projectIds[]=20 형식으로 직렬화
    });

    return response.data;
  } catch (error) {
    console.error('Error updating user information:', error);
    throw error;
  }
};
