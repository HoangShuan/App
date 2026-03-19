import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
  // In development we force a relative baseURL so CRA's proxy forwards requests
  // to the backend and cookies are treated as same-site. In production use
  // the configured REACT_APP_API_BASE_URL.
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3001' 
    : process.env.REACT_APP_API_BASE_URL,
  headers: {
    'content-type': 'application/json',
  },
  withCredentials: true,
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // hoặc sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    (error) => Promise.reject(error)
  },
);

axios.interceptors.response.use(
  (response) => response.data, // chỉ trả về data cho gọn
  (error) => Promise.reject(error)
);

export default axiosClient;
