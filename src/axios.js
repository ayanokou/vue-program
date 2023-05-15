// 创建 Axios 实例
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8081',
    timeout: 5000,
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么
        const token = sessionStorage.getItem('token');
        console.log(token);
        console.log("添加头部成功");
        if (token) {
            config.headers['token'] = token;
        }
        return config;
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
    response => {
        // 对响应数据做些什么
        console.log("响应拦截器");
        const token = response.headers['token'];
        if (token) {
            // 将Token保存在本地存储中
            console.log(token);
            sessionStorage.setItem('token', token);
        }
        return response;
    },
    error => {
        // 对响应错误做些什么
        if (error.response.status === 401) {
            // 如果返回的状态码是 401，表示未授权，跳转到登录页
            console.log("401返回")
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;