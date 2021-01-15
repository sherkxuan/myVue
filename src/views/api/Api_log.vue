<template>
  <div>接口统计</div>
</template>

<script>
import { getApi } from "@/api/api";
export default {
    name:"ApiLog",
    created(){
      getApi().then(res=>{
        console.log('nn',res);
      })  
    },
}
</script>

<style>

</style>