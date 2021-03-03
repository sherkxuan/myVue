<template>
  <a-form
    ref="ruleForm"
    :rules="rules"
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
  <a-form-item label="商品标签" name="goods_label">
      <a-input
        v-model:value="form.goods_label"
        maxlength="255"
        placeholder="请输入商品标签以便于优化搜索,中间用英文逗号(,)隔开"
      />
    </a-form-item>
    <a-form-item label="是否包邮" name="is_mail">
      <a-radio-group v-model:value="form.is_mail" @change="clickRadio">
        <a-radio :value="1">免运费</a-radio>
        <a-radio :value="0">不包邮</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item v-if="form.is_mail==0" label="运费" name="mail_price">
      <a-input-number
              v-model:value="form.mail_price"
              precision="2"
              :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
              />
    </a-form-item>
    <a-form-item label="是否上架" name="status">
      <a-radio-group v-model:value="form.status">
        <a-radio :value="1">立即上架</a-radio>
        <a-radio :value="0">放入仓库</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="商品排序" name="goods_sort">
      <a-input-number
        v-model:value="form.goods_sort"
        @change="numberCheck($event,'goods_sort')"
        maxlength="6"
      />
    </a-form-item>
  </a-form>
</template>

<script>
import { message } from "ant-design-vue";
export default {
  props: {
    fatherData: {
      type: Array,
      default: [],
    },
  },
    data(){
        return{
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            form:{
                is_mail:1,//是否包邮
                goods_label:'',//搜索优化，商品标签
                mail_price:'',//邮费
                status:1,//是否立即上架
                goods_sort:0//商品排序
            }
        }
    },
    created(){
      this.init()
    },
    methods:{
      //表单验证
    async onSubmit() {
      if(this.form.is_mail==0){
        if(this.form.mail_price=='' || this.form.mail_price<0){
          message.warning("请输入邮费!");
          return false;
        }
      }
      if(this.form.goods_sort==null){
        message.warning("排序值不能为空!");
        return false;
      }
      this.$emit("formData", this.form);
      return true
    },
      //初始方法
    init() {
      //处理表单初始值(父传子or子传父)
      if (this.fatherData.length != 0) {
        this.form = this.fatherData;
      }
    },
    //父组件点击上一步
    onBack() {
      this.$emit("formData", this.form);
    },
        //格式化数字
        numberCheck(e,type) {
            if (e == null) return;
            let res = e.toString().replace("-", "");
            res = res.replace(".", "");
            this.form[type] = parseInt(res);
        },
        //是否包邮点击时
        clickRadio(e){
            if(e.target.value==1){
                this.form.mail_price=''
            }
        }
    }
} 
</script>

<style>

</style>