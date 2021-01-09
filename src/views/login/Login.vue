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
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
export default {
  components: {
    UserOutlined,
    LockOutlined,
  },
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
    };
  },
  methods: {
    handleSubmit(e) {
      console.log(this.form);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>
