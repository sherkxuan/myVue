<template>
  <a-form
    ref="ruleForm"
    :rules="rules"
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-item label="属性模型" name="goods_model" extra="请选择属性模型填写合适的属性,没有商品属性可不填写或选填合适的属性">
      <a-select
        v-model:value="goods_model"
        show-search
        placeholder="选择属性模型"
        option-filter-prop="label"
        style="width: 200px"
        :filter-option="filterOption"
        @change="handleChange"
      >
        <a-select-option
          v-for="(model, index) in goodsModelData"
          :key="model.id"
          :value="index"
          >{{ model.model_name }}</a-select-option
        >
      </a-select>
       <a-table :columns="propTable" :pagination="false" :data-source="propList" rowKey="id" size="small">
      <template #prop="{record}">
        <div class="specStyle">
             <a-space>
                <div v-for="(item,index) in record.prop_values" :key="index">
                    <div v-if="item==''"><a-input
                        v-model:value="record.value"
                        maxlength="30"
                        placeholder="请输入属性"
                    /></div>
                    <div v-else>
                        <a-radio-group v-model:value="record.value" button-style="solid">
                            <a-radio-button :value="item">{{item}}</a-radio-button>
                        </a-radio-group>
                    </div>
                </div>
            </a-space>
        </div>
      </template>
      <template #clearProp="{record}">
           <a-space>
               <a-button size="small" type="danger" @click="record.value=''">清除</a-button>
            </a-space>
      </template>
    </a-table>
    </a-form-item>
  </a-form>
</template>

<script>
const propTable = [
  {
    title: '属性名称',
    dataIndex: 'prop_name',
    width:120
  },
  {
    title: '可选属性值(请输入或选择属性值,不需要的属性请清空)',
    slots: { customRender: 'prop' },
  },
  {
    title: '清空属性',
    width:120,
    slots: { customRender: 'clearProp' },
  },
];
import { getGoodsModelList } from "@/api/goods";
import { message } from "ant-design-vue";
export default {
  props: {
    fatherData:{
        type: Array,
        default: []
    }
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
      goodsModelData: [], //后台请求的商品模型列表
      goods_model: "", //商品模型名称
      propList:[],//所有属性列表
      propTable,
      //tmp:'',
      //propData:[]
    };
  },
  created(){
    this.init();
  },
  methods: {
     //表单验证
    async onSubmit() {
      this.$emit('formData',[this.propList,this.goods_model])
      return true;
    },
    //父组件点击上一步
    onBack(){
      this.$emit('formData',[this.propList,goods_model])
    },
      //选择模型方法
    handleChange(value){
      //选中商品的所有规格
      this.propList =this.goodsModelData[value].goodsModelProp;
      this.propList.forEach((item,index)=>{
          this.propList[index].value = "";
      })
    },
    //初始方法
    init() {
      getGoodsModelList().then((res) => {
        this.goodsModelData = res;
      });

      //处理表单初始值(父传子or子传父)
      if(this.fatherData.length != 0){
          this.goods_model = this.fatherData[1]
          this.propList = this.fatherData[0]
      }
    },
    //选择分类搜索时
    filterOption(input, option) {
      return (
        option.children["0"].children
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
  },
};
</script>

<style lang="scss">
.specStyle {
    >div{
        display: flex;
        flex-wrap: wrap;
        >div{
            margin-top: 4px;
        }
    }
}
</style>