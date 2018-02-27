<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper" ref="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <i class="icon-shopcart">cart</i>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight':totalCount>0}">￥{{totalPrice}}</div>
        <div class="desc">
          另需配送费￥{{deliveryPrice}}元
        </div>
      </div>
      <div class="content-right" @click.stop.prevent="pay">
        <div class="pay" :class="payClass">
          {{payDesc}}
        </div>
      </div>
    </div>
    <div class="ball-container">
      <transition name="drop" v-for="ball in balls" @before-enter="beforeEnter" @enter="enter"
                  @after-enter="afterEnter">
        <div class="ball" v-show="ball.show">
          <div class="inner inner-hook"></div>
        </div>
      </transition>
    </div>
    <transition name="slide">
      <div class="list-shopcart" v-show="listShow">
        <div class="list-header">
          <span class="title">购物车</span>
          <span class="empty" @click="clearList">清空</span>
        </div>
        <div class="list-content" ref="list-scroll">
          <ul>
            <li class="list-item" v-for="food in selectFoods">
              <div class="name">{{food.name}}</div>
              <div class="price"><span class="f12">￥</span>{{food.price*food.count}}</div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script type='text/ecmascript-6'>
  import BScroll from 'better-scroll';
  import cartcontrol from '../cartcontrol/cartcontrol.vue';

  export default {
    props: {
      selectFoods: {  // 父级组件传过来的选中的食物数组
        type: Array,
        default() {  // vue中type是function或者array的 default默认都是函数
          return [];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        balls: [ // 定义多个是方便多次点击
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ], // 备用5个小球以防止连击的情况
        dropBalls: [], // 已经掉落的小球存放的数组
        fold: true   // 购物车列表是否折叠 默认折叠
      };
    },
    computed: {
      // 通过selectFoods数据计算出totalPrice totalCount等购物车需要的数据
      totalPrice() { // 购物车总价
        let totalPrice = 0;
        this.selectFoods.forEach((food) => {
          totalPrice += food.price * food.count;
        });
        return totalPrice;
      },
      totalCount() { // 购物车总个数
        let totalCount = 0;
        this.selectFoods.forEach((food) => {
          totalCount += food.count;
        });
        return totalCount;
      },
      payDesc() { // 结算描述信息的三个状态
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`;
        } else {
          return `去结算`;
        }
      },
      payClass() { // 去结算状态区分类名
        if (this.totalPrice >= this.minPrice) {
          return 'enough';
        } else {
          return 'not-enough';
        }
      },
      listShow() { // 购物车列表显示与否的计算函数
        if (!this.totalCount) { // 如果购物车为空
          this.fold = true; // 折叠
          return false; // 不显示
        }
        let show = !this.fold; // 不为空
        // 当购物车列表显示的时候设置滚动,并且有dom的toggle所以要放到this.$nextTick里面
        if (!this.scroll) {
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs['list-scroll'], {
              click: true
            });
          });
        } else {
            this.scroll.refresh(); // 如果存在就刷新
        }
        return show; // 显示
      }
    },
    methods: {
      drop(el) { // 触发动画设置ball.show的值
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true; // 让该小球显示
            ball.el = el;  // 标记该小球的元素是el
            this.dropBalls.push(ball); // 把这个小球放到已下落的数组里
            this.scale = false;
            return; // 跳出循环
          }
        }
      },
      beforeEnter(el) { // el是小球ball元素
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.children[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d{${x}px,0,0)`;
          }
        }
        console.log(this.dropBalls);
      },
      enter(el, done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;  // 触发重新绘制
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        });
        done();
      },
      afterEnter(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          setTimeout(() => { // 防止动画没有执行完
            el.style.display = 'none';
          }, 500);
        }
        let logoWrapper = this.$refs['logo-wrapper'];
        logoWrapper.style.webkitAnimation = 'scaleToggle 1s';
        logoWrapper.style.animation = 'scaleToggle 1s';
      },
      toggleList() { // 购物车折叠切换
        this.fold = !this.fold; // 让折叠切换
        return this.fold;
      },
      clearList() { // 清空购物车（已选择的商品）
          this.selectFoods.forEach((food) => {
              food.count = 0;
          });
      },
      hideList() { // 隐藏购物车列表
          this.fold = true;
      },
      pay() { // 支付函数
          if (this.totalPrice < this.minPrice) {
              return;
          }
          window.alert(`需要支付${this.totalPrice}元`);
      }
    },
    components: {
      cartcontrol  // 商品添加减少到购物车的控制按钮组件
    }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus' type="text/stylus">
  @import '../../common/stylus/mixin.styl';

  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index:50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      .content-left
        flex: 1
        font-size: 0
        .logo-wrapper
          display: inline-block
          position: relative
          top: -6px
          width: 55px
          height: 55px
          padding: 6px
          margin: auto 12px
          vertical-align: top
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          transition: all .4s
          .logo
            width: 44px
            height: 44px
            line-height: 44px
            text-align: center
            border-radius: 50%
            background: rgba(255, 255, 255, 0.4)
            &.highlight
              background: rgb(0, 160, 220)
              .icon-shopcart
                color: #ffffff
            .icon-shopcart
              font-size: 16px
              color: rgba(255, 255, 255, 0.2)
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            border-radius: 8px
            background: rgb(240, 20, 20)
            box-shadow: 0px 4px 8px 0 rgba(0, 0, 0, .2)
            color: #ffffff
            font-size: 9px
            text-align: center
          transition: all .4s ease-in-out
        .price
          display: inline-block
          box-sizing: border-box
          padding-right: 12px
          border-right: 1px solid rgba(255, 255, 255, 0.4)
          color: rgba(255, 255, 255, 0.4)
          font-size: 16px
          font-weight: 700
          line-height: 24px
          vertical-align: top
          margin-top: 12px
          &.highlight
            color: #ffffff
        .desc
          display: inline-block
          padding: 0 12px
          font-size: 12px
          line-height: 24px
          color: rgba(255, 255, 255, 0.4)
          vertical-align: top
          margin-top: 12px
      .content-right
        flex: 0 0 105px
        .pay
          font-size: 16px
          line-height: 50px
          text-align: center
          color: rgba(255, 255, 255, 0.4)
          &.not-enough
            background: rgba(255, 255, 255, 0.2)
          &.enough
            background: #00b43c
            color: #ffffff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        transition: all .4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          position: absolute
          width: 16px
          height: 16px
          background: #00a0dc
          border-radius: 50%
          transition: all .4s linear
    .slide-enter-active, .slide-leave-active
      transition: all .4s linear
    .slide-enter, .slide-leave-active
      transition: all .4s linear
      transform: translate3d(0, 100%, 0)
    .list-shopcart
      position: absolute;
      left: 0
      bottom: 48px
      width: 100%
      z-index: -1
      .list-header
        height: 40px
        background: #f3f5f7
        border-1px(rgba(7, 17, 27, 0.1))
        .title
          float: left
          font-size: 14px
          line-height: 40px
          color: rgb(7, 17, 27)
          padding-left: 18px
        .empty
          float: right
          font-size: 14px
          line-height: 40px
          color: rgb(0, 160, 220)
          padding-right: 18px
      .list-content
        max-height: 217px
        padding: 0 18px
        background: #ffffff
        .list-item
          position: relative
          border-1px(rgba(7,17,27,0.1))
          padding:12px 0
          .name
            font-size: 14px
            line-height:14px
            color:rgb(7,17,27)
          .price
            position:absolute
            right: 90px
            bottom:2px
            font-size: 24px
            line-height:24px
            font-weight: 700
            color:rgb(240,20,20)

            .f12
              font-size:12px
          .cartcontrol-wrapper
            position:absolute
            right:0
            bottom:6px
    .fade-enter-active,.fade-leave-active
      opacity:1
      transition:all .4s
    .fade-enter,.fade-leave-active
      opacity:0
      transition:all .4s
    .list-mask
      position:fixed
      left:0
      top:0
      z-index:-2
      width:100%
      height:100%
      background:rgba(7,12,27,0.6)
  @keyframes scaleToggle
    0%
      transform: scale(0.8)
    25%
      transform: scale(1.2)
    50%
      transform: scale(1)
    75%
      transform: scale(1.2)
    100%
      transform: scale(1)

</style>
