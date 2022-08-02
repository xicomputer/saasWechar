// pages/Modify/Modify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signatureData: "",
    active: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var signature = wx.getStorageSync('signature')
    this.setData({
      signatureData: signature
    })
  },
  // onDescribe:function(e){
  //   this.setData({
  //     signatureData:e.detail.value,
  //   })
  // },
  InputContent: function (e) {
    var that = this;
    that.setData({
      signatureData: e.detail.trim(),
    })
    if (that.data.signatureData == "" || that.data.signatureData == undefined) {
      that.setData({
        active: false
      })
    } else {
      that.setData({
        active: true
      })
    }
  },
  cancel: function () {
    wx.switchTab({
      url: '/pages/tabPage/me/me',
    })
  },
  signatureSure: function () {
    var that = this
    var token = wx.getStorageSync('token')
    if (!that.data.signatureData) {
      wx.showToast({
        title: '请输入个性签名',
        icon: 'none'
      })
      return
    } else {
      wx.request({
        //接口，
        url: 'https://xssj.letterbook.cn/xssj-third/userRegister/upUserInfo',
        header: {
          token: token,
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          signature: that.data.signatureData
        },
        method: 'POST',
        success: function (res) {
          wx.setStorageSync('signature', that.data.signatureData)
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          })
          setTimeout(res => {
            wx.switchTab({
              url: '/pages/tabPage/me/me',
            })
          }, 1000)
        },
        fail: function () {
          doFail();

        },
      })
    }
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

})