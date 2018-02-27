<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menu-scroll"><!--左侧菜单栏-->
        <ul class="menu"><!--7.加入current类当滚动到的区间索引匹配菜单索引的时候-->
          <li class="menu-item border-1px" v-for="(item,index) in goods" :class="{'current':currentIndex === index}"
              @click="selectMenu(index,$event)"
          >
            <span class="text">
              <icon :type="item.type"></icon>{{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foods-scroll"><!--右侧食物栏-->
        <ul>
          <li class="food-list food-list-hook" v-for="item in goods">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li @click="selectFood(food,$event)" class="foods-item border-1px" v-for="food in item.foods">
                <div class="icon">
                  <img :src="food.icon" width="57" height="57"/>
                </div>
                <div class="content">
                  <h1 class="name">{{food.name}}</h1>
                  <div class="desc" v-show="food.description">{{food.description}}</div>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span class="rating">好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart ref="shopcart" :selectFoods="selectFoods" :minPrice="seller.minPrice"
                :deliveryPrice="seller.deliveryPrice"></shopcart>
    </div>
    <food :food="selectedFood" ref="food"></food><!--选中的商品传到商品组件 ref引用组件实例或属性-->
  </div>
</template>

<script type='text/ecmascript-6'>
  import icon from '../icon/icon.vue'; // 左边的icon图标组件
  import BScroll from 'better-scroll';
  import shopcart from '../shopcart/shopcart.vue';
  import cartcontrol from '../cartcontrol/cartcontrol.vue';
  import food from '../food/food.vue';

  const ERR_OK = 0;
  export default {
    props: {
      seller: {  // 或许要用到
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [], // 2.存放所有区间的高度clientHeight
        scrollY: 0,     // 3.存放滚动条的位置值（通过better-scroll的参数属性获取）
        selectedFood: {}
      };
    },
    created() {
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          this.$nextTick(() => { // 等到最后一次dom更新后延迟加载滚动better-scroll
            this._initScroll();
            this._calculateHeight(); // 计算所有的元素区间高度
          });
        }
      });
      this.$nextTick(() => {
        this.$root.eventHub.$on('cart.add', (target) => { // 父组件绑定监听事件cart.add获取到子组件触发事件传过来的target
          this._drop(target); // 调用自己的方法把target元素传递到自己的另一个子组件中
        });
      });
    },
    methods: {
      _initScroll() {
        if (!this.menuScroll) {
          this.menuScroll = new BScroll(this.$refs['menu-scroll'], {
            click: true // a.手动派发事件
          });
        } else {
            this.menuScroll.refresh();
        }
        if (!this.foodsScroll) {
          this.foodsScroll = new BScroll(this.$refs['foods-scroll'], {// @param (dom,options)
            click: true,
            probeType: 3  // 4.实时监控滚动条位置
          });
        } else {
            this.foodsScroll.refresh();
        }

        // 5.实时监控后触发滚动事件返回一个pos的位置值
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight() {
        // 1,获取dom元素
        let list = this.$refs['foods-scroll'].getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height); // 放入第一个元素的高度
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          height += item.clientHeight; // 每一区间的高度
          this.listHeight.push(height);
        }
      },
      selectMenu(index, event) { // b.点击事件处理函数
        // 阻止pc端默认click事件，防止之后的手动派发事件一起执行两次
        if (!event._constructed) {
          return;
        }
        let el = this.$refs['foods-scroll'].getElementsByClassName('food-list-hook')[index];
        this.foodsScroll.scrollToElement(el, 300); //
      },
      _drop(target) {
        // 优化体验，手机上会卡顿，让这个动画晚一点执行
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);// 父组件调用子组件（shopcart）的方法
        });
      },
      selectFood(food, event) { // 点击具体某个商品实物
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show(); // 显示food子组件
      }
    },
    computed: {
      // 6.计算当前滚动到的区间的索引值
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => { // 检测goods的food变化
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    components: {
      icon,
      shopcart, // 购物车组件
      cartcontrol, // 加减按钮组件
      food
    }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus'  type="text/stylus">
  @import '../../common/stylus/mixin.styl';
  .goods
    display: flex
    position: absolute // 充满剩余空间
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px // hack部分android机型
      background: #f3f5f7
      .menu-item
        display: table
        width: 56px
        height: 54px
        padding: 0 12px
        &.current
          position: relative
          margin-top: -1px
          background: #ffffff
          .text
            border-none()
            font-weight: 700
        .text
          display: table-cell
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
          line-height: 14px
          text-align: center
          color: rgb(77, 85, 93)
    .foods-wrapper
      flex: 1
      .title
        height: 26px
        line-height: 26px
        padding-left: 14px
        font-size: 12px
        color: rgb(147, 153, 159)
        border-left: 2px solid #d9dde1
        background: #f3f5f7

      .foods-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          width: 57px
          margin-right: 10px
        .content
          position: relative
          flex: 1
          .name
            font-size: 14px
            line-height: 14px
            color: rgb(7, 17, 27)
            margin: 2px 0 8px 0
          .desc, .extra
            font-size: 10px
            color: rgb(147, 153, 159)
            padding-bottom: 8px
          .desc
            line-height: 13px
          .extra
            font-size: 0
            .count
              margin-right: 12px
              font-size: 10px
            .rating
              font-size: 10px
          .price
            line-height: 14px
            font-size: 0
            .now
              font-size: 14px
              font-weight: 700
              color: rgb(240, 20, 20)
              margin-right: 8px
            .old
              font-size: 10px
              color: rgb(147, 153, 159)
              text-decoration: line-through

          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
