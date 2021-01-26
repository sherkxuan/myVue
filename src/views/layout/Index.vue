<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <!-- 侧边菜单区 -->
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <layoutAside :collapsed="collapsed"/>
    </a-layout-sider>
    <a-layout>
      <!-- 头部区 -->
      <a-layout-header style="background: #fff; padding: 0">
        <LayoutHeader @clickBt="headerAction()"/>
      </a-layout-header>
      <!-- 内容区 -->
      <a-layout-content :style="{margin: '24px 16px',padding: '24px',background: '#fff',minHeight: '280px',height:'84vh',overflow: 'overlay'}">
          <LayoutMain />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import LayoutAside from "./component/Aside";
import LayoutMain from "./component/Main";
import LayoutHeader from "./component/Header";
import router from "@/router/index.js";
//import { notification } from 'ant-design-vue';
import { reactive, toRefs } from "vue";
import { getMyInfo } from "@/api/account";
export default {
  name: "Layout",
  components: {
    LayoutAside,
    LayoutHeader,
    LayoutMain
  },
  setup() {
    const data = reactive({
      collapsed: JSON.parse(localStorage.getItem("collapsed"))
    });
    const headerAction = () => {
      let bool = !data.collapsed;
      data.collapsed = bool;
      localStorage.setItem("collapsed", bool);
    };
    // eslint-disable-next-line no-unused-labels
    beforeCreate: {
      if (localStorage.getItem("token") == null) {
        router.push("/");
      }
    };
    created:{
      /* if(localStorage.getItem('first_load')!=null){
        getMyInfo().then(res=>{
          notification.info({
            message: '登录通知',
            description:
              '欢迎你，'+res.real_name+'\n上次登录IP：'+res.last_ip+'\n上次登录时间：'+res.last_time,
              style: {
                whiteSpace:'pre-wrap'
            },
          });
          console.log('zh')
          localStorage.removeItem("first_load");
          localStorage.setItem("userinfo", JSON.stringify(res));
        });
      } */
    };
    return {
      ...toRefs(data),
      headerAction
    };
  }
};
</script>
<style lang="scss">
</style>