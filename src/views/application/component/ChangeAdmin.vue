<template>
  <div class="table-header">
     <a-input-search
      class="search"
      v-model:value="searchValue"
      placeholder="请输入管理员姓名"
      enter-button
      @search="onSearch"
    />
    <a-button type="danger" size="small" @click="reload()"><template #icon><RedoOutlined /></template>显示全部</a-button>
  </div>
  <a-table :pagination="{defaultPageSize:6}" :loading="loading" size="small" :columns="columns" rowKey="id" :data-source="data" :row-selection="rowSelection">
      <template #name="{ text }">
        <a>{{ text }}</a>
      </template>
      <template #action="{ record }">
        <span style="display: flex;width: 100%;justify-content: space-around;font-size: 10px;">
          <a-button type="dashed"  @click="clickAdmin(record.id,record.real_name)" size="small">选择</a-button>
        </span>
      </template>
    </a-table>
</template>
<script>
import { getAdminList} from "@/api/account";
const columns = [
  {
    title: '姓名',
    dataIndex: 'real_name',
    width: 80,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    align:'center',
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
  name:"ChangeAdmin",
  components: {},
  data(){
    return{
      columns,
      data:[],
      searchValue:'',
      loading:false,
    }
  },
  methods:{
    //选择管理员
    clickAdmin(id,name){
      //console.log(id,name)
      this.$emit('clickAdmin', {admin_id:id,real_name:name})
    },
    //刷新
    reload(){
      this.init();
    },
    //初始方法
    init(){
      this.loading=true;
      getAdminList().then(res=>{
        this.data = res;
        this.loading=false;
      });
    },
    //搜索
    onSearch(){
      let arr = [];
      this.data.forEach((item,index)=>{
        if(item.real_name.includes(this.searchValue)){
            arr.push(item)
        }
      });
      //this.searchValue=''
      this.data = arr;
    },
  },
  created(){
    this.init();
  }
}
</script>
<style lang="scss" scoped>
.ant-table{
  font-size: 12px;
}
.table-header{
  width: 48%;
}
</style>