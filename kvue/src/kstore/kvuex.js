let Vue;

class Store {
  constructor(options) {
    //保存选项

    this.$options = options;
    this._mutations = options.mutations;
    this._actions = options.actions;

    this._vm = new Vue({
      data() {
        return {
          //不希望 $$state不被代理
          $$state: options.state,
        };
      },
    });

    //解决异步实例this 指向丢失
    this.commit = this.commit.bind(this);
    this.dispatch = this.dispatch.bind(this);
  }

  //存储器
  get state() {
    return this._vm._data.$$state;
  }

  set state(v) {
    console.error("请使用replaceState 去修改状态");
  }

  commit(type, payload) {
    //匹配对应的type对应的mutation
    const entry = this._mutations[type];
    if (!entry) {
      console.error("error");
    }
    entry(this.state, payload);
  }

  dispatch(type, payload) {
    //匹配对应的type对应的mutation
    const entry = this._actions[type];
    if (!entry) {
      console.error("error");
    }

    //{commit,dispatch,state}
    entry(this, payload);
  }
}
function install(_Vue) {
  Vue = _Vue;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    },
  });
}

export default { Store, install };
