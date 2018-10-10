// pages/home/photoShow/photoShow.js

// 引入功能函数
const ults = require('../../../ults/ults.js');
// console.log(ults.imgUrlEncode()  )
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 百度图片请求API
    url: 'https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj',

    // 搜索的内容
    word: '',

    // 加载第几页
    page: 1,

    // 每页加载的数量
    row: 30,

    // 按多少列显示
    list: 3,

    // 存放图片的img对象
    imgs: [],

    // 存放图片高度的对像
    height: [],

    // 初始获取的数据
    current: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 创建数据容器
    this.createContainer();

    // 保存搜索的关键字
    this.data.word = options.word;

    // 异步请求页面
    this.showPage();

    // 动态设置搜索标题
    this.setSearchTiele();

  },

  /**
   * 动态设置搜索标题
   */
  setSearchTiele() {

    wx.setNavigationBarTitle({

      title: this.data.word

    });

  },

  /**
   * 创建数据容器imgs和height
   */
  createContainer() {

    // 根据列数 创建多少组数据, 并填充0
    this.data.height = new Array(this.data.list).fill(0);

    // 用map遍历imgs中填充的数组(同一个地址),并返回修改后的数组(不同地址) 
    this.data.imgs = new Array(this.data.list).fill([]).map(() => []);

  },

  /**
   * 点击缩略图全屏显示大图
   */
  showImage(e) {

    // 全屏显示
    wx.previewImage({

      // 目标image标签上绑定的属于自己的middleURL
      current: e.currentTarget.dataset.src,

      // 所有图片的middleURL地址数组
      urls: this.data.current.map(item => item.middleURL)

    });

  },


  /**
   * 下载图片时间
   */
  download(e) {

    // 获取目标节点data-src的值
    const src = e.currentTarget.dataset.src;

    // 下载文件API
    wx.downloadFile({

      // 文件路径
      // url: this.data.url,
      url: e.currentTarget.dataset.src,

      // 请求成功
      success(res) {
        
        wx.saveImageToPhotosAlbum({

          //  下载文件
          filePath: res.tempFilePath,

        });

        // console.log(res.tempFilePath);

      },

      // 请求失败
      fail() { }

    })

  },

  /**
   * 滚动到底部加载更多图片事件
   */
  more() {

    // 下一页
    this.data.page++;

    // 然后渲染
    this.showPage();

  },

  /**
   * 渲染页面
   */
  showPage() {

    // 异步请求数据,返回promise
    this.queryData()
      .then((res) => {

        // 抛出错误.
        if (!res.data.data){
          throw '很奇怪的,搜索"绿谷"一词,百度API返回的数据不能转成json对象';
        }

        // 成功回调,渲染数据
        this.showData(this.codeData(res.data.data));

        // 结束加载提示动画

        wx.hideNavigationBarLoading(); 

      }, (err) => {

        // 失败回调,渲染数据
        console.log('请求失败:', err);

      })

  },

  /**
   * 数据筛选
   */

  showData(data) {

    // 检查传入数据的情况
    // console.log(data)

    // 保存原始数据到current上
    this.data.current = data;

    data.forEach(value => {

      // 查找数组中最小值,并返回出来
      const min = Math.min(...this.data.height);

      // 查找第一个最小值的索引值
      const index = this.data.height.findIndex((value) => value === min);

      // 保存图片到第一个最小值的数组
      this.data.imgs[index].push(value);

      // 合计左边图片总高度
      this.data.height[index] += value.height;

    });

    // 更新下数据,只需要更新imgs就可以了
    this.setData({

      imgs: this.data.imgs

    });

    // 检查数据的推入情况
    // console.log(this.data);

  },

  /**
   * 数据打包，
   */
  codeData(data) {

    // 存放处理后的数据并返回
    const arr = [];

    data.forEach((value) => {

      // 数据为空的去除
      if (value.objURL) {

        // 对象合并
        arr.push(Object.assign({

          // 小图
          thumbURL: value.thumbURL,

          // 中图
          middleURL: value.middleURL,

          // 大图
          objURL: ults.imgUrlEncode(value.objURL)

        }, ults.zoom(value, 100)));

      }

    });

    return arr;

  },

  /**
   * 请求数据，返回promise
   */
  queryData() {

    // 开始显示加载提示动画
    wx.showNavigationBarLoading();

    // 开始请求数据
    return new Promise((resolve, reject) => {

      //wx请求
      wx.request({

        // 请求路径
        url: ults.codeUrl(
          this.data.url,
          this.data.word,
          this.data.page,
          this.data.row
        ),

        // 成功回调
        success: resolve,

        // 失败回调
        fail: reject

      })

    });

  }

})