// pages/activity/yxcj/activeDetails/activeDetails.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag:'',
    token:'',
    marchant:'',
    activityId:'',
    buton:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.options = options
    this.setData({
      tag: options.tag,
      token:wx.getStorageSync('token'),
      marchant:options.marchantId ,
      activityId:options.activityId
    })
    let that = this
    //查看是否授权
    wx.getSetting({
      success: function (res) {
        if (wx.getStorageSync('wx_userinfo_key')) {
          // 已授权
          if(that.data.token){
            that.setData({
              buton:false
            })
          }else{
            wx.navigateTo({
              url: '/pages/shopHome/home/home',
            })
          }
        } else {
          wx.navigateTo({
            url: '/pages/shopHome/home/home',
          })
          //用户没有授权
          that.setData({
            buton:true
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.globalData.options = {}
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})