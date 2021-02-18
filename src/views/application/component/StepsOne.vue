<template>
  <a-form ref="ruleForm" :rules="rules" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="平台名称" name="name">
          <a-input v-model:value="form.name" size="large" maxlength="15" placeholder="请输入平台名称,便于识别"/>
        </a-form-item>
        <a-form-item label="平台说明" name="describe">
          <a-textarea v-model:value="form.describe" maxlength="150"  placeholder="请简单描述平台的作用"/>
        </a-form-item>
        <a-form-item label="平台管理员" name="admin_id">
          <a-input class="selectAdmin" size="large" v-model:value="form.admin_name" disabled  placeholder="请点击右边按钮选择平台的管理员">
            <template #addonAfter>
              <div @click="addBox = true">选择管理员</div>
            </template>
          </a-input>
          <span class="ts"><span style="color:red">*</span>列表没有管理员?<a style="margin-left: 2%;">点击创建</a></span>
        </a-form-item>
        <a-form-item label="平台类型" name="type">
            <a-select placeholder="123" size="large" v-model:value="form.type" @focus="focus" ref="select" >
              <a-select-option value="1">
                微信公众号
              </a-select-option>
              <a-select-option value="2">
                微信小程序
              </a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item label="原始ID" name="original_id">
          <a-input v-model:value="form.original_id" size="large" maxlength="30" placeholder="请输入原始ID"/>
        </a-form-item>
        <a-form-item label="AppId" name="app_id">
          <a-input v-model:value="form.app_id" size="large" maxlength="18" placeholder="请输入APPID"/>
        </a-form-item>
        <a-form-item label="AppSecret" name="app_secret">
          <a-input v-model:value="form.app_secret" size="large" maxlength="32" placeholder="请输入AppSecret"/>
        </a-form-item>
        <a-form-item label="二维码" name="qr_code">
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
            </div>
            <div v-else>
              <!-- todo -->
              <loading-outlined v-if="loading" />
              <plus-outlined v-else />
              <div class="ant-upload-text">Upload</div>
            </div>
            </a-upload>
        </a-form-item>
      </a-form>
       <a-modal :confirm-loading="confirmLoading" :footer="null" :width="720" style="top: 20px;" v-model:visible="addBox" title="选择管理员"  destroyOnClose>
         <change-admin v-on:clickAdmin="clickAdmin"/>
      </a-modal>
</template>

<script>
import { message } from 'ant-design-vue';
import ChangeAdmin from "./ChangeAdmin.vue";
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { isPlatformRepeat } from "@/api/platform";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  name:"StepsOne",
  components:{ChangeAdmin,LoadingOutlined,PlusOutlined},
  props: {
    fatherData:{
        type: Array,
        default: []
    }
  },
  data(){
    let checkAdmin = async (rule, value, callback) => {
      if(value==''){
        return Promise.reject('初始管理员不能为空');  
      }
    };
    let checkOriginalId = async (rule, value, callback) => {
      if(value!=''){
        await isPlatformRepeat({original_id:value}).then(res=>{
            if(res){
              return Promise.reject('该original_id已存在');  
            }
        });
      }
    };
    return{
      fileList: [],
      loading: false,
      imageUrl: this.fatherData.qr_code!=null?this.fatherData.qr_code:'',
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      uploadUrl:this.$PathUrl+'/v1/upload',
      form: {
          name: '',
          describe: '',
          admin_id:'',
          admin_name:'',
          type:'',
          original_id:'',
          app_secret:'',
          app_id:'',
          qr_code:'',
      },
      addBox:false,
      rules:{
        name: [
          { required: true, message: '请输入平台名称', trigger: 'blur' },
          {whitespace:true, message: '名称不能为空', trigger: 'blur' }
        ],
        describe: [
          { required: true, message: '请描述平台的作用', trigger: 'blur' },
          {whitespace:true, message: '描述不能为空', trigger: 'blur' }
        ],
        admin_id: [
          { validator: checkAdmin, trigger: ['change','blur'] }
        ],
        type: [
          { required: true, message: '请选择平台类型', trigger: 'blur' },
        ],
        original_id: [
          { required: true, message: '请登录微信相关平台查询原始ID并填入', trigger: 'blur' },
          {whitespace:true, message: '原始ID不能为空', trigger: 'blur' },
          { validator: checkOriginalId, trigger: 'blur' }
        ],
        app_id: [
          { required: true, message: '请登录微信相关平台查询AppId并填入', trigger: 'blur' },
          {whitespace:true, message: 'AppId不能为空', trigger: 'blur' }
        ],
        app_secret: [
          { required: true, message: '请登录微信相关平台查询AppSecret并填入', trigger: 'blur' },
          {whitespace:true, message: 'AppSecret不能为空', trigger: 'blur' }
        ],
        qr_code: [
          { required: true, message: '请上传二维码图片', trigger: 'blur' },
        ],
      }
    }
  },
  methods:{
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
        this.form.qr_code = info.file.response.data.url;
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
    //表单提交
    async onSubmit() {
      return await this.$refs.ruleForm
        .validate()
        .then(() => {
            //alert('ok');
            this.$emit('formData',this.form)
            return true;
        })
        .catch(error => {
          message.warning('请检查表单填写是否正确!')
          return false;
        });
    },
    //选择管理员
    clickAdmin(adminData){
      this.form.admin_name = adminData.real_name
      this.form.admin_id = adminData.admin_id
      this.addBox = false;
      //console.log(this.form)
    },
    //处理表单初始值(父传子or子传父)
    init(){
        if(this.fatherData.length != 0){
            this.form = this.fatherData
        }
    }
  },
  created(){
      this.init();
  }
}
</script>
<style lang="scss">
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
<style>
/* .ant-select-selection-item{
    flex: none!important;
}
.ant-form-explain {
    text-align: left;
    margin-left: 1%;
} */
</style>