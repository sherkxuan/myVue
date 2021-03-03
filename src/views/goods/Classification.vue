<template>
  <!-- 说明 -->
  <a-collapse v-model:activeKey="activeKey">
    <a-collapse-panel key="1" header="商品分类说明">
      <p>商品分类最多为三级分类，前台可根据小程序商城配置显示二级或者三级;前台默认只显示一二级分类;删除分类时注意，如果该分类下有商品则也会把商品删除(不可挽回彻底删除)</p>
    </a-collapse-panel>
  </a-collapse>
  <!-- 表头 -->
  <div class="table-header">
    <a-button type="primary" size="small" @click="addShow = true"><template #icon><PlusCircleOutlined /></template>添加分类</a-button>
    <a-button type="danger" size="small" @click="delAll()"><template #icon><DeleteOutlined /></template>删除选中</a-button>
     <a-input-search
      class="search"
      v-model:value="searchValue"
      placeholder="搜索分类名称"
      enter-button
      @search="onSearch"
    />
    <a-button type="danger" size="small" @click="reload()"><template #icon><RedoOutlined /></template>刷新</a-button>
  </div>
  <!-- 表格 -->
  <div>
    <a-table :loading="loading" size="small" :columns="columns" rowKey="id" :data-source="classListData" bordered :row-selection="rowSelection">
        <template #name="{text}">
            <a>{{ text }}</a>
        </template>
        <template #ClassName="{ record }">
            <a-popover v-if="record.class_desc!=''">
                <template #content>
                    {{record.class_desc}}
                </template>
                <a>{{ record.class_name }}</a>
            </a-popover>
            <span v-else>
                {{ record.class_name }}
            </span>
        </template>
        <template #classIcon="{ record }">
            <span>
                <a-image
                    width="50px"
                    height="50px"
                    :src="record.class_icon?record.class_icon:errorIcon"
                    :fallback="errorIcon"
                    />
            </span>
        </template>
        <template #sort="{ record }">
            <span>
                <a-input-number v-model:value="record.sort" maxlength="4" @blur="numblur(record.sort,record)"/>
            </span>
        </template>
        <template #action="{ record }">
            <span style="display: flex;width:100%;justify-content: space-around;font-size: 10px;">
            <a-button type="primary" shape="circle" @click="edit(record.id)" size="small">改</a-button>
            <a-popconfirm
                cancelText="取消"
                okText="确定"
                title="确定移至回收站吗?"
                @confirm="del(record.id)"
            >
            <a-button type="danger" shape="circle" size="small">删</a-button>
            </a-popconfirm>
            </span>
        </template>
    </a-table>
  </div>
  <!-- 添加分类 -->
   <a-modal title="添加商品分类" :footer="null" :width="800" style="top: 20px;" v-model:visible="addShow"  :maskClosable="false" destroyOnClose>
      <add-class @ok="onSubmit" @cancel="cancelAdd"/>
  </a-modal>
  <!-- 修改商品分类 -->
   <a-modal title="修改商品分类" :footer="null" :width="800" style="top: 20px;" v-model:visible="editShow"  :maskClosable="false" destroyOnClose>
      <edit-class :getData="getData" @edit="onSubmitEdit" @cancel="canceledit"/>
  </a-modal>
</template>

<script>
const columns = [
  {
    title: '名称',
    slots: { customRender: 'ClassName' },
    //width:150,
  },
  {
    title: '缩略图',
    slots: { customRender: 'classIcon' },
    width:150,
    align:'center'
  },
  {
    title: '排序值',
    slots: { customRender: 'sort' },
    width:150,
    dataIndex: 'sort',
    sorter: (a, b) => a.sort - b.sort,
    align:'center'
  },
  {
    title: '操作',
    slots: { customRender: 'action' },
    width:100,
    align:'center',
  },
];
import { PlusCircleOutlined,DeleteOutlined,RedoOutlined } from '@ant-design/icons-vue';
import AddClass from './component/AddClass';
import EditClass from './component/EditClass';
import { message } from 'ant-design-vue';
import { addGoodsClass,getGoodsClassList,editGoodsClassSort,delClass,getGoodsClassById,editGoodsClass } from "@/api/goods";
export default {
    components: {PlusCircleOutlined,DeleteOutlined,RedoOutlined,AddClass,EditClass},
    data(){
        return{
            addShow:false,
            activeKey: ['1'],//默认打开第一条说明
            loading:false,
            columns,
            classListData:[],
            searchValue:'',
            searchDataAll:[],
            ids:'',//批量删除id集合
            editShow:false,//修改窗口状态
            //查询的行记录数据
            getData:[],
            //图片容错占位符
            errorIcon:'data:image/png;base64,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'
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
        //确认修改分类
        onSubmitEdit(e){
            editGoodsClass(e).then(res=>{
                if(res=="SUCCESS"){
                     message.success("修改成功");
                     this.reload();
                }
                this.editShow = false
            });
        },
        //关闭修改窗口
        canceledit(){
            this.editShow = false
        },
        //修改窗口打开
        edit(id){
            this.editShow = true
            getGoodsClassById(id).then(res=>{
                this.getData = res
            });
        },
        //删除商品模型
        del(id){
            delClass({id:id,type:0}).then(res=>{
                if(res=='SUCCESS'){
                   this.reload()
                }
            })
        },
        //批量删除
        delAll(){
            if(!this.ids){
                message.warning('没有选中数据!');
                return;
            }
            delClass({id:this.ids,type:0}).then(res=>{
                if(res=='SUCCESS'){
                    this.ids = '';
                    message.success('已删除选中的数据!');
                    this.reload();
                }
            })
        },
        //搜索
        onSearch(){
            let arr = [];
            this.searchDataAll.forEach((item,index)=>{
                if(item.class_name.includes(this.searchValue)){
                    arr.push(item)
                }
            });
            this.searchValue=''
            this.classListData = arr;
        },
        //更改排序值
        numblur(sort,rowdata){
            if(sort==null)return;
            let res = sort.toString().replace('-','');
            res = parseInt(res.replace('.',''));
            editGoodsClassSort({'id':rowdata.id,'sort':res}).then(res=>{
                this.reload();
            });
        },
        //刷新列表
        reload(){
            this.init();
        },
        //初始方法
        init(){
            this.loading = true;
            getGoodsClassList().then(res=>{
                this.classListData = res
                this.searchDataAll=res
                this.loading = false;
            });
        },
        //关闭添加
        cancelAdd(){
            this.addShow = false
        },
        //添加分类
        onSubmit(e){
            console.log(e);
            addGoodsClass(e).then(res=>{
                if(res=='SUCCESS'){
                    message.success('添加成功')
                    this.reload();
                }
                this.addShow = false
            });
        }
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
  width: 550px;
}
</style>