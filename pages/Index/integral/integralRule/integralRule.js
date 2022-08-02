// pages/Index/integral/integralRule/integralRule.js
const app = getApp()
const time = require('../../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskList:[],  // 任务列表
    signData:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      marchantId:options.marchantId
    })
    this.getTaskList()
    this.getSignData()
  },
  // 获取任务
  getTaskList(){
    let data = {marchantId:this.data.marchantId}
    return app.sjrequest('/integral/queryMyTaskList',data).then(res=>{
      this.setData({
        taskList:res.data.data
      })
    })
  },
  // 查询签到接口
  getSignData(){
    let data = {marchantId:this.data.marchantId,type:2}
    app.sjrequest('/integral/operateSignin',data).then(res=>{
      if(res.data.code == 200){
        res.data.data.countDownTime = time.formatTimeSec(res.data.data.countDownTime)
        this.setData({signData:res.data.data})
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
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
   
})