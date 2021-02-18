<template>
 <a-modal :footer="null" :width="1000" style="top: 20px;" v-model:visible="show">
      <sku-add @cancel="cancel" @onSubmit="ok"/>
  </a-modal>
  <a-button @click="show = true;">打开</a-button>
</template>
<script>
import SkuAdd from "../goods/component/SkuAdd.vue";
export default {
  components:{SkuAdd},
  data(){
    return{
      show:false
    }
  },
  methods:{
    ok(obj){
      console.log(obj);
    },
    cancel(){
      console.log('点击了取消');
    }
  }
}
</script>
<style>

</style>