<template>
  <div class="ModelTitle">
    <div><span style="color:red">*</span>模型名称</div>
    <div><a-input v-model:value="ModelName" maxlength="20" placeholder="请输入模型名称" /></div>
  </div>
  <a-divider />
  <div class="SpecStyle">
    <div>
      <div><a-input maxlength="5" v-model:value="AddSpecName" placeholder="请输入规格名称" /></div>
      <div><a-button type="primary" size="small" @click="addSpec(AddSpecName)"><template #icon><PlusOutlined /></template>添加规格</a-button></div>
    </div>
    <a-table v-if="dataSource.length!=0" :dataSource="dataSource" :pagination="false" size="small" bordered :columns="columns" rowKey="id">
      <template #SpecValues="{ record }">
          <div class="SpecValuesStyle">
            <div v-for="(item,index) in record.SpecValues" :key="index" class="inputList">
              <span v-if="record.SpecValues.length!=1"><a-button type="danger" shape="circle" @click="delSpecValueRow(record,item)" size="small"><template #icon><MinusOutlined /></template></a-button></span>
              <a-input v-model:value="item.value" maxlength="15" placeholder="请输入规格值" />
            </div>
            <div><a-button type="primary" shape="circle" @click="addSpecValueRow(record)" size="small"><template #icon><PlusOutlined /></template></a-button></div>
          </div>
      </template> 
      <template #action="{ record }">
          <span style="display: flex;width:100%;justify-content: space-around;font-size: 10px;">
            <a-button type="danger" shape="circle" @click="delSpecRow(record)" size="small"><DeleteOutlined /></a-button>
          </span>
      </template>
    </a-table>
  </div>
  <a-divider />
  <div class="SpecStyle">
    <div>
      <div><a-input maxlength="5" v-model:value="AddPropName" placeholder="请输入属性名称" /></div>
      <div><a-button type="primary" size="small" @click="addProp(AddPropName)"><template #icon><PlusOutlined /></template>添加属性</a-button></div>
    </div>
    <a-table v-if="dataSource2.length!=0" :dataSource="dataSource2" :pagination="false" size="small" bordered :columns="columns2" rowKey="id">
      <template #PropValues="{ record }">
          <div class="SpecValuesStyle">
            <div v-for="(item,index) in record.PropValues" :key="index" class="inputList">
              <span v-if="record.PropValues.length!=1"><a-button type="danger" shape="circle" @click="delPropValueRow(record,item)" size="small"><template #icon><MinusOutlined /></template></a-button></span>
              <a-input v-model:value="item.value" maxlength="15" placeholder="属性值可为空" />
            </div>
            <div v-if="record.PropValues[0].value"><a-button type="primary" shape="circle" @click="addPropValueRow(record)" size="small"><template #icon><PlusOutlined /></template></a-button></div>
          </div>
      </template> 
      <template #action="{ record }">
          <span style="display: flex;width:100%;justify-content: space-around;font-size: 10px;">
            <a-button type="danger" shape="circle" @click="delPropRow(record)" size="small"><DeleteOutlined /></a-button>
          </span>
      </template>
    </a-table>
  </div>
  <a-divider />
  <div class="footer">
    <div>
      <a-button type="dashed" @click="cancel">取消</a-button>
      <a-button type="primary"  @click="ok" >确认</a-button>
    </div>
  </div>
</template>

