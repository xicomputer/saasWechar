// pages/order/orderDetail/orderDetail.js
const time = require('../../../utils/util')
const app = getApp()
Page({
  useStore: true,
  /**
   * 页面的初始数据
   */
  data: {
    /**
     * orderState:
     *  0待付款，1待发货，2待收货,3已完成(头部样式)
     *  4退款中
     *  5商家处理中,6商家已拒绝，7买家同意，8退货成功，9买家发货
     */
    isClose: false,  // 是否关店
    orderState:0,
    orderStateList:[//订单状态
      {
        state:'等待您付款',
        prompt:'剩余14分钟59秒自动取消'
      },
      {
        state:'等待商家发货',
        prompt:'2天内商家未发货订单自动取消'
      },
      {
        state:'等待您收货',
        prompt:'签收后三天内未收货将自动确认收货'
      },
      {
        state:'您的订单已完成',
        prompt:''
      },
      {
        state:'退款申请中',
        prompt:'商家会在1个工作日内给你退款'
      },
      {
        state:'请等待商家处理',
        prompt:'将会在24小时内处理'
      },
      {
        state:'卖家已拒绝，您需要处理',
        prompt:'请与商家进行沟通'
      },
      {
        state:'请退货并填写物流信息',
        prompt:'请在两天内处理,超时自动取消'
      },
      {
        state:'退款成功',
        prompt:'您已成功退款'
      },
      {
        state:'已填写物流信息',
        prompt:'将会在三天内处理，如超时平台将默认商家自动确认收货'
      },
    ],
    returnStateList:[//退货状态
      {
        state:'您已成功发起退款申请，请耐心等待商家处理。',
        prompt:'商家同意或者超时未处理你系统将退款给您。'
      },
      {
        state:'拒绝原因：货物已被损坏',
        prompt:'商家已拒绝您的退货申请。'
      },
      {
        state:'商家已同意退货申请，请尽早发货',
        prompt:''
      },
      {
        state:'退款总金额',
        prompt:'退回微信'
      },
      {
        state:'您已填写物流单号，请耐心等待',
        prompt:'商家同意或者超时未处理系统将退款给你'
      },
    ],
    prompts:[
      '未与商家协商一致，请勿使用到付或平邮，以免商家拒签货物',
      '交易的钱款还在平台中间账户，确保你资金安全',
      '请填写真实物流信息，逾期未填写，退货申请将撤销'
    ],
    refundReasonList:[//退款原因
      {name:'不喜欢/不想要了'},
      {name:'未按时发货'},
      {name:'发票的问题'},
      {name:'收货地址填错了'},
      {name:'其他'}
    ],
    reasonBox:false,
    isSubmit:false,
    logisticsBox:false,
    topList:[],
    refundState:0,
    citInfo:{},
    refundInfo:{},
    deliveryRefund:false,
    showCancel:false,
    deliveryCompany: '',
    deliveryNumber: '',
    message:'',
    len:0,
    uniqueId:'',
    reason:'',
    payState: false,         // 是否付款
    isTake: false,
    isCheck: false,
    cartShop:{},
    takeData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({cartShop:{...app.globalData.setInfo}})
    this.setData({
      _options: options
    })
  },
  // 拒绝退款
  refund(){
    this.setData({ reasonBox:true })
  },
  // 取消拒绝退款
  refundOnClose() {
    this.setData({ reasonBox: false });
  },
  // 填写物流信息
  logistics(){
    this.setData({ logisticsBox: true });
  },
  // 取消填写物流信息
  logisticsOnClose() {
    this.setData({ logisticsBox: false });
  },
  // 选择拒绝原因
  radioChange(e) {
    const refundReasonList = this.data.refundReasonList
    for (let i = 0, len = refundReasonList.length; i < len; ++i) {
      refundReasonList[i].checked = refundReasonList[i].name === e.detail.value
    }
    this.setData({
      refundReasonList
    })
  },
  // 评论
  comment(e){
    let index = e.currentTarget.dataset.index
    let goodsData = this.data.citInfo.commList[index]
    let citInfo = this.data.citInfo
    app.globalData.marchantId = citInfo.marchantId,//商家id
    app.globalData.commodityId = goodsData.commodityId//商品id
    app.globalData.commodityLogo = goodsData.thumbnail//商品图片
    app.globalData.commodityName = goodsData.commodityName//商品名称
    app.globalData.orderUniqueId = goodsData.uniqueId//订单uid
    wx.navigateTo({
      url: '../postGoodsComment/postGoodsComment',
    })
  },
  // 选择其他
  inputFocus(){
    console.log('focus')
    const refundReasonList = this.data.refundReasonList
    for (let i = 0, len = refundReasonList.length; i < len; ++i) {
      refundReasonList[i].checked = refundReasonList[i].name == '其他'
    }
    this.setData({
      refundReasonList
    })
  },
  // 查看物流
  checkWl(){
    wx.navigateTo({
      url:'../logistics/logistics?wlNumber='+this.data.citInfo.expressNo+'&wlCompany='+this.data.citInfo.expressCompany+'&orderNumber='+this.data.citInfo.orderNumber
    })
  },
  queryCity(uniqueId){
    let data = {uniqueId:uniqueId}
    
    if(!this.data.deliveryRefund) {  //配送订单
      app.sjrequest('/order/queryCityInfo',data).then(res=>{
        if(res.data.code == 200) {
          var timestamp = Date.parse(new Date());
          if(res.data.data.arrivalTime){
            res.data.data.arrivalTime = time.formatTimeSec(res.data.data.arrivalTime)
          }
          if(res.data.data.orderTime){
            res.data.data.orderTime = time.formatTimeSec(res.data.data.orderTime)
          }
          res.data.data.endTime = res.data.data.endTime*1000 - timestamp + 5000
          console.log(res.data.data.endTime)
          this.setData({
            citInfo:res.data.data,
          })
          if(res.data.data.refundState==0){
            if(res.data.data.orderState < 4){
              this.setData({orderState:res.data.data.orderState})
              console.log(this.data.orderState)
            }
          }
          if(res.data.data.refundState==1){
              this.setData({orderState:5})
          }
          if(res.data.data.refundState==2){
            this.setData({orderState:7})
          }
          if(res.data.data.refundState==3){
            this.data.returnStateList[1].state = '拒绝原因:' +res.data.data.rejectReason
            this.setData({orderState:6,returnStateList:this.data.returnStateList})
          }
          if(res.data.data.refundState==4){
            this.setData({orderState:9})
          }
          if(res.data.data.refundState==5){
            this.setData({orderState:8})
          }
          if(res.data.data.orderState == 4){
            this.setData({orderState:3})
          }
        }
      })
    }
    if(this.data.deliveryRefund){
      let data = {uniqueId:this.data.uniqueId}
      app.sjrequest('/order/chargebackDetails',data).then(res=>{
        if(res.data.code == 200) {
          if(res.data.data.applyRefundTime){
            res.data.data.applyRefundTime = time.formatTimeSec(res.data.data.applyRefundTime)
          }
          console.log(res.data.data)
          this.setData({
            citInfo:res.data.data,
          })
          if(res.data.data.refundState==1){
            this.setData({orderState:5})
          }
          if(res.data.data.refundState==2){
            this.setData({orderState:7})
          }
          if(res.data.data.refundState==3){
            this.data.returnStateList[1].state = '拒绝原因:' +res.data.data.refundReason
            this.setData({orderState:6,returnStateList:this.data.returnStateList})
          }
          if(res.data.data.refundState==4){
            this.setData({orderState:9})
          }
          if(res.data.data.refundState==5){
            this.setData({orderState:8})
          }
        }
      })
    }
  },
  showPopup() {
    this.setData({ showCancel: true });
  },
  // 输入事件
  inputContent(e){
    this.setData({
      message:e.detail.value,
      len:e.detail.value.length
    })
  },
  inputDeliveryCompany(e){
    this.setData({
      deliveryCompany:e.detail.value
    })
  },
  inputDeliveryNumber(e){
    let value = this.validateNumber(e.detail.value)
    this.setData({
      deliveryNumber:parseInt(value)
    })
  },
  // 校验只能输入数字
  validateNumber(val) {
    return val.replace(/^(0+)|[^\d]+/g, '')
  },
  wroteDelivery(){
    var that = this
    if(this.data.deliveryCompany == ''){
      wx.showToast({
        title: '请输入快递公司',
        icon: 'none'
      })
      return
    }
    if(this.data.deliveryNumber == ''){
      wx.showToast({
        title: '请输入快递单号',
        icon: 'none'
      })
      return
    }
    let data = {uniqueId:this.data.uniqueId,tExpressCompany:this.data.deliveryCompany,tExpressNo:this.data.deliveryNumber}
    app.sjrequest('/order/chargeback',data).then(res=>{
      if(res.data.code == 200 ){
        that.setData({
          logisticsBox: false
        })
        that.queryCity(that.data.uniqueId)
      }
    })
  },
  //确认退款
  confirmCancel(){
    this.data.refundReasonList.forEach(item=>{
      if(item.checked){
        this.setData({
          reason:item.name
        })
      }
    })
    if(this.data.reason == '其他') {
      if(this.data.message == '') {
        wx.showToast({
          title: '请输入退款原因',
          icon: 'none'
        })
        this.setData({
          reason:''
        })
        return
      }else{
        this.setData({reason:this.data.message})
      }
    }
    if(this.data.reason==''){
      wx.showToast({
        title: '请选择退款原因',
        icon: 'none'
      })
      return
    }
    let that = this
    let data = { uniqueId:this.data.citInfo.uniqueId,reason:this.data.reason,orderId:this.data.citInfo.orderId}
    console.log(data)
    var token = wx.getStorageSync('token')
    let appid = wx.getStorageSync('appid')
    let data2s = {
        authorizerAppid:appid,
        sceneType:3
    }
    app.mb2request('/subTemplate/listPriTemplateId',data2s).then(res=>{
      let tempData = res.data.data
      wx.requestSubscribeMessage({
          tmplIds: tempData,
          success: function (res) {
            let data3s = {
              status: 1,
              marchantId:  that.data.citInfo.marchantId,
              templateIds: tempData,
              appId:appid,
              targetId:that.data.citInfo.orderId,
              targetType:4
          }
            app.sjrequest('/basic/addsubscription', data3s).then(res => {
              
          })
          },
          complete: function () {
            app.sjrequest1('/order/ezchargeback',data,token).then(res=>{
              if(res.data.code == 200) {
                wx.showToast({
                  title: '申请成功,等待商家同意',
                  icon: 'none',
                  duration: 1000
                })
                setTimeout(function(){
                  wx.redirectTo({
                    url: `/pages/order/orderList/orderList?activeTab=2&marchantId=${that.data.citInfo.marchantId}&tabsItem=4`,
                  })
                },1000
                )
              }
            })
          }
      })
    })
   
  },
  copy(){
    wx.setClipboardData({
      data: this.data.citInfo.orderNumber,
      success:function(){
        wx.showToast({
          title: '复制成功',
          icon: 'none'
        })
      }
    })
  },
  copyTd(){
    wx.setClipboardData({
      data: this.data.citInfo.expressNo,
      success:function(){
        wx.showToast({
          title: '复制成功',
          icon: 'none'
        })
      }
    })
  },
  onClose() {
    this.setData({ showCancel: false });
  },
  // 再来一单
  rebuy(){
    let that = this
    let data = {
        marchantId: this.data.citInfo.marchantId,
        commoditys: [],
        orderType: this.data.citInfo.orderType,
        shppingId:this.data.citInfo.shipping.id
    }
    this.data.citInfo.commList.forEach(el => {
      data.commoditys.push({
          commodityId: el.commodityId,
          tempSpecId: el.tempSpecId,
          amount: el.amount
      })
  })
    var token = wx.getStorageSync('token')
    app.sjrequest1('/order/onekeyAboutOrder', data, token ).then(res => {
        if (res.data.code === 200) {
            // 更新 store 数据
            app.store.setState({
                submitObj: JSON.stringify(res.data.data)
            })
            wx.navigateTo({
                url: '/pages/order/submitOrder/submitOrder?personnel=' + (that.data.citInfo.saleUniqueId||0)
            })
        }else if(res.data.code == 338){
          this.setData({
            isClose:true
          })
        }
    })
  },
  // 撤销申请
  cancelRefund(){
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
            let data = {orderCommodityId:that.data.citInfo.orderCommodityId,orderId:that.data.citInfo.orderId}
            app.sjrequest('/order/cancelChargeback',data).then(res=>{
              if(res.data.code == 200) {
                wx.showToast({
                  title: '撤销退款成功',
                  icon:'none',
                  success:function(){
                    wx.navigateBack({
                      delta: 0,
                    })
                  }
                })
              }
            })
         }
      }
   })
  },
  // 配送订单操作
  updateCityOrder(e){
    console.log(e)
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
                  wx.navigateBack({
                    delta: 0,
                  })
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
  //倒计时结束
  countDownOver(){
    if(this.data.payState){
      return
    }
    let data = {uniqueId:this.data.citInfo.uniqueId,orderState:3,marchantId:this.data.citInfo.marchantId}
    app.sjrequest('/order/updateCityOrder',data).then(res=>{
      if(res.data.code == 200){
        wx.showToast({
          title: '已自动为您取消订单',
          icon: 'none',
          duration: 2000,
          success:function(){ 
            setTimeout(function () { 
              wx.navigateBack({
                delta: 0,
              })
             }, 2000) 
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
	  let merchantId = wx.getStorageSync('merchantId')
	  let appid = wx.getStorageSync('appid')
      let data = {uniqueId:item.uniqueId,paymentWay:2,actualMoney:item.actualMoney,marchantId:merchantId,appid:appid,orderNumber:item.orderNumber,body:item.nickName,payPlatform:'JSAPI'}
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
              that.setData({
                payState:true
              })
              wx.showToast({
                title: '支付成功',
                duration:1000
              })
              setTimeout(function(){
                wx.navigateBack({
                  delta: 0,
                })
              },1000)
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
  read(){
    this.setData({isCheck:!this.data.isCheck})
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
    let data = this.data.takeData
    data.receivingType = type
    this.cancelTake()
    app.sjrequest('/order/updateCityOrder',data).then(res=>{
      if(res.data.code == 200){
        wx.navigateBack({
          delta: 0,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  refundDetails(uniqueId){
    let data = {uniqueId:uniqueId}
    app.sjrequest('/order/refundDetails',data).then(res => {
      if(res.data.code == 200) {
        if(res.data.data.applyRefundTime){
          res.data.data.applyRefundTime = time.formatTimeSec(res.data.data.applyRefundTime)
        }
        this.setData({
          refundInfo:res.data.data,
          orderState:5
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.data._options.deliveryRefund == 5){
      this.setData({
        deliveryRefund:true
      })
    }
    this.setData({
      uniqueId:this.data._options.deliveryUniqueId
    })
    if(this.data._options.state){
      this.refundDetails(this.data._options.uniqueId)
    }
    this.queryCity(this.data._options.uniqueId)
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