<template>
<!-- 说明 -->
  <a-collapse v-model:activeKey="HeaderActiveKey">
    <a-collapse-panel key="1" header="回收站说明">
      <p>在此可以彻底删除,请谨慎操作</p>
    </a-collapse-panel>
  </a-collapse>
<!-- 表头 -->
  <div class="table-header">
    <a-button type="danger" size="small" @click="reload()"><template #icon><RedoOutlined /></template>刷新</a-button>
  </div>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="商品回收站">
      <a-space style="margin-bottom: 1%;">
        <a-button type="primary" size="small" @click="regoods(1,1)"><template #icon><LogoutOutlined /></template>恢复选中</a-button>
        <a-button type="danger" size="small" @click="delgoods(1,1)"><template #icon><DeleteOutlined /></template>删除选中</a-button>
      </a-space>
      <!-- 表格 -->
      <a-table
        :loading="loading"
        size="small"
        :columns="goodsHeader"
        :data-source="goodsData"
        rowKey="id"
        :row-selection="goodsRowSelection"
      >
        <template #action="{ record }">
          <a-space>
            <a @click="regoods(0,record.id)">恢复</a>
            <a-popconfirm
              cancelText="取消"
              okText="确定"
              title="确定彻底删除吗?"
              @confirm="delgoods(0,record.id)"
            >
              <a>删除商品</a>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-tab-pane>
    <a-tab-pane key="2" tab="模型回收站" force-render> 
      <a-space style="margin-bottom: 1%;">
        <a-button type="primary" size="small" @click="regoodsModel(1,1)"><template #icon><LogoutOutlined /></template>恢复选中</a-button>
        <a-button type="danger" size="small" @click="delgoodsModel(1,1)"><template #icon><DeleteOutlined /></template>删除选中</a-button>
      </a-space>
      <!-- 表格 -->
      <a-table
        :loading="loading"
        size="small"
        :columns="goodsModelHeader"
        :data-source="goodsModelData"
        rowKey="id"
        :row-selection="goodsModelRowSelection"
      >
        <template #action="{ record }">
          <a-space>
            <a @click="regoodsModel(0,record.id)">恢复</a>
            <a-popconfirm
              cancelText="取消"
              okText="确定"
              title="确定彻底删除吗?"
              @confirm="delgoodsModel(0,record.id)"
            >
              <a>删除模型</a>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
      </a-tab-pane>
    <a-tab-pane key="3" tab="分类回收站">
       <a-space style="margin-bottom: 1%;">
        <a-button type="primary" size="small" @click="regoodsClass(1,1)"><template #icon><LogoutOutlined /></template>恢复选中</a-button>
        <a-button type="danger" size="small" @click="delgoodsClass(1,1)"><template #icon><DeleteOutlined /></template>删除选中</a-button>
      </a-space>
       <!-- 表格 -->
      <a-table
        :loading="loading"
        size="small"
        :columns="goodsClassHeader"
        :data-source="goodsClassData"
        rowKey="id"
        :row-selection="goodsClassRowSelection"
      >
        <template #action="{ record }">
          <a-space>
            <a @click="regoodsClass(0,record.id)">恢复</a>
            <a-popconfirm
              cancelText="取消"
              okText="确定"
              title="删除后该类下的所有商品也会被删除,确定彻底删除吗?"
              @confirm="delgoodsClass(0,record.id)"
            >
              <a>删除分类</a>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import { ref } from "vue";
