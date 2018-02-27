<template>
  <div class="seller" ref="seller-scroll">
    <div class="seller-content">
      <div class="overview">
        <div class="title">{{seller.name}}</div>
        <div class="desc">
          <star :size="36" :score="seller.score" class="star"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block border-1px">
            <div class="title">起送价</div>
            <div class="text">
              <span class="price">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <div class="title">商家配送</div>
            <div class="text">
              <span class="price">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <div class="title">平均配送时间</div>
            <div class="text">
              <span class="price">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite">
          <span class="icon" :class="{'active':favorite}" v-show="favorite" @click="toggleFavorite">do</span>
          <span class="icon" :class="{'active':favorite}" v-show="!favorite" @click="toggleFavorite">undo</span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h2 class="title">商品公告</h2>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
      </div>
      <ul v-if="seller.supports" class="supports">
        <li v-for="item in seller.supports" class="support-item border-1px">
          <span class="icon" :class="classMap[item.type]"></span>
          <span class="text">{{item.description}}</span>
        </li>
      </ul>
      <split></split>
      <div class="pics">
        <h2 class="title">商家实景</h2>
        <div class="pic-wrapper" ref="pic-scroll">
          <ul class="pics-list" ref="pics-list">
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" width="120" height="90"/>
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <div class="title border-1px">商家信息</div>
        <ul>
          <li v-for="info in seller.infos" class="info-item">
            {{info}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  import {saveToLocal, loadFromLocal} from '../../common/js/store';
  import BScroll from 'better-scroll';
  import star from '../star/star.vue';
  import split from '../split/split.vue';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        favorite: (() => {
            console.log(loadFromLocal(this.seller.id, 'favorite', false));
            return loadFromLocal(this.seller.id, 'favorite', false);
        })()
      };
    },
    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏';
      }
    },
    created() {
      console.log('seller-created', this.$refs['seller-scroll']);
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      this.$nextTick(() => {
        this._initScroll();
        this._calculateWidth();
      });
    },
    watch: { // 监控某个数据属性
      'seller'() {
        console.log('watchseller', this.seller);
        this.$nextTick(() => {
          this._initScroll();
        });
        this._calculateWidth();
      }
    },
    methods: {
      _initScroll() { // 初始化滚动
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs['seller-scroll'], {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      },
      _calculateWidth() { // 计算ul的宽度值，为了better-scroll滚动
        if (this.seller.pics) { // 当seller.pics有值的时候
          let imgWidth = 120;
          let margin = 6;
          let ulWidth = (imgWidth + margin) * this.seller.pics.length - 6;
          this.$refs['pics-list'].style.width = ulWidth + 'px';
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$refs['pic-scroll'], {
                scrollX: true
              });
            } else {
              this.picScroll.refresh();
            }
          });
        }
      },
      toggleFavorite(event) {
        if (!event._constructed) {
            return;
        }
        this.favorite = !this.favorite;
        saveToLocal(this.seller.id, 'favorite', this.favorite);
      }
    },
    components: {
      star,
      split
    }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus' type="text/stylus">
  @import '../../common/stylus/mixin.styl';

  .seller
    position: absolute
    top: 174px
    bottom: 0
    width: 100%
    overflow: hidden
    .seller-content
      .overview
        position: relative
        padding: 18px 18px 0 18px
        .title
          fonts-size: 14px
          line-height: 14px
          color: rgb(7, 17, 27)
        .desc
          padding: 8px 0 18px 0
          font-size: 0
          border-1px(rgba(7, 17, 27, 0.1))
          .star
            display: inline-block
            vertical-align: top
            margin-right: 8px
          .text
            display: inline-block
            vertical-align: top
            margin-right: 12px
            font-size: 10px
            line-height: 16px
            color: rgb(77, 85, 93)
        .remark
          display: flex
          .block
            flex: 1
            margin: 18px auto
            border-right: 1px solid rgba(7, 17, 27, 0.1)
            text-align: center
            &:last-child
              border: none
            .title
              margin-bottom: 4px
              font-size: 10px
              line-height: 10px
              color: rgb(147, 153, 159)
            .text
              font-size: 10px
              color: rgb(7, 17, 27)
              .price
                font-size: 24px
                line-height: 24px
        .favorite
          position: absolute
          right: 11px
          top: 18px
          width: 50px
          text-align: center
          .icon
            display: block
            font-size: 12px
            line-height: 24px
            color: rgb(147, 153, 159)
            &.active
              color: rgb(220, 20, 20)
          .text
            font-size: 12px
            line-height: 24px
            color: rgb(147, 153, 159)
      .bulletin
        padding: 18px 18px 0 18px
        .title
          margin-bottom: 8px
          fonts-size: 14px
          line-height: 14px
          color: rgb(7, 17, 27)
          font-weight: 700
        .content-wrapper
          padding: 0 12px 16px
          border-1px(rgba(7, 17, 27, 0.1))
          .content
            font-size: 12px
            line-height: 24px
            color: rgb(240, 20, 20)
      .supports
        padding: 0 18px
        .support-item
          padding: 16px 12px
          font-size: 12px
          line-height: 16px
          color: rgb(7, 17, 27)
          border-1px(rgba(7, 17, 27, 0.1))
          &:last-child
            border-none()
          .icon
            display: inline-block
            width: 16px
            height: 16px
            background-size: 16px 16px
            background-repeat: no-repeat
            vertical-align: top
            &.decrease
              bg-image(decrease_4)
            &.discount
              bg-image(discount_4)
            &.special
              bg-image(special_4)
            &.invoice
              bg-image(invoice_4)
            &.guarantee
              bg-image(guarantee_4)
      .pics
        padding: 18px 0 18px 18px
        .title
          margin-bottom: 12px
          fonts-size: 14px
          line-height: 14px
          font-weight: 700
          color: rgb(7, 17, 27)
        .pic-wrapper
          width: 100%
          white-space: nowrap
          overflow: hidden

          .pics-list
            font-size: 0
            .pic-item
              display: inline-block
              margin-right: 6px
      .info
        padding: 18px 18px 0 18px
        color: rgb(7, 17, 27)
        .title
          padding-bottom: 12px
          fonts-size: 14px
          line-height: 14px
          font-weight: 700
          border-1px(rgba(7, 17, 27, 0.1))
        .info-item
          padding: 16px 12px
          line-height: 16px
          font-size: 12px
          border-1px(rgba(7, 17, 27, 0.1))
          &:last-child
            border-none()
</style>
