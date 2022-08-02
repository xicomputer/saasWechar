// pages/Index/saleList/saleList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    marchantId:0,
    saleGoodsList:[],
    skuList:[],
    buyNum:1,
    orderType:1,
    skuActive:null,
    show:false,
    goodsData:{},
    orderSwitch:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderSwitch  = wx.getStorageSync('orderSwitch')
    this.setData({marchantId:options.marchantId,orderType:options.orderType,orderSwitch:orderSwitch})
    this.getCategoryGoodsList()
  },
  // 促销
  getCategoryGoodsList(){
    var data={
      'marchantId':this.data.marchantId
    }
    app.sjrequest('/commodity/queryPromotionList',data).then(res =>{
      if(res.data.code==200){
        wx.hideLoading()
        this.setData({
          saleGoodsList: res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
  },
  // 去下单
  goBuy(e){
    var item = e.currentTarget.dataset.item
    item.stock='请选择规格'
    item.itemText='请选择规格'
    this.setData({
      goodsData:item,
      buyNum:1,
      skuActive:null,
      show:true
    })
    this.getSku(item.id)
  },
  // 获得商品规格
  getSku(commodityId){
    var that = this
    var data={'commodityId':commodityId,marchantId:this.data.marchantId}
    app.sjrequest('/commodity/queryCommoSku',data).then(res =>{
      if(res.data.code==200){
        that.setData({
          skuList: res.data.data,
          goodsData: res.data.data[0]
        })
        res.data.data.forEach((item,index)=>{
          let skuItem = 'skuList[' + index + '].active'
          if(item.isDefault == 1) {
            that.setData({
              [skuItem]: true,
              goodsData: item
            })
          }else{
            that.setData({
              [skuItem]: false
            })
          }
        })
      }
    })
  },
    //关闭商品弹框
  onClose1(){
    this.setData({
      show:false,
    })
  },
  // 切换 sku
handleSelectSku(e) {
  if (this.data.skuActive === e.currentTarget.dataset.index) {
    return
  } else {
    this.setData({
      skuActive: e.currentTarget.dataset.index
    })
    this.data.skuList.forEach((el, i) => {
      let skuItem = 'skuList[' + i + '].active'
      this.setData({
        [skuItem]: false
      })
    })
    let skuItem = 'skuList[' + this.data.skuActive + '].active'
    this.setData({
      [skuItem]: true,
      goodsData: this.data.skuList[this.data.skuActive]
    })
  }
},
  // 编辑数量
  handleEdit(e) {
    if (e.currentTarget.dataset.type === 'minus') {
      // 减一
      if (this.data.buyNum === 1) {
        wx.showToast({
          title:'数量不能少于1',
          icon:'none'
        })
        return
      } else {
        this.setData({
          buyNum: this.data.buyNum - 1
        })
      }
    } else {
      // 加一
      this.setData({
        buyNum: this.data.buyNum + 1
      })
    }
  },
      // 加入购物车
handlePopupAddCart() {
  var data={
    'tempSpecId':this.data.goodsData.id,
    'commodityId':this.data.goodsData.commodityId,
    'amount':this.data.buyNum,
    'marchantId':this.data.marchantId,
    'operate':1
  }
  app.sjrequest('/commodity/addTrolley',data).then(res =>{
    if(res.data.code==200){
      wx.showToast({
        title:'添加成功',
        icon:'success'
      })
    }
  })
},
  //确认下单
  surexf(){
    if(this.data.goodsData.stock==0){
      wx.showToast({
        title:'暂无库存',
        icon:'none'
      })
      return 
    }
    console.log(this.data.orderType)
    let jsonData = {
        marchantId: this.data.marchantId,
        orderType: this.data.orderType,
        commoditys: [
          {
            commodityId: this.data.goodsData.commodityId,
            tempSpecId: this.data.goodsData.id,
            amount: this.data.buyNum
          }
        ]
    }
    // 使用社交token
    const token = wx.getStorageSync('token')
    app.sjrequest1('/order/onekeyAboutOrder', jsonData, token).then(res => {
        if (res.data.code === 200) {
            // 更新 store 数据
            app.store.setState({
                submitObj: JSON.stringify(res.data.data)
            })
            wx.navigateTo({
                url: '/pages/order/submitOrder/submitOrder'
            })
        }
    })
    // }
  },
  changeTime(e){
    const {index} = e.currentTarget.dataset
    this.data.saleGoodsList[index].timeData = e.detail
    this.setData({
        saleGoodsList: this.data.saleGoodsList
    });
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
  onShareAppMessage: function () {
    return {
      title: '邵阳人和秒杀专区',
      path: `/pages/Index/saleList/saleList?marchantId=${this.data.marchantId}`,
    }
  },
  onShareTimeline: function () {
    return {
      title: '邵阳人和秒杀专区',
      path: `/pages/Index/saleList/saleList?marchantId=${this.data.marchantId}`,
      imageUrl:'https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/static/miaosha123.png'
    }
  }
})