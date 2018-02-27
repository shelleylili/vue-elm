<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <!-- 使用 router-link 组件来导航. -->
        <!-- 通过传入 `to` 属性指定链接. -->
        <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <keep-alive><!--防止刷新重新渲染-->
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import {urlParse} from './common/js/util.js';
  import header from './components/header/header.vue';
  const ERR_OK = 0;
  export default {
    name: 'app',
    data() {
      return {
        seller: {
          id: (() => {
              let queryParam = urlParse();
              return queryParam.id;
          })()
        }
      };
    },
    created() { // 当页面加载完毕后的生命周期的钩子
      this.$http.get('/api/seller?id=' + this.seller.id).then((data) => {
        if (data && data.body.errno === ERR_OK) {
//          this.seller = data.body.data;
          this.seller = Object.assign({}, this.seller, data.body.data);
        }
      });
    },
    components: {
      'v-header': header
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import './common/stylus/index.styl';

  #app
    color: #333333
    .tab
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      border-1px(rgba(7, 17, 27, 0.1))
      .tab-item
        flex: 1
        text-align center
        & > a
          display: block
          color: rgb(77, 85, 93)
          font-size: 14px
          &.active
            color: rgb(240, 20, 20)
</style>
