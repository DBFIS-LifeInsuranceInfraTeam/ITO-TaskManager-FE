import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 에러 처리 로직
    return Promise.reject(error);
  }
);

export default apiClient;