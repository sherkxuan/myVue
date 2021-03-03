<template>
  <!-- 说明 -->
  <a-collapse v-model:activeKey="activeKey">
    <a-collapse-panel key="1" header="商品服务说明">
      <p>添加适合商品发布的可能用到的服务</p>
    </a-collapse-panel>
  </a-collapse>
  <!-- 表头 -->
  <div class="table-header">
    <a-button type="primary" size="small" @click="addShow = true"><template #icon><PlusCircleOutlined /></template>添加服务</a-button>
    <a-button type="danger" size="small" @click="reload()"><template #icon><RedoOutlined /></template>刷新</a-button>
  </div>
  <!-- 表格 -->
  <a-table :loading="loading" size="small" :columns="columns" rowKey="id" :data-source="serveData" bordered>
    <template #action="{ record }">
            <span style="display: flex;width:100%;justify-content: space-around;font-size: 10px;">
            <a-button type="primary" shape="circle" @click="edit(record.id)" size="small">改</a-button>
            <a-popconfirm
                cancelText="取消"
                okText="确定"
                title="确定删除吗?"
                @confirm="del(record)"
            >
            <a-button type="danger" shape="circle" size="small">删</a-button>
            </a-popconfirm>
            </span>
        </template>
  </a-table>
  <!-- 添加服务 -->
  <a-modal title="添加商品服务" :footer="null" :width="500"  v-model:visible="addShow" :maskClosable="false" destroyOnClose>
      <serve  @cancel="cancel" @ok="addOk"/>
  </a-modal>
  <!-- 修改服务 -->
  <a-modal title="修改商品服务" :footer="null" :width="500"  v-model:visible="editShow" :maskClosable="false" destroyOnClose>
      <serve :formData="formData" @cancel="cancel" @ok="editOk"/>
  </a-modal>
</template>

<script>
const columns = [
  {
    title: '服务名称',
    dataIndex: 'serve_name',
    width:150,
  },
  {
    title: '描述',
    dataIndex: 'serve_desc',
    //width:150,
    align:'left'
  },
  {
    title: '创建时间',
    width:150,
    dataIndex: 'create_time',
    sorter: (a, b) => a.create_time - b.create_time,
    align:'center'
  },
  {
    title: '操作',
    slots: { customRender: 'action' },
    width:100,
    align:'center',
  },
];
import Serve from "../goods/component/Serve.vue";
import { PlusCircleOutlined,RedoOutlined } from '@ant-design/icons-vue';
import { addGoodsServe,getGoodsServeList,getGoodsServeById,editGoodsServe,delGoodsServe } from "@/api/goods";
import { message } from 'ant-design-vue';
export default {
  components:{PlusCircleOutlined,RedoOutlined,Serve},
  data(){
    return{
      loading:false,
      addShow:false,
      columns,
      serveData:[],
      editShow:false,
      formData:[]//编辑选中的数据
    }
  },
  created(){
    this.init();
  },
  methods:{
    //删除商品服务
    del(data){
      delGoodsServe({id:data.id}).then(res=>{
        if(res=='SUCCESS'){
          message.success('成功删除');
          let index = this.serveData.indexOf(data)
          this.serveData.splice(index,1);
        }
      });
    },
    //确认修改
    editOk(e){
      console.log(e);
      editGoodsServe(e).then(res=>{
        if(res=='SUCCESS'){
          message.success('修改成功');
        }
        this.reload();
        this.editShow = false;
      });
    },
    //修改服务
    edit(id){
      getGoodsServeById(id).then(res=>{
        this.formData =res;
        this.editShow = true;
      });
    },
    //刷新表格
    reload(){
      this.init()
    },
    //初始方法
    init(){
      this.loading=true;
      getGoodsServeList().then(res=>{
        this.serveData = res;
        this.loading=false;
      });
    },
    //确认添加
    addOk(e){
      console.log(e);
      addGoodsServe(e).then(res=>{
        if(res=='SUCCESS'){
          message.success('添加成功');
        }
        this.reload();
        this.addShow = false;
      });
    },
    //取消
    cancel(){
      this.addShow = false;
      this.editShow = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.table-header{
  width: 250px;
}
</style>