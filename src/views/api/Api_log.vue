<template>
  <div class="box-1">
    <div>
      <dv-border-box-4 class="box-bg">
        <dv-decoration-7 style="width:500px;height:30px;font-size:20px">API日志</dv-decoration-7>
        <dv-scroll-board :config="config01" style="width:500px;height:350px;color:#444444;" />
      </dv-border-box-4>
    </div>
    <div>
      <dv-border-box-4 :reverse="true" class="box-bg">
        <dv-decoration-7 style="width:500px;height:30px;font-size:20px">API调用排行</dv-decoration-7>
        <dv-scroll-ranking-board :config="config02" style="width:500px;height:350px;background:#007483;padding: 3%;" />
      </dv-border-box-4>
    </div>
  </div>
</template>

<script>
import { getApiLog, getCountApi } from "@/api/api";
export default {
    name:"ApiLog",
    components: {getApiLog},
    data(){
      return{
        config01:{},
        config02:{}
      }
    },
    methods:{
      init(){
        getApiLog().then(res=>{
          if(!res){return false;}
          let arr =[];
          res.forEach(item => {
            arr.push([item.name,item.access_ip,item.method,this.formartDate(item.create_time)])
          });
          this.config01 = {
            data:arr,
            header: ['接口名称', '调用者ip', '请求方式','调用时间'],
            waitTime:1000,
            columnWidth: [150,120,100,180],
            align:['center','center','center','center'],
            rowNum:10,
            oddRowBGC:"#e7feff",
            evenRowBGC:"#e4e4e4"
          }
        });
      },
      init2(){
        getCountApi().then(res=>{
          if(!res){return false;}
          let arr = [];
          res.forEach(item => {
            arr.push({name:item.name,value:item.num})
          });
           this.config02 = {
             data:arr,
             unit: '次',
             rowNum:10,
           }
        });
      },
      //时间戳转换
      formartDate(param) {
        let date = new Date(param*1000);
        let Y,M,D,h,m,s;
        Y = date.getFullYear() + '-';
        M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
        D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
        h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
        m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
        s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return Y + M + D + h + m + s;
      }
    },
    created(){
      let that = this;
      that.init();
      that.init2();
      setInterval(function(){
        that.init();
      }, 3600*1000);
      
    },
}
</script>

<style lang="scss" scoped>
.box-1{
  //padding: 3%;
  display: flex;
  width: 100%;
  justify-content: space-around;
  >div{
    width: 50%;
    height: 100%;
  }
  .box-bg{
    width: 100%;
    padding: 6%;
    height: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>>