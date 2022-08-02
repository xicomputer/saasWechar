// pages/activity/pmhd/pmEnter/pmEnter.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    merchantId: -1,
    pmNumber: 0,
    list: [
      {
        name: '待发货',
        num: 0,
      },
      {
        name: '待收货',
        num: 0,
      },
      {
        name: '已完成',
        num: 0,
      },
      {
        name: '退款/售后',
        num: 0,
      }
    ],
    statusList: ['待开喊','参喊中','待付款','已获喊','未获喊'],
    numList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.options = options
    this.setData({
      merchantId: options.marchantId
    })
  },
  // 获得数字
  getNumber(){
    let params = {}
    if(this.data.merchantId != -1){
      params = {
        merchantId: this.data.merchantId,
      }
    }
    app.request.auctionRequest('/order/orderStatusCount', params).then((res) =>{
      if(res.data.code == 200){
        let result = res.data.data
        result.forEach(item =>{
          if(item.status == 5){
            this.setData({
              pmNumber: item.count
            })
          }else{
            this.data.list[item.status - 1].num = item.count
          }
        })
        this.setData({
          list: this.data.list,
          numList:result
        })
      }
    })
  },
  toOrderList(e){
    const {status} = e.currentTarget.dataset
    if(this.data.merchantId){
      wx.navigateTo({
        url: `/pages/activity/pmhd/orderList/orderList?status=${status}&merchantId=${this.data.merchantId}`,
      })
    }else{
      wx.navigateTo({
        url: `/pages/activity/pmhd/orderList/orderList?status=${status}`,
      })
    }
  },
  toPmList(e){
    let index = e.currentTarget.dataset.index +1 
    if(this.data.merchantId){
      wx.navigateTo({
        url: `/pages/activity/pmhd/pmList/pmList?merchantId=${this.data.merchantId}&status=`+index,
      })
    }else{
      wx.navigateTo({
        url: `/pages/activity/pmhd/pmList/pmList`,
      })
    }
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
    this.getNumber()
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

  }
})