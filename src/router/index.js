import Vue from 'vue';
import Router from 'vue-router';
import VueResource from 'vue-resource';
import goods from '../components/goods/goods.vue';
import ratings from '../components/ratings/ratings.vue';
import seller from '../components/seller/seller.vue';

Vue.use(Router);
Vue.use(VueResource); // 全局注册vue-resource

export default new Router({
  routes: [
    { path: '/',
      redirect: { name: 'goods' } // 设置默认路由 重定向
    },
    {
      path: '/goods',
      name: 'goods',
      component: goods
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: ratings
    },
    {
      path: '/seller',
      name: 'seller',
      component: seller
    }
  ],
  linkActiveClass: 'active'
});