import { getGoodsRecycle,restoreGoods,delGoods,del,delClass } from "@/api/goods";
import { PlusCircleOutlined,RedoOutlined,DeleteOutlined,LogoutOutlined } from '@ant-design/icons-vue';
import { message } from "ant-design-vue";
//商品表格头
const goodsHeader = [
  {
    title: '商品名称',
    dataIndex: 'goods_name',
  },
  {
    title: '删除时间',
    dataIndex: 'delete_time',
    align:'center',
  },
   {
    title: '操作',
    slots: { customRender: 'action'},
    align:'center',
  },
];
const goodsModelHeader = [
  {
    title: '模型名称',
    dataIndex: 'model_name',
  },
  {
    title: '删除时间',
    dataIndex: 'delete_time',
    align:'center',
  },
   {
    title: '操作',
    slots: { customRender: 'action'},
    align:'center',
  },
];
const goodsClassHeader = [
  {
    title: '分类名称',
    dataIndex: 'class_name',
  },
  {
    title: '删除时间',
    dataIndex: 'delete_time',
    align:'center',
  },
   {
    title: '操作',
    slots: { customRender: 'action'},
    align:'center',
  },
];
export default {
  components:{PlusCircleOutlined,RedoOutlined,DeleteOutlined,LogoutOutlined},
  data() {
    return {
      HeaderActiveKey:1,
      activeKey: ref("1"),
      goodsHeader,
      goodsModelHeader,
      goodsClassHeader,
      goodsData:[],
      goodsModelData:[],
      goodsClassData:[],
      loading:false,
      goodsIds : [],
      goodsModelIds : [],
      goodsClassIds : [],
    };
  },
  computed: {
      goodsClassRowSelection(){
          return {
              onChange: (selectedRowKeys) => {
              //选择的行id
                  this.goodsClassIds = selectedRowKeys
              }
          };
      },
      goodsModelRowSelection(){
          return {
              onChange: (selectedRowKeys) => {
              //选择的行id
                  this.goodsModelIds = selectedRowKeys
              }
          };
      },
      goodsRowSelection() {
          return {
              onChange: (selectedRowKeys) => {
              //选择的行id
                  this.goodsIds = selectedRowKeys
              }
          };
      },
  },
  methods:{
    //恢复分类
    regoodsClass(type,id){
      restoreGoods({type:'goodsClass',ids:type==1?this.goodsClassIds:id}).then(res=>{
        if(res=='SUCCESS'){
            message.success('已成功恢复');
        }else{
            message.success('恢复失败');
        }
        this.reload();
      });
    },
    //删除分类
    delgoodsClass(type,id){
      delClass({type:1,id:type==1?this.goodsClassIds:id}).then(res=>{
        if(res=='SUCCESS'){
            message.success('已彻底删除');
        }else{
            message.error('删除失败');
        }
        this.reload();
      });
    },
    //删除模型
    delgoodsModel(type,id){
      del({type:1,id:type==1?this.goodsModelIds:id}).then(res=>{
        if(res=='SUCCESS'){
            message.success('已彻底删除');
        }else{
            message.success('删除失败');
        }
        this.reload();
      });
    },
    //恢复模型
    regoodsModel(type,id){
      restoreGoods({type:'goodsModel',ids:type==1?this.goodsModelIds:id}).then(res=>{
        if(res=='SUCCESS'){
            message.success('已成功恢复');
        }else{
            message.error('恢复失败');
        }
        this.reload();
      });
    },
    //删除选中商品
    delgoods(type,id){
      delGoods({type:1,id:type==1?this.goodsIds:id}).then(res=>{
        if(res=='SUCCESS'){
            message.success('已彻底删除');
        }else{
            message.error('删除失败');
        }
        this.reload();
      });
    },
    //恢复选中商品
    regoods(type,id){
      restoreGoods({type:'goods',ids:type==1?this.goodsIds:id}).then(res=>{
        if(res=='SUCCESS'){
            message.success('已成功恢复');
        }else{
            message.error('恢复失败');
        }
        this.reload();
      });
    },
    reload(){
      this.getGoods();
    },
    getGoods(){
      this.loading = true;
      getGoodsRecycle().then(res=>{
        this.goodsData = res['goods'];
        this.goodsModelData = res['goodsModel'];
        this.goodsClassData = res['goodsClass'];
        this.loading = false;
      });
    }
  },
  created(){
    this.getGoods();
  }
};
</script>

<style scoped>
.table-header{
  width: 100px;
}
</style>