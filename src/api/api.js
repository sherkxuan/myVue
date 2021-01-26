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
//删除API(单个删除)
export function del(id) {
    return service.request({
        url: "/v1/delApi/id/"+id,
        method: "get"
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
//删除所有选中的id
export function delAll(data) {
    return service.request({
        url: "/v1/delAll",
        method: "post",
        data
    });
}