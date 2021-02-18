import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Antd from "ant-design-vue";
import Axios from "axios";
import "ant-design-vue/dist/antd.css";
import dataV from '@jiaminghi/data-view';


const app = createApp(App);
//注入Axios
app.config.globalProperties.$axios = Axios; 
//配置上传文件地址
app.config.globalProperties.$PathUrl="http://zx.cn";
//app.config.globalProperties.$PathUrl="http://api.sherkxuan.ren";
app
  .use(store)
  .use(router)
  .use(Antd)
  .use(dataV)
  .mount("#app");
