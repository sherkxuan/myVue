<template>
<!-- 说明 -->
  <a-collapse v-model:activeKey="activeKey">
    <a-collapse-panel key="1" header="接口管理模块说明">
      <p>接口说明及其注意事项</p>
    </a-collapse-panel>
  </a-collapse>
<!-- 表头 -->
  <div class="table-header">
    <a-button type="primary" size="small" @click="addBox = true"><template #icon><PlusCircleOutlined /></template>添加接口</a-button>
    <a-button type="danger" size="small" @click="delAll()"><template #icon><DeleteOutlined /></template>删除选中</a-button>
     <a-input-search
      class="search"
      v-model:value="searchValue"
      placeholder="搜索接口名称"
      enter-button
      @search="onSearch"
    />
    <a-button type="danger" size="small" @click="reload()"><template #icon><RedoOutlined /></template>刷新</a-button>
  </div>
<!-- 表格 -->
  <div>
    <a-table :loading="loading" size="small" :columns="columns" rowKey="id" :data-source="data" bordered :row-selection="rowSelection">
      <template #name="{text}">
        <a>{{ text }}</a>
      </template>
      <template #N_title="{ record }">
        <a-popover>
          <template #content>
              {{record.exp}}
          </template>
           <a>{{ record.name }}</a>
        </a-popover>
      </template>
       <template #num="{ record }">
          <span>{{record.call_num>=0?record.call_num:'无限'}}</span>
      </template>
      <template #status="{ record }">
          <span>
            <a-switch checked-children="开" un-checked-children="关" v-model:checked="record.status" @click="setStatus(record.id,record.status)"/>
          </span>
      </template>
       <template #action="{ record }">
        <span style="display: flex;width:100%;justify-content: space-around;font-size: 10px;">
          <a-button type="dashed" shape="circle" @click="look(record.id)" size="small">查</a-button>
          <a-button type="primary" shape="circle" @click="edit(record.id)" size="small">改</a-button>
          <a-popconfirm
            cancelText="取消"
            okText="确定"
            title="确定删除吗?"
            @confirm="del(record.id,record)"
          >
          <a-button type="danger" shape="circle" size="small">删</a-button>
        </a-popconfirm>
        </span>
    </template>
    </a-table>
  </div>
  <!-- 添加 -->
    <a-modal :confirm-loading="confirmLoading" ok-text="添加" cancel-text="取消" :width="720" style="top: 20px;" v-model:visible="addBox" title="新增API" @ok="addClick" destroyOnClose>
      <add-api ref="add" v-on:ApiOk="ApiOk"/>
    </a-modal>
  <!-- 修改 -->
  <a-modal ok-text="修改" cancel-text="取消" :width="720" style="top: 20px;" v-model:visible="editBox" title="修改API" @ok="editClick" >
      <edit-api ref="edit" v-on:ApiOk="ApiOk"  :ApiInfo="ApiInfoData" />
  </a-modal>
  <!-- 查看 -->
  <a-modal :footer="null" :width="720" style="top: 20px;" v-model:visible="lookBox" title="查看API">
      <look-api ref="look" v-on:ApiOk="ApiOk"  :ApiInfo="ApiInfoData" />
  </a-modal>
</template>

