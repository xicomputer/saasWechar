// pages/Order/Order.js
const time = require('../../../utils/util')
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
    tabsList:[],
    tabList:[
      {name:'待付款'},
      {name:'待接单'},
      {name:'待收货'},
      {name:'已完成'},
      {name:'已退款'}
    ],
    tabsitem: 0,
    marchantId: 0,
    orderList:[],
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
    })
  },
  // 配送订单操作
  updateCityOrder(e){
    var that = this
    var ev = e.currentTarget.dataset
    let data = {uniqueId:ev.uniqueid,orderState:ev.id,marchantId:ev.marchantid,orderType:2}
    var text,notice
    switch(parseInt(ev.id)){
      case 3:
      text = '确认取消订单吗？'
      notice = '取消成功'
      break;
      case 4:
      text = '确认收货吗？'
      notice = '已确认收货'
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
  // 申请退款
  refundApply(e){
    var that = this
    var ev = e.currentTarget.dataset
    let data = {uniqueId:ev.uniqueid,applet:2,payPlatform:'JSAPI'}
    wx.showModal({
      title: '提示',
      content: '确认申请退款吗？',
      success: function (sm) {
        if (sm.confirm) {
            // 用户点击了确定 可以调用删除方法了
            app.sjrequest('/order/operateCityRefund',data).then(res=>{
              if(res.data.code == 200){
                wx.showToast({
                  title: '退款成功',
                  duration:2000,
                })
                setTimeout(res=>{
                  that.setData({tabsitem:4})
                  that.clearData()
                  that.getOrderList()
                },2000)
              }
            })
          } else if (sm.cancel) {
            console.log('用户点击取消')
          }
        }
    })
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
            that.setData({tabsitem:4})
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
      let data = {marchantId:merchantId,appid:appid,uniqueId:item.uniqueId,paymentWay:2,actualMoney:item.actualMoney,orderNumber:item.orderNumber,body:item.nickName,payPlatform:'JSAPI',orderType:2}
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
  // 评论
  comment(e){
    let orderIdx = e.currentTarget.dataset.orderidx
    let goodsIdx = e.currentTarget.dataset.goodsidx
    let goodsData = this.data.orderList[orderIdx].orderCommodity[goodsIdx]
    let orderList = this.data.orderList[orderIdx]
    app.globalData.marchantId = orderList.marchantId,//商家id
    app.globalData.commodityId = goodsData.commodityId//商品id
    app.globalData.commodityLogo = goodsData.thumbnail//商品图片
    app.globalData.commodityName = goodsData.commodityName//商品名称
    app.globalData.orderUniqueId = goodsData.uniqueId//订单uid
    wx.navigateTo({
      url: '/pages/order/postGoodsComment/postGoodsComment',
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
    let data={pageCurr:this.data.pageCurr,pageSize:this.data.pageSize,orderType:2}
    if(this.data.marchantId){
      data.marchantId = this.data.marchantId
    }
    if(this.data.tabsitem==0){
      data.orderState = 0
    }else if(this.data.tabsitem==1){
      data.orderState = 7
    }else if(this.data.tabsitem==2){
      data.orderState = 2
    }else if(this.data.tabsitem==3){
      data.orderState = 4
    }
    else if(this.data.tabsitem==4){
      data.orderState = 3
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
          item.orderTime = time.formatTimeSec(item.orderTime,'Y-M-D h:m:s')
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