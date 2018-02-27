<template>
  <span class="v-icon" :class="classMap[type]" v-show="type>0"></span>
</template>

<script type='text/ecmascript-6'>
    export default {
        props: {
          type: {
              type: Number
          }
        },
        created() {
          this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        }
    };
</script>

<style lang='stylus' rel='stylesheet/stylus'  type="text/stylus">
  @import '../../common/stylus/mixin.styl';

  .v-icon
    display: inline-block
    width: 16px
    height: 16px
    background-size: 16px 16px
    background-repeat: no-repeat
    vertical-align: top
    &.decrease
      bg-image(decrease_3)
    &.discount
      bg-image(discount_3)
    &.special
      bg-image(special_3)
    &.invoice
      bg-image(invoice_3)
    &.guarantee
      bg-image(guarantee_3)
</style>
