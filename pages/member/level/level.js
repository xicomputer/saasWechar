// pages/member/level/level.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    marchantId: 0,  // 商家id
    memberInfo:{},  // 会员信息
    cartShop:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({marchantId:options.marchantId})
    this.setData({cartShop:{...app.globalData.setInfo}})
    this.getMemberInfo()
  },
  getMemberInfo(){
    let data = { marchantId:this.data.marchantId,type:3}
    app.sjrequest('/member/queryMemberInfo',data).then(res=>{
      if(res.data.code == 200) {
        this.setData({memberInfo:res.data.data})
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})