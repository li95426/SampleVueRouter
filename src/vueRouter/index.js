// 自定义vueRouter
let _Vue = null;
export default class VueRouter {
  constructor(options) {
    this.options = options;
    this.routeMap = {};
    // 创建响应式数据
    this.data = _Vue.observable({
      current: window.location.pathname,
    });
  }

  static install(Vue) {
    // 1.判断当前插件是否已经被安装
    if (VueRouter.install.installed) {
      return;
    }
    VueRouter.install.installed = true;
    // 2.把Vue构造函数记录到全局变量
    _Vue = Vue;
    // 3.把创建Vue实例时候传入的router对象注入到Vue实例上
    // _Vue.prototype.$router = this.$options.router
    // 混入
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router;
          this.$options.router.init();
        }
      },
    });
  }

  init() {
    this.createRouterMap();
    this.initComponents(_Vue);
    this.initEvent();
  }

  createRouterMap() {
    // 遍历所有的路由规则，把路由规则解析成键值对的形式，存储到routerMap中
    this.options.routes.forEach((route) => {
      this.routeMap[route.path] = route.component;
    });
  }
  initComponents(Vue) {
    Vue.component("router-link", {
      props: {
        to: String,
      },
      // 完整版本的Vue可以使用template，在vue.config.js中开启
      // template: '<a :href="to"><slot></slot></a>',
      render(h) {
        return h(
          "a",
          {
            attrs: {
              href: this.to,
            },
            on: {
              click: this.clickHandler,
            },
          },
          [this.$slots.default]
        );
      },
      methods: {
        clickHandler(e) {
          history.pushState({}, "", this.to);
          this.$router.data.current = this.to;
          e.preventDefault();
        },
      },
    });

    const self = this;
    Vue.component("router-view", {
      render(h) {
        const component = self.routeMap[self.data.current];
        return h(component);
      },
    });
  }
  initEvent() {
    window.addEventListener("popstate", () => {
      this.data.current = window.location.pathname;
    });
  }
}
