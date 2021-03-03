<template>
  <a-form
    ref="ruleForm"
    :rules="rules"
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-item label="商品名称" name="goods_name">
      <a-input
        v-model:value="form.goods_name"
        maxlength="30"
        placeholder="请输入分类名称,不超过30字符"
      />
    </a-form-item>
    <a-form-item label="促销语" name="promotion">
      <a-textarea
        v-model:value="form.promotion"
        showCount
        maxlength="50"
        placeholder="请输入促销语,用于商品促销;不超过50字符"
      />
    </a-form-item>
    <a-form-item label="商品分类" name="goods_class">
      <a-cascader
            v-model:value="form.goods_class"
            :options="options"
            expand-trigger="hover"
            @change="checkClass"
            :show-search="{ filter }"
            :fieldNames="{ label: 'class_name', value: 'id', children: 'children' }"
            placeholder="请选择分类,若没有三级分类则不可选"
        />
    </a-form-item>
    <a-form-item label="商品服务" name="goods_serve">
      <a-checkbox-group v-if="checkedList!=''" v-model:value="form.goods_serve">
           <a-row>
            <a-col v-for="item in checkedList" :key="item.id">
                <a-checkbox :value="item.id">
                    <a-tooltip>
                        <template #title>{{item.serve_desc}}</template>
                        {{item.serve_name}}
                    </a-tooltip>
                </a-checkbox>
            </a-col>
           </a-row>
      </a-checkbox-group>
      <a-spin v-else/>
    </a-form-item>
  </a-form>
</template>

<script>
import { getGoodsClassList,getGoodsServeList } from "@/api/goods";
import { message } from "ant-design-vue";
export default {
  props: {
    fatherData:{
        type: Array,
        default: []
    }
  },
    data(){
        return{
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            form:{
                goods_name:'',
                goods_class:'',//分类名称
                goods_class_id:'',//三级分类id
                promotion:'',//促销语
                goods_serve:[],//商品服务列表
            },
            rules:{
              goods_name: [
                { required: true, message: '请输入商品标题', trigger: 'blur' },
                {whitespace:true, message: '名称不能为空', trigger: 'blur' }
              ],
              goods_class: [
                { type:'array',required: true, message: '请选择商品分类', trigger: 'blur' },
              ],
              goods_serve: [
                { type:'array',required: true, message: '请选择商品服务', trigger: 'blur' },
              ],
            },
            options : [],//所有分类数据
            checkedList:[],//商品服务列表
        }
    },
    methods:{
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
        //选择分类后事件
        checkClass(value){
            this.form.goods_class_id = value[2];
        },
        //搜索分类
        filter(inputValue, path){
            return path.some(option => option.class_name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
        },
        //初始方法
        getClass(){
            //查询所有分类
            getGoodsClassList().then(res=>{
                this.options = res;
            });
            //查询可用的商品服务
            getGoodsServeList().then(res=>{
                this.checkedList = res;
            })

            //处理表单初始值(父传子or子传父)
            if(this.fatherData.length != 0){
                this.form = this.fatherData
            }
        },
    },
    created(){
        this.getClass();
    }
}
</script>

<style lang="scss" >

</style>