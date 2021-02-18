<template>
  <a-form ref="ruleForm" :rules="rules" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="接口名称" name="name">
          <a-input v-model:value="form.name"  maxlength="20" placeholder="请输入API名称"/>
        </a-form-item>
        <a-form-item label="接口说明" name="exp">
          <a-textarea v-model:value="form.exp" maxlength="150"  placeholder="请简单描述API的作用"/>
        </a-form-item>
        <a-form-item label="路由地址" name="api_route">
          <a-input v-model:value="form.api_route" maxlength="30"  placeholder="请输入API的调用路由"/>
          <span class="ts"><span style="color:red">*</span>可通过此地址调用API</span>
        </a-form-item>
        <a-form-item label="映射地址" name="api_map">
          <a-input v-model:value="form.api_map" maxlength="50"  placeholder="请输入被映射的方法"/>
          <span class="ts"><span style="color:red">*</span>此地址指向控制器的具体方法,例如:Controller/Active</span>
        </a-form-item>
        <a-form-item label="请求方式" name="method">
          <a-input v-model:value="form.method"  placeholder="请输入API的请求方式，多个之间用'|'相隔"/>
         <span class="ts"><span style="color:red">*</span>多个请求中间用'|'相隔(全部小写),例如:get|post,末尾不能以'|'结束</span>
        </a-form-item>
        <a-form-item label="调用次数" name="call_num">
          <a-input-number v-model:value="form.call_num" />
          &nbsp;&nbsp;<span class="ts"><span style="color:red">*</span>为负数则表示无限调用</span>
        </a-form-item>
        <!-- <a-form-item label="状态">
          <a-radio-group v-model:value="form.status">
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
        </a-form-item> -->
        <a-form-item label="禁用IP" name="forbid_ip">
          <a-textarea v-model:value="form.forbid_ip"  placeholder="请输入禁止访问的IP地址，多个之间用'|'相隔"/>
          <span class="ts"><span style="color:red">*</span>例如:192.168.1.1|127.0.0.1,末尾不能是'|'结尾，没有则不填</span>
        </a-form-item>
      </a-form>
</template>

<script>
import { message } from 'ant-design-vue';
import { isRouteMap, editApi } from "@/api/api";
export default {
  name:"EditApi",
  props:{
    ApiInfo:{
      type: Object,
      default: []
    }
  },
  data(){
      //自定义验证请求方式
      let checkmethod = async (rule, value, callback) => {
      let http = ['post','get','put','delete','ajax','pjax','json','options','patch','head'];
      let arr = [];
      arr=value.split("|");
      let res = arr.every(val => http.includes(val));
      if(!res){
        return Promise.reject('无效的请求类型');
      }
    };
    //自定义验证ip地址
    let checkIp =  async (rule, value, callback) => {
      if(value!=''){
        let arr = [];
        arr=value.split("|");
        let ip =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        for(let i=0; i<arr.length;i++){
          if(!ip.test(arr[i])){
            return Promise.reject('无效的IP地址格式');
          }
        }
      }
    };
    //验证路由是否已存在
    let checkRoute =  async (rule, value, callback) => {
      if(value!='' && value != this.api_route){
        await isRouteMap({'name':value}).then(res=>{
          if(res){
              return Promise.reject('已存在该路由');
          }
        });
      }
    };
    //验证映射地址是否已存在
    let checkMap =  async (rule, value, callback) => {
      if(value!=''&& value != this.api_map){
        await isRouteMap({'name':value}).then(res=>{
          if(res){
              return Promise.reject('已存在该映射');
          }
        });
      }
    };
    return{
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      api_route:'',
      api_map:'',
      form:[],
      rules:{
        name: [
          { required: true, message: '请输入API名称', trigger: 'blur' },
          {whitespace:true, message: '字符串两边不能为空格', trigger: 'blur' }
        ],
        exp: [
         { required: true, message: '请简单描述你的API', trigger: 'blur' },
         {whitespace:true, message: '字符串两边不能为空格', trigger: 'blur' }
        ],
        api_route: [
          { required: true, message: '路由不能为空', trigger: 'blur' },
          { pattern:new RegExp(/^\w+$/), message: '路由名称只能是字母或数字或下划线', trigger: 'blur' },
          {whitespace:true, message: '字符串两边不能为空格', trigger: 'blur' },
          { validator: checkRoute, trigger: 'blur' }
        ],
        api_map:[
          { required: true, message: '映射地址不能为空', trigger: 'blur' },
          { pattern:new RegExp(/^(([0-9a-zA-Z_]+)|([0-9a-zA-Z_]+\/[0-9a-zA-Z_]+))+$/), message: '映射地址不合法', trigger: 'blur' },
          { validator: checkMap, trigger: 'blur' }
        ],
        method:[
          { validator: checkmethod, trigger: 'blur' },
          { required: true, message: '请求类型不能为空', trigger: 'blur' },
        ],
        call_num:[
          {type:'number',required: true, message: '数量不能为空', trigger: 'blur' },
        ],
        forbid_ip:[
          { validator: checkIp, trigger: 'blur' }
        ]
      }
    }
  },
  watch:{
    ApiInfo(val){
      this.form = val;
      this.api_route = val.api_route
      this.api_map = val.api_map
    }
  },
  methods:{
    //表单提交
    onSubmit(id) {
      this.$refs.ruleForm
        .validate()
        .then(() => {
            editApi(id,this.form).then(res=>{
              if(res =="SUCCESS"){
                this.$emit('ApiOk')
              }
            });
        })
        .catch(error => {
          message.warning('请检查表单填写是否正确!')
        });
    }
  }
  
}
</script>
<style lang="scss">
.ts{
  font-size: 8px;
  color: rgb(175, 175, 175);
  padding: 2%;
}
</style>