// pages/Order/Order.js
const time = require('../../../utils/util')
import drawQrcode from "../../../utils/api/weapp.qrcode.min.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // active: 0
    pageCurr:1,
    pageSize:10,
    toBottom:false,
    isSubmit:false,
    tabsList:[
      
    ],
    tabList:[
      {name:'待付款',orderState:0},
      //{name:'待接单',orderState:1},
      {name:'待使用',orderState:2},
      {name:'已完成',orderState:4},
      //{name:'已取消',orderState:5},
    ],
    tabsitem: 0,
    marchantId: 0,
    shopOrderStatus: 0,
    deliveryOrderStatus:0,
    orderList:[],
    showQRCode:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.tabsitem){
      this.setData({
        tabsitem:parseInt(options.tabsitem),
      })
    }
    if(options.marchantId){
      this.setData({
        marchantId:parseInt(options.marchantId),
      })
    }
    this.setData({  // 防止触发onChange事件
      tabsList:this.data.tabList
    })
  },
  // 获取页面参数
  getParam(){
    this.clearData()
    this.getOrderList()
  },
  //切换订单状态
  onChange(e){
    this.clearData()
    var index = e.detail.index
    this.setData({
      tabsitem:index
    })
    this.clearData()
    this.getOrderList()
  },
  //清空数据
  clearData(){
    this.setData({
      pageCurr:1,
      orderList:[],
      toBottom: false,
      verification:0
    })
  },
  //显示二维码
  showQR(e){
    var uniqueId = e.currentTarget.dataset.uniqueid
    this.setData({
      showQRCode: true
    })
    let data = {uniqueId:uniqueId}
    console.log(data)
    app.sjrequest('/order/queryVerification',data).then(res=>{
      this.setData({
        verification: res.data.data.verification
      })
      drawQrcode({
        width: 110,
        height: 110,
        canvasId: 'myQrcode',
        text: res.data.data.verification
      })
    })
  },
  onClose() {
    this.setData({ 
      showQRCode: false
    });
  },
  // 配送订单操作
  updateCityOrder(e){
    var that = this
    var ev = e.currentTarget.dataset
    let data = {uniqueId:ev.uniqueid,orderState:ev.id,marchantId:ev.marchantid}
    var text,notice
    switch(parseInt(ev.id)){
      case 3:
      text = '确认取消订单吗？'
      notice = '取消成功'
      break;
      case 4:
      text = '您确认在这家店取到货了吗？',
      notice = '核销成功' 
      break;
    }
    if(ev.id != 2){
      wx.showModal({
        title: '提示',
        content: text,
        success: function (sm) {
          if (sm.confirm) {
              // 用户点击了确定 可以调用删除方法了
              app.sjrequest('/order/updateCityOrder',data).then(res=>{
                if(res.data.code == 200){
                  wx.showToast({
                    title: notice,
                    duration:1000
                  })
                  setTimeout(res=>{
                    that.clearData()
                    that.getOrderList()
                  },1000)
                }
              })
            } else if (sm.cancel) {
              console.log('用户点击取消')
            }
          }
      })
    }
  },
  //倒计时结束
  countDownOver(e){
    let that = this
    console.log(e.currentTarget.dataset)
    let data = {uniqueId:e.currentTarget.dataset.uniqueid,orderState:3,marchantId:e.currentTarget.dataset.marchantid}
    app.sjrequest('/order/updateCityOrder',data).then(res=>{
      if(res.data.code == 200){
        wx.showToast({
          title: '已自动为您取消订单',
          icon: 'none',
          duration: 2000,
          success:function(){ 
            that.getParam()
         }
        })
      }
    })
    
  },
  // 支付订单
  payOrder(e){
    if(!this.data.isSubmit){  // 防止多次点击
      this.setData({
        isSubmit:true
      })
      var item = e.currentTarget.dataset.item
      var that = this
      console.log(item)
	  let merchantId = wx.getStorageSync('merchantId')
	  let appid = wx.getStorageSync('appid')
      let data = {marchantId:merchantId,appid:appid,uniqueId:item.uniqueId,paymentWay:2,actualMoney:item.actualMoney,orderNumber:item.orderNumber,body:item.nickName,payPlatform:'JSAPI'}
      app.sjrequest('/order/paymentOrder',data).then(res=>{
        if(res.data.code == 200 ){
          wx.requestPayment({
            appId: res.data.data.appId,
            nonceStr: res.data.data.nonceStr, // 支付签名随机串，不长于 32 位
            package: res.data.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: res.data.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            timeStamp: res.data.data.timeStamp, // 支付签名时间戳，
            paySign: res.data.data.paySign, // 支付签名
            success: function (res) {
              that.clearData()
              that.getOrderList()
              that.setData({
                isSubmit:false
              })
            },
            fail: function (res) {
              wx.showToast({
                title: '支付失败',
                icon: 'none'
              })
              that.setData({
                isSubmit:false
              })
            }
          });
        }
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
    this.getParam()
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
  getOrderList(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let data={pageCurr:this.data.pageCurr,pageSize:this.data.pageSize}
    if(this.data.marchantId){
      data.marchantId = this.data.marchantId
    }
    if(this.data.tabsitem==0){
      data.orderState = 0
    }else if(this.data.tabsitem==1){
      data.orderState = 2
    }else{
      data.orderState = 4
    }
    app.sjrequest('/order/queryWintookOrder',data).then(res =>{
    
      if(res.data.code == 200){
        wx.hideLoading()
        var timestamp = Date.parse(new Date());
        if(res.data.data.length<this.data.pageSize){
          this.setData({
            toBottom: true
          })
        }
        res.data.data.forEach(item=>{
          item.arriveTime = time.formatTimeSec(item.arriveTime,'Y-M-D h:m:s')
          item.endTime = item.endTime*1000 - timestamp
          if(item.shippingAddress){
            item.shippingAddress = JSON.parse(item.shippingAddress)
          }
        })
        this.setData({
          orderList:res.data.data.concat(this.data.orderList),
          pageCurr:this.data.pageCurr + 1
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.toBottom == false){
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
  /**
   * 用户点击右上角分享
   */
   
})