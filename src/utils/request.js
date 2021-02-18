import axios from "axios";
import router from "@/router/index.js";
import { message } from 'ant-design-vue';
const service = axios.create({
  //baseURL: "http://api.sherkxuan.ren",//生产环境
  //baseURL:this.$PathUrl,
  baseURL: "/api", //开发环境
  timeout: 5000 //请求超时
});
// 请求拦截器
service.interceptors.request.use(
  function(config) {
    //message.loading('Action in progress..',0)
    // 对发送请求前做些什么
    let pathname = router.currentRoute._value.path
    if(pathname != '/'){
      config.headers.token = localStorage.getItem('token');
    }
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function(response) {
    
    //console.log('相应到此',response);
    if (response.data.code == 200) {
      return response.data.data;
    } else if (response.data.code == 201) {
      //处理token过期事件
      message.warning(response.data.data)
      localStorage.removeItem("token");
      router.push('/')
    } else if (response.data.code == 500) {
      message.error(response.data.data)
      return false;
    } else {
      message.warning(response.data.data)
      return response.data;
    }
    // 对响应数据做点什么
  },
  function(error) {
    // 对响应错误做点什么
    alert(error);
    return Promise.reject(error);
  }
);
export default service;
