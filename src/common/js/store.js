/**
 * Created by shelley on 2017/2/14.
 */
/**
 * localStorage的存api
 * @param id 是整个外面对象的key
 * @param key 存储对象的key
 * @param value 存储对象的值
 */
export function saveToLocal(id, key, value) {
  let seller = window.localStorage._seller_;
  if (!seller) { // 第一次没有seller时候
    seller = {};
    seller[id] = {};
  } else { // 存在seller
    seller = JSON.parse(seller);
    if (!seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = value;
  window.localStorage._seller_ = JSON.stringify(seller);
};

/*
 * localStorage取api
 * @param id 是整个外面对象的key
 * @param key 存储对象的key
 * @param def 是默认值，没取到的时候
 */
export function loadFromLocal(id, key, def) {
  let seller = window.localStorage._seller_;
  if (!seller) {
    return def;
  }
  seller = JSON.parse(seller); // 注意localStorage操作的是字符串，而我们js操作的是对象，要parse
  if (!seller[id]) {
    return def;
  }
  let ret = seller[id][key];
  return ret || def;
};
