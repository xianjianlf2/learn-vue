function defineReactive(obj, key, val) {
  //递归

  observe(val);
  Object.defineProperty(obj, key, {
    get() {
      console.log("get", key);
      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        console.log("set", key);
        val = newVal;
      }
    },
  });
}

//遍历所有传入obj的属性,执行响应式处理
function observe(obj) {
  //首先判断Obj是对象
  if (typeof obj !== "object" || obj == null) {
    return obj;
  }
  Object.keys(obj).forEach((key) => defineReactive(obj, key, obj[key]));
}

//出现的作用:为了动态新增一个属性
function set(obj, key, val) {
  defineReactive(obj, key, val);
}

const obj = {
  foo: "foo",
  baz: {
    a: 1,
  },
};
observe(obj);
// 用户不能手动设置所有属性:
// 递归的响应式处理过程
// defineReactive(obj, "foo", "foo");
// defineReactive 解决不了数组问题
// 解决方案: 拦截数组的变更方法

set(obj, "dong", "dong");
obj.dong;
