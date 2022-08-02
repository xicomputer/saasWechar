// pages/member/integral/integral.js
const app = getApp()
const time = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    integral:0,    // 总积分
    integralList:[] ,  // 积分列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({marchantId:options.marchantId,integral:options.integral})
    this.getInteList()
  },
  getInteList(){
    let data = {marchantId:this.data.marchantId}
    app.sjrequest('/member/queryMemberRecordList',data).then(res=>{
      if(res.data.code == 200) {
        res.data.data.forEach(item=>{
          item.addTime = time.formatDateTime(item.addTime)
        })
        this.setData({
          integralList:res.data.data
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
  onShareAppMessage: function () {

  }
})