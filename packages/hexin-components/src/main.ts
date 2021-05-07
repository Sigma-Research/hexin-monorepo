import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

// 冒泡调用
// 用于子组件向父组件传值，可以在任意级别的父组件监听到所写的fn函数
// 优化：可调用多个 fn （数组）
Vue.prototype.runClosest = function(cfg: any) {
  const obj = {
    vue: cfg.vue,
    mark: cfg.mark,
    fn: cfg.fn,
    param: cfg.param,
    cfg_max_loop: 10,
  };
  let node = obj.vue.$parent;
  for (let i = 1; i <= obj.cfg_max_loop; i++) {
    if (node[obj.fn] || (obj.mark && node[obj.mark])) {
      node[obj.fn](obj.param);
      break;
    } else {
      node = node.$parent;
    }
  }
}

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
