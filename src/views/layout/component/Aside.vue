<template>
  <div class="logo">
    <span v-if="collapsed">
      管理
    </span>
    <span v-else>
      sherk后台管理
    </span>
  </div>
  <a-menu
    v-model:openKeys="data.openKeys"
    v-model:selectedKeys="data.selectedKeys"
    mode="inline"
    theme="dark"
    :inline-collapsed="collapsed"
    @click="selectMenu"
    @openChange="openMenu"
  >
    <template v-for="item in rotuers" :key="item.path">
      <template v-if="!item.hidden">
        <!-- 一级菜单 -->
        <a-menu-item :key="item.path" v-if="hasOnlyChildren(item)">
          <router-link :to="item.children[0].path">
            <span class="anticon">
              <i class="iconfont" :class="item.meat && item.meat.icon"></i>
            </span>
            <span>{{
              item.children[0].meat && item.children[0].meat.title
            }}</span>
          </router-link>
        </a-menu-item>
        <a-sub-menu v-else :key="item.path">
          <template #title>
            <span class="anticon">
              <i class="iconfont" :class="item.meat && item.meat.icon"></i>
            </span>
            <span
              ><span>{{ item.meat && item.meat.title }}</span></span
            >
          </template>
          <template v-if="item.children.length">
            <template v-if="!item.hidden">
              <a-menu-item v-for="child in item.children" :key="child.path">
                <router-link :to="child.path">
                  <i
                    class="iconfont"
                    :class="child.meat && child.meat.icon"
                  ></i>
                  {{ child.meat && child.meat.title }}
                </router-link>
              </a-menu-item>
            </template>
          </template>
        </a-sub-menu>
      </template>
    </template>
  </a-menu>
</template>
<script>
import { reactive } from "vue";
import { useRouter } from "vue-router";
export default {
  name: "Aside",
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { options } = useRouter();
    //路由
    const rotuers = options.routes;

    //数据
    const data = reactive({
      selectedKeys: localStorage.getItem("selectedKeys")
        ? [localStorage.getItem("selectedKeys")]
        : [],
      openKeys: localStorage.getItem("openKeys")
        ? [localStorage.getItem("openKeys")]
        : []
    });

    //选择菜单
    const selectMenu = ({ item, key, keyPath }) => {
      data.selectedKeys = [key];
      localStorage.setItem("selectedKeys", key);
    };
    //展开菜单
    const openMenu = openKeys => {
      data.openKeys = openKeys;
      localStorage.setItem("openKeys", openKeys);
    };
    //判断是否只有一个子级路由
    const hasOnlyChildren = data => {
      //如果没有子级返回出去
      if (!data.children) {
        return false;
      }
      //过滤掉hidden为true的路由
      const routers = data.children.filter(item =>
        item.hidden ? false : true
      );
      //最终结果
      if (routers.length === 1) {
        return true;
      }
      return false;
    };
    return {
      data,
      rotuers,
      selectMenu,
      openMenu,
      hasOnlyChildren
    };
  }
};
</script>
<style lang="scss" scoped>
.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  line-height: 32px;
  text-align: center;
  font-size: 20px;
  margin: 16px;
  color: aliceblue;
}
.iconfont {
  margin-right: 5%;
}
</style>
