//用于管理平台模块的api
import service from "@/utils/request.js";

//输出平台列表
export function getPlatformList() {
    return service.request({
        url: "/v1/getPlatformList",
        method: "get"
    });
}
//删除平台或移入回收站
export function del(data) {
    return service.request({
        url: "/v1/delPlatform",
        method: "post",
        data
    });
}
//获取验证微信平台的url参数
export function getCheckUrlCode(data) {
    return service.request({
        url: "/v1/getCheckUrlCode",
        method: "post",
        data
    });
}
//验证微信端是否接入成功
export function isTokenOk(data,type) {
    return service.request({
        url: "/v1/isTokenOk/type/"+type+"/Token/"+data,
        method: "get",
    });
}
//添加平台
export function addPlatform(data) {
    return service.request({
        url: "/v1/addPlatform",
        method: "post",
        data
    });
}
//更改平台的状态
export function setPlatformStatus(id) {
    return service.request({
        url: "/v1/setPlatformStatus/id/"+id,
        method: "get"
    });
}
//查询平台是否重复
export function isPlatformRepeat(data) {
    return service.request({
        url: "/v1/isPlatformRepeat",
        method: "post",
        data
    });
}
//根据id查询详情
export function getPlatformById(id) {
    return service.request({
        url: "/v1/getPlatformById/id/"+id,
        method: "get"
    });
}
//修改平台验证为成功状态
export function serPlatformConnect(data) {
    return service.request({
        url: "/v1/serPlatformConnect",
        method: "put",
        data
    });
}