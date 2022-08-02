// pages/smallShop/favorites.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    favoriteList:[] // 收藏列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
  },
  // 获取页面参数
  getParams(){
    wx.showLoading({
      title: '加载中',
    })
    this.getFavoriteList()
  },
  // 获取收藏列表
  getFavoriteList(){
    const res =  app.sjrequest('/sales/queryFavoriteList').then(res=>{
      if(res.data.code == 200) {
        wx.hideLoading()
        this.setData({
          favoriteList:res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
    return res
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
    this.getParams()
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