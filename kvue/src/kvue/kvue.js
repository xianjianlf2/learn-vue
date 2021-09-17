function defineReactive(obj, key, val) {
  //递归

  observe(val);
  Object.defineProperty(obj, key, {
    get() {
      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        //防止用户再次赋值
        observe(newVal);
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
function proxy(vm) {
  Object.keys(vm.$data).forEach((key) => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key];
      },
      set(v) {
        vm.$data[key] = v;
      },
    });
  });
}
class KVue {
  constructor(options) {
    //0.保存选项
    this.$options = options;
    this.$data = options.data;
    //1.响应式   递归遍历data中的对象,做响应式处理
    observe(this.$data);

    // 设置代理 proxy(this)
    proxy(this);
    // 2.编译模板

    new Compile(options.el, this);
  }
}
//遍历模板树,解析其中动态部分,初始化并获得更新函数
class Compile {
  constructor(el, vm) {
    //保存一下实例
    this.$vm = vm;
    //获取数组元素的dom 节点
    const dom = document.querySelector(el);

    //编译
    this.compile(dom);
  }

  compile(el) {
    //遍历el
    el.childNodes.forEach((node) => {
      if (this.isElement(node)) {
        //元素:解析动态的指令,属性绑定,事件

        this.compileElement(node);

        //递归
        if (node.childNodes.length > 0) {
          this.compile(node);
        }
      } else if (this.isInter(node)) {
        //插值表达式
        // console.log("编译插值", node.textContent);
        this.compileText(node);
      }
    });
  }
  compileElement(node) {
    const attrs = node.attributes;
    Array.from(attrs).forEach((attr) => {
      //判断是否是动态属性
      //condition 1 :instruction
      const attrName = attr.name;
      const exp = attr.value;
      if (this.isDir(attrName)) {
        const dir = attrName.substring(2);
        //检验当前指令是否是合法的元素
        //跳转到 k-text  执行text函数
        this[dir] && this[dir](node, exp);
      }
    });
  }

  //编译文本
  compileText(node) {
    this.update(node, RegExp.$1, "text");
    // node.textContent = this.$vm[RegExp.$1];
  }
  isElement(node) {
    return node.nodeType === 1;
  }
  //{{xxxx}}
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
  isDir(attrName) {
    return attrName.startsWith("k-");
  }

  //处理所有动态的绑定
  //dir 指的是指令的名称
  update(node, exp, dir) {
    //1.初始化
    const fn = this[dir + "Updater"];
    fn && fn(node, this.$vm[exp]);

    //2.创建Watcher实例,负责后续的更新
  }

  //k-text
  text(node, exp) {
    this.update(node, exp, "text");
  }
  textUpdater(node, val) {
    node.textContent = val;
  }

  //k-html
  html(node, exp) {
    node.innerHTML = this.$vm[exp];
  }
}

//负责具体节点的更新
class Watcher {
  constructor(vm, key, updater) {
    this.vm = vm;
    this.key = key;
    this.updater = updater;
  }

  update() {
    const val = this.vm[this.key];
    this.updater.call(this.vm, val);
  }
}

//Dep和响应式属性之间有一对一关系
// 负责通知watcher更新
class Dep {}
