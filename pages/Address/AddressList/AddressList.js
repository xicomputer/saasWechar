const { default: toast } = require("../../../miniprogram_npm/@vant/weapp/toast/toast");

// pages/Address/AddressList/AddressList.js
const app = getApp()
Page({
  useStore: true,
  /**
   * 页面的初始数据
   */
  data: {
    addList: [],
    haveAdd: true,
    title:"管理收货地址",
    orderData: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showaddrList();
    if(app.globalData.comefrom){
      wx.setNavigationBarTitle({
        title: '请选择收货地址'
      })
    }
  },

  backOrder(e) {
    let { from } = app.store.getState()
    let comefrom = app.globalData.comefrom
    if (from === 'submitOrder') {
      let itemObj = e.currentTarget.dataset.item
      var pages = getCurrentPages()
      var currPage = pages[pages.length - 1] // 当前页面
      var prevPage = pages[pages.length - 2]
      var shipping = 'submitObj.shipping'
      prevPage.setData({[shipping]: itemObj});
      // 更新 store 数据
      app.store.setState({from: ''});
      wx.navigateBack({delta: 1});
      typeof prevPage.changeNum == 'function' && prevPage.changeNum();

      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit('addressChange',{shipping:itemObj});
    }
    if (comefrom === 'goodsDetail'|| comefrom=='member') {
      let itemObj = e.currentTarget.dataset.item
      var pages = getCurrentPages()
      var currPage = pages[pages.length - 1]; // 当前页面
      var prevPage = pages[pages.length - 2];
      prevPage.setData({shipping: itemObj});
      if(comefrom=='member'){
        prevPage.setData({
          name: itemObj.contacts,
          tel:itemObj.contactWay,
          areaId:itemObj.areaId,
          cityId:itemObj.cityId,
          provinceId:itemObj.provincesId,
          area:itemObj.areaName,
          city:itemObj.cityName,
          province:itemObj.provincesName,
          address:itemObj.address
        })
      }
      // 更新 store 数据
      app.globalData.comefrom = ''
      wx.navigateBack({
        delta: 1,
        success:function(){
          if(comefrom === 'goodsDetail'){
            prevPage.findFreightStr()
          }
        }
      })
    }
    if (comefrom === 'integral') {
      let itemObj = e.currentTarget.dataset.item
      var pages = getCurrentPages()
      var currPage = pages[pages.length - 1]; // 当前页面
      var prevPage = pages[pages.length - 2];
      prevPage.setData({
        logisticsContactMan: itemObj.contacts,
        logisticsAddress:itemObj.provincesName+itemObj.cityName+itemObj.areaName+itemObj.address,
        logisticsTel:itemObj.contactWay
      })
      // 更新 store 数据
      app.globalData.comefrom = ''
      wx.navigateBack({ delta: 0});
    }
    if(comefrom=='pmhd'){
      let itemObj = e.currentTarget.dataset.item
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2]
      console.log(itemObj)
      prevPage.setData({
        ['address.name']: itemObj.contacts,
        ['address.tel']: itemObj.contactWay,
        ['address.detail']: itemObj.provincesName + itemObj.cityName + itemObj.areaName + itemObj.address
      })
      // 更新 store 数据
      app.globalData.comefrom = ''
      wx.navigateBack({delta: 0});
    }
  },

  saveBtn() {
    wx.navigateTo({
      url: `/pages/Address/NewAddress/NewAddress`,
    })
  },
  showaddrList() {
    var that = this;
    app.sjrequest('/commodity/queryShipping').then(res=>{
      console.log(res.data.data, '收货地址')
      this.setData({
        addList:res.data.data
      })
    })
  },
  /**删除 */
  clickDel(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认删除此地址吗？',
      success: function (sm) {
        if (sm.confirm) {
            // 用户点击了确定 可以调用删除方法了
            let data ={shippingId:e.currentTarget.dataset.id}
            console.log(data, '删除参数')
          app.sjrequest('/commodity/deleteShipping',data).then(res=>{
              console.log(res)
              that.showaddrList()
          })
          } else if (sm.cancel) {
            console.log('用户点击取消')
          }
        }
    })
  },
  /**编辑收货地址 */
  clickEdit(e) {
    console.log(e.currentTarget.dataset.item);
    var item = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '../NewAddress/NewAddress?item='+item,
    })
  },
  WxSetAddress(){
    let that = this
    wx.chooseAddress({
      success (res) {
        let data = {address:res.detailInfo,contacts:res.userName,contactWay:res.telNumber,provincesName:res.provinceName,cityName:res.cityName,areaId:res.postalCode,areaName:res.countyName,isDefault:1
        }
        console.log(res)
        wx.showLoading({
          title: '保存中',
          mask: true
        })
        app.sjrequest('/commodity/addShipping',data).then(res=>{
          wx.hideLoading({})
          if(res.data.code == 200){
            that.showaddrList();
          }else{
            wx.showToast({
              title:res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
         
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
   
})