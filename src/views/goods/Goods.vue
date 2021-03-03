<template>
  <!-- 说明 -->
  <a-collapse v-model:activeKey="activeKey">
    <a-collapse-panel key="1" header="商品列表说明">
      <p>可以在此添加商品，查看商品，修改商品；添加商品前，请确认商品模型已添加</p>
    </a-collapse-panel>
  </a-collapse>
  <!-- 表头 -->
  <div class="table-header">
    <a-button type="primary" size="small" @click="addShow = true"><template #icon><PlusCircleOutlined /></template>添加商品</a-button>
     <a-input-search
      class="search"
      v-model:value="searchData"
      placeholder="搜索商品:名称or标签"
      enter-button
      @search="onSearch"
    />
    <a-button type="danger" size="small" @click="reload()"><template #icon><RedoOutlined /></template>{{is_search?'重置':'刷新'}}</a-button>
  </div>
  <!-- 表格 -->
  <a-table :loading="loading" size="small" :columns="columns" :data-source="goodsList" rowKey="id">
    <template #action="{ record }">
      <a-space>
        <a @click="setStatus(record)">{{record.status==1?'下架':'上架'}}</a>
        <a @click="editGoods(record.id)">修改商品</a>
        <a @click="editSku(record.id)">修改库存</a>
        <a-popconfirm
                cancelText="取消"
                okText="确定"
                title="确定移至回收站吗?"
                @confirm="delGoods(record)"
            >
            <a>删除商品</a>
        </a-popconfirm>
      </a-space>
    </template>
     <template #goods_name ="{ record }">
      <a-popover>
          <template #content>
              {{record.promotion}}
          </template>
           <a>{{ record.goods_name }}</a>
      </a-popover>
    </template>
    <template #goods_icon ="{ record }">
      <span>
        <a-image
          width="100px"
          height="100px"
          :fallback="errorIcon"
          :src="record.goods_icon"
        />
      </span>
    </template>
    <template #status ="{ record }">
      <span>
        {{record.status==1?'销售中':'仓库中'}}
      </span>
    </template>
    <template #expandedRowRender="{ record }">
      <div class="goods-box">

        <div v-for="skuItem in record.goodsSku" :key="skuItem.id">
          <div><a-image width="100px" height="100px" :fallback="errorIcon" :src="skuItem.sku_img"/></div>
          <div>
            <div>{{skuItem.sku_values}}</div>
            <div>价格:￥{{skuItem.price}}</div>
            <div>库存:{{skuItem.repertory}}</div>
            <div>销量:{{skuItem.sales}}</div>
          </div>
        </div>

      </div>
    </template>
  </a-table>
  <!-- 修改库存 -->
  <a-modal title="修改库存" ok-text="修改" @ok="editSkuClick" cancel-text="取消" :width="1000" style="top: 20px;" v-model:visible="editSkuShow" :maskClosable="false" destroyOnClose>
      <add-goods-three :fatherData ="formData[2]" ref="sku" @formData="sonData"/>
     <!--  <add-goods-three ref="three" :fatherData ="formData[2]" @formData="sonData($event,2)" />  -->
  </a-modal>
  <!-- 修改商品 -->
  <a-modal title="修改商品" :footer="null" :width="1000" style="top: 20px;" v-model:visible="editShow" :maskClosable="false" destroyOnClose>
      <edit-goods :formData="formData" @subData="editOver"  @onClick="onClick"/>
  </a-modal>
  <!-- 添加商品 -->
  <a-modal title="添加商品" :footer="null" :width="1000" style="top: 20px;" v-model:visible="addShow" :maskClosable="false" destroyOnClose>
      <add-goods  @onClick="onClick"/>
  </a-modal>
</template>

