<template>
  <a-form
    ref="ruleForm"
    :rules="rules"
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-item label="服务名称" name="serve_name" extra="最多不能超过8个字">
      <a-input
        v-model:value="form.serve_name"
        maxlength="8"
        placeholder="请输入分类名称,最多8字符"
      />
    </a-form-item>
    <a-form-item label="描述" name="serve_desc">
      <a-textarea
        :autoSize="true"
        v-model:value="form.serve_desc"
        showCount
        maxlength="200"
        placeholder="请输入服务描述"
      />
    </a-form-item>
  </a-form>
  <div class="footer">
    <div>
      <a-button type="dashed" @click="cancel">取消</a-button>
      <a-button type="primary" @click="ok" :loading="loading">确认</a-button>
    </div>
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
export default {
    props:{
        formData:{
            type: Object,
            default: []
        }
    },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      loading:false,
      form: {
          serve_name:'',
          serve_desc:''
      },
      rules: {
        serve_name: [
          { required: true, message: "请输入服务名称", trigger: "blur" },
          { whitespace: true, message: "服务名称不能为空", trigger: "blur" },
        ],
        serve_desc: [
          { required: true, message: "请输入服务描述", trigger: "blur" },
          { whitespace: true, message: "服务描述不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created(){
       this.form = this.formData
  },
  methods:{
    //点击确认
    ok() {
      this.loading = true;
      this.$refs.ruleForm
        .validate()
        .then(() => {
          this.$emit("ok", this.form);
        })
        .catch((error) => {
          this.loading = false;
          message.warning("请检查表单填写是否正确!");
        });
    },
    //点击取消
    cancel() {
      this.$emit("cancel");
    },
  }
};
</script>

<style lang="scss">
.footer {
  > div {
    width: 200px;
    margin: 0px auto;
    display: flex;
    justify-content: space-around;
  }
}
</style>