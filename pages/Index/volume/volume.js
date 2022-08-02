// pages/shopHome/components/volume/volume.js
const app = getApp()
const formate = require("../../../utils/util")


Page({

  /**
   * 页面的初始数据
   */
  data: {
    marchantId:'',
    saleCanList: [],
    isDiscount:false,
    saleState:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      marchantId:options.marchantId
    })
    this.isShowSale() //促销弹框

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
// 函数
// 优惠是否弹框
isShowSale() {
  let data = {
    marchantId: this.data.marchantId
  }
  app.sjrequest('/coupons/queryCouponsGet', data).then(res => {
    if (res.data.code == 200) {
      if (res.data.data.length) {
        let saleCanList = []
        res.data.data.forEach((item) => {
          let endTime = formate.formatDateTime2(item.endTime)
          item.endTime = endTime.split(" ")[0]
          let startTime = formate.formatDateTime2(item.startTime)
          item.startTime = startTime.split(" ")[0]
          if (item.isDraw == 0) {
            saleCanList.push(item)
            this.setData({
              isDiscount: true,
              saleState: '点击领券'
            })
          }
          item.endTime = formate.formatDate(item.endTime)
        })
        this.setData({
          saleCanList: saleCanList
        })
        app.globalData.activeStatuList = this.data.activeStatuList
      }
    }
  })

},
// 关闭优惠弹窗
closeSale() {
  this.setData({
    isDiscount: false,
  })
},
receiveSale() {
  var data = {
    couponsIds: []
  }
  this.data.saleCanList.forEach(item => {
    if (item.isDraw == 0) {
      data.couponsIds.push(item.id)
    }
  })
  data.couponsIds = data.couponsIds.toString()
  var token = wx.getStorageSync('token')
  app.sjrequest('/coupons/getCoupons', data, token).then(res => {
    if (res.data.code == 200) {
      this.setData({
        isDiscount: false
      })
      wx.showToast({
        title: '领取成功',
        icon: 'none'
      })
      this.getCouponList()
      // this.reCoupons()
    }
  })
},
// 获取优惠券列表
getCouponList() {

  let data = {
    marchantId: this.data.marchantId
  }

  return app.sjrequest('/coupons/queryCouponsList', data).then(res => {

    if (res.data.code == 200) {
      console.log(res.data,'addcouponList');
      wx.hideLoading()
      this.setData({
        addcouponList: res.data.data.couponsList1.length,
        addcouponList1:res.data.data.couponsList1,
        addcouponList2:res.data.data.couponsList2,
        addcouponList3:res.data.data.couponsList3
        
      })
      setTimeout(() => {
        this.setData({
          loading: false
        })
      }, 500)
    }
  })
},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})