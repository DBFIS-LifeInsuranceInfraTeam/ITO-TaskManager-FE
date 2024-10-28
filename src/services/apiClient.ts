import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}/api`, // 환경 변수를 사용
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
