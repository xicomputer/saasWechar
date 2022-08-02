// pages/Index/integral/myIntegral/myIntegral.js
const app = getApp()
const time = require('../../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    minDate:new Date('2020-01-01').getTime(),  // 可选最小时间
    maxDate:new Date().getTime(),    // 可选最大时间
    showTimeSelect: false,  // 选择时间弹框
    currentDate: '',  // 当前选择框时间
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      else if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
    startTime: '2020-01-01', // 选择的最小时间
    endTime:new Date().getTime(), // 选择的最大时间
    type:0,
    scoreList:[], // 积分列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let time =  this.formatDate(new Date().getTime())
    this.setData({
      endTime: time,
      marchantId:options.marchantId
    })
    this.getMyInteList()
  },
  // 查询列表
  getMyInteList(){
    wx.showLoading({
      title: '查询中',
      mask: true
    })
    let data = {marchantId:this.data.marchantId,startTime:this.data.startTime,endTime:this.data.endTime}
    return app.sjrequest('/integral/queryMyInteList',data).then(res=>{
      if(res.data.code == 200){
        wx.hideLoading()
        res.data.data.forEach(item=>{
          item.addTime = time.formatTimeSec(item.addTime)
        })
        this.setData({
          scoreList:res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  // 选择时间弹框
  slectTime(e){
    var type = e.currentTarget.dataset.type
    if(type == 1) {  // 选择开始时间
      this.setData({
        currentDate: new Date(this.data.startTime).getTime()
      })
    }
    if(type == 2) { // 选择结束时间
      this.setData({
        currentDate:new Date(this.data.endTime).getTime()
      })
    }
    this.setData({
      showTimeSelect:true,
      type:type
    })
  },
  //  关闭选择时间弹框
  closeSelect(){
    this.setData({
      showTimeSelect:false
    })
  },

  onInput(event) {  // 确认时间
    if(this.data.type == 1) {   // 开始时间
      this.setData({
        startTime:this.formatDate(event.detail)
      })
    }
    if(this.data.type == 2) {  // 结束时间
      this.setData({
        endTime:this.formatDate(event.detail)
      })
    }
    this.closeSelect()
  },
  formatDate(date) {
    var date = new Date(date);
    var YY = date.getFullYear() + '-';
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    return YY + MM + DD ;
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