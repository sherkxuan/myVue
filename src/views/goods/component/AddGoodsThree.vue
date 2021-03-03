<template>
  <a-form
    v-if="!windowBox"
    ref="ruleForm"
    :rules="rules"
    :model="allData"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-item label="规格模型" name="goods_model">
      <a-select
        v-model:value="allData.goods_model"
        show-search
        placeholder="选择规格模型"
        option-filter-prop="label"
        style="width: 200px"
        :filter-option="filterOption"
        @change="handleChange"
      >
        <a-select-option :value="-1">单规格商品</a-select-option>
        <a-select-option v-for="(model,index) in goodsModelData" :key="model.id" :value="index">{{model.model_name}}</a-select-option>
      </a-select>
    </a-form-item>
    <div  v-if="specList.length==0">
    <a-form-item label="销售价" name="price" extra="该商品具体销售价格">
       <a-input-number
        v-model:value="allData.price"
        precision="2"
        :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
        :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
        />
      </a-form-item>
      <a-form-item label="成本价" name="cost_price" extra="仅用于后台商品统计,前台不作显示">
       <a-input-number
        v-model:value="allData.cost_price"
        precision="2"
        :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
        :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
        />
      </a-form-item>
      <a-form-item label="库存" name="repertory" extra="仅用于展示库存,实际库存以商品规格填写为准">
      <a-input-number
        v-model:value="allData.repertory"
        @change="numberCheck1"
        maxlength="8"
      />
    </a-form-item>
    </div>
    <a-table v-if="specList.length>0" :columns="specTable" :pagination="false" :data-source="specList" rowKey="id" size="small">
      <template #spec="{record}">
        <div class="specStyle">
          <a-space>
            <div v-for="(item,index) in record.value" :key="index">
                <a-button  @click="specClick(record,item)" :type="is_click(record,item)">{{item.spec_value}}</a-button>
            </div>
          </a-space>
        </div>
      </template>
    </a-table>
    <table width="100%" class="tableStyle" v-if="specSkuTable.length>0">
        <tr>
          <th style="text-align: center" v-for="th in specSkuTable" :key="th.dataindex">{{th.title}}</th>
        </tr>
        <tr v-if="specList.length>0">
           <td style="text-align: right; padding-right: 10px;" :colspan="specList.length">
             <a-button size="small" type="primary" @click="pl">批量添加</a-button></td>
           <td style="width: 180px;text-align: center"><a-input-number
              v-model:value="allData.price"
              precision="2"
              :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
              /></td>
          <td style="width: 180px;text-align: center"><a-input-number
              v-model:value="allData.cost_price"
              precision="2"
              :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
              /></td>
          <td style="width: 180px;text-align: center"><a-input-number
              v-model:value="allData.repertory"
              @change="numberCheck2"
              maxlength="8"
            /></td>
            <td style="width: 100px;text-align: center">
               <div class="upload-box">
               <a-upload
                  v-model:fileList="fileList"
                  name="files"
                  list-type="picture-card"
                  class="avatar-uploaders"
                  :show-upload-list="false"
                  :action="uploadUrl"
                  :data="{ file_type: 'image' }"
                  :before-upload="beforeUpload"
                  @change="handleChangeImg($event,index,0)"
                >
                  <div v-if="allData.sku_img" class="uploadShowImg">
                    <img :src="allData.sku_img" alt="avatar" />
                    <div>更换</div>
                  </div>
                  <div v-else>
                    <!-- todo -->
                    <loading-outlined v-if="loading" />
                    <plus-outlined v-else />
                    <div class="ant-upload-text">上传</div>
                  </div>
                  <div v-if="allData.sku_img!=''" style="font-size:10px;color:red;" @click.stop="delImg(index,0)">删除</div>
                </a-upload>
                </div>
            </td>
        </tr>
        <tr v-for="(tr,index) in skuData" :key="index">
          <td style="text-align: center" v-for="(td,inde) in tr" :key="inde">{{td}}</td>
          <td style="width: 180px;text-align: center"><a-input-number
              v-model:value="formData[index].price"
              precision="2"
              :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
              /></td>
          <td style="width: 180px;text-align: center"><a-input-number
              v-model:value="formData[index].cost_price"
              precision="2"
              :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
              /></td>
          <td style="width: 180px;text-align: center"><a-input-number
              v-model:value="formData[index].repertory"
              @change="numberCheck($event,index)"
              maxlength="8"
            /></td>
            <td style="width: 100px;text-align: center">
              <div class="upload-box">
               <a-upload
                  v-model:fileList="fileList"
                  name="files"
                  list-type="picture-card"
                  class="avatar-uploaders"
                  :show-upload-list="false"
                  :action="uploadUrl"
                  :data="{ file_type: 'image' }"
                  :before-upload="beforeUpload"
                  @change="handleChangeImg($event,index,1)"
                >
                  <div v-if="formData[index].sku_img" class="uploadShowImg">
                    <img :src="formData[index].sku_img" alt="avatar" />
                    <div>更换</div>
                  </div>
                  <div v-else>
                    <!-- todo -->
                    <loading-outlined v-if="loading" />
                    <plus-outlined v-else />
                    <div class="ant-upload-text">上传</div>
                  </div>
                  <div v-if="formData[index].sku_img!=''" style="font-size:10px;color:red;" @click.stop="delImg(index,1)">删除</div>
                </a-upload>
              </div>
            </td>
        </tr>
    </table>
  </a-form>
  <div v-else class="boxloading">
    <a-spin size="large" />
  </div>
  
