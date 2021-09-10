import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  // state 应该是响应式对象
  state: {
    counter: 0,
  },
  mutations: {
    add(state) {
      state.counter++;
    },
  },
  actions: {
    // 上下文从何而来
    add({ commit }) {
      setTimeout(() => {
        commit("add");
      }, 1000);
    },
  },
  modules: {},
});
