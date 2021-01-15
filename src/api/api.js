//用于管理接口模块的api
import service from "@/utils/request.js";

//管理员登录方法
export function getApi(data) {
    return service.request({
        url: "/v1/upload",
        method: "post",
        //data: data
        data//可以简写
    });
}