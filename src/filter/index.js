/**
 * Created by shelley on 2017/2/12.
 */
import Vue from 'vue';
import {formateDate} from '../common/js/date.js';

// 格式化评价日期的filter
// Vue.filter('formateDate', (time) => {
//   let date = new Date(time);
//   function toDouble (num) {
//     return num > 9 ? '' + num : '0' + num;
//   }
//   return date.getFullYear() + '-' + toDouble(date.getMonth() + 1) + '-' + toDouble(date.getDate()) + ' ' + toDouble(date.getHours()) + ':' + toDouble(date.getMinutes());
// });
Vue.filter('formateDate', (time) => {
  let date = new Date(time);
  return formateDate(date, 'yyyy-MM-dd hh:mm'); // 调用公共模块的js中的方法
});

// 可以多个filter
// Vue.filter('a', (a) => {
//   return 'a';
// });
