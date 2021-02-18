<template>
  <!-- 说明 -->
  <a-collapse v-model:activeKey="activeKey">
    <a-collapse-panel key="1" header="商品模型说明">
      <p>商品模型是添加商品必须的一个功能;分别是商品规格与商品属性;在此建立模型后，添加商品即可选择相应的模型</p>
    </a-collapse-panel>
  </a-collapse>
  <!-- 表头 -->
  <div class="table-header">
    <a-button type="primary" size="small" @click="addShow = true"><template #icon><PlusCircleOutlined /></template>添加模型</a-button>
    <a-button type="danger" size="small" @click="delAll()"><template #icon><DeleteOutlined /></template>删除选中</a-button>
     <a-input-search
      class="search"
      v-model:value="searchValue"
      placeholder="搜索模型名称"
      enter-button
      @search="onSearch"
    />
    <a-button type="danger" size="small" @click="reload()"><template #icon><RedoOutlined /></template>刷新</a-button>
  </div>
  <!-- 添加模型 -->
  <a-modal :footer="null" :width="1000" style="top: 20px;" v-model:visible="addShow">
      <sku-add @cancel="cancel" @onSubmit="ok"/>
  </a-modal>
</template>

<script>
import SkuAdd from "../goods/component/SkuAdd.vue";
import { addGoodsModel } from "@/api/goods";
export default {
  components:{SkuAdd},
  data(){
    return{
      activeKey: ['1'],//默认打开第一条说明
      addShow:false//添加模型窗口状态
    }
  },
  methods:{
    //确认添加
    ok(obj){
      addGoodsModel(obj).then(res=>{
        console.log(res);
      });
    },
    //关闭添加框
    cancel(){
      this.addShow = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.table-header{
  width: 45%;
}
</style>>