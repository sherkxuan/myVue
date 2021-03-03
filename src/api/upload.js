//用于上传图片或文件的API
import service from "@/utils/request.js";

//图片上传
export function upload(data) {
    return service.request({
        //url: "/v1/upload",
        url: "http://zx.cn/v1/upload",
        //url: "/v1/upload",
        method: "post",
        //data: data
        data//可以简写
    });
}