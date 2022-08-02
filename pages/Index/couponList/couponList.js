// pages/Index/couponList/couponList.js
const app = getApp()
const time = require("../../../utils/util")
const formate = require("../../../utils/util")    
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabsList: [ // tabs列表
      {
        name:'当前可用'
      },
      {
        name:'已使用'
      },
      {
        name:'已过期'
      }
    ],
    tabsActive:0,  // 当前tabs
    marchantId:0, // 商家id
    couponList: [],  // 优惠券列表
    showCouponList:[], // 当前显示优惠券列表 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    this.setData({
      marchantId:options.marchantId
    })
    this.getCouponList()
  },
  // 获取优惠券列表
  getCouponList(){
    let data = {marchantId: this.data.marchantId}
    return app.sjrequest('/coupons/queryCouponsList',data).then(res=>{
      if(res.data.code == 200){
        wx.hideLoading()
        res.data.data.couponsList1.forEach(item=>{
          item.commodityCoupons.endTime = time.formatTimeSec(item.commodityCoupons.endTime)
        })
        res.data.data.couponsList2.forEach(item=>{
          item.commodityCoupons.endTime = time.formatTimeSec(item.commodityCoupons.endTime)
        })
        res.data.data.couponsList3.forEach(item=>{
          item.commodityCoupons.endTime = time.formatTimeSec(item.commodityCoupons.endTime)
        })
        res.data.data.couponsList1.map(res=>{
          let endTime= time.formatDateTime2(res.commodityCoupons.endTime) 
          res.commodityCoupons.endTime  = endTime.split(" ")[0]
          let startTime =time.formatDateTime2( res.commodityCoupons.startTime) 
          res.commodityCoupons.startTime  = startTime.split(" ")[0]
        })
        this.setData({
          couponList:res.data.data,
          showCouponList: res.data.data.couponsList1
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  // 切换tabs栏
  changeTabs(e){
    let idx =  e.currentTarget.dataset.idx
    this.setData({
      tabsActive:idx
    })
    switch(idx){
      case 0:
        this.data.couponList.couponsList1.map(res=>{
          let endTime= time.formatDateTime2(res.commodityCoupons.endTime) 
          res.commodityCoupons.endTime  = endTime.split(" ")[0]
          let startTime =time.formatDateTime2( res.commodityCoupons.startTime) 
          res.commodityCoupons.startTime  = startTime.split(" ")[0]
        })
        this.setData({
          showCouponList: this.data.couponList.couponsList1
        })
      break;
      case 1:
        this.data.couponList.couponsList2.map(res=>{
          let endTime= time.formatDateTime2(res.commodityCoupons.endTime) 
          res.commodityCoupons.endTime  = endTime.split(" ")[0]
          let startTime =time.formatDateTime2( res.commodityCoupons.startTime) 
          res.commodityCoupons.startTime  = startTime.split(" ")[0]
        })
        this.setData({
          showCouponList: this.data.couponList.couponsList2
        })
      break;
      case 2:
        this.data.couponList.couponsList3.map(res=>{
          let endTime= time.formatDateTime2(res.commodityCoupons.endTime) 
          res.commodityCoupons.endTime  = endTime.split(" ")[0]
          let startTime =time.formatDateTime2( res.commodityCoupons.startTime) 
          res.commodityCoupons.startTime  = startTime.split(" ")[0]
        })
        this.setData({
          showCouponList: this.data.couponList.couponsList3
        })
      break;
    }
  },
  // 立即使用
  toStoreUse(){
    if(this.data.tabsActive==0){
      wx.showLoading({
        title: '加载中',
      })
      // var pages = getCurrentPages()
      // var prevPge = pages[pages.length-2]
      // prevPge.setData({
      //   tabActive:1
      // })
      // prevPge.getCategoryGoodsList()
      // wx.navigateBack({
      //   delta: 0,
      // })
      wx.redirectTo({
        url: '/pages/shopHome/home/home'
      })
      wx.hideLoading()
    }
  },
  showAdd(e){
    let Curindex = e.currentTarget.dataset.index
    let list = this.data.showCouponList
    list.map((res,index)=>{
        if(index == Curindex){
          res.showFlag = true
        }else{
          res.showFlag = false
        }
    })
    this.setData({showCouponList:list})
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