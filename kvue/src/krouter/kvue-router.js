//实现install 方法
let Vue;
class VueRouter {
  constructor(options) {
    this.$options = options;

    // 给指定对象定义响应式属性
    Vue.util.defineReactive(
      this,
      "current",
      window.location.hash.slice(1) || "/"
    );

    // 监控hash change
    window.addEventListener("hashchange", () => {
      // #/about  => /about
      this.current = window.location.hash.slice(1);
    });
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
  Vue.component("router-link", {
    props: {
      to: {
        type: String,
        require: true,
      },
    },
    render(h) {
      return h(
        "a",
        {
          attrs: { href: "#" + this.to },
        },
        this.$slots.default
      );
    },
  });
  Vue.component("router-view", {
    render(h) {
      let component = null;
      const route = this.$router.$options.routes.find(
        (route) => route.path === this.$router.current
      );
      if (route) {
        component = route.component;
      }
      return h(component);
    },
  });
};

export default VueRouter;
