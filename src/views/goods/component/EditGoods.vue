<template>
  <div>
        <a-steps :current="current" size="small">
          <a-step title="基本信息" />
          <a-step title="参数设置" />
          <a-step title="库存设置" />
          <a-step title="属性设置"/>
          <a-step title="展示设置"/>
          <a-step title="其它设置"/>
        </a-steps>
        <div class="steps-content">
          <div v-if="current==0">
              <add-goods-one ref="one" :fatherData ="formData[0]" @formData="sonData($event,0)"/> 
          </div>
           <div v-if="current==1">
               <add-goods-two ref="two" :fatherData ="formData[1]" @formData="sonData($event,1)"/> 
           </div>
           <div v-if="current==2">
               <add-goods-three ref="three" :fatherData ="formData[2]" @formData="sonData($event,2)" /> 
           </div>
           <div v-if="current==3">
               <add-goods-four ref="four" :fatherData ="formData[3]" @formData="sonData($event,3)"/> 
           </div>
           <div v-if="current==4">
               <add-goods-five ref="five" :fatherData ="formData[4]" @formData="sonData($event,4)"/> 
           </div>
           <div v-if="current==5">
               <add-goods-six ref="six" :fatherData ="formData[5]" @formData="sonData($event,5)" /> 
           </div>
        </div>
        <div class="steps-action">
            <a-button v-if="current > 0" @click="prev(current)">
            上一步
          </a-button>
          <a-button v-if="current < 5"  style="margin-left: 8px"  type="primary" @click="next(current)">
            下一步
          </a-button>
          <a-button
            v-if="current == 5"
            style="margin-left: 8px" 
            type="primary"
            @click="onSub"
            :loading="btLoading"
          >
            完成
          </a-button>
        </div>
      </div>
</template>

<script>
import AddGoodsOne from "../component/AddGoodsOne";
import AddGoodsTwo from "../component/AddGoodsTwo";
import AddGoodsThree from "../component/AddGoodsThree";
import AddGoodsFour from "../component/AddGoodsFour";
import AddGoodsFive from './AddGoodsFive.vue';
import AddGoodsSix from './AddGoodsSix.vue';
export default {
  props: {
    formData:{
        type: Array,
        default: []
    }
  },
    components:{AddGoodsOne,AddGoodsTwo,AddGoodsThree,AddGoodsFour,AddGoodsFive,AddGoodsSix},
    data(){
        return{
            current: 0,//步骤条当前进度
        }
    },
    methods:{
    //最终提交（所有功能耗时2天）
    async onSub(){
      let status = await this.$refs.six.onSubmit();
      if(status){
       this.$emit('subData',this.formData)
      }
    },
      //子组件传过来的值
    sonData(data,index){
      this.formData[index] = data;
    },
        //点击下一步执行事件
        async next(index) {
          let type = this.is_type(index);
          let status = await this.$refs[type].onSubmit();
          if(status){
            this.current++;
          }
        },
        //点击上一步执行事件
        prev(index) {
            let type = this.is_type(index);
            this.$refs[type].onBack();
            this.current--;
        },
        //判断点击哪个组件
        is_type(index){
          let type = '';
          switch (index) {
            case 0:
              type = 'one'
              break;
            case 1:
              type = 'two'
              break;
            case 2:
              type = 'three'
              break;
            case 3:
              type = 'four'
              break;
            case 4:
              type = 'five'
              break;
            case 5:
              type = 'six'
              break;
            default:
              type = 'error'
              break;
          }
          return type;
        }
    }
}
</script>

<style lang="scss" scoped>
.steps-action {
  margin-top: 24px;
  text-align: center;
}
.steps-content {
  margin-top: 10px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
 // background-color: #fafafa;
  min-height: 200px;
  //text-align: center;
  padding-top: 10px;
}
</style>