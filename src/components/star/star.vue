<template>
  <div class="star" :class="starType">
    <span class="star-item" v-for="itemClass in itemClasses" :class="itemClass"></span>
  </div>
</template>

<script type='text/ecmascript-6'>

  const LENGTH = 5; // 默认设置五颗星
  const CLS_ON = 'on'; // 全星
  const CLS_OFF = 'off'; // 无星
  const CLS_HALF = 'half'; // 半颗星

  export default {
    props: {
      size: {
        type: Number
      },
      score: {
          type: Number
      }
    },
    computed: {
      starType() { // 计算星星是48 36 24的然后设置类名
          return 'star-' + this.size;
      },
      itemClasses() { // 计算星星的on half off
          let result = [];
          let score = Math.floor(this.score * 2) / 2; // 向下取整技巧
          let hasDecimal = score % 1 !== 0; // 是否有小数
          let integer = Math.floor(score); // 整数部分

          for (let i = 0; i < integer; i++) {
              result.push(CLS_ON);
          }
          if (hasDecimal) {
              result.push(CLS_HALF);
          }
          while (result.length < LENGTH) {
              result.push(CLS_OFF);
          }
          return result;
      }
    }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus' type="text/stylus">
  @import '../../common/stylus/mixin.styl';
  .star
    font-size:0
    .star-item
      display:inline-block
      &:last-child
        margin-right:0!important
    &.star-48
      .star-item
        width:20px
        height:20px
        background-repeat:no-repeat
        background-size:20px 20px
        margin-right:22px
        &.on
          bg-image(star48_on)
        &.half
          bg-image(star48_half)
        &.off
          bg-image(star48_off)
    &.star-36
      .star-item
        width:15px
        height:15px
        background-repeat:no-repeat
        background-size:15px 15px
        margin-right:6px
        &.on
          bg-image(star36_on)
        &.half
          bg-image(star36_half)
        &.off
          bg-image(star36_off)
    &.star-24
      .star-item
        width:10px
        height:10px
        background-repeat:no-repeat
        background-size:10px 10px
        margin-right:7px
        &.on
          bg-image(star24_on)
        &.half
          bg-image(star24_half)
        &.off
          bg-image(star24_off)
</style>
