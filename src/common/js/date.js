/**
 * Created by shelley on 2017/2/12.
 */
/* 评价日期转换函数
*  @param date:number 日期时间戳
*  @param fmt:string 要转换的日期格式
*  return string 'yyyy-MM-dd hh:mm'的日期串
* */
export function formateDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)); // RegExp.$1表示第一个匹配项
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };

  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, padLeftZero(o[k]));
    }
  }
  return fmt;
};

/* 补0函数
*  @param num: number 日期
*  return string 例'09'，'12'
* */
function padLeftZero (num) {
  return ('00' + num).substr((num + '').length); // '009'：'09'，'0010'：'10'
}

