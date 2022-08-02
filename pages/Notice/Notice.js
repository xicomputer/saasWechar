// pages/Notice/Notice.js
const app = getApp()
const time = require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeTypeList:[
      {
        img:'/pages/img/notice/store_notice_img.png',
        title:'商铺消息',
        content:'点击查看你的商家售后',
        time:'2020/10/22',
        to:'./store/NoticeList/NoticeList',
        sum:0,
        hide:false
      },
      {
        img:'/pages/img/notice/system_notice_img.png',
        title:'系统消息',
        content:'查看系统通知',
        time:'刚刚',
        to:'./system/NoticeList/NoticeList',
        sum:0,
        hide: false
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.from == 'store'){
      this.setData({['noticeTypeList[0].hide']:true})
    }
  },
  getParams(){
    let data = {type:2}
    var chatTime = 'noticeTypeList[0].time'
    var messageaddTime = 'noticeTypeList[1].time'
    var chatSum = 'noticeTypeList[0].sum'
    var messageSum = 'noticeTypeList[1].sum'
    app.sjrequest('/basic/queryCountAmount',data).then(res =>{
      if(res.data.data.chatTime){
        res.data.data.chatTime = time.formatTime(res.data.data.chatTime)
        this.setData({
          [chatTime]:res.data.data.chatTime
        })
      }
      if(res.data.data.messageaddTime){
        res.data.data.messageaddTime = time.formatTime(res.data.data.messageaddTime)
        this.setData({
          [messageaddTime]:res.data.data.messageaddTime
        })
      }
      this.setData({
        [chatSum]:res.data.data.countChat,
        [messageSum]:res.data.data.countMessage,
      })
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