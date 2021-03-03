//用于管理接口模块的api
import service from "@/utils/request.js";

//输出API列表
export function getApiList() {
    return service.request({
        url: "/v1/getApiList",
        method: "get"
    });
}

//新增API
export function install(data) {
    return service.request({
        url: "/v1/addApi",
        method: "post",
        data
    });
}
//删除API
export function del(data) {
    return service.request({
        url: "/v1/delApi",
        method: "delete",
        data
    });
}
//验证请求路由或映射是否存在
export function isRouteMap(data) {
    return service.request({
        url: "/v1/isRouteMap",
        method: "post",
        data
    });
}

//更改API的状态
export function setApiStatus(id) {
    return service.request({
        url: "/v1/setApiStatus/id/"+id,
        method: "get"
    });
}
//根据id查询对应的API
export function getApiById(id) {
    return service.request({
        url: "/v1/getApiById/id/"+id,
        method: "get"
    });
}
//根据ID修改API
export function editApi(id,data) {
    return service.request({
        url: "/v1/editApi/id/"+id,
        method: "post",
        data
    });
}
//删除所有选中的id(废弃)
export function delAll(data) {
    return service.request({
        url: "/v1/delAll",
        method: "post",
        data
    });
}

//查询接口调用日志前20条数据
export function getApiLog() {
    return service.request({
        url: "/v1/getApiLog",
        method: "get",
    });
}

//查询统计API调用最多的20条记录
export function getCountApi() {
    return service.request({
        url: "/v1/getCountApi",
        method: "get",
    });
}

//查询API调用次数小于1000的接口
export function getApiWarning() {
    return service.request({
        url: "/v1/getApiWarning",
        method: "get",
    });
}