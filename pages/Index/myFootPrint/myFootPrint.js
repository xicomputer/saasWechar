// pages/Index/myFootPrint/myFootPrint.js
const app = getApp();
const time = require('../../../utils/util');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        lookedList: [], // 浏览列表
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.getLookedList();
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
    toStore(e){
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/shopHome/home/home?marchantId='+id,
      })
    },

    // 获取足迹
  getLookedList(){
    return app.sjrequest('/marchant/queryFootprintList').then(res=>{
      res.data.data.forEach(item=>{
        item.updateTime = time.formatTimeSec(item.updateTime)
      })
      this.setData({
        lookedList: res.data.data
      })
    })
  },


})