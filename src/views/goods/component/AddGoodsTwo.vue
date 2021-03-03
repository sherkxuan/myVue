<template>
  <a-form
    ref="ruleForm"
    :rules="rules"
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-item label="总库存" name="inventory" extra="仅用于展示库存,实际库存以商品规格填写为准">
      <a-input-number
        v-model:value="form.inventory"
        @change="numberCheck($event,'inventory')"
        maxlength="8"
      />
    </a-form-item>
    <a-form-item label="库存预警" name="warning_inventory" extra="当商品库存低于设置的库存,将提醒商家及时补货">
      <a-input-number
        v-model:value="form.warning_inventory"
        @change="numberCheck($event,'warning_inventory')"
        maxlength="8"
      />
    </a-form-item>
    <a-form-item label="销售价" name="goods_price" extra="仅用于展示价格,实际价格以商品规格填写为准">
       <a-input-number
        v-model:value="form.goods_price"
        precision="2"
        :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
        :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
        />
    </a-form-item>
    <a-form-item label="划线价" name="goods_line_price" extra="设置划线价格用于与实际价格做对比">
       <a-input-number
        v-model:value="form.goods_line_price"
        precision="2"
        :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
        :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
        />
    </a-form-item>
    <a-form-item label="已售数量" name="sold" extra="该参数不作数据统计">
      <a-input-number
        v-model:value="form.sold"
        @change="numberCheck($event,'sold')"
        maxlength="6"
      />
      </a-form-item>
      <a-form-item label="每人限购" name="limitation" extra="每人最多可购买数量,为0则表示不限制">
      <a-input-number
        v-model:value="form.limitation"
        @change="numberCheck($event,'limitation')"
        maxlength="6"
      />
    </a-form-item>
     <a-form-item label="起售数量" name="satr_num" extra="最低要求购买数量,最小为1">
      <a-input-number
        v-model:value="form.satr_num"
        @change="numberCheck($event,'satr_num')"
        maxlength="6"
      />
    </a-form-item>
  </a-form>
</template>

<script>
import { message } from "ant-design-vue";
export default {
    props: {
      fatherData:{
          type: Array,
          default: []
      }
    },
    data(){
        //验证价格不能为0或负数
        let checkPrice =  async (rule, value, callback) => {
          if(value<=0){
            return Promise.reject('商品价格必须大于0元');
          }
        };
        return{
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            form:{
                inventory:1000,//总库存
                warning_inventory:100,//库存预警数量
                goods_price:'',//商品价格
                goods_line_price:'',//划线价
                sold:0,//已售数量
                limitation:0,//限购数量,为零则不限制
                satr_num:1,//起售数量,默认一件起售
            },
             rules:{
              inventory: [
                { type:'number',required: true, message: '总库存不能为空', trigger: 'blur' },
              ],
              warning_inventory: [
                { type:'number',required: true, message: '库存预警数量不能为空', trigger: 'blur' },
              ],
              goods_price: [
                { type:'number',required: true, message: '商品价格不能为空', trigger: 'blur' },
                { validator: checkPrice, trigger: 'blur' }
              ],
              goods_line_price: [
                { type:'number',required: true, message: '划线价不能为空', trigger: 'blur' },
                { validator: checkPrice, trigger: 'blur' }
              ],
              limitation: [
                { type:'number',required: true, message: '每人限购不能为空', trigger: 'blur' },
              ],
              satr_num: [
                { type:'number',required: true, message: '起售数量不能为空', trigger: 'blur' },
              ],
            },
        }
    },
    methods:{
      //父组件点击上一步
      onBack(){
        this.$emit('formData',this.form)
      },
       //表单验证
        async onSubmit() {
          return await this.$refs.ruleForm
            .validate()
            .then(() => {
                //alert('ok');
                this.$emit('formData',this.form)
                return true;
            })
            .catch(error => {
              message.warning('请检查表单填写是否正确!')
              return false;
            });
        },
        //初始方法
        getClass(){
            //处理表单初始值(父传子or子传父)
            if(this.fatherData.length != 0){
                this.form = this.fatherData
            }
        },
         //禁止数字输入框输入负号和点
        numberCheck(e,type) {
            if (e == null) return;
            let res = e.toString().replace("-", "");
            res = res.replace(".", "");
            this.form[type] = parseInt(res);
            if(this.form.satr_num==0){
              this.form.satr_num=1
            }
            if(this.form.warning_inventory > this.form.inventory){
              message.warning('预警库存不能大于总库存!');
              this.form.warning_inventory=this.form.inventory
            }
            //if(this.form.inventory)
        },
    },
    created(){
        this.getClass();
    }
}
</script>

<style lang="scss" >
.ant-input-number{
    width: unset;
}
</style>