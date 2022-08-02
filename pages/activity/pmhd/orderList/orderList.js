// pages/activity/pmhd/orderList/orderList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    pageNum: 1,
    pageSize: 10,
    stopLoading: true,
    orderIndex: -1,
    isShowReason: false,//选择原因框
    isSureReturn: false,//确认退货框
    status: -1,
    statusList: ['待发货', '待收货', '已完成', '退款/售后'],
    typeList: ['','（申请中）','（退款中）','（退款中）','（已完成）','（已拒绝）'],
    reasonIndex: -1,
    reasonList: [
      '不喜欢/不是自己想要的',
      '商品质量问题',
      '收到的商品破损、损坏',
      '商品出现了发错、漏拍',
      '发票的问题',
      '收到商品与店铺描述不符合',
      '其他'
    ],
    reasonInfo: '',//其他原因
    logistics: {
      company:'',
      number:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.options = options
    const status = options.status || 0
    this.setData({
      status: Number(status),
      merchantId: options.merchantId
    })
    this.getOrderList()
  },
  // 获得订单列表
  getOrderList(){
    let params = {}
    if(this.data.merchantId){
      params = {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        merchantId: this.data.merchantId,
        auctionId: this.data.auctionId,
        status: this.data.status + 1
      }
    }else{
      params = {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        auctionId: this.data.auctionId,
        status: this.data.status + 1
      }
    }
    app.request.auctionRequest('/order/list', params).then((res) =>{
      if(res.data.code == 200){
        let result = res.data.data
        if (result.length < this.data.pageSize) {
          this.setData({
            stopLoading:false
          })
        }
        for(let index in result){
          result[index].status = result[index].status + 1
        }
        this.setData({
          orderList: this.data.orderList.concat(result)
        })
      }
    })
  },
  // 去商家
  toShop(e){
    const {item} = e.currentTarget.dataset
    // app.request.auctionRequest('/order/clearOrderUnread', item.auctionId)
    wx.navigateTo({
      url: `/pages/shopHome/home/home?marchantId=${item.merchantId}`,
    })
  },
  // 去详情
  toDetails(e){
    const {item} = e.currentTarget.dataset
    // app.request.auctionRequest('/order/clearOrderUnread', item.auctionId)
    wx.navigateTo({
      url: `/pages/activity/pmhd/details/details?auctionId=${item.auctionId}`,
    })
  },
  // 联系商家
  contactShop(e){
    const {item} = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/order/contact/contact?logoPic=${item.merchantLogo}&marchantId=${item.merchantId}&marchantName=${item.merchantName}`,
    })
  },
  // 切换状态
  changeTab(e){
    const {index} = e.currentTarget.dataset
    if(index != this.data.status){
      this.setData({
        status: index,
        pageNum: 1,
        stopLoading: true,
        orderList: []
      })
      this.getOrderList()
    }
  },
  // 打开退款退货原因
  showReason(e){
    const {index} = e.currentTarget.dataset
    this.setData({
      isShowReason: true,
      reasonIndex: -1,
      orderIndex: index
    })
  },
  // 隐藏退款退货原因
  showNotReason(){
    this.setData({
      isShowReason: false
    })
  },
  // 选择原因
  changeReason(e){
    this.setData({
      reasonIndex: e.currentTarget.dataset.index
    })
  },
  // 其他原因获焦
  textareaFocus(){
    this.setData({
      reasonIndex: this.data.reasonList.length-1
    })
  },
  // 获得用户填写的其他原因
  getReasonInfo(e){
    this.setData({
      reasonInfo: e.detail.value,
    })
  },
  // 确认选择原因
  sureReason(){
    if(this.data.reasonIndex == -1 || (this.data.reasonIndex == this.data.reasonList.length-1 && this.data.reasonInfo == '')){
      wx.showToast({
        title: '请选择或者填写原因',
        icon: 'none'
      })
    }else{
      let refundReason
      if(this.data.reasonIndex == this.data.reasonList.length-1){
        refundReason = this.data.reasonInfo
      }else{
        refundReason = this.data.reasonList[this.data.reasonIndex]
      }
      const params = {
        orderNo: this.data.orderList[this.data.orderIndex].xsAuctionOrderItem.orderNo, //订单编号
        refundReason: refundReason, //退款退货原因
      }
      app.request.auctionRequest('/order/orderRefund', params).then((res) =>{
        if(res.data.code == 200){
          wx.showToast({
            title: '申请成功,等待商家审核',
            icon: 'none'
          })
          this.showNotReason()
          this.setData({
            status: 4,
            pageNum: 1,
            stopLoading: true,
            orderList: []
          })
          this.getOrderList()
        }
      })
    }
  },
   // 打开确认退货框
   showSureReturn(e){
    const {index} = e.currentTarget.dataset
    this.setData({
      ['logistics.company']: '',
      ['logistics.number']: '',
      isSureReturn: true,
      orderIndex: index
    })
  },
  // 隐藏确认退货框
  showNotSureReturn(){
    this.setData({
      isSureReturn: false
    })
  },
   // 获得用户填写的物流公司
   getLogisticsCompany(e){
    this.setData({
      ['logistics.company']: e.detail.value
    })
  },
   // 获得用户填写的物流单号
   getLogisticsNumber(e){
    this.setData({
      ['logistics.number']: e.detail.value
    })
  },
  // 确认退货
  sureReturn(){
    if(this.data.logistics.company == '' || this.data.logistics.number == ''){
      wx.showToast({
        title: '物流公司和物流单号不能为空哦~',
        icon: 'none'
      })
    }else{
      const params = {
        orderNo: this.data.orderList[this.data.orderIndex].xsAuctionOrderItem.orderNo, //订单编号
        refundMailName: this.data.logistics.company,
        refundMailOrderNo: this.data.logistics.number,
        refundStatus: 2
      }
      app.request.auctionRequest('/order/orderRefund', params).then((res) =>{
        if(res.data.code == 200){
          wx.showToast({
            title: '申请成功,等待商家审核',
            icon: 'none'
          })
          this.showNotSureReturn()
          this.setData({
            status: 3,
            pageNum: 1,
            stopLoading: true,
            orderList: []
          })
          this.getOrderList()
        }
      })
    }
  },
  // 确认收货
  sureOrder(e){
    const {index} = e.currentTarget.dataset
    const params = {
      orderNo: this.data.orderList[index].xsAuctionOrderItem.orderNo //订单编号
    }
    app.request.auctionRequest('/order/orderConfirm', params).then((res) =>{
      if(res.data.code == 200){
        wx.showToast({
          title: '收货成功',
          icon: 'none'
        })
        this.setData({
          status: 2,
          pageNum: 1,
          stopLoading: true,
          orderList: []
        })
        this.getOrderList()
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
    if (this.data.stopLoading) {
      this.setData({
        pageNum: this.data.pageNum + 1
      })
      this.getOrderList()
    }
  },
  copyOrder(e){
    var order=e.currentTarget.dataset.order;
    wx.setClipboardData({
      data:order,
      success(res){
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  }
})