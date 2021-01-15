<template>
  <a-collapse>
    <a-collapse-panel key="1" header="接口管理模块说明">
      <p>接口说明及其注意事项</p>
    </a-collapse-panel>
  </a-collapse>
  <div class="table-header">
    <a-button type="primary">添加接口</a-button>
    <a-button type="danger">删除选中</a-button>
     <a-input-search
      class="search"
      v-model:value="value"
      placeholder="搜索接口名称"
      enter-button
      @search="onSearch"
    />
    <a-button type="danger">重置搜索</a-button>
  </div>
  <div>
    <a-table :columns="columns" rowKey="id" :data-source="data" bordered :row-selection="rowSelection">
      <template #name="{text}">
        <a>{{ text }}</a>
      </template>
      <template #status="{ record }">
          <span>
            <a-switch checked-children="开" un-checked-children="关" v-model:checked="record.status" />
          </span>
      </template>
       <template #action="{ record }">
        <span style="display: flex;width:100%;justify-content: space-around;font-size: 10px;">
          <a-button type="dashed" shape="circle" size="small">查</a-button>
          <a-button type="primary" shape="circle" size="small">改</a-button>
          <a-button type="danger" shape="circle" size="small" @click="del(record.id)">删</a-button>
        </span>
    </template>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: '接口名称',
    dataIndex: 'name',
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
    dataIndex: 'call_num',
    sorter: (a, b) => a.name.length - b.name.length,
    width:120,
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

const data = [
  {
    id: '10',
    name: '文件上传',
    api_route: 'upload',
    api_map: 'Upload/upload02',
    call_num: 1883,
    method:'post|get',
    status:1
  },
  {
    id: '11',
    name: '管理员登录',
    api_route: 'adminLogin',
    api_map: 'Admin/adminLogin',
    call_num: 1882,
    method:'post',
    status:0
  }
];

export default {
  data() {
    return {
      data,
      columns,
    };
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys) => {
          //选择的行id
          console.log(`selectedRowKeys: ${selectedRowKeys}`);
        }
      };
    },
  },
  methods:{
    del(id){
      console.log(id)
    }
  }
};
</script>

<style lang="scss" scoped>
.table-header{
  display: flex;
  margin-top: 2%;
  margin-bottom: 2%;
  width: 38%;
  justify-content: space-around;
  .search{
    width: auto;
  }
}
</style>