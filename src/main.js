// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import './common/stylus/index.styl';
import Vue from 'vue';
import App from './App';
import router from './router';
import filter from './filter';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router, // router 挂载
  filter, // filter 挂载
  data: {
    eventHub: new Vue() // 根集线器，用来监听事件
  },
  template: '<App/>',
  components: {App}
});
