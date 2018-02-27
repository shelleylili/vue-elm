/**
 * Created by shelley on 2017/2/14.
 */
/* 解析url
 * @example ?id=123&ab=gb
 * @returns {{id: number}}
 */
export function urlParse() {
  let search = window.location.search;
  let obj = {};
  let reg = /[?&][^?&/]+/g; // ["?id=123", "&ab=gb/"]
  let arr = search.match(reg);

  arr.forEach((item) => {
    let arrInner = item.substr(1).split('=');
    obj[arrInner[0]] = arrInner[1];
  });
  return obj;
};
