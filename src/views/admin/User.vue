<template>
    <TEditor ref="editor" v-model:value="data" />
</template>
<script>
export default {
  components: {
  },
  data(){
    return {
      data: '你好啊,我的值是别人传过来的,也可以作为初始化的值传给编辑器哦'
    }
  },
}
</script>
<style>
</style>