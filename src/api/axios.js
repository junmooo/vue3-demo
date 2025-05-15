import axios from 'axios';

const service = axios.create({
  baseURL: '/aigc',
  timeout: 60000,
});

service.interceptors.request.use(async (config) => {
  const loginInfo = localStorage.getItem('token') ?? '';
  // do something
  config.headers.Authorization = 'Bearer sk-40f540e96272456288ff6890c06d9913';
  config.headers['Content-Type'] = 'application/json';
  config.headers['token'] = loginInfo;
  return config;
});

service.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data;
    }
  },
  (error) => {
    localStorage.clear();
    let errMsg = error;
    if (error.response?.status === 403) {
      errMsg = 'token 失效';
      // window.location.href = '/';
      return Promise.reject(errMsg);
    } else {
      localStorage.clear();
    }
    return Promise.reject(errMsg);
  },
);

export default service;
