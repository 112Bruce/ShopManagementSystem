import axios from 'axios'
import { ElLoading,ElMessage } from 'element-plus'
import store from '../store/index'
// 使用create创建axios实例
const Service = axios.create({
    timeout:8000,
    baseURL:'http://127.0.0.1:8888/api/private/v1/',
    headers:{
        'Content-type': 'application/json;charset=utf-8',
        "Authorization": store.state.uInfo.userInfo.token
    }
})

let loadingObj = null;

// 请求拦截（请求之前）
Service.interceptors.request.use(config => {
    // Element的loading动画
    loadingObj = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })

    // 只有return config，才会执行请求
    return config;
})

// 响应拦截（对请求结果进行处理）
Service.interceptors.response.use(res=>{
    // 关闭loading1
    loadingObj.close();
    const data = res.data;
    if(!data.data){
        ElMessage.error(data.meta.msg || '服务器出错');
        return data;
    }

    return res.data;
}, err=>{
    // 关闭loading1
    loadingObj.close();
    ElMessage({
        message: '服务器错误',
        type: 'error',
        duration:2000
    })
})

// 封装请求 post请求
export const post = config => {
    return Service({
        // 将config的属性全部拷贝过来
        ...config,
        method: 'post',
        data:config.data,
    })
}

// 封装请求 get请求
export const get = config => {
    return Service({
        // 将config的属性全部拷贝过来
        ...config,
        method: 'get',
        // get请求时常用params传参
        params:config.data,
    })
}

// 封装请求 put请求
export const put = config => {
    return Service({
        // 将config的属性全部拷贝过来
        ...config,
        method: 'put',
        data:config.data,
    })
}

// 封装请求 put请求
export const del = config => {
    return Service({
        // 将config的属性全部拷贝过来
        ...config,
        method: 'delete',
        // 无需传参
        // data:config.data,
    })
}