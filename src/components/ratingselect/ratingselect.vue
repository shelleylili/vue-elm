<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span
        class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span
        class="count">{{positives.length}}</span></span>
      <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span
        class="count">{{negatives.length}}</span></span>
    </div>
    <div class="switch" :class="{'on':onlyContent}">
      <span @click="toggleContent(onlyContent,$event)" class="icon">{{onlyContent}}</span>
      <span class="text">只看有内容的评论</span>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props: {
      ratings: { //  评论的所有数据
        type: Array,
        default() {
          return [];
        }
      },
      selectType: { // 选中那个类型
        type: Number,
        default: ALL
      },
      onlyContent: { // 是否只显示有内容的评价
        type: Boolean,
        default: false
      },
      desc: { // 类型描述文字
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      }
    },
    computed: {
      positives() {
          return this.ratings.filter((rating) => { // 计算好评的个数,根据rating.rateType(0：赞,1：low)
              return rating.rateType === POSITIVE;
          });
      },
      negatives() {
          return this.ratings.filter((rating) => { // 计算差评的个数
              return rating.rateType === NEGATIVE;
          });
      }
    },
    methods: {
      select(type, event) { // 选择哪种类型
        if (!event._constructed) {
          return;
        }
//        this.selectType = type; // 选择类型子组件重写从父组件获取的值
        this.$root.eventHub.$emit('ratings.select', type); // 因为this.selectType是基础类型数据，所以要告知父组件该数据在子组件发生变化了，要派发事件
      },
      toggleContent(onlyContent, event) { // 切换是否只看有内容的评论
        if (!event._constructed) {
          return;
        }
//        this.onlyContent = !this.onlyContent; // 切换是否只看有内容的评论标记
        this.$root.eventHub.$emit('content.toggle', !onlyContent); // 传过去自己的反
      }
    }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus' type="text/stylus">
  @import "../../common/stylus/mixin.styl"

  .ratingselect
    .rating-type
      margin: auto 18px
      padding: 18px 0
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 0
      .block
        display: inline-block
        padding: 8px 12px
        margin-right: 8px
        border-radius: 2px
        color: rgb(77, 85, 93)
        font-size: 12px
        &.active
          color: #ffffff
        .count
          font-size: 8px
          margin-left: 2px
        &.positive
          background: rgba(0, 160, 220, 0.2)
          &.active
            background: rgb(0, 160, 220)
        &.negative
          background: rgba(77, 85, 93, 0.2)
          &.active
            background: rgb(77, 85, 93)
    .switch
      padding: 12px 16px
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      color: rgb(147, 153, 159)
      line-height: 24px
      font-size: 0
      &.on
        color: rgb(0, 160, 220)
      .icon
        display: inline-block
        font-size: 24px
        margin-right: 4px
      .text
        font-size: 12px
        display: inline-block

</style>
