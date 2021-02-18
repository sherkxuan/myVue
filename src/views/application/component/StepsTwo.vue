<template>
<div v-if="checkdata.type==1">
  <a-form ref="ruleForm"  :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="URL">
          <div class="formBox">
            <div>{{url}}</div>
            <div @click="copyText(url)">点击复制</div>
          </div>
        </a-form-item>
        <a-form-item label="Token">
          <div class="formBox">
            <div>{{Token}}</div><!-- 只能是3-32位 -->
            <div @click="copyText(Token)">点击复制</div>
          </div>
        </a-form-item>
        <a-form-item label="EncodingAESKey">
          <div class="formBox">
            <div>{{EncodingAESKey}}</div><!-- 只能是43位 -->
            <div @click="copyText(EncodingAESKey)">点击复制</div>
          </div>
        </a-form-item>
  </a-form>
  <div class="isCheck">
    接入状态:
    <span class="isOk" v-if="!isCheck">未接入</span>
    <span class="isOk2" v-else>成功接入</span>
    <span @click="clickToken">点击验证</span>
  </div>
</div>
<div v-else>
  <a-result :title="miniTitle" :status="isMiniAppOk" :sub-title="retInfo">
    <template #extra v-if="!isCheck">
      <a-button key="console" type="primary" @click="isTokenOk" :loading="btLoading">
        验证
      </a-button>
    </template>
  </a-result>
</div>
</template>

<script>
import { message } from 'ant-design-vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { getCheckUrlCode,isTokenOk,addPlatform } from "@/api/platform";
export default {
  name:"StepsTwo",
  components:{LoadingOutlined,PlusOutlined},
  props:{
    checkdata:{
      type:Array,
      default: []
    }
  },
  data(){
    return{
      labelCol: { span: 3 },
      wrapperCol: { span: 20 },
      Token:'',
      EncodingAESKey:'',
      url:'',
      isCheck:false,
      miniTitle:'当前小程序未接入,若接入请手动验证',
      isMiniAppOk:'info',
      retInfo:'',
      btLoading:false,
      //autoId:'',
    }
  },
  created(){
    this.init();
  },
  methods:{
    //点击完成提交数据
    onSub(){
      if(this.checkdata.type==2){
        this.checkdata.token = null;
        this.checkdata.encoding_AES_Key = null;
      }else{
        this.checkdata.token = this.Token;
        this.checkdata.encoding_AES_Key = this.EncodingAESKey;
      }
      if(this.isCheck){
        this.checkdata.is_connect = 1;
      }else{
        this.checkdata.is_connect = 0;
      }
      //clearInterval(this.autoId)
      console.log('最终数据:',this.checkdata);
      addPlatform(this.checkdata).then(res=>{
          if(res == "SUCCESS"){
            this.$emit('addOk')
          }
      });
    },
    //手动点击验证
    clickToken(){
      this.isTokenOk();
      if(this.isCheck){
        message.success('成功接入!')
      }else{
        message.warning('验证失败!')
      }
    },
    //验证是否成功接入
    isTokenOk(){
      let data;
      this.btLoading = true;
      if(this.checkdata.type==1){
          data = this.Token;
      }else{
        data = this.checkdata.original_id;
      }
      isTokenOk(data,this.checkdata.type).then(res=>{
        if(res == "SUCCESS"){
          this.isCheck = true;
          this.isMiniAppOk = 'success';
          this.miniTitle = '小程序已成功接入到服务器'
          this.retInfo = '';
        }else{
          this.isCheck = false;
          this.isMiniAppOk = 'info';
          this.miniTitle = '当前小程序未接入,若接入请手动验证'
          this.retInfo = res;
        }
        this.btLoading = false;
      }).catch(function (error) {
        this.btLoading = false;
      });
    },
    //复制对象
    copyText(text){
      	let inputElement = document.createElement('input')
      	inputElement.value = text;
      	document.body.appendChild(inputElement);
      	inputElement .select(); //选中文本
   		  document.execCommand("copy"); //执行浏览器复制命令
   		  inputElement.remove();
   		  message.success('复制成功!')
    },
    //初始方法
    init(){
      let that = this;
      this.Token = this.randomString();
      this.EncodingAESKey = this.randomString(43);
      let data = {
        type:this.checkdata.type,
        original_id:this.checkdata.original_id,
        Token:this.Token,
        EncodingAESKey:this.EncodingAESKey,
        app_id: this.checkdata.app_id,
        app_secret: this.checkdata.app_secret
      };
      getCheckUrlCode(data).then(res=>{
        this.url = this.$PathUrl+'/v1/verifyWechat?type='+this.checkdata.type+'&code='+res;
        if(res instanceof Object){
          this.url = '加载失败';
          this.Token ='';
          this.EncodingAESKey = ''
        }
      });
      this.isTokenOk();
      //间隔判断，每五秒发送一次请求
      /* if(this.checkdata.type==1){
        let i = 0;
        this.autoId = setInterval(function(){
          that.isTokenOk();
          i++;
          if(i==30 || that.isCheck) clearInterval(this.autoId)
        }, 5000);
      } */
    },
    //生成随机字符串
    randomString(e) {    
        e = e || 32;
        var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789",
        a = t.length,
        n = "";
        for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
        return n
    },
    //表单提交
    onSubmit() {
      this.$refs.ruleForm
        .validate()
        .then(() => {
            alert('ok');
        })
        .catch(error => {
          message.warning('请检查表单填写是否正确!')
        });
    }
  }
}
</script>
<style lang="scss" scoped>
.isCheck{
  background-color: antiquewhite;
  text-align: center;
  >span{
    margin-right: 4%;
  }
  .isOk{
    color: red;
  }
  .isOk2{
    color: rgb(0, 204, 255);
  }
  >span:last-child{
    color: blue;
    cursor:pointer;
  }
}
.formBox{
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  >div:first-child:hover{
    color: red;
  }
  >div:last-child{
    font-size: 12px;
    color: rgb(0, 150, 155);
  }
  >div:last-child:hover{
    cursor:pointer;
    font-size: 12.5px;
  }
}

</style>