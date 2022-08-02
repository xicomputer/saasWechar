// pages/Notice/NoticeList/NoticeList.js
const app = getApp()
const time = require("../../../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //通知列表
  getNotice(){
    var data={}
    app.sjrequest('/basic/queryMessageList',data).then(res =>{
      var list = res.data.data
      for(var i in list){
        const date = new Date(list[i].addTime)
        const now = new Date()
        
        const year = date.getFullYear()-now.getFullYear()
        const month = (date.getMonth() + 1) - (now.getMonth() + 1)
        const day = date.getDate()-now.getDate()
        if(year==0 && month==0 && day ==0 ){
          list[i].flag = true
        }else{
          list[i].flag = false
        }
        list[i].addTime=time.formatTime(list[i].addTime)
        // list[i].addTime=list[i].addTime.substring(0,5)
      }
      this.setData({noticeList:list})
    })
  },
  // 通知详情
  toDetail(e){
    var item=e.currentTarget.dataset['item']
    wx.setStorage({
      key: 'noticeListItem',
      data: JSON.stringify(item)
    })
    wx.navigateTo({
      url:'../NoticeDetail/NoticeDetail?id'
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
    this.getNotice()
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