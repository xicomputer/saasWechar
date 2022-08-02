const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[],
    marchantId:'',
    classifyId:'',
    category:'',
    show: false,//下单弹框
    skuList:[],//规格列表
    skuActive: null,//当前规格
    goodsData:{},//当前商品数据
    buyNum:1,//购买数量,
    // openOverlay:false,//下单方式弹框
    index: 0,//方式索引
    orderType:0,
  },

  // "navigationBarBackgroundColor": "#783705",
  // "navigationBarTextStyle": "white"
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      marchantId:options.marchantId,
      classifyId:options.classifyId,
      orderType:options.orderType
    })
    wx.setNavigationBarTitle({
      title: options.category+'系列',
    })
    this.getCategoryGoods()
  },
  getCategoryGoods(){
    var data={'marchantId':this.data.marchantId,'classifyId':this.data.classifyId,'pageCurr':1,'pageSize':10}
    app.sjrequest('/commodity/queryCommodityList',data).then(res =>{
      if(res.data.code==200){
        this.setData({
          goodsList: res.data.data
        })
      }
    })
  },
  // 去下单
  goBuy(e){
    var item = e.currentTarget.dataset.item
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
    let that = this
    var data={'commodityId':commodityId,marchantId:this.data.marchantId}
    app.sjrequest('/commodity/queryCommoSku',data).then(res =>{
      if(res.data.code==200){
        this.setData({
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
  onClose(){
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
    if(this.data.goodsData.stock==0){
      wx.showToast({
        title:'暂无库存',
        icon:'none'
      })
      return 
    }
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
  //  // 下单方式弹框
  //  handleBuy() {
  //   if(this.data.skuActive==null){
  //     wx.showToast({
  //       title:'请选择规格',
  //       icon:'none'
  //     })
  //     return 
  //   }
  //   this.setData({
  //     show: false,
  //     // openOverlay:true
  //   })
  // },
  // //关闭下单方式
  // closexf(){
  //   this.setData({
  //       openOverlay:false
  //   })
  //   this.setData({
  //       index:0
  //   })
  // },
  // //选择消费方式
  // checkxf(e){
  //   this.setData({
  //       index:e.currentTarget.dataset.index
  //   })
  // },
  //确认下单
  surexf(){
    // if(this.data.index===0){
    //   wx.showToast({
    //     title: '请选择一种消费方式'
    //   })
    // }else{
        // this.setData({
        //     openOverlay:false
        // })
        if(this.data.goodsData.stock==0){
          wx.showToast({
            title:'暂无库存',
            icon:'none'
          })
          return 
        }
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
   
})