<template>
  <!-- 说明 -->
  <a-collapse v-model:activeKey="activeKey">
    <a-collapse-panel key="1" header="平台管理模块说明">
      <p>应用平台说明及其注意事项</p>
    </a-collapse-panel>
  </a-collapse>
  <!-- 表头 -->
  <div class="table-header">
    <a-button type="primary" size="small" @click="addBox = true">
      <template #icon><PlusCircleOutlined /></template>添加平台
    </a-button>
    <a-input-search class="search" v-model:value="searchValue" placeholder="搜索平台名称" enter-button @search="onSearch"/>
    <a-button type="danger" size="small" @click="reload()" :loading="btLoading">
      <template #icon><RedoOutlined /></template>刷新
    </a-button>
  </div>
  <!-- 表格 -->
  <div>
    <a-table :loading="loading" size="small" :columns="columns" rowKey="id" :data-source="data" bordered :row-selection="rowSelection">
      <template #name="{ text }">
        <a>{{ text }}</a>
      </template>
      <template #N_title="{ record }">
        <a-popover>
          <template #content>
              {{record.describe}}
          </template>
           <a>{{ record.name }}</a>
        </a-popover>
      </template>
      <template #type="{ record }">
        <span>
          {{record.type==1?'微信公众号':'微信小程序'}}
        </span>
      </template>
       <template #qr="{ record }">
        <span>
          <a-image
            width="100px"
            height="100px"
            :src="record.qr_code"
          />
        </span>
      </template>
      <template #status="{ record }">
        <span>
          <a-switch checked-children="开" un-checked-children="关" v-model:checked="record.status" @click="setStatus(record.id, record.status)" />
        </span>
      </template>
       <template #connect="{ record }">
        <span>
          <div v-if="record.is_connect==1">已接入</div>
          <div v-else>
            <a-button type="link" @click="openCheck(record.id)">
              未接入(点击接入)
            </a-button>
          </div>
        </span>
      </template>
      <template #action="{ record }">
        <span style="display: flex;width: 100%;justify-content: space-around;font-size: 10px;">
          <a-button type="dashed"  @click="look(record.id)" size="small">进入</a-button>
          <a-button type="primary"  @click="edit(record.id)" size="small">设置</a-button>
          <a-popconfirm cancelText="取消" okText="确定" title="确定移至回收站吗?" @confirm="del(record.id, record)">
            <a-button type="danger" shape="circle" size="small">删</a-button>
          </a-popconfirm>
        </span>
      </template>
    </a-table>
  </div>
  <!-- 添加 -->
  <a-modal :footer="null"  :width="1000" style="top: 20px;" v-model:visible="addBox" title="新建平台" destroyOnClose>
      <add v-on:Ok="Ok"/>
  </a-modal>
  <!-- 接入页面 -->
  <a-modal :footer="null" :width="800" style="top: 20px;" v-model:visible="checkShow" title="验证平台" destroyOnClose>
    <edit-check-p :byId="getbyId" @closeWindow="closeWindow"/>
  </a-modal>
</template>

<script>
import { PlusCircleOutlined, RedoOutlined } from "@ant-design/icons-vue";
import { getPlatformList, del, setPlatformStatus} from "@/api/platform";
import Add from "./component/Add.vue";
import EditCheckP from "./component/EditCheckP.vue";
const columns = [
  {
    title: '平台名称',
    //dataIndex: 'name',
    slots: { customRender: 'N_title' },
    sorter: (a, b) => a.name.length - b.name.length,
    width: 80,
  },
  {
    title: '管理员',
    dataIndex: 'real_name',
    width: 80,
  },
  {
    title: '类型',
    slots: { customRender: 'type' },
    width: 80,
    align:'center',
  },
  {
    title: '二维码',
    slots: { customRender: 'qr' },
    align:'center',
    width: 80,
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    sorter: (a, b) => a.name.length - b.name.length,
    width:180,
    align:'center',
  },
  {
    title: '状态',
    align:'center',
    slots: { customRender: 'status' },
    width:100,
  },
  {
    title: '是否接入',
    align:'center',
    slots: { customRender: 'connect' },
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
  components: { PlusCircleOutlined, RedoOutlined, Add,EditCheckP, EditCheckP},
  data() {
    return {
      activeKey: ["1"], //默认打开第一条说明
      columns,
      btLoading:false,//刷新按钮加载状态
      loading:false,//表格加载状态
      addBox:false,//新建平台窗口状态
      data:[],
      searchValue:'',//搜索框的数据
      searchDataAll:[],//搜索临时存放全部数据
      checkShow:false,
      getbyId:''//选中的修改配置的数据ID
    };
  },
  methods:{
    //关闭验证窗口
    closeWindow(){
      this.checkShow = false;
      this.init()
    },
    //打开接入窗口
    openCheck(id){
      this.checkShow = true;
      this.getbyId = id;
    },
    //更改状态
    setStatus(id,status){
      setPlatformStatus(id).then(res=>{
          return res;
      })
    },
    //搜索
    onSearch(){
      //this.getList();
      let arr = [];
      this.searchDataAll.forEach((item,index)=>{
        if(item.name.includes(this.searchValue)){
            arr.push(item)
        }
      });
      this.searchValue=''
      this.data = arr;
    },
    //添加成功回调
    Ok(){
      this.addBox = false;
      this.getlist();
    },
    //删除平台
     del(id,data){
      del({id:id,type:0}).then(res=>{
        if(res=='SUCCESS'){
            let index = this.data.indexOf(data)
            this.data.splice(index,1);
        }
      })
    },
    //初始化加载方法
    init(){
      this.getlist();
    },
    //获取列表
    getlist(){
      this.loading=true
      getPlatformList().then(res=>{
        this.data = res;
        this.searchDataAll=res
        this.loading=false
      });
    },
    //刷新
    reload(){
      let that = this;
      this.btLoading = true;
      this.getlist();
      setTimeout(()=>{
        that.btLoading = false;
      },500);
    }
  },
  created(){
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.ant-table{
  font-size: 12px;
}
.table-header{
  width: 35%;
}
</style>