<script>
import AddGoods from "../goods/component/AddGoods";
import EditGoods from "../goods/component/EditGoods";
import AddGoodsThree from "../goods/component/AddGoodsThree";
import { getGoodsList,setGoodsStatus,getGoodsByIdJson,editGoods,editGoodsSku,delGoods,searchGoods } from "@/api/goods";
import { PlusCircleOutlined,RedoOutlined } from '@ant-design/icons-vue';
import { message } from "ant-design-vue";
const columns = [
  {
    title: '商品名称',
    slots: {customRender: 'goods_name'},
    align:'center',
  },
  {
    title: '商品图片',
    slots: {customRender: 'goods_icon'},
    align:'center',
  },
  {
    title: '商品价格',
    dataIndex: 'goods_price',
    align:'center',
  },
  {
    title: '总库存',
    dataIndex: 'inventory',
    align:'center',
  },
  {
    title: '商品状态',
    slots: {customRender: 'status'},
    align:'center',
  },
  {
    title: '销量',
    dataIndex: 'goods_sold',
    align:'center',
  },
  {
    title: '添加时间',
    dataIndex: 'create_time',
    align:'center',
  },
  {
    title: '操作',
    slots: { customRender: 'action'},
    align:'center',
  },
];
export default {
  components:{PlusCircleOutlined,RedoOutlined,AddGoods,EditGoods,AddGoodsThree},
  data(){
    return{
      loading:false,//表格加载状态
      activeKey: ['1'],//默认打开第一条说明
      addShow:false,
      editShow:false,
      editSkuShow:false,
      columns,
      goodsList:[],//商品列表数据
      formData:[],//商品详情json数据
      tmpEditId:'',//被编辑的临时id
      tmpSkuData:[],//修改后的sku单行数据
      searchData : '',//搜索的数据
      is_search:false,
      //图片容错占位符
      errorIcon:'data:image/png;base64,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'
    }
  },
  methods:{
    onSearch(){
      let value = this.searchData.trim()
      if(!value){
        return;
      }
      searchGoods(value).then(res=>{
          this.is_search = true;
          this.goodsList=res
      });
    },
    //删除商品
    delGoods(data){
      if(data.status==1){
        message.warning('该商品正在销售,请下架后再删除');
        return;
      }
      let index = this.goodsList.indexOf(data);
      delGoods({id:data.id,type:0}).then(res=>{
        if(res=="SUCCESS"){
          this.goodsList.splice(index,1);
        }
      });
    },
    sonData(e){
      this.tmpSkuData = e
    },
    //确认修改库存
    async editSkuClick(){
      let status = await this.$refs.sku.onSubmit();
      if(status){
        editGoodsSku(this.tmpEditId,this.tmpSkuData).then(res=>{
          if(res=='SUCCESS'){
            message.success('修改成功');
            this.reload();
          }else{
            message.success('修改失败');
          }
          this.tmpEditId = '';
          this.formData = [];
          this.editSkuShow=false;
        });
      }
    },
    //修改库存页面打开
    editSku(id){
       getGoodsByIdJson(id).then(res=>{
        this.formData = res
        this.tmpEditId = id
        this.editSkuShow=true;
      });
      
    },
    //处理修改商品
    editOver(data){
      editGoods(this.tmpEditId,data).then(res=>{
        if(res=="SUCCESS"){
          message.success('修改成功');
        }else{
           message.success('修改失败');
        }
        this.tmpEditId = '';
        this.formData = [];
        this.editShow = false;
      });
    },
    //修改商品
    editGoods(id){
      getGoodsByIdJson(id).then(res=>{
        this.formData = res
        this.tmpEditId = id
        this.editShow = true;
      });
    },
    //上下架商品
    setStatus(data){
      let index =  this.goodsList.indexOf(data);
      setGoodsStatus(data.id).then(res=>{
        if(res=='SUCCESS'){
          if(this.goodsList[index].status == 0){
              message.success('商品已上架')
              this.goodsList[index].status=1
          }else{
              message.success('商品已下架')
              this.goodsList[index].status = 0;
          }
        }else{
          message.error('更改失败');
        }
      });
    },
    //监听添加商品事件
    onClick(e){
      if(e=='SUCCESS'){
        message.success('添加成功')
        this.reload();
        this.addShow = false;
      }else{
        message.error('添加失败')
      }
    },
    //刷新
    reload(){
      this.is_search = false;
      this.searchData = '';
      this.init()
    },
    //初始方法
    init(){
        this.loading = true;
        getGoodsList().then(res=>{
          this.goodsList = res
          this.loading = false;
        });
    }
  },
  created(){
    this.init();
  }
}
</script>

<style lang="scss" scoped>
.table-header{
  width: 400px;
}
.goods-box{
  display: flex;
  flex-wrap: wrap;
  //align-items: center;
  >div{
    display: flex;
    width: 260px;
    background-color: rgb(255, 255, 255);
    margin: 1%;
    padding: 1%;
    border: 1px solid rgb(231, 231, 231);
    >div:first-child{
      display: flex;
      align-items: center;
    }
    >div:last-child{
      padding-left: 2%;
    }
  }
}
</style>