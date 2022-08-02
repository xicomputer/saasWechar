// pages/Notice/store/NoticeList/NoticeList.js
const app = getApp()
const time = require("../../../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  getParams(){
    app.sjrequest('/basic/queryChatList').then(res=>{
      if(res.data.code == 200){
        wx.hideLoading()
        res.data.data.forEach(item=>{
          item.addTime = time.formatTime(item.addTime)
        })
        this.setData({
          noticeList:res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
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
    wx.showLoading({
      title: '加载中',
    })
    this.getParams()
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