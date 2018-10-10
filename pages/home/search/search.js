// pages/home/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    like: [
      '魔禁三',
      '史莱姆转生',
      '蕾姆',
      'JOJO',
      'overload',
      '绿谷'
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 点击搜索
   */
  query(e) {

    // 获取搜索框的内容
    const inpValue = e.detail.value.queryValue;

    //
    wx.navigateTo({

      url: '/pages/home/photoShow/photoShow?word=' + inpValue

    })

    // console.log(inpValue);

  }
  
})