</template>

<script>
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
const specTable = [
  {
    title: '规格名称',
    dataIndex: 'spec_name',
    width:120
  },
  {
    title: '可选规格值(请先选则需要的规格,然后再填写价格)',
    slots: { customRender: 'spec' },
  },
];
import { getGoodsModelList } from "@/api/goods";
import { message } from 'ant-design-vue';
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  props: {
    fatherData:{
        type: Array,
        default: []
    }
  },
  components: {LoadingOutlined,PlusOutlined},
  data() {
    //验证价格不能为0或负数
    let checkPrice =  async (rule, value, callback) => {
      if(value<=0){
        return Promise.reject('商品价格必须大于0元');
      }
    };
    return {
      windowBox:false,
      loading:false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      goodsModelData:[],//后台请求的商品模型列表
      spec:[],//商品规格id数组
      specList:[],//商品所有规格列表
      specTable,
      arrs:[],//sku计算名称数组容器
      specSkuTable:[],//sku表格头
      skuArr : [],
      skuData:[],
      fileList: [], //上传图片列表
      imageUrl: "", //成功图片的路径
      uploadUrl: this.$PathUrl + "/v1/upload", //上传路径
      formData:[],//填写的规格数组
      allData:{
        goods_model:-1,//商品模型名称
        price:'',
        cost_price:'',
        repertory:'',
        sku_img:'',
      },
      rules:{
        price: [
          { type:'number',required: true, message: '商品价格不能为空', trigger: 'blur' },
          { validator: checkPrice, trigger: 'blur' }
        ],
        cost_price: [
          { type:'number',required: true, message: '划线价不能为空', trigger: 'blur' },
          { validator: checkPrice, trigger: 'blur' }
        ],
        repertory: [
          { type:'number',required: true, message: '库存不能为空', trigger: 'blur' },
        ],
      },
    };
  },
  created(){
    this.init();
  },
  methods:{
    //父组件点击上一步
    onBack(){
      if(this.allData.goods_model==-1){
        this.$emit('formData',[this.allData,this.allData.goods_model])
      }else{
        this.$emit('formData',[this.formData,this.allData.goods_model])
      }
      
    },
    //请求数据
    async getData(){
      return  await getGoodsModelList();
    },
    //初始方法
    async init(){
      this.windowBox = true;
      this.goodsModelData = await this.getData();
      //处理表单初始值(父传子or子传父)（单属性商品）
      if(this.fatherData.length != 0 && this.fatherData[1]==-1){
          this.allData = this.fatherData[0]
      }else if(this.fatherData.length != 0 && this.fatherData[1]!=-1){
         this.goodsModelData = await this.getData();
         this.allData.goods_model = this.fatherData[1]
         this.formData = this.fatherData[0];
         this.arrs = await this.backShow();
         this.skuData  = this.doExchange(this.arrs)
         this.specList = this.goodsModelData[this.fatherData[1]].goodsModelSpec;
         this.tableHead();
         this.formData = this.fatherData[0];
      }
      this.windowBox = false;
    },
    //处理回显数据
    backShow(){
      let arr = []
      this.formData.forEach((item,index)=>{
        arr[index]=item.sku_value;
      })
      let arr2 = []
      arr.forEach(a=>{
        arr2.push(a.split(';'));
      })
      let arr3 = []
      arr2.forEach((a2,ak2)=>{
        a2.forEach((b,bk)=>{
          let dd = []
          if(arr3[bk]!=null){
            dd = arr3[bk]
            if(dd.indexOf(b)==-1){
              dd.push(b)
              arr3[bk] = dd
            }
          }else{
            dd.push(b)
            arr3[bk] = dd
          }
        })
      })
      
      return arr3
    },
    //表单验证
      async onSubmit() {
        if(this.allData.goods_model==-1){
            return await this.$refs.ruleForm
              .validate()
              .then(() => {
                  this.$emit('formData',[this.allData,this.allData.goods_model])
                  return true;
              })
              .catch(error => {
                message.warning('请检查表单填写是否正确!')
                return false;
              });
        }
        try {
           this.formData.forEach(item=>{
              if(item.price==null){
                  throw new Error("列表中有空的销售价!");
              }
              if(item.cost_price==null){
                throw new Error("列表中有空的成本价!");
              }
              if(item.repertory==null){
                throw new Error("列表中有空的库存!");
              }
              if(item.price<=0){
                  throw new Error("列表中销售价为0或负数!");
              }
              if(item.cost_price<=0){
                  throw new Error("列表中成本价为0或负数!");
              }
            })
        } catch (e) {
          message.warning(e.message)
          return false;
        }
        this.$emit('formData',[this.formData,this.allData.goods_model])
        return true;
    },
    //批量添加
    pl(){
      this.formData.forEach(item=>{
        item.price = this.allData.price?this.allData.price:item.price;
        item.cost_price = this.allData.cost_price?this.allData.cost_price:item.cost_price;
        item.repertory = this.allData.repertory?this.allData.repertory:item.repertory;
        item.sku_img = this.allData.sku_img?this.allData.sku_img:item.sku_img;
      })
      this.allData.price = '';
      this.allData.cost_price = '';
      this.allData.repertory = '';
      this.allData.sku_img = '';
    },
    //判断是否已经点击按钮
    is_click(rowData,data){
      let index = this.specList.indexOf(rowData);
        let cz = this.arrs[index].indexOf(data.spec_value);
        if(cz!=-1){
          return "primary";
        }else{
          return;
        }
    },
    //sku计算
    specClick(rowData,data){
        let index = this.specList.indexOf(rowData);
        let cz = this.arrs[index].indexOf(data.spec_value);
        if(cz!=-1){
          //如果数组长度为1，则禁止删除
          if(this.arrs[index].length!=1){
              this.arrs[index].splice(cz,1)
          }else{
            message.warning('至少存在一个规格值')
          }
        }else{
          this.arrs[index].push(data.spec_value);
        }
        this.skuData  = this.doExchange(this.arrs)
    },
    //sku计算函数
    doExchange(arr) {
      // 当数组大于等于2个的时候
      let len = arr.length;
      if(len >= 2) {
        // 第一个数组的长度
        var len1 = arr[0].length;
        // 第二个数组的长度
        var len2 = arr[1].length;
        // 2个数组产生的组合数
        var lenBoth = len1 * len2;
        //  申明一个新数组,做数据暂存
        var items = new Array(lenBoth);
        // 申明新数组的索引
        var index = 0;
        // 2层嵌套循环,将组合放到新数组中
        for(var i = 0; i < len1; i++) {
          for(var j = 0; j < len2; j++) {
            items[index] = arr[0][i] + ";" + arr[1][j];
            index++;
          }
        }
        // 将新组合的数组并到原数组中
        var newArr = new Array(len - 1);
        for(var i = 2; i < arr.length; i++) {
          newArr[i - 1] = arr[i];
        }
        newArr[0] = items;
        // 执行回调
        return this.doExchange(newArr);
      } else {
        let tmpArr = [];
        //console.log(arr[0])
        arr[0].forEach(ite=>{
            tmpArr.push(ite.split(';'));
        })
        this.formData = [];
        for(let i = 0;arr[0].length>i;i++){
            this.formData.push({
              price:'',
              cost_price:'',
              repertory:0,
              sku_img:'',
              sku_value:arr[0][i]
            });
        }

        //console.log(this.formData)
        return tmpArr;
      }
    },
    //选择模型方法
    handleChange(value){
      this.specSkuTable = [];
      this.skuData = [];
      this.arrs = [];
      this.allData.price = '';
      this.allData.cost_price = '';
      this.allData.repertory = '';
      this.allData.sku_img = '';
      //选中商品的所有规格
      this.specList = value==-1?[]:this.goodsModelData[value].goodsModelSpec;
      if(value==-1){
        return;
      }
      this.specList.forEach((ide,k) =>{
          this.arrs[k]=[ide.value[0]['spec_value']]
          this.specSkuTable.push({
            title:this.specList[k].spec_name,
            dataIndex: this.specList[k].id,
          });
      });
      let arr = [
        {
          title:"购买价",
          dataIndex: Date.now(),
          width:150
        },
        {
          title:"成本价",
          dataIndex: Date.now(),
          width:150
        },
        {
          title:"库存",
          dataIndex: Date.now(),
          width:150
        },
        {
          title:"SKU图片",
          dataIndex: Date.now(),
          width:120
        }
      ];
      this.specSkuTable = this.specSkuTable.concat(arr);
      this.skuData = this.doExchange(this.arrs);
      //console.log(this.skuData)
    },
    //渲染表格头
    tableHead(){
      this.specSkuTable = [];
       this.specList.forEach((ide,k) =>{
          //this.arrs[k]=[ide.value[0]['spec_value']]
          this.specSkuTable.push({
            title:this.specList[k].spec_name,
            dataIndex: this.specList[k].id,
          });
      });
      let arr = [
        {
          title:"购买价",
          dataIndex: Date.now(),
          width:150
        },
        {
          title:"成本价",
          dataIndex: Date.now(),
          width:150
        },
        {
          title:"库存",
          dataIndex: Date.now(),
          width:150
        },
        {
          title:"SKU图片",
          dataIndex: Date.now(),
          width:120
        }
      ];
      this.specSkuTable = this.specSkuTable.concat(arr);
    },
    //选择分类搜索时
    filterOption(input, option) {
      return (
        option.children["0"].children
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    //删除图片
    delImg(index,type){
      if(type){
        this.formData[index].sku_img = '';
      }else{
        this.allData.sku_img = '';
      }
      
    },
    //选择图片事件
    handleChangeImg(info,index,type) {
      if (info.file.status === "uploading") {
        this.loading = true;
        return;
      }
      if (info.file.status === "done") {
        // Get this url from response in real world.
        if (info.file.response.code != 200) {
          this.loading = false;
          message.error(info.file.response.data);
          return;
        }
        if(type){
          this.formData[index].sku_img = info.file.response.data.url;
        }else{
          this.allData.sku_img = info.file.response.data.url;
        }
        
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.imageUrl = imageUrl;
          this.loading = false;
        });
      }
      if (info.file.status === "error") {
        this.loading = false;
        message.error("上传文件出错");
      }
    },
    //文件上传钩子
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("你只能上传JPG|JPEG|PNG格式的图片");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("图片大小不能超过2MB");
      }
      return isJpgOrPng && isLt2M;
    },
    numberCheck(e,index) {
        if (e == null) return;
        let res = e.toString().replace("-", "");
        res = res.replace(".", "");
        this.formData[index].repertory = parseInt(res);
    },
    numberCheck2(e) {
        if (e == null) return;
        let res = e.toString().replace("-", "");
        res = res.replace(".", "");
        this.allData.repertory = parseInt(res);
    },
  }
};
</script>

<style lang="scss">
.boxloading{
  height: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tableStyle{
  border-collapse:collapse;/* 取消表格边框 */
  tr{
    border-bottom:1px solid #dedede;/* 表格横线 */
  }
  tr:not(:first-child):hover{
    background-color: rgb(238, 245, 255);
  }
  tr:first-child{
    background-color: rgb(247, 247, 247);
    height: 42px;
  }
  th{
    font-weight: unset;
  }
}
.specStyle{
  display: flex;
  a-button{
    margin-left: 0.5%;
    margin-right: 0.5%;
  }
}
.upload-box{
  >span{
    width: unset;
    margin-top: 1%;
  }
  .ant-upload.ant-upload-select-picture-card{
    margin: unset;
  }
}
.avatar-uploaders > .ant-upload {
  width: 64px;
  height: 64px;
}
.avatar-uploaders {
  .uploadShowImg {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 64px;
      height: 64px;
    }
    div {
      position: absolute;
      width: 64px;
      height: 64px;
      line-height: 64px;
      color: rgba(0, 0, 0, 0);
    }
    div:hover {
      background: rgba(0, 0, 0, 0.295);
      color: rgb(255, 0, 0);
    }
  }
}
</style>