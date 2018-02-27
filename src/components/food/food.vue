<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food-scroll">
      <div class="food-content">
        <div class="food-header">
          <img :src="food.image"/>
          <div class="back" @click="hide">back</div>
        </div>
        <div class="content">
          <div class="title">
            <div class="name">{{food.name}}</div>
            <div class="desc">
              <span class="count">月售{{food.sellCount}}份</span>
              <span class="rating">好评率{{food.rating}}%</span>
            </div>
            <div class="price">
              <span class="now"><span class="f12">￥</span>{{food.price}}</span>
              <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontorl :food="food"></cartcontorl>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count || food.count===0" @click.stop.prevent="addFirst">加入购物车</div>
          </transition>
        </div>
        <split></split>
        <div class="intro">
          <h1 class="title">商品介绍</h1>
          <p class="info">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect :ratings="food.ratings" :selectType="selectType" :desc="desc"
                        :onlyContent="onlyContent"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings"
                  class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" class="avatar" width="12" height="12"/>
                </div>
                <div class="time">{{rating.rateTime | formateDate}}</div>
                <div class="content">
                  <span class="icon" v-show="rating.rateType">low</span>
                  <span class="icon highlight" v-show="!rating.rateType">赞</span>
                  <span class="text">{{rating.text}}</span>
                </div>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评论</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type='text/ecmascript-6'>
  import BScroll from 'better-scroll';
  import Vue from 'vue';
  import cartcontorl from '../cartcontrol/cartcontrol.vue';
  import split from '../split/split.vue';
  import ratingselect from '../ratingselect/ratingselect.vue';

  const ALL = 2;

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false, // food组件是否显示
        selectType: 1, // 显示的类型
        onlyContent: true, // 只显示有内容的评论
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    created() {
      console.log('food-created', this.$refs['food-scroll']);
      this.$root.eventHub.$on('ratings.select', (type) => {
        this.selectType = type; // 把子组件传递过来的type值付给父组件的data的selectType属性，驱动dom
        this.$nextTick(() => {
          this._initScroll();// 让better-scroll的实例刷新从新计算滚动条高度，在dom更新之后
        });
      });
      this.$root.eventHub.$on('content.toggle', (onlyContent) => {
        this.onlyContent = onlyContent;// 把子组件传递过来的onlyContent值付给父组件的data的onlyContent属性，驱动dom
        this.$nextTick(() => {
          this._initScroll();
        });
      });
    },
    methods: {
      show() { // 外部调用的显示food组件的方法
        this.showFlag = true;
        this.selectType = ALL;  // 每个food的显示的时候的默认选择类型不一定一样
        this.onlyContent = true; // 是否只看有内容的品论也是
        this.$nextTick(() => {
          this._initScroll();
        });
      },
      hide() {
        this.showFlag = false;
      },
      addFirst(event) { // 第一次添加到购物车（如果该food还没有添加到购物车）
        if (!event._constructed) {
          return;
        }
        this.$nextTick(() => {
          this.$root.eventHub.$emit('cart.add', event.target); // 驱动动画
          console.log(this.$root.eventHub);
          Vue.set(this.food, 'count', 1);
        });
      },
      needShow(type, text) { // 结合选择类型和是否显示只有内容的评论标记判断该显示的评论内容
        if (this.onlyContent && !text) { // 如果只显示内容 并且 该记录没有文本 返回false不显示
          return false;
        }
        if (this.selectType === ALL) { // 全选
          return true;
        } else { // type : 0 / 1,  this.selectType: 0 / 1
          return type === this.selectType;
        }
      },
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs['food-scroll'], {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      }
    },
    components: {
      cartcontorl,
      split,
      ratingselect
    }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus' type="text/stylus">
  @import '../../common/stylus/mixin.styl';

  .move-enter-active, .move-leave-active
    transition: all .4s
    transform: translate3d(0, 0, 0)

  .move-enter, .move-leave-active
    transition: all .4s
    transform: translate3d(100%, 0, 0)

  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: #ffffff
    .food-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        left: 12px
        top: 12px
        font-size: 24px
        font-weight: 24px
        color: #ffffff
    .content
      position: relative
      .title
        padding: 18px
        .name
          margin-bottom: 8px
          font-size: 14px
          line-height: 14px
          color: rgb(7, 17, 27)
          font-weight: 700
        .desc
          font-size: 0
          margin-bottom: 18px
          .count, .rating
            font-size: 10px
            line-height: 10px
            color: rgb(147, 153, 159)
          .count
            margin-right: 12px
        .price
          line-height: 14px
          font-size: 0
          .now
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
            margin-right: 8px
            .f12
              font-size: 12px
          .old
            font-size: 10px
            color: rgb(147, 153, 159)
            text-decoration: line-through
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 18px
      .fade-enter-active, .fade-leave-active
        transition: all .4s
        opacity: 1
      .fade-enter, .fade-leave-active
        transition: all .4s
        opacity: 0
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        padding: 12px
        font-size: 12px
        line-height 12px
        color: #ffffff
        background: rgb(0, 160, 220)
        text-align: center
        border-radius: 36px
    .intro
      padding: 18px
      .title
        margin-bottom: 6px
        font-size: 14px
        line-height 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .info
        padding: 0 8px
        line-height: 24px
        font-size: 12px
        color: rgb(77, 85, 93)
    .rating
      padding-top: 18px
      .title
        margin-left: 18px
        font-size: 14px
        line-height: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
    .rating-wrapper
      padding: 0 18px
      .rating-item
        position: relative
        padding: 16px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .user
          position: absolute
          right: 0
          top: 16px
          font-size: 0
          .name
            margin-right: 6px
            font-size: 10px
            line-height: 12px
            color: rgb(143, 157, 159)
          .avatar
            border-radius: 50%
            vertical-align: top
        .time
          margin-bottom: 6px
          font-size: 10px
          line-height: 12px
          color: rgb(147, 153, 159)
        .content
          font-size: 0
          .icon
            margin-right: 4px
            font-size: 12px
            line-height: 16px
            color: rgb(147, 153, 159)
            &.highlight
              color: rgb(0, 160, 220)
          .text
            font-size: 12px
            line-height: 16px
            color: rgb(7, 17, 27)
      .no-rating
        font-size: 12px
        line-height: 12px
        color:rgb(147,153,159)
        padding:12px 0
</style>
