// pages/subordinate/subordinate.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowShop: false,
    shopList: [],
    subordinateList:[],
    shopName:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSubordinateList()
  },

  // 是否显示商家列表
  // isShowShopList(){
  //   this.setData({
  //     isShowShop: !this.data.isShowShop
  //   })
  // },
  // 获得商家列表
  // getShopList(){
  //   const fxToken = wx.getStorageSync('fxToken')
  //   const data ={
  //     type: 1,
  //     pageCurr: 1,
  //     pageSize: 20
  //   }
  //   app.fxrequest('/sales/querySalesMarchantList', data, fxToken).then(res => { //使用
  //     if(res.data.code==200){
  //       if(res.data.data.length==0){
  //         wx.showToast({
  //           title: '您还没有下级',
  //           icon: 'none'
  //         })
  //       }else{
  //         this.getSubordinateList(res.data.data[0].marchantId,res.data.data[0].personnel)
  //         this.setData({
  //           shopList: res.data.data,
  //           shopName: res.data.data[0].nickName
  //         })
  //       }
  //     }
  //   })
  // },
  // 获得下级列表
  getSubordinateList(){
    // const fxToken = wx.getStorageSync('fxToken')
    // const data ={
    //   storeId: wx.getStorageSync('storeId'),
    // }
    // app.fxrequest('/sales/querySubordinateList', data, fxToken).then(res => { //使用
    //   if(res.data.code==200){
    //     res.data.data.forEach(item => {
    //       if(item.addTime){
    //         //item.addTime = time.formatNowDate(new Date(item.addTime),1)
    //         let y = new Date().getFullYear()
    //         item.addTime = `${y}-${item.addTime}`
    //       }
    //     });
    //     this.setData({
    //       subordinateList: res.data.data
    //     })
    //   }
    // })
  },
  // 切换商家
  // changeShop(e){
  //   // let {marchantid,personnel} = e.currentTarget.dataset
  //   let {index} = e.currentTarget.dataset
  //   let {marchantId,nickName,personnel} = this.data.shopList[index]
  //   this.setData({
  //     shopName: nickName
  //   })
  //   this.getSubordinateList(marchantId,personnel)
  //   this.isShowShopList()
  // },
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
  // onShareAppMessage: function () {

  // }
})