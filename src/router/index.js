import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  //登录页
  {
    path: "/",
    name: "Login",
    hidden:true,
    component: () =>import("../views/login/Login.vue"),
    meat:{
      title:"登录"
    },
  },
  //首页
  {
    path: "/index",
    name: "Index",
    meat:{
      title:"首页",
      icon:"icon-index-copy"
    },
    component: () =>import("../views/layout/Index.vue"),
    children:[
      {
        path: "/index",
        name: "Index",
        meat:{
          title:"首页",
          icon:"icon-index-copy"
        },
        component: () =>import("../views/home/Index.vue"),
      },
    ]
  },
  //信息管理
  {
    path: "/adminIndex",
    name: "AdminIndex",
    meat:{
      title:"管理总台",
      icon:"icon-shezhi1"
    },
    component: () =>import("../views/layout/Index.vue"),
    //嵌套路由
    children:[
      {
        //角色管理
        path: "/role",
        name: "Role",
        meat:{
          title:"角色管理",
          icon:"icon-authority"
        },
        component: () =>import("../views/admin/Role.vue")
      },
      {
        //用户管理
        path: "/user",
        name: "User",
        meat:{
          title:"用户管理",
          icon:"icon-yonghu"
        },
        component: () =>import("../views/admin/User.vue")
      }
    ]
  },
  //接口管理
  {
    path: "/api",
    name: "Api",
    meat:{
      title:"接口管理",
      icon:"icon-API"
    },
    component: () =>import("../views/layout/Index.vue"),
    children:[
      {
        path: "/api",
        name: "Api",
        meat:{
          title:"接口管理",
          icon:"icon-API"
        },
        component: () =>import("../views/api/Api.vue"),
      },
      {
        path: "/api_log",
        name: "ApiLog",
        meat:{
          title:"接口统计",
          icon:"icon-tongji"
        },
        component: () =>import("../views/api/Api_log.vue"),
      },
    ]
  },
  {
    path: "/management",
    name: "Management",
    meat:{
      title:"平台管理",
      icon:"icon-jiatianjiakuangxuanduoxuan-8"
    },
    component: () =>import("../views/layout/Index.vue"),
    children:[
      {
        path: "/management",
        name: "Management",
        meat:{
          title:"平台管理",
          icon:"icon-jiatianjiakuangxuanduoxuan-8"
        },
        component: () =>import("../views/application/Management.vue"),
      },
      {
        path: "/recycle",
        name: "Recycle",
        meat:{
          title:"回收站",
          icon:"icon-jiatianjiakuangxuanduoxuan-8"
        },
        component: () =>import("../views/application/Recycle.vue"),
      },
    ]
  },
  {
    path: "/goods",
    name: "Goods",
    meat:{
      title:"商品管理",
      icon:"icon-jiatianjiakuangxuanduoxuan-8"
    },
    component: () =>import("../views/layout/Index.vue"),
    children:[
      {
        path: "/goods",
        name: "Goods",
        meat:{
          title:"商品管理",
          icon:"icon-jiatianjiakuangxuanduoxuan-8"
        },
        component: () =>import("../views/goods/Goods.vue"),
      },
      {
        path: "/skulist",
        name: "SkuList",
        meat:{
          title:"模型管理",
          icon:"icon-jiatianjiakuangxuanduoxuan-8"
        },
        component: () =>import("../views/goods/SkuList.vue"),
      },
      {
        path: "/classification",
        name: "Classification",
        meat:{
          title:"分类管理",
          icon:"icon-jiatianjiakuangxuanduoxuan-8"
        },
        component: () =>import("../views/goods/Classification.vue"),
      },
      {
        path: "/goodsServe",
        name: "GoodsServe",
        meat:{
          title:"服务管理",
          icon:"icon-jiatianjiakuangxuanduoxuan-8"
        },
        component: () =>import("../views/goods/GoodsServe.vue"),
      },
      {
        path: "/recycle",
        name: "Recycle",
        meat:{
          title:"回收站",
          icon:"icon-jiatianjiakuangxuanduoxuan-8"
        },
        component: () =>import("../views/goods/Recycle.vue"),
      },
    ]
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