<script>
import {DeleteOutlined,PlusOutlined,MinusOutlined} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
export default {
  components: {DeleteOutlined,PlusOutlined,MinusOutlined},
    data() {
      return {
        AddPropName:'',//添加属性框的值
        AddSpecName:'',//添加规格框的值
        dataSource: [],//这个数组存放规格记录
        dataSource2:[],//这个数组存放属性记录
        ModelName:'',//商品模型名称
        columns: [
          {
            title: '规格名称',
            dataIndex: 'SpecName',
            //slots: { customRender: 'SpecName' },
            width:150,
          },
          {
            title: '规格值',
            dataIndex: 'SpecValues',
            slots: { customRender: 'SpecValues' },
          },
          {
            title: '操作',
            slots: { customRender: 'action' },
            width:120,
            align:'center',
          },
        ],
        columns2: [
          {
            title: '属性名称',
            dataIndex: 'PropName',
            width:150,
          },
          {
            title: '属性值(若不填属性值,在添加商品时进行填写;若填写属性值,则添加商品时选中其中一项)',
            //dataIndex: 'PropValues',
            slots: { customRender: 'PropValues' },
          },
          {
            title: '操作',
            slots: { customRender: 'action' },
            width:120,
            align:'center',
          },
        ],
      };
    },
    methods:{
      //点击取消
      cancel(){
        this.$emit('cancel')
      },
      //点击确认
      ok(){
        if(this.ModelName.trim()==''){
          message.warning('商品模型不能为空');
          return;
        };
        if(this.dataSource.length===0){
          message.warning('规格不能为空');
          return;
        }
        if(this.dataSource2.length===0){
          message.warning('属性不能为空');
          return;
        }
        this.dataSource.forEach((item,index)=>{
          item.SpecValues.forEach((item2,index2)=>{
            if(item2.value==''){
               message.warning('有空的规格值,请检查');
              return;
            }
          });
        });
        this.dataSource2.forEach((ite,index)=>{
          ite.PropValues.forEach((ite2,index2)=>{
            if(ite2.value=='' && index2>0){
               message.warning('有空的属性值,请检查');
              return;
            }
          });
        });
        let arr1 = [],arr2 = [],arr1_values = [],arr2_values = [];
        this.dataSource.forEach((item,index)=>{
          item.SpecValues.forEach((item2,index2)=>{
            arr1_values.push(item2.value)
          });
          arr1.push({
              SpecName:item.SpecName,
              SpecValues:arr1_values
            });
          arr1_values = []
        });
        this.dataSource2.forEach((it,index)=>{
          it.PropValues.forEach((it2,index2)=>{
            arr2_values.push(it2.value)
          });
          arr2.push({
              PropName:it.PropName,
              PropValues:arr2_values
            });
          arr2_values = []
        });
        let data = {
           Spec:arr1,
           Prop:arr2,
           name:this.ModelName
        };
        this.$emit('onSubmit',data);
      },
      //删除属性值
      delPropValueRow(Rowdata,item){
        let index = this.dataSource2.indexOf(Rowdata);
        let index2 = this.dataSource2[index].PropValues.indexOf(item)
        this.dataSource2[index].PropValues.splice(index2,1);
      },
      //添加属性值
      addPropValueRow(Rowdata){
        let index = this.dataSource2.indexOf(Rowdata)
        this.dataSource2[index].PropValues.push({
            value: '',
            key: Date.now(),
        })
      },
      //删除属性记录
      delPropRow(data){
        let index = this.dataSource2.indexOf(data)
        this.dataSource2.splice(index,1);
      },
      //添加属性记录
      addProp(value){
        if(value.trim()==''){
          return;
        }
        this.dataSource2.push({
          PropName: value,
          PropValues: [{
            value: '',
            key: Date.now(),
          }],
          id:Date.now()
        })
        this.AddPropName='';
      },
      //删除规格值
      delSpecValueRow(Rowdata,item){
        let index = this.dataSource.indexOf(Rowdata);
        let index2 = this.dataSource[index].SpecValues.indexOf(item)
        this.dataSource[index].SpecValues.splice(index2,1);
      },
      //添加规格值
      addSpecValueRow(Rowdata){
        let index = this.dataSource.indexOf(Rowdata)
        this.dataSource[index].SpecValues.push({
            value: '',
            key: Date.now(),
        })
      },
      //添加规格记录
      addSpec(value){
        if(value.trim()==''){
          return;
        }
        this.dataSource.push({
            SpecName: value,
            SpecValues: [{
              value: '',
              key: Date.now(),
            }],
            id:Date.now()
        })
        this.AddSpecName='';
      },
      //删除规格记录
      delSpecRow(data){
        let index = this.dataSource.indexOf(data)
        this.dataSource.splice(index,1);
      }
    },
    created(){
      
    }
  };
</script>

<style lang="scss">
.footer{
  >div{
    width: 200px;
    margin:0px auto;
    display: flex;
    justify-content: space-around;
  }
}
.SpecValuesStyle{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .inputList{
    display: flex;
    align-items: center;
    span{
      margin-right: 3%;
    }
  }
  >div{
    width: 150px;
    margin-right: 0.5%;
    margin-bottom: 0.5%;
  }
  >div:last-child{
    margin-left: 1%;
  }
}
.ModelTitle{
  display: flex;
  align-items: center;
  >div:first-child{
    margin-right: 1%;
  }
  >div:last-child{
    width: 300px;
  }
}
.SpecStyle{
  margin-top: 2%;
  >div:first-child{
    display: flex;
    align-items: center;
    margin-bottom: 1%;
    >div:first-child{
      width: 150px;
      margin-right: 1%;
    }
  }
}
</style>>