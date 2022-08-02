// pages/GoodsDetails/GoodsDetails.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData:[], // 详情数据
    DefaultSpec:{}, // 默认规格 
    normsIndex:0,  //默认索引
    value: 1,
    canNotBuyText:'不能购买',
    recommendGoodsList:[], // 为你推荐
    labelList: [], // 标签列表
    openOverlay: false,
    index: 1,
    showShare:false,
    showXS: false,
    canBuy: true,
    isApp: false,
    time:2*1000,
    _options:{},
    isAuthorization:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      _options: options
    })
    if(options.fromApp){
      this.setData({
        isApp: true
      })
    }
    // this.getParams(options.id,options.seckillId)
  },
  async getParams(id,seckillId){
    let data = {activityCommodityId: id,seckillId:seckillId}
    var that = this
    var timestamp = Date.parse(new Date());
    await app.sjrequest('/seckill/commodityListInfo',data).then(res=>{
      if(res.data.code == 200) {
        res.data.data.commodity.labels = res.data.data.commodity.labels.split(',')
        res.data.data.commodity.preferences =  JSON.parse(res.data.data.commodity.preferences)
        var useTime = 0
        if(res.data.data.state == 1) {
          useTime = res.data.data.startTime*1000 - timestamp
          this.setData({
            canBuy: false,
            canNotBuyText: '活动未开始'
          })
        }
        if(res.data.data.state == 2) {
          useTime = res.data.data.endTime*1000 - timestamp
          this.setData({
            canBuy: true,
          })
        }
        that.setData({
          DefaultSpec:res.data.data.activityCommoditySku[0],
          normsIndex: 0,
          detailData:res.data.data,
          time:useTime,
        })
        let haveStock = 0
        this.data.detailData.activityCommoditySku.forEach(item=>{
          haveStock = haveStock + item.liveStock
        })
        if(haveStock == 0){
          wx.showToast({
            title: '该规格已经卖完了',
          })
          this.setData({
            canNotBuyText: '已售罄'
          })
        }
        that.getLabelList()
      }
    })
    this.queryRecommendList()
  },
  //获取商品推荐
  queryRecommendList(){
    let data={marchantId:this.data.detailData.commodity.marchantId,commodityId:this.data.detailData.commodity.id}
    app.sjrequest('/commodity/queryRecommendList',data).then(res=>{
      if(res.data.code==200){
        // if(res.data.data.length>4){
        //   res.data.data.splice(4)
        // }
        this.setData({
          recommendGoodsList:res.data.data
        })
        console.log("推荐",res.data.data)
      }
    });
  },
  /**选择规格 */
  selectNorms(e) {
    let index = e.currentTarget.dataset.index
    if(this.data.detailData.activityCommoditySku[index].liveStock == 0){
      this.setData({
        canNotBuyText: '已售罄'
      })
    }else{
      this.setData({
        canNotBuyText: ''
      })
    }
    this.setData({
      normsIndex: index,
      DefaultSpec:this.data.detailData.activityCommoditySku[index]
    })
  },
  /**立即购买 */
  doBuy() { 
    let data = {
        seckillId:this.data.detailData.seckillId,
        orderList: []
    }
    data.orderList.push({
        marchantId: this.data.detailData.commodity.marchantId,
        commList:[
          {
            skuId: this.data.DefaultSpec.id,
            amount: this.data.value
          }
        ]
    })
    console.log(data)
    app.sjrequest1('/seckill/onekeyAboutOrder', data).then(res => {
        wx.hideLoading()
        if (res.data.code === 200) {
            // 更新 store 数据
            app.store.setState({
                submitObj: JSON.stringify(res.data.data)
            })
            wx.navigateTo({
                url: '/pages/order/submitOrder/submitOrder'
            })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
    })
  },
   // 改变购买数量
   changeBuyNum(e){
    this.setData({
      value:e.detail
    })
  },
  /**查看商品详情 */
  showDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../GoodsDetails/GoodsDetails?id='+id,
    })
  },
  //获取标签列表
  getLabelList(){
    let data = {labelIntros:this.data.detailData.commodity.labels}
    app.sjrequest('/commodity/queryLabelIntro',data).then(res=>{
      console.log(res.data.data)
      this.setData({
        labelList:res.data.data
      })
    })
  },
  // 显示隐藏标签
  showLabel(){
    this.setData({
      showXS: true
    })
  },
  hideLabel(){
    this.setData({
      showXS: false
    })
  },
  // 分享显示隐藏
  showShare(){
    this.setData({
      showShare: true
    })
  },
  hideShare(){
    this.setData({
      showShare: false
    })
  },
  // 图片预览
  imgClick(e){
    var that = this
    var src = e.currentTarget.dataset.src
    var imgList = e.currentTarget.dataset.list
    wx.previewImage({
      current: src,
      urls: imgList
    })
  },
  async repeatLoad(){
    var that = this
    await this.onLoad(this.data._options)
    if(this.data.detailData.state == 1){
      wx.showModal({
        title: '提示',
        content: '刷新失败，请重试',
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            that.repeatLoad()
          } else {//这里是点击了取消以后
            wx.navigateBack({
              delta: 0,
            })
          }
        }
      })
    }
  },
  async countDownOver(e){
    if(e.currentTarget.dataset.state==1) {
      wx.showLoading({
        title: '刷新中...',
      })
      this.repeatLoad()
    }
    if(e.currentTarget.dataset.state==2) {
      wx.showToast({
        title: '活动结束了',
        icon: 'none'
      })
      this.setData({
        canBuy:false,
        canNotBuyText: '活动已结束'
      })
    }
  },
  // 跳转购物车
  toShopCart(){
    wx.navigateTo({
      url: '../../../Index/ShopCart/ShopCart',
    })
  },
  toStore(){
    wx.navigateTo({
      url: '/pages/shopHome/home/home'
    })
  },
  //授权
bindGetUserInfo(res){
  if (res.detail.encryptedData) {
    this.setData({
      isAuthorization: false
    })
    //同意授权
      this.login();
  } else {
    //拒绝授权
    wx.showToast({
      title: '授权未成功',
      icon: 'none'
    })
  }
},
//登录
login() {
  var that =this;
  wx.getUserProfile({
    success: function (res) {
      var encryptedData = res.encryptedData
      var iv = res.iv
      let data = {encryptedData: encryptedData,iv: iv,}
      wx.showLoading({
        title: '登录中',
      })
      app.authLogin(data)
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
    //查看是否授权
    var that = this
    wx.getSetting({
      success: function (res) {
        if (wx.getStorageSync('wx_userinfo_key')) {
          // 已授权
          that.setData({
            isAuthorization: false
          })
          that.getParams(that.data._options.id,that.data._options.seckillId)
        } else {
          // 没有授权
          that.setData({
            isAuthorization: true
          })
        }
      }
    });
    // this.getParams(this.data._options.id,this.data._options.seckillId)
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
  onShareAppMessage: function () {
    return {
      title: this.data.detailData.commodity.commodityName,
      path: "/pages/activity/sycx/ActivityGoodsDetail/ActivityGoodsDetail?id="+this.data._options.id+"&seckillId="+this.data._options.seckillId,
      imageUrl:''
    }
  }
})