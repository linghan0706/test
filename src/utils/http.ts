import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// 创建 axios 实例
const http: AxiosInstance = axios.create({
  baseURL: process.env.End_SERVICE_HOST || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    console.log('发送请求:', config.url, config.method, config.params || config.data);
    
    // 可以在这里添加认证 token
    // const token = localStorage.getItem('token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    return config;
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    console.log('收到响应:', response.status, response.config.url);
    return response;
  },
  (error: AxiosError) => {
    // 对响应错误做点什么
    console.error('响应错误:', error);
    
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      console.error('错误状态:', error.response.status);
      console.error('错误数据:', error.response.data);
      
      // 可以根据不同的状态码进行不同的处理
      switch (error.response.status) {
        case 401:
          // 未授权，可能需要重新登录
          console.log('未授权，请重新登录');
          // 可以在这里清除本地存储的用户信息并重定向到登录页面
          break;
        case 403:
          // 禁止访问
          console.log('禁止访问');
          break;
        case 404:
          // 请求的资源不存在
          console.log('请求的资源不存在');
          break;
        case 500:
          // 服务器内部错误
          console.log('服务器内部错误');
          break;
        default:
          console.log('其他错误');
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('网络错误:', error.request);
    } else {
      // 在设置请求时触发了错误
      console.error('请求设置错误:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default http;