<script>
import { PlusCircleOutlined,DeleteOutlined,RedoOutlined } from '@ant-design/icons-vue';
import { getApiList, del, setApiStatus, getApiById, delAll, getApiWarning } from "@/api/api";
import { notification } from 'ant-design-vue';
import AddApi from "./component/AddApi.vue";
import EditApi from "./component/EditApi.vue";
import LookApi from "./component/LookApi.vue";
import { message } from 'ant-design-vue';
const columns = [
  {
    title: '接口名称',
    //dataIndex: 'name',
    slots: { customRender: 'N_title' },
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: '路由',
    dataIndex: 'api_route',
    width: 150,
  },
  {
    title: '映射地址',
    dataIndex: 'api_map',
  },
  {
    title: '请求方式',
    dataIndex: 'method',
  },
   {
    title: '剩余次数',
    //dataIndex: 'call_num',
    slots: { customRender: 'num' },
    sorter: (a, b) => a.name.length - b.name.length,
    width:120,
  },
  {
    title: '最后调用时间',
    dataIndex: 'update_time',
    sorter: (a, b) => a.name.length - b.name.length,
    width:180,
  },
  {
    title: '状态',
    //dataIndex: 'status',
    align:'center',
    slots: { customRender: 'status' },
    width:100,
  },
  {
    title: '操作',
    key: 'action',
    slots: { customRender: 'action' },
    width:120,
    align:'center',
  },
];
export default {
  components: {PlusCircleOutlined,DeleteOutlined,RedoOutlined,AddApi,EditApi,getApiById,LookApi,delAll,getApiWarning,notification},
  data() {
    return {
      data:[],
      columns,
      activeKey: ['1'],//默认打开第一条说明
      loading:false,//加载提示
      addBox:false,//增加弹窗
      editBox:false,//修改弹窗
      lookBox:false,//查看弹出
      ApiInfoData:[],//api详情数据
      clickId:'',//选中的id
      searchValue:'',//搜索框的数据
      searchDataAll:[],//搜索临时存放全部数据
      confirmLoading: false,//异步确认按钮
      ids:''//批量删除id集合
    };
  },
  created(){
    this.getList();
    if(localStorage.getItem('api_load')!=null){
      this.getApiWarning();
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys) => {
          //选择的行id
          this.ids = selectedRowKeys
        }
      };
    },
  },
  methods:{
    //查询次数小于1000的记录
    getApiWarning(){
      getApiWarning().then(res=>{
        res.forEach(item => {
          if(item.call_num==0){
            notification.error({
              duration:null,
              message: 'API通知',
              description:item.name+'调用次数已用完',
            });
          }else{
             notification.warning({
              message: 'API通知',
              description:item.name+'调用次数不足,只剩'+item.call_num+'次',
            });
          }
        });
      });
      localStorage.removeItem("api_load");
    },
    //搜索
    onSearch(){
      //this.getList();
      console.log('xs')
      let arr = [];
      this.searchDataAll.forEach((item,index)=>{
        if(item.name.includes(this.searchValue)){
            arr.push(item)
        }
      });
      this.searchValue=''
      this.data = arr;
    },
    //批量删除
    delAll(){
      console.log('pl:',this.ids);
      if(!this.ids){
         message.warning('没有选中数据!');
         return;
      }
      delAll(this.ids).then(res=>{
          if(res=='SUCCESS'){
            this.ids = '';
            message.success('已删除选中的数据!');
            this.reload();
          }
      })
    },
    //查看API
    look(id){
      this.lookBox=true;
      getApiById(id).then(res=>{
        this.ApiInfoData = res
        //console.log(res);
      });
    },
    //修改API
    edit(id){
      this.editBox = true;
      this.clickId = id;
      getApiById(id).then(res=>{
        this.ApiInfoData = res
      });
    },
    //更改状态
    setStatus(id,status){
      console.log(id,status)
      setApiStatus(id).then(res=>{
          return res;
      })
    },
    //监听子组件方法
    ApiOk(){
      message.success('操作成功!')
      this.addBox=false;
      this.editBox=false;
      this.confirmLoading = false;
      this.reload();
    },
    //修改接口点击提交
    editClick(){
      this.$refs.edit.onSubmit(this.clickId);
    },
    //新增接口点击提交
    addClick(){
      this.confirmLoading = true;
      this.$refs.add.onSubmit();
      //this.confirmLoading = false;
    },
    //删除接口
    del(id,data){
      del(id).then(res=>{
        if(res=='SUCCESS'){
            let index = this.data.indexOf(data)
            this.data.splice(index,1);
        }
      })
    },
    //获取数据
   getList(){
      this.loading=true
      getApiList().then(res=>{
        this.data=res
        this.searchDataAll=res
        this.loading=false
      })
    },
    //刷新接口
    reload(){
      this.getList();
    }
  }
};
</script>
<style lang="scss" scoped>
.ant-table{
  font-size: 12px;
}
.table-header{
  display: flex;
  margin-top: 2%;
  margin-bottom: 1%;
  width: 45%;
  align-items: center;
  justify-content: space-around;
  .search{
    width: auto;
  }
}
</style>