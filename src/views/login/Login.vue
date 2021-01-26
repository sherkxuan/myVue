<template>
  <div class="body-con">
    <div class="login-box">
      <h2>xx后台管理系统</h2>
      <a-form
        class="form-box"
        layout="vertical"
        :model="form"
        @submit="handleSubmit"
      >
        <a-form-item style="width: 80%">
          <a-input
            size="large"
            v-model:value="form.username"
            placeholder="Username"
          >
            <template #prefix
              ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
            /></template>
          </a-input>
        </a-form-item>
        <a-form-item style="width: 80%">
          <a-input-password
            size="large"
            v-model:value="form.password"
            type="password"
            placeholder="Password"
          >
            <template #prefix
              ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
            /></template>
          </a-input-password>
        </a-form-item>
        <a-form-item style="width: 80%">
          <a-button
            :loading="loading"
            size="large"
            block
            type="primary"
            html-type="submit"
            :disabled="form.username === '' || form.password === ''"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { message } from "ant-design-vue";
import router from "@/router/index.js";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
//导入请求api
import { adminLogin,isLogin } from "@/api/account";
export default {
  components: {
    UserOutlined,
    LockOutlined
  },
  setup() {
    beforeCreate:{
      if (localStorage.getItem("token") != null) {
        isLogin({'token':localStorage.getItem("token")}).then(res=>{
          if(res===true){
            router.push("/index");
          }
        });
        
      }
    }
    const from = reactive({
      loading:false,
      form: {
        username: "",
        password: ""
      }
    });
    const handleSubmit = () => {
      from.loading=true;
      adminLogin(from.form).then(res => {
        if (res.msg) {
          localStorage.setItem("token", res.token);
          localStorage.setItem('first_load',1)
          message.success(res.msg);
          from.loading=false;
          router.push("/index");
        } else {
          from.loading=false;
          message.error(res.data);
        }
      });
    }
    const data = toRefs(from);
    return {
      handleSubmit,
      ...data
    };
  }
};
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>
