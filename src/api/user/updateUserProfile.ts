import qs from 'qs';
import apiClient from '../apiClient';

interface UpdateUserProfilePayload {
  file?: File;
}

export const updateUserProfile = async (userId: string, payload: UpdateUserProfilePayload) => {
  try {
    const formData = new FormData();

    if (payload.file) {
      formData.append('file', payload.file); // 파일 추가
    }

    const response = await apiClient.post(`/users/${userId}/profile-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }), // 직렬화 설정
    });

    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
