<template>
  <div class="header-box">
    <div class="menu-btn" @click="heddin">
      <i class="iconfont icon-toggle"></i>
    </div>
    <div class="header-menu">
      <a-dropdown :trigger="['click']" placement="bottomLeft">
        <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
          <a-avatar :src="data.userinfo.avatar" />
          <i class="iconfont icon-gengduo"></i>
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item key="0">
              <a href="" style="color:red">{{data.userinfo.real_name}}</a>
            </a-menu-item>
            <a-menu-item key="1">
              <a href="">修改密码</a>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="2" @click="outLogin()"> 退出 </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>
<script>
import { getCurrentInstance, reactive } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';
import LayoutAside from "./Aside";
import router from "@/router/index.js";
import { message } from "ant-design-vue";

import { getMyInfo } from "@/api/account";
import { notification } from 'ant-design-vue';
export default {
  name: "Header",
  components: {
    UserOutlined,
  },
  setup() {
    const { emit } = getCurrentInstance();
    const heddin = () =>{
      emit('clickBt')
    }
    const data = reactive({
        userinfo:{
          avatar:'',
          real_name:''
        }
    })
    beforeCreate:{
      if(localStorage.getItem('first_load')!=null){
        getMyInfo().then(res=>{
          notification.info({
            message: '登录通知',
            description:
              '欢迎你，'+res.real_name+'\n上次登录IP：'+res.last_ip+'\n上次登录时间：'+res.last_time,
              style: {
                whiteSpace:'pre-wrap'
            },
          });
          localStorage.removeItem("first_load");
          localStorage.setItem("userinfo", JSON.stringify(res));
          data.userinfo = res
        });
      }
      if(localStorage.getItem('userinfo')!=null){
          data.userinfo = JSON.parse(localStorage.getItem('userinfo'))
      }
    }
    const outLogin = ()=>{
      localStorage.removeItem("token");
      localStorage.removeItem("userinfo");
      message.success("成功退出");
      router.push("/");
    }
    return {
      heddin,data,outLogin
    }
  }
};
</script>
<style lang="scss" scoped>
.header-box {
  padding: 0 20px;
  .header-menu {
    float: right;
    
  }
}
.menu-btn{
      float: left;
      cursor: pointer;
      .iconfont{
        font-size: 24px;
      }
    }
.ant-dropdown-menu{
    margin-top: 10%;
}
</style>