// pages/activity/pmhd/pmList/pmList.js
const paymentUtil = require("../../../../utils/paymentUtil")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowAddress: false,
    orderIndex: -1,
    status: 0,
    type: 0,
    statusList: ['全部喊价','待开喊','参喊中','待付款','已获喊','未获喊'],
    statusNumList: [0, 0, 0, 0, 0, 0, 0],
    statusColorList: ['全部喊价','#07C160','#FFB300','#FF0000','#6467F0','#FF0000','#999999'],
    auctionList: [],
    pageNum: 1,
    pageSize: 10,
    stopLoading: true,
    address: {
      name: '',
      tel: '',
      detail: '请选择收货地址'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.options = options
    this.setData({
      merchantId: options.merchantId,
      auctionId: options.auctionId,
      status: options.status || 0
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      pageNum:1,auctionList:[]
    },()=>{
      this.getNumber();
      this.getAuctionList();
    });
  },

  // 获得我参加的拍卖信息
  getAuctionList(){
    let that = this
    if(this.data.status == 0){
      this.setData({
        status: -1
      })
    }
    let params = {}
    if(this.data.merchantId && this.data.merchantId != -1){
      params = {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        merchantId: this.data.merchantId,
        status: this.data.status
      }
    }else{
      params = {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        status: this.data.status
      }
    }
    app.request.auctionRequest('/bidding/list', params).then((res) =>{
      if(res.data.code == 200){
        let result = res.data.data
        if (result.length < this.data.pageSize) {
          this.setData({
            stopLoading:false
          })
        }
        this.setData({
          auctionList: this.data.auctionList.concat(result)
        })
        if(this.data.auctionId){
          result.forEach((item,index) => {
            if(item.auctionId == this.data.auctionId){
              app.sjrequest('/commodity/queryShipping').then(res=>{
                res.data.data.forEach(item=>{
                  if(item.isDefault==1){
                    that.setData({
                      ['address.name']: item.contacts,
                      ['address.tel']: item.contactWay,
                      ['address.detail']: item.provincesName + item.cityName + item.areaName + item.address
                    })
                  }
                  that.setData({
                    orderIndex: index,
                    isShowAddress: true
                  })
                })
              })
            }
          });
        }
      }
    })
  },
  // 获得数字
  getNumber(){
    let params = {}
    if(this.data.merchantId && this.data.merchantId != -1){
      params = {
        merchantId: this.data.merchantId
      }
    }
    app.request.auctionRequest('/bidding/groupAuctionBiddingCount', params).then((res) =>{
      if(res.data.code == 200){
        let result = res.data.data
        result.forEach(item =>{
          this.data.statusNumList[item.status] = item.count
        })
        this.setData({
          statusNumList: this.data.statusNumList
        })
      }
    })
  },
  // 去商家
  toShop(e){
    const {item} = e.currentTarget.dataset
    app.request.auctionRequest('/bidding/clearBiddingUnread', item.auctionId)
    wx.navigateTo({
      url: `/pages/shopHome/home/home?marchantId=${item.merchantId}`,
    })
  },
  // 去详情
  toDetails(e){
    const {item} = e.currentTarget.dataset
    app.request.auctionRequest('/bidding/clearBiddingUnread', item.auctionId)
    wx.navigateTo({
      url: `/pages/activity/pmhd/details/details?auctionId=${item.auctionId}`,
    })
  },
  // 更改倒计时时间
  changeTime(e){
    const {index} = e.currentTarget.dataset
    this.data.auctionList[index].timeData = e.detail
    this.setData({
      auctionList: this.data.auctionList
    });
  },
  // 倒计时结束
  overTime(){
    // debugger
  },
  // 切换状态
  changeTab(e){
    const {index} = e.currentTarget.dataset
    if(index != this.data.status){
      this.setData({
        status: index,
        pageNum: 1,
        stopLoading: true,
        auctionList: []
      })
      this.getAuctionList()
    }
  },
  // 去支付保证金
  toBondPayment(e){
    const {item} = e.currentTarget.dataset
    const params = {
      auctionId: item.auctionId, //拍卖id
      cashDeposit: item.cashDeposit, //保证金
      receivingAddress: item.receivingAddress, //收货地址
      receivingName: item.receivingName, //收货人姓名
      receivingTelephone: item.receivingTelephone, //收货人电话
      status: item.status
    }
    app.request.auctionRequest('/bidding/save', params).then((res) =>{
      if(res.data.code == 200){
        let result = res.data.data
        this.paymentMoney(result,1)
      }
    })
  },
  // 显示地址框
  showAddress(e){
    let that = this
    const {index} = e.currentTarget.dataset
    app.sjrequest('/commodity/queryShipping').then(res=>{
      res.data.data.forEach(item=>{
        if(item.isDefault==1){
          that.setData({
            ['address.name']: item.contacts,
            ['address.tel']: item.contactWay,
            ['address.detail']: item.provincesName + item.cityName + item.areaName + item.address
          })
        }
        that.setData({
          orderIndex: index,
          isShowAddress: true
        })
      })
    })
    
  },
  // 隐藏地址框
  showNotAddress(){
    this.setData({
      isShowAddress: false
    })
  },
  // 跳转收货地址
  selectAddress() {
    app.globalData.comefrom ='pmhd'
    wx.navigateTo({
      url: '/pages/Address/AddressList/AddressList'
    })
  },
  // 去支付尾款
  toFinalPayment(){
    if(this.data.address.detail == '请选择收货地址'){
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return
    }
    const params = {
      auctionId: this.data.auctionList[this.data.orderIndex].auctionId, //拍卖id
      auctionItemId: this.data.auctionList[this.data.orderIndex].auctionItemId, //拍卖品id
      bond: this.data.auctionList[this.data.orderIndex].cashDeposit, //保证金
      money: this.data.auctionList[this.data.orderIndex].fillingMoney, //实际金额
      merchantId: this.data.auctionList[this.data.orderIndex].merchantId, //商家ID
      receivingAddress: this.data.address.detail, //收货地址
      receivingName: this.data.address.name, //收货人姓名
      receivingTelephone: this.data.address.tel, //收货人电话
      totalMoney: this.data.auctionList[this.data.orderIndex].myPrice, //总金额
    }
    app.request.auctionRequest('/order/payOrder', params).then((res) =>{
      if(res.data.code == 200){
        let result = res.data.data
        this.paymentMoney(result,2)
      }else{
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false,
          success (res) {
            if (res.confirm) {
              this.setData({
                pageNum: 1,
                stopLoading: true,
                auctionList: []
              })
              this.getAuctionList()
            }
          }
        })
      }
    })
  },
  // 付钱
  paymentMoney(data,type){
    // type: 1-支付保证金（刷新列表） 2-支付尾款(跳转到订单列表)
    const that = this
    paymentUtil.auctionWxpay(data).then(() => {
      if(type == 1){
        // 刷新列表
        that.setData({
          status:data.auctionStatus + 1,
          pageNum: 1,
          stopLoading: true,
          auctionList: []
        })
        that.getAuctionList()
      }else{
        //跳转订单列表
        wx.navigateTo({
          url: '/pages/activity/pmhd/orderList/orderList?status=0',
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
      this.getAuctionList()
    }
  }
})