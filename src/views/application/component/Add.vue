<template>
      <div>
        <a-steps :current="current" size="small">
          <a-step title="基本信息" />
          <a-step title="引导配置" />
          <!-- <a-step title="步骤3"/> -->
        </a-steps>
        <div class="steps-content">
          <div v-if="current==0">
            <steps-one ref="info" :fatherData ="formData"  @formData="sonData"/>
          </div>
           <div v-if="current==1">
             <steps-two ref="add" :checkdata="formData" v-on:addOk="addOk"/>
           </div>
        </div>
        <div class="steps-action">
          <a-button v-if="current < 1" type="primary" @click="next">
            下一步
          </a-button>
          <a-button
            v-if="current == 1"
            type="primary"
            @click="onSub"
            :loading="btLoading"
          >
            完成
          </a-button>
          <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">
            上一步
          </a-button>
        </div>
      </div>

       <a-modal :confirm-loading="confirmLoading" :footer="null" :width="720" style="top: 20px;" v-model:visible="addBox" title="选择管理员"  destroyOnClose>
         <change-admin v-on:clickAdmin="clickAdmin"/>
      </a-modal>
</template>

<script>
import StepsOne from "./StepsOne.vue";
import StepsTwo from "./StepsTwo.vue";
export default {
  name:"Add",
  components:{StepsOne,StepsTwo},
  data(){
    return{
      current: 0,//步骤条当前进度
      formData:[],//子组件传过来的值
      btLoading:false
    }
  },
  methods:{
    //监听添加回调事件
    addOk(){
      this.btLoading = false;
      this.$emit('Ok')
    },
    //点击完成事件
    onSub(){
      this.btLoading = true;
      this.$refs.add.onSub();
    },
    //子组件传过来的值
    sonData(data){
      this.formData = data;
    },
    //点击下一步执行事件
    async next() {
      let status = await this.$refs.info.onSubmit();
      if(status){
        this.current++;
      }
    },
    //点击上一步执行事件
    prev() {
      this.current--;
    },
    
  },
  created(){
    
  }
}
</script>
<style lang="scss" scoped>
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  //text-align: center;
  padding-top: 2%;
}

.steps-action {
  margin-top: 24px;
  text-align: center;
}
.ant-steps {
    width: 70%;
    text-align: center;
}
</style>