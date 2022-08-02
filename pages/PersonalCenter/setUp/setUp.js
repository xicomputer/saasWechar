// pages/PersonalCenter/setUp/setUp.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},   // 用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getUserInfo(){
    let ids = wx.getStorageSync('merchantId')
    app.sjrequest('/userRegister/queryUserInfo',{marchantId:ids}).then(res=>{
      if(res.data.code==200){
        var wxUserInfo=wx.getStorageSync('wx_userinfo_key') || {};
        this.setData({
          userInfo:{
            ...res.data.data,
            nickName:wxUserInfo.userInfo.nickName,
            avatarUrl:wxUserInfo.userInfo.avatarUrl
          }
        }) 
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserInfo()
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