//用于商品模块操作的api
import service from "@/utils/request.js";

//添加商品模型
export function addGoodsModel(data) {
    return service.request({
        url: "/v1/addGoodsModel",
        method: "post",
        data
    });
}
//查询模型列表
export function getGoodsModelList() {
    return service.request({
        url: "/v1/getGoodsModelList",
        method: "get"
    });
}
//删除商品模型
/* type==0移至回收站
type==1彻底删除 */
export function del(data) {
    return service.request({
        url: "/v1/delGoodsModel",
        method: "delete",
        data
    });
}
//根据id查询对应的商品模型
export function getGoodsModelById(data) {
    return service.request({
        url: "/v1/getGoodsModelById/id/"+data,
        method: "get"
    });
}
//根据id修改对应的商品模型
export function editGoodsModel(data) {
    return service.request({
        url: "/v1/editGoodsModel",
        method: "put",
        data
    });
}
//新增商品分类
export function addGoodsClass(data) {
    return service.request({
        url: "/v1/addGoodsClass",
        method: "post",
        data
    });
}
//查询所有商品一级分类
export function getGoodsClassOne() {
    return service.request({
        url: "/v1/getGoodsClassOne",
        method: "get"
    });
}
//查询所有商品二级分类
export function getGoodsClassTwo(id) {
    return service.request({
        url: "/v1/getGoodsClassTwo/id/"+id,
        method: "get"
    });
}
//查询商品分类
export function getGoodsClassList() {
    return service.request({
        url: "/v1/getGoodsClassList",
        method: "get"
    });
}
//根据id重新设置商品的排序值
export function editGoodsClassSort(data) {
    return service.request({
        url: "/v1/editGoodsClassSort",
        method: "put",
        data
    });
}
//商品分类删除或移入回收站
export function delClass(data) {
    return service.request({
        url: "/v1/delGoodsClass",
        method: "delete",
        data
    });
}
//根据id查询商品分类详情
export function getGoodsClassById(data) {
    return service.request({
        url: "/v1/getGoodsClassById/id/"+data,
        method: "get"
    });
}
//根据请求查询对应的等级分类全部数据(level=1:查询所有一级分类，level=2:查询所有二级分类，level=3:查询所有三级分类)
export function getGoodsClassWhere(data) {
    return service.request({
        url: "/v1/getGoodsClassWhere/level/"+data,
        method: "get"
    });
}
//更新商品分类数据
export function editGoodsClass(data) {
    return service.request({
        url: "/v1/editGoodsClass",
        method: "put",
        data
    });
}
//添加商品服务
export function addGoodsServe(data) {
    return service.request({
        url: "/v1/addGoodsServe",
        method: "post",
        data
    });
}
//查询商品服务列表
export function getGoodsServeList() {
    return service.request({
        url: "/v1/getGoodsServeList",
        method: "get"
    });
}
//根据id查询对应的商品服务
export function getGoodsServeById(data) {
    return service.request({
        url: "/v1/getGoodsServeById/id/"+data,
        method: "get"
    });
}
//修改商品服务
export function editGoodsServe(data) {
    return service.request({
        url: "/v1/editGoodsServe",
        method: "put",
        data
    });
}
//删除商品服务
export function delGoodsServe(data) {
    return service.request({
        url: "/v1/delGoodsServe",
        method: "delete",
        data
    });
}
//发布商品
export function addGoods(data) {
    return service.request({
        url: "/v1/addGoods",
        method: "post",
        data
    });
}
//商品列表
export function getGoodsList() {
    return service.request({
        url: "/v1/getGoodsList",
        method: "get"
    });
}
//通过此接口可以让商品上架销售或下架到仓库
export function setGoodsStatus(id) {
    return service.request({
        url: "/v1/setGoodsStatus/id/"+id,
        method: "get"
    });
}
//查询商品所有详情输出json格式
export function getGoodsByIdJson(id) {
    return service.request({
        url: "/v1/getGoodsByIdJson/id/"+id,
        method: "get"
    });
}
//修改商品详情
export function editGoods(id,data) {
    return service.request({
        url: "/v1/editGoods/id/"+id,
        method: "post",
        data
    });
}
//修改商品库存
export function editGoodsSku(id,data) {
    return service.request({
        url: "/v1/editGoodsSku/id/"+id,
        method: "post",
        data
    });
}
//删除商品或移至回收站
export function delGoods(data) {
    return service.request({
        url: "/v1/delGoods",
        method: "delete",
        data
    });
}
//搜索商品，根据商品名称或者商品标签搜索商品
export function searchGoods(data) {
    return service.request({
        url: "/v1/searchGoods/search/"+data,
        method: "get"
    });
}
//搜索商品，根据商品名称或者商品标签搜索商品
export function getGoodsRecycle(data) {
    return service.request({
        url: "/v1/getGoodsRecycle",
        method: "get"
    });
}
//恢复商品相关：type判断恢复类型[goods,goodsModel,goodsClass]
export function restoreGoods(data) {
    return service.request({
        url: "/v1/restoreGoods",
        method: "post",
        data
    });
}

