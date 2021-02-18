<template>
    <div v-if="getInfo.type==2">
        <a-result v-if="!isCheck" status="warning" title="当前小程序接入未验证,点击按钮进行验证">
            <template #extra>
                <a-button key="console" type="primary" :loading="btLoading" @click="checkToken">
                验证
                </a-button>
            </template>
            <div class="miniStyle">
                <div><span>appId:</span><span>{{getInfo.app_id}}</span></div>
                <div><span>appSecret:</span><span>{{getInfo.app_secret}}</span></div>
                <div><a>修改平台配置</a></div>
            </div>
        </a-result>
        <a-result
            v-else
            status="success"
            title="小程序已接入!"
            sub-title="你的配置信息填写无误,现可以调用相关API."
        >
            <template #extra>
            <a-button key="console" type="primary"  @click="closeWindow">
                关闭
            </a-button>
            </template>
        </a-result>
    </div>
    <div v-if="getInfo.type==1">
        <div v-if="!isCheck">
            <a-form ref="ruleForm"  :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-item label="URL">
                    <div class="formBox">
                        <div>{{url}}</div>
                        <div @click="copyText(url)">&nbsp;&nbsp;点击复制</div>
                    </div>
                </a-form-item>
                <a-form-item label="Token">
                    <div class="formBox">
                        <div>{{Token}}</div><!-- 只能是3-32位 -->
                        <div @click="copyText(Token)">&nbsp;&nbsp;点击复制</div>
                    </div>
                </a-form-item>
                <a-form-item label="EncodingAESKey">
                    <div class="formBox">
                        <div>{{EncodingAESKey}}</div><!-- 只能是43位 -->
                        <div @click="copyText(EncodingAESKey)">&nbsp;&nbsp;点击复制</div>
                    </div>
                </a-form-item>
            </a-form>
            <div>
                <div class="status">当前状态:  <span v-if="!isCheck" style="color:red">未接入</span><span v-else style="color: dodgerblue;">已接入</span></div>
                <a-button type="primary" :loading="btLoading" @click="checkToken">
                    验证
                </a-button>
                <a-button style="margin-left: 2%;">修改配置</a-button>
            </div>
        </div>
        <a-result
            v-else
            status="success"
            title="公众号已接入!"
            sub-title="你的配置信息填写无误,现可以调用相关API."
        >
            <template #extra>
            <a-button key="console" type="primary" @click="closeWindow">
                关闭
            </a-button>
            </template>
        </a-result>
    </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { getPlatformById,getCheckUrlCode,isTokenOk, serPlatformConnect} from "@/api/platform";
export default {
    name:"EditCheckP",
    props:{
        byId:{
            type:Number,
            default: ''
        }
    },
    data(){
        return{
            getInfo:[],//数据详情
            Token:'',
            EncodingAESKey:'',
            url:'',
            btLoading:false,
            isCheck:false//验证是否成功
        }
    },
    created(){
        this.init();
    },
    methods:{
        //关闭窗口
        closeWindow(){
            this.$emit('closeWindow');
        },
        //验证成功，修改接入状态
        setConnect(){
            serPlatformConnect({id:this.getInfo.id});
        },
        //验证小程序是否接入
        checkToken(){
            this.btLoading = true;
            let data;
            if(this.getInfo.type==1){
                data = this.Token;
            }else{
                data = this.getInfo.original_id;
            }
            isTokenOk(data,this.getInfo.type).then(res=>{
                if(res == "SUCCESS"){
                    message.success('成功接入!')
                    this.isCheck = true;
                    this.setConnect();
                }else{
                    message.warning('未能接入!')
                    this.isCheck = false;
                }
                this.btLoading = false;
            })
        },
        //初始方法
        async init(){
            await this.getData();
            this.getCheckUrlCode();
        },
        //根据查询数据
        async getData(){
            await getPlatformById(this.byId).then(res=>{
                this.getInfo = res;
            });
        },
        //生成验证token
        getCheckUrlCode(){
            this.Token = this.randomString();
            this.EncodingAESKey = this.randomString(43);
            let data = {
                type:this.getInfo.type,
                original_id:this.getInfo.original_id,
                Token:this.Token,
                EncodingAESKey:this.EncodingAESKey,
                app_id: this.getInfo.app_id,
                app_secret: this.getInfo.app_secret
            };
            getCheckUrlCode(data).then(res=>{
                this.url = this.$PathUrl+'/v1/verifyWechat?type='+this.getInfo.type+'&code='+res;
                if(res instanceof Object){
                    this.url = '加载失败';
                    this.Token ='';
                    this.EncodingAESKey = ''
                }
            });
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
    }
}
</script>

<style lang="scss" scoped>
.status{
    font-size: 13px;
}
.formBox{
  display: flex;
  //align-items: center;
  //justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  font-size: 8px;
  >div:first-child:hover{
    color: red;
  }
  >div:last-child{
    font-size: 8px;
    color: rgb(0, 150, 155);
  }
  >div:last-child:hover{
    cursor:pointer;
  }
}
.miniStyle{
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  >div{
    width: 100%;
    display: flex;
  }
  >div>span:first-child{
    width: 20%;
    text-align: right;
  }
  >div>span:last-child{
    width: 80%;
    padding-left: 2%;
    color: rgb(0, 225, 255);
  }
  >div:last-child{
    font-size: 12px;
    justify-content: center;
    margin-top: 2%;
  }
}
</style>