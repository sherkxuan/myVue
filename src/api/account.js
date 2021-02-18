//用于用户的登录忘记密码等账户操作的api
import service from "@/utils/request.js";

//管理员登录方法
export function adminLogin(data) {
    return service.request({
        url: "/v1/adminLogin",
        method: "post",
        //data: data
        data//可以简写
    });
}

//管理员退出登录方法
export function adminLoginOut(data) {
    return service.request({
        url: "/v1/adminLogin",
        method: "post",
        //data: data
        data//可以简写
    });
}

//验证用户是否已经登录或者登录token是否已过期
export function isLogin(data) {
    return service.request({
        url: "/v1/isLogin",
        method: "post",
        data
    });
}

//查询当前登录用户的个人信息
export function getMyInfo() {
    return service.request({
        url: "/v1/getMyInfo",
        method: "get"
    });
}
//查询管理员列表
export function getAdminList() {
    return service.request({
        url: "/v1/getAdminList",
        method: "get"
    });
}

