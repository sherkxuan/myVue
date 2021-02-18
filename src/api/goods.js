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


