import View from "./krouter-view";
import Link from "./krouter-link";

//实现install 方法
let Vue;
class VueRouter {
  constructor(options) {
    this.$options = options;

    this.current = window.location.hash.slice(1) || "/";
    Vue.util.defineReactive(this, "matched", []);
    //match 方法可以递归的遍历路由表,获得匹配

    this.match();

    // 监控hash change
    window.addEventListener("hashchange", this.onHashChange.bind(this));
    window.addEventListener("load", this.onHashChange.bind(this));

    // //创建一个路由映射表
    // this.routeMap = {};
    // options.routes.forEach((route) => {
    //   this.routeMap[route.path] = route;
    // });
  }
  onHashChange() {
    this.current = window.location.hash.slice(1);

    this.matched = [];
    this.match();
  }

  match(routes) {
    routes = routes || this.$options.routes;

    //递归遍历路由表

    for (const route of routes) {
      if (route.path === "/" && this.current === "/") {
        this.matched.push(route);
        return;
      }

      //about/info
      if (route.path !== "/" && this.current.indexOf(route.path) != -1) {
        this.matched.push(route);
        if (route.children) {
          this.match(route.children);
        }
        return;
      }
    }
  }
}

// 形参1是Vue的构造函数.目的是便于扩展
VueRouter.install = function(_Vue) {
  // 引⽤构造函数，VueRouter中要使⽤
  Vue = _Vue;

  //挂载$router
  Vue.mixin({
    beforeCreate() {
      // 只有根组件拥有router选项
      if (this.$options.router) {
        // vm.$router
        Vue.prototype.$router = this.$options.router;
      }
    },
  });
  // 实现两个全局组件router-link和router-view
  Vue.component("router-link", Link);
  Vue.component("router-view", View);
};

export default VueRouter;
