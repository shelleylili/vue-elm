<template>
  <div class="ratings" ref="rating-scroll">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <div class="score">{{seller.score}}</div>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务评价</span>
            <star :size="36" :score="seller.score" class="star"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评价</span>
            <star :size="36" :score="seller.score" class="star"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :ratings="ratings" :selectType="selectType" :desc="desc"
                    :onlyContent="onlyContent"></ratingselect>
      <div class="ratings-wrapper">
        <ul>
          <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in ratings" class="rating-item">
            <div class="avatar-wrapper">
              <img :src="rating.avatar" width="28" height="28" class="avatar"/>
            </div>
            <div class="content">
              <div class="name">{{rating.username}}</div>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score" class="star"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon">赞</span>
                <span class="recommend-item" v-for="text in rating.recommend">{{text}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formateDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  import BScroll from 'better-scroll';
  import star from '../star/star.vue';
  import split from '../split/split.vue';
  import ratingselect from '../ratingselect/ratingselect.vue';

  const ALL = 2;
  const ERR_OK = 0;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      };
    },
    created() {
        console.log('rating-created', this.$refs['rating-scroll']);
      this.$http.get('/api/ratings').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.ratings = response.data;
          this.$nextTick(() => {
            this._initScroll();
          });
        }
    });

      this.$root.eventHub.$on('ratings.select', (type) => {
        this.selectType = type; // 把子组件传递过来的type值付给父组件的data的selectType属性，驱动dom
        this.$nextTick(() => {
//          this.scroll.refresh(); // 让better-scroll的实例刷新从新计算滚动条高度，在dom更新之后
//          console.log('rating:', 111);
//          this._initScroll();
        });
      });
      this.$root.eventHub.$on('content.toggle', (onlyContent) => {
        this.onlyContent = onlyContent;// 把子组件传递过来的onlyContent值付给父组件的data的onlyContent属性，驱动dom
        this.$nextTick(() => {
//          this.scroll.refresh();
//          console.log('rating', 222);
//          this._initScroll();
        });
      });
    },
    methods: {
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
      _initScroll() { // 初始化滚动
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs['rating-scroll'], {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      }
    },
    components: {
      star,
      split,
      ratingselect
    }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus' type="text/stylus">
  .ratings
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .ratings-content
      .overview
        display: flex
        padding: 18px 0
      .overview-left
        flex: 0 0 136px
        border-right: 1px solid rgba(7.17 .27 .0 .1)
        text-align: center
        padding: 2px 0 6px 0
        @media only screen and (max-width: 320px)
          flex: 0 0 120px
        .score
          font-size: 24px
          line-height: 28px
          color: rgb(255, 153, 0)
          padding-bottom: 2px
        .title
          margin-bottom: 8px
          font-size: 12px
          line-height: 12px
          color: rgb(7, 17, 27)
        .rank
          font-size: 10px
          line-height: 10px
          color: rgb(147, 153, 159)
      .overview-right
        flex: 1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .score-wrapper
          font-size: 0
          margin-bottom: 8px
          .title
            display: inline-block
            vertical-align: top
            margin-right: 12px
            font-size: 12px
            line-height: 18px
            color: rgb(7, 17, 27)
          .star
            display: inline-block
            vertical-align: top
          .score
            display: inline-block
            vertical-align: top
            margin-left: 12px
            font-size: 12px
            line-height: 18px
            color: rgb(255, 153, 0)
        .delivery-wrapper
          font-size: 0
          .title
            margin-right: 12px
            font-size: 12px
            line-height: 18px
            color: rgb(7, 17, 27)
          .time
            font-size: 12px
            line-height: 18px
            color: rgb(147, 153, 159)
    .ratings-wrapper
      .rating-item
        display: flex
        padding: 18px 0
        margin: auto 18px
        .avatar-wrapper
          flex: 0 0 28px
          margin-right: 12px
          .avatar
            border-radius: 50%;
        .content
          flex: 1
          position: relative
          .name
            margin-bottom: 4px
            font-size: 10px
            line-height: 12px
          .star-wrapper
            font-size: 0
            .star
              display: inline-block
              vertical-align: top
              margin: auto 6px 6px auto
            .delivery
              display: inline-block
              vertical-align: top
              font-size: 10px
              line-height: 12px
              color: rgb(147, 153, 159)

          .text
            margin-bottom: 5px
            font-size: 12px
            line-height: 18px
            color: rgb(7, 17, 27)
          .recommend
            font-size: 0
            line-height: 16px
            .icon
              font-size: 12px
              margin-right: 8px
              color: rgb(0, 160, 220)
            .recommend-item
              padding: 0 6px
              margin: 0 8px 4px 0
              font-size: 9px
              border-radius: 4px
              color: rgb(147, 153, 159)
              border: 1px solid rgba(7, 17, 27, 0.1)
          .time
            position: absolute
            right: 0
            top: 0
            font-size: 10px
            line-height: 12px
            color: rgb(147, 153, 159)

</style>
