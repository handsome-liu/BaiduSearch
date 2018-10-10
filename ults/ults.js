/**
 * 图片等比例缩放到指定宽度 
 */
function zoom(img, tarWidth = 100) {

  return {

    // 缩放后的宽度
    width: tarWidth,

    // 缩放后的高度
    height: tarWidth / img.width * img.height

  }

}

/**
 * 打包url
 * word 搜索的关键字
 * pn 从第几条数据开始获取
 * rn 一次取几条
 */
function codeUrl(url, word, pn, rn) {

  // 返回数据完成的请求url
  return `${url}&word=${word}&pn=${(pn - 1) * rn}&rn=${rn}`;

}


/**
 * 解码高清图片url
 */
function imgUrlEncode(imgUrl) {

  // 解码正则对照表
  const encryption = {
    'w': 'a',
    'k': 'b',
    'v': 'c',
    '1': 'd',
    'j': 'e',
    'u': 'f',
    '2': 'g',
    'i': 'h',
    't': 'i',
    '3': 'j',
    'h': 'k',
    's': 'l',
    '4': 'm',
    'g': 'n',
    '5': 'o',
    'r': 'p',
    'q': 'q',
    '6': 'r',
    'f': 's',
    'p': 't',
    '7': 'u',
    'e': 'v',
    'o': 'w',
    '8': '1',
    'd': '2',
    'n': '3',
    '9': '4',
    'c': '5',
    'm': '6',
    '0': '7',
    'b': '8',
    'l': '9',
    'a': '0',
    // 转义斜杆,留个斜杆给正则转义
    '_z2C\\$q': ':',
    '_z&e3B': '.',
    'AzdH3F': '/'
  };

  // 获取需要匹配的内容
  const enKey = Object.keys(encryption);

  // 转换成正则表达式 _z2C\$q
  const reg = new RegExp(enKey.join('|') + '|.', 'g'); //

  // 匹配到的值, 存储转码后的正确路径
  let result, code = [];

  while (result = reg.exec(imgUrl)) {

    // 判断 _z2C\$q
    if (result[0] === '_z2C$q') {

      // 修改成转义前的,为了取正则对照表的值
      result[0] = '_z2C\\$q';

    }

    code.push(encryption[result] || result[0]);

  }

  return code.join('');

}

export {
  zoom,
  codeUrl,
  imgUrlEncode
};