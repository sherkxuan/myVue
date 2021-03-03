<template>
  <!-- 说明 -->
  <a-collapse v-model:activeKey="activeKey">
    <a-collapse-panel key="1" header="商品模型说明">
      <p>商品模型是添加商品必须的一个功能;分别是商品规格与商品属性;在此建立模型后，添加商品即可选择相应的模型;商品属性的未定义则表示需要在添加商品时手动输入</p>
    </a-collapse-panel>
  </a-collapse>
  <!-- 表头 -->
  <div class="table-header">
    <a-button type="primary" size="small" @click="addShow = true"><template #icon><PlusCircleOutlined /></template>添加模型</a-button>
     <a-input-search
      class="search"
      v-model:value="searchValue"
      placeholder="搜索模型名称"
      enter-button
      @search="onSearch"
    />
    <a-button type="danger" size="small" @click="reload()"><template #icon><RedoOutlined /></template>刷新</a-button>
  </div>
  <!-- 表格 -->
  <div>
    <a-table :loading="loading" size="small" :columns="columns" rowKey="id" :data-source="data" bordered >
      <template #spec="{record}">
        <div>
          <div class="specStyle" v-for="(item,index) in record.goodsModelSpec" :key="index">
            <div>{{item.spec_name}}:</div>
            <div>
              <span v-for="(specvalue,index2) in item.value" :key="index2">{{specvalue.spec_value}}</span>
            </div>
          </div>
        </div>
      </template>
      <template #prop="{record}">
        <div>
          <div class="specStyle"  v-for="(item3,index3) in record.goodsModelProp" :key="index3">
            <div>{{item3.prop_name}}:</div>
            <div><span  v-for="(propvalue,index4) in item3.prop_values" :key="index4">{{propvalue!=''?propvalue:'自定义'}}</span>
            </div>
          </div>
        </div>
      </template>
       <template #action="{ record }">
        <span style="display: flex;width:100%;justify-content: space-around;font-size: 10px;">
          <a-button type="primary" shape="circle" @click="edit(record.id)" size="small">改</a-button>
          <a-popconfirm
            cancelText="取消"
            okText="确定"
            title="确定移至回收站吗?"
            @confirm="del(record.id,record)"
          >
          <a-button type="danger" shape="circle" size="small">删</a-button>
        </a-popconfirm>
        </span>
    </template>
    </a-table>
  </div>
  <!-- 添加模型 -->
  <a-modal title="添加商品模型" :footer="null" :width="1000" style="top: 20px;" v-model:visible="addShow" :maskClosable="false" destroyOnClose>
      <sku-set @cancel="cancel" @onSubmit="ok"/>
  </a-modal>
  <!-- 修改模型 -->
  <a-modal title="添加商品模型" :footer="null" :width="1000" style="top: 20px;" v-model:visible="editShow" :maskClosable="false" destroyOnClose>
      <sku-set :getinfo="getinfo" @cancel="cancel" @onSubmit="editOk"/>
  </a-modal>
  <!-- 警告提醒 -->
  <a-modal  :footer="null" :width="650" style="top: 20px;" v-model:visible="WShow" :maskClosable="false" destroyOnClose>
      <a-result status="warning" 
          title="在你修改商品模型我们会提醒你以下消息"
          sub-title="我们不建议你修改商品模型,若必须修改你将明白后果:
              修改后，原有的商品将无法延用修改后的模型,
              需要修改商品重新设置新的商品模型;
              若有商品正在使用修改的商品模型,建议先修改相应商品的模型为无，再修改商品模型
              若不清楚修改后果,建议新建商品模型.">
        <template #extra>
          <a-button key="console" type="primary" @click="WShow = false;editShow = true;">我已知晓</a-button>
        </template>
      </a-result>
  </a-modal>
</template>

<script>
const columns = [
  {
    title: '模型名称',
    dataIndex: 'model_name',
    width:150,
    align:'center'
  },
  {
    title: '规格',
    align:'center',
    width:500,
    slots: { customRender: 'spec' },
  },
  {
    title: '属性',
    align:'center',
    width:500,
    slots: { customRender: 'prop' },
  },
  {
    title: '操作',
    slots: { customRender: 'action' },
    width:100,
    align:'center',
  },
];
import SkuSet from "../goods/component/Sku.vue";
import { PlusCircleOutlined,RedoOutlined } from '@ant-design/icons-vue';
import { addGoodsModel,getGoodsModelList,del,getGoodsModelById,editGoodsModel } from "@/api/goods";
import { message } from 'ant-design-vue';
export default {
  components:{SkuSet,PlusCircleOutlined,RedoOutlined},
  data(){
    return{
      loading:false,//表格加载状态
      activeKey: ['1'],//默认打开第一条说明
      addShow:false,//添加模型窗口状态
      editShow:false,
      WShow:false,//警告框状态
      getinfo:'',//根据id查询的数据
      editId:'',//被修改的ID
      searchValue:'',
      searchDataAll:[],//搜索临时存储数据
      columns,
      data:[]
    }
  },
  methods:{
    //确认修改
    editOk(e){
      e.id = this.editId;
      editGoodsModel(e).then(res=>{
        if(res=='SUCCESS'){
          message.success('修改成功');
        }
        this.reload();
        this.editShow = false;
      });
    },
    //修改商品模型窗口打开
    edit(id){
      this.editId = id; 
      getGoodsModelById(id).then(res=>{
        this.WShow=true;
        this.getinfo=res;
      });
    },
    //删除商品模型
     del(id,data){
      del({id:id,type:0}).then(res=>{
        if(res=='SUCCESS'){
            let index = this.data.indexOf(data)
            this.data.splice(index,1);
        }
      })
    },
    //搜索
    onSearch(){
      //this.getList();
      let arr = [];
      this.searchDataAll.forEach((item,index)=>{
        if(item.model_name.includes(this.searchValue)){
            arr.push(item)
        }
      });
      this.searchValue=''
      this.data = arr;
    },
    //处理请求的数据
    setData(data){
      this.data =data;
    },
    //刷新列表
    reload(){
      this.init();
    },
    //输出模型列表
    init(){
      this.loading=true;
      getGoodsModelList().then(res=>{
        this.setData(res);
        this.searchDataAll=res
        this.loading=false;
      });
      
    },
    //确认添加
    ok(obj){
      addGoodsModel(obj).then(res=>{
        if(res=='SUCCESS'){
          message.success('添加成功');
          this.addShow = false;
          this.reload();
        }
      });
    },
    //关闭添加和修改框
    cancel(){
      this.addShow = false;
      this.editShow=false;
    }
  },
  created(){
    this.init();
  }
}
</script>

<style lang="scss" scoped>
.specStyle:last-child{
  border-bottom: unset;
  padding-bottom: 0;
  padding-top: 1%;
}
.specStyle{
  width: 100%;
  display: flex;
  border-bottom: 1px solid rgb(230, 230, 230);
  padding-bottom: 1%;
  padding-top: 1%;
  span{
    display:inline-block;
    margin: 0.5%;
    padding:0 1%;
    height: 25px;
    line-height: 25px;
    background-color: rgb(254, 254, 255);
    box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
    border: 1px solid #bbbbbb;
    border-radius: 2px;
  }
  span:hover{
    background-color: rgb(230, 230, 230);
  }
  >div:last-child{
    width: 85%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  >div:first-child{
    width: 15%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 0.5%;
  }
}
.table-header{
  width: 400px;
}
</style>>