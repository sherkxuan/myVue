<template>
  <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="接口名称">
          {{ApiInfo.name}}
        </a-form-item>
        <a-form-item label="接口说明">
          {{ApiInfo.exp}}
        </a-form-item>
        <a-form-item label="路由地址">
          {{ApiInfo.api_route}}
        </a-form-item>
        <a-form-item label="映射地址">
          {{ApiInfo.api_map}}
        </a-form-item>
        <a-form-item label="请求方式">
          {{ApiInfo.method}}
        </a-form-item>
        <a-form-item label="调用次数">
          {{ApiInfo.call_num < 0 ?'无限次数':ApiInfo.call_num}}
        </a-form-item>
        <a-form-item label="状态">
          {{ApiInfo.status==0 ?'已关闭该API':'API已启用'}}
        </a-form-item>
        <a-form-item label="禁用IP" v-if="ApiInfo.forbid_ip">
          {{ApiInfo.forbid_ip}}
        </a-form-item>
      </a-form>
</template>

<script>
export default {
  name:"LookApi",
  props:{
    ApiInfo:{
      type: Object,
      default: []
    }
  },
  data(){
    return{
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    }
  }
}
</script>
<style lang="scss">
.ts{
  font-size: 8px;
  color: rgb(175, 175, 175);
  padding: 2%;
}
</style>