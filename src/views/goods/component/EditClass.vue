<template>
  <a-form v-if="getData!=''" ref="ruleForm" :rules="rules" :model="getData" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="分类名称" name="class_name">
          <a-input v-model:value="getData.class_name" maxlength="15" placeholder="请输入分类名称"/>
        </a-form-item>
        <a-form-item label="上级分类" name="checkId">
           <a-input  class="selectAdmin" :value="getClassLevel(getData.id,getData.two_id,getData.three_id)" disabled>
            <template #addonAfter v-if="getData.two_id!=0">
              <div @click="checkClass(getData.id,getData.two_id,getData.three_id)">选择分类</div>
            </template>
          </a-input>
          <span class="ts" v-if="getData.two_id==0"><span style="color:red">*</span>顶级分类不能修改上级</span>
          <span class="ts" v-else-if="getData.three_id==0"><span style="color:red">*</span>当前二级分类可以修改上级分类</span>
          <span class="ts" v-else-if="getData.three_id!=0"><span style="color:red">*</span>当前三级分类可以修改上级分类</span>
        </a-form-item>
        <a-form-item label="排序" name="sort">
          <a-input-number v-model:value="getData.sort" @change="numberCheck" maxlength="4"/>
        </a-form-item>
        <a-form-item label="描述" name="class_desc">
          <a-textarea v-model:value="getData.class_desc" showCount maxlength="200" placeholder="请输入分类描述"/>
        </a-form-item>
        <a-form-item label="分类图片" name="class_icon">
          <a-upload 
            v-model:fileList="fileList" 
            name="files" 
            list-type="picture-card" 
            class="avatar-uploader" 
            :show-upload-list="false"
            :action="uploadUrl"
            :data="{file_type:'image'}"
            :before-upload="beforeUpload"
            @change="handleChange" >
            <div v-if="imageUrl" class="uploadShowImg">
              <img :src="imageUrl" alt="avatar" />
              <div>更换</div>
              <!-- <div>更换</div> -->
            </div>
            <div v-else>
              <!-- todo -->
              <loading-outlined v-if="loading" />
              <plus-outlined v-else />
              <div class="ant-upload-text">Upload</div>
            </div><div v-if="imageUrl!='' && getData.two_id==0" style="font-size:10px;color:red" @click.stop="delImg">删除</div>
            </a-upload>
        </a-form-item>
 </a-form>
 <a-modal title="选择商品分类" :footer="null" :width="500"  v-model:visible="ClassShow" destroyOnClose>
     <a-form ref="ruleForm" :rules="rules" :model="form2" :label-col="labelCol" :wrapper-col="wrapperCol">
         <a-form-item label="一级分类" v-if="getData.three_id==0">
          <a-select
                v-model:value="checkId_name"
                show-search
                placeholder="搜索或选择"
                style="width: 200px"
                :filter-option="filterOption"
                @change="selectHandleChange"
            >
                <a-select-option v-for="ite in oneSelectData" :key="ite.id" :value="ite.id">{{ite.class_name}}</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item label="二级分类"  v-if="getData.three_id!=0">
          <a-select
                v-model:value="checkId_name"
                show-search
                placeholder="搜索或选择"
                style="width: 200px"
                :filter-option="filterOption2"
                @change="selectHandleChange2"
            >
                <a-select-option v-for="ite in twoSelectData" :key="ite.id" :value="ite.id">{{ite.class_name}}</a-select-option>
            </a-select>
        </a-form-item>
     </a-form>
     <div class="footer">
        <div>
            <a-button type="dashed" @click="no">取消</a-button>
            <a-button type="primary"  @click="yes">确认</a-button>
        </div>
    </div>
  </a-modal>
 <div class="footer">
    <div>
      <a-button type="dashed" @click="cancel">取消</a-button>
      <a-button type="primary"  @click="ok" :loading="loading">确认</a-button>
    </div>
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { getGoodsClassWhere,getGoodsClassById } from "@/api/goods";
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
    components: {
    LoadingOutlined,
    PlusOutlined,
  },
    props:{
      getData:{
          type: Object,
          default: []
      }
    },
    data(){
      //验证是否是顶级分类，若不是，则必须上传图片
      let checkIcon =  async (rule, value, callback) => {
        if(value=='' && this.getData.two_id!=0){
            return Promise.reject('非顶级分类需要上传图片');
        }
      };
        return{
            ClassShow:false,//选择商品分类窗口状态
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            fileList: [],//上传图片列表
            imageUrl: '',//成功图片的路径
            loading: false,
            uploadUrl:this.$PathUrl+'/v1/upload',//上传路径
            checkId_name:'',//二级分类状态
            oneSelectData:[],
            twoSelectData:[],
            tmpName:'',//临时变量,存放上级名称
            tmpTwoId:'',//临时二级id
            tmpOneId:'',//临时一级id
            form:[],
            rules:{
                class_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    {whitespace:true, message: '名称不能为空', trigger: 'blur' }
                ],
                sort: [
                    {type:'number',required: true, message: '排序不能为空', trigger: 'blur' },
                ],
                class_icon: [
                    //{ required: true, message: '请上传分类图标', trigger: 'blur' },
                    { validator: checkIcon, trigger: 'blur' }
                ],
            }
        }
    },
    updated(){
        this.imageUrl = this.getData.class_icon
        this.tmpTwoId = this.getData.three_id;
        this.tmpOneId = this.getData.two_id;
    },
    methods:{
      //顶级分类删除图片
      delImg(){
        this.getData.class_icon = '';
        this.imageUrl = '';
      },
      //修改上级分类
      checkClass(id,two_id,three_id){
        if(three_id!=0){
          getGoodsClassWhere(2).then(res=>{
            this.twoSelectData=res;
          })
        }else{
           getGoodsClassWhere(1).then(res=>{
            this.oneSelectData=res;
          })
        }
        this.ClassShow = true
      },
      //查询分类的等级
      getClassLevel(id,two_id,three_id){
        if(two_id==0)return '顶级分类';
        //return;
        if(three_id!=0){
          getGoodsClassById(three_id).then(res=>{
              this.tmpName =  res.class_name;
          })
        }else{
          getGoodsClassById(two_id).then(res=>{
            this.tmpName =  res.class_name;
          })
        }
        this.checkId_name = this.tmpName;
        return this.tmpName;
      },
        //确认分类选择
        yes(){
            this.getData.three_id = this.tmpTwoId;
            this.getData.two_id = this.tmpOneId;
            this.ClassShow = false;
        },
        //关闭选择分类框
        no(){
            this.ClassShow = false;
        },
        //选择分类选中时
        selectHandleChange2(value){
            this.tmpTwoId = value
            this.twoSelectData.forEach(res=>{
                if(res.id == value){
                    this.checkId_name=res.class_name
                }
            })
        },
        //选择分类搜索时
        filterOption2(input, option){
            return option.children['0'].children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },
        //选择分类选中时
        selectHandleChange(value){
            this.oneSelectData.forEach(res=>{
                if(res.id == value){
                    this.checkId_name=res.class_name
                }
            })
            this.tmpOneId = value;
        },
        //选择分类搜索时
        filterOption(input, option){
            return option.children['0'].children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },
        //点击确认
        ok(){
            //this.loading = true;
            this.$refs.ruleForm
                .validate()
                .then(() => {
                  this.$emit('edit',this.getData);
                  //console.log(that.$emit('edit'));
                })
                .catch(error => {
                this.loading = false;
                message.warning('请检查表单填写是否正确!')
            });
        },
         //点击取消
        cancel(){
            this.$emit('cancel')
        },
        //选择图片事件
        handleChange(info) {
            if (info.file.status === 'uploading') {
                this.loading = true;
                return;
            }
            if (info.file.status === 'done') {
                // Get this url from response in real world.
                if(info.file.response.code!=200){
                    this.loading = false;
                    message.error(info.file.response.data);
                    return;
                }
                this.getData.class_icon = info.file.response.data.url;
                getBase64(info.file.originFileObj, imageUrl => {
                    this.imageUrl = imageUrl;
                    this.loading = false;
                });
            }
            if (info.file.status === 'error') {
                this.loading = false;
                message.error('上传文件出错');
            }
        },
        //文件上传钩子
        beforeUpload(file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('你只能上传JPG|JPEG|PNG格式的图片');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('图片大小不能超过2MB');
            }
            return isJpgOrPng && isLt2M;
        },
        //禁止数字输入框输入负号和点
        numberCheck(e){
            if(e==null)return;
            let res = e.toString().replace('-','');
            res = res.replace('.','');
            this.form.sort = parseInt(res);
        }
    }
}
</script>

<style lang="scss">
.footer{
  >div{
    width: 200px;
    margin:0px auto;
    display: flex;
    justify-content: space-around;
  }
}
.ts{
  font-size: 8px;
  color: rgb(175, 175, 175);
  padding: 2%;
}
.selectAdmin{
  input{
    color: rgb(31, 31, 31) !important;
  }
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.avatar-uploader {
  .uploadShowImg{
    display: flex;
    align-items: center;
    justify-content: center;
    img{
      width: 128px;
      height: 128px; 
    }
    div{
      position: absolute;
      width: 128px;
      height: 128px;
      line-height: 128px;
      color: rgba(0, 0, 0, 0);
    }
    div:hover{
      background: rgba(0, 0, 0, 0.295);
      color: rgb(255, 0, 0);
    }
  }
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>