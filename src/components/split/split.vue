<template>
    <div class="split">
      <div class="top-line border-1px"></div>
      <div class="bottom-line border-1px"></div>
    </div>
</template>

<script type='text/ecmascript-6'>
    export default {
        name: 'split'
    };
</script>

<style lang='stylus' rel='stylesheet/stylus' type="text/stylus">
  @import '../../common/stylus/mixin.styl';
  .split
    width:100%
    height: 16px
    background: #f3f5f7
    position:relative
    .top-line
      border-1px(rgba(7,17,27,0.1))
    .bottom-line
      position:absolute
      bottom:0
      height:100%
      border-1px(rgba(7,17,27,0.1))
</style>
