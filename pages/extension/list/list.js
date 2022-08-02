// pages/extension/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxUserInfo:wx.getStorageSync('wx_userinfo_key') || {},
    marchantId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData={
      marchantId:options.marchantId
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log(this.data.wxUserInfo,'9898980');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  
  /**
   * 用户点击右上角分享
   */
  
  onShareAppMessage: function(res) {
    let uniqueId = wx.getStorageSync('uniqueId1');
    return {
      title: '发现了一家宝藏店铺，赶紧来抢购吧！',
      path: "/pages/shopHome/home/home?marchantId=" + this.data.marchantId + '&uniqueId=' + uniqueId  + "&sss=1111",
      imageUrl: 'https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/Saas/goto.jpg'
    }
  }
})