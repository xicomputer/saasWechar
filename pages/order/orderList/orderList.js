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
    activeTab: '2',
    toBottom:false,
    isSubmit:false,
    marchantId:0,
    dntabs:[
      {name:'待消费'},
      {name:'已取消'},
      {name:'已完成'},
      {name:'退款/退货'},
    ],
    pstabs:[
      {name:'待付款'},
      {name:'待发货'},
      {name:'待收货'},
      {name:'已完成'},
      {name:'退款/退货'},
    ],
    tabsList:[],
    tabsItem: 0,
    shopOrderStatus: 0,
    deliveryOrderStatus:0,
    orderList:[],
    showQRCode:false,
    showHexiao:false,
    isTake: false,
    isCheck: false,
    takeData:{},
    cartShop:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({cartShop:{...app.globalData.setInfo}})
    if(options.marchantId){
      this.setData({
        marchantId:options.marchantId
      })
    }
    this.setData({
      activeTab:options.activeTab||2,
      tabsitem:parseInt(options.tabsItem)||0
    })
    wx.setNavigationBarTitle({
      title: this.data.activeTab==1?'店内订单':'物流订单'
    })
  },
  // 获取页面参数
  getParam(){
    if(this.data.activeTab=='1'){
      this.setData({
        tabsList:this.data.dntabs
      })
    }else if(this.data.activeTab=='2'){
      this.setData({
        tabsList:this.data.pstabs
      })
    }
  },
  //切换订单状态
  onChange(e){
    this.clearData()
    var index = e.detail.index
    this.setData({
      tabsitem:index
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
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
      showQRCode: false,
      showHexiao: false
    });
  },
  showNumer(){
    this.setData({
      showHexiao:true
    })
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
      url: '../postGoodsComment/postGoodsComment',
    })
  },
  // 撤销申请
  cancelRefund(e){
    let that = this
    wx.showModal({
      title: '撤销退货申请',
      content: '是否要撤销退货申请，撤销后将无法再次申请退货',
      showCancel: true,//是否显示取消按钮
      cancelText:"否",//默认是“取消”
      confirmText:"是",//默认是“确定”
      success: function (res) {
         if (res.cancel) {
            //点击取消,默认隐藏弹框
         } else {
            //点击确定
            console.log(e.currentTarget.dataset)
            let data = {orderCommodityId:e.currentTarget.dataset.ordercommodityid,orderId:e.currentTarget.dataset.orderid}
            app.sjrequest('/order/cancelChargeback',data).then(res=>{
              if(res.data.code == 200) {
                wx.showToast({
                  title: '撤销退款成功',
                  icon:'none',
                  success:function(){
                    that.clearData()
                    that.setData({
                      tabsitem:3
                    })
                  }
                })
              }
            })
         }
      }
   })
  },
  read(){
    this.setData({isCheck:!this.data.isCheck})
  },
  // 电话联系
  callStore(e){
    let tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel 
    })
  },
  // 收货弹框
  getOrderGoods(e){
    let el = e.currentTarget.dataset
    let data = {uniqueId:el.uniqueid,orderState:el.id,marchantId:el.marchantid}
    this.setData({isTake:true,takeData:data})
  },
  // 取消收货
  cancelTake(){
    this.setData({isTake:false,isCheck:false})
  },
  // 确认收货
  confirmTake(e){
    if(!this.data.isCheck){
      wx.showToast({
        title: '请先勾选我已知悉',
        icon:'none'
      })
      return
    }
    let type = e.currentTarget.dataset.type
    let that = this
    let data = this.data.takeData
    data.receivingType = type
    this.cancelTake()
    app.sjrequest('/order/updateCityOrder',data).then(res=>{
      if(res.data.code == 200){
        that.clearData()
        that.getOrderList()
      }
    })
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
      text = '确认收货吗？'
      notice = '已确认收货'
      break;
      case 5:
      text = '确认删除订单吗？'
      notice = '删除成功'
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
                  that.clearData()
                  that.getOrderList()
                }
              })
            } else if (sm.cancel) {
              console.log('用户点击取消')
            }
          }
      })
    }
    if(ev.id == 2){
      app.sjrequest('/order/updateCityOrder',data).then(res=>{
        if(res.data.code == 200){
          wx.showToast({
            title: '已提醒商家',
            icon: 'none'
          })
        }else if(res.data.code == 309){
          wx.showToast({
            title: '您已经提醒过了，一天只能提醒一次哦!',
            icon: 'none'
          })
        }
      })
    }
  },
   // 支付订单
   payOrder(e){
    if(!this.data.isSubmit){  // 防止多次点击
      this.setData({
        isSubmit:true
      })
      var item = e.currentTarget.dataset.item
      var that = this
	  let merchantId = wx.getStorageSync('merchantId')
	  let appid = wx.getStorageSync('appid')
      console.log(item)
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
    this.clearData()
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.getOrderList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.clearData()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  toApplyReturn(e){
    wx.navigateTo({
      url: `../applyReturn/applyReturn?uniqueId=${e.currentTarget.dataset.uniqueid}&selfUniqueId=${e.currentTarget.dataset.selfuniqueid}`,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  getOrderList(){
    if(this.data.activeTab == 1){ // 店内订单
      switch(this.data.tabsitem){ 
        case 0:
            this.setData({  
              shopOrderStatus:1
            })
            break;
          case 1:
            this.setData({
              shopOrderStatus:3
            }) //已取消
            break;
          case 2:
            this.setData({
              shopOrderStatus:4
            }) //已完成
            break;
          case 3:
            this.setData({
              shopOrderStatus:5
            }) //退货退款
            break;
      }
      let data={pageCurr:this.data.pageCurr,pageSize:this.data.pageSize,orderState:this.data.shopOrderStatus}
      app.sjrequest('/order/queryReserveOrder',data).then(res =>{
        if(res.data.code == 200){
          if(res.data.data.length<this.data.pageSize){
            this.setData({
              toBottom: true
            })
          }
          res.data.data.forEach(item=>{
            item.orderTime = time.formatTimeSec(item.orderTime,'Y-M-D h:m:s')
          })
          this.setData({
            orderList:res.data.data.concat(this.data.orderList)
          })
          console.log(this.data.orderList)
        }
      })
    }
    if(this.data.activeTab == 2){ // 配送订单
      switch(this.data.tabsitem){ 
        case 0:
            this.setData({  
              deliveryOrderStatus:0
            }) //待付款
            break;
          case 1:
            this.setData({
              deliveryOrderStatus:1
            }) //已发货
            break;
          case 2:
            this.setData({
              deliveryOrderStatus:2
            }) //已收货
            break;
          case 3:
            this.setData({
              deliveryOrderStatus:4
            }) //已完成
            break;
          case 4:
            this.setData({
              deliveryOrderStatus:5
            }) //退款退货
            break;
      }
      let data={pageCurr:this.data.pageCurr,pageSize:this.data.pageSize,orderState:this.data.deliveryOrderStatus}
      if(this.data.marchantId){
        data.marchantId = this.data.marchantId
      }
      app.sjrequest('/order/queryCityOrder',data).then(res =>{
        if(res.data.code == 200){
          wx.hideLoading()
          if(res.data.data.length<this.data.pageSize){
            this.setData({
              toBottom: true
            })
          }
          res.data.data.forEach(item=>{
            item.orderTime = time.formatTimeSec(item.orderTime)

          })
          this.setData({
            orderList:[...new Set(this.data.orderList.concat(res.data.data))],
            pageCurr:this.data.pageCurr + 1
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      })
    }
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