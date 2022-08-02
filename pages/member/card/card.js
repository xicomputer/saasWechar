// pages/member/card/card.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // vipLevel: 1, //会员等级 0-普通会员
    type: 0, //激活状态 0-未激活，1-已激活
    marchantId: 0,  // 商家id
    memberInfo:{},  // 会员信息
    cartShop:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.options = options
    this.setData({cartShop:{...app.globalData.setInfo}})
    this.setData({marchantId:options.marchantId})
    //查看是否授权
    wx.getSetting({
      success: function (res) {
        if (wx.getStorageSync('wx_userinfo_key')) {
        } else {
          wx.navigateTo({
            url: '/pages/shopHome/home/home',
          })
        }
      }
    });
  },
  getMemberInfo(){
    let data = { marchantId:this.data.marchantId,type:1}
    app.sjrequest('/member/queryMemberInfo',data).then(res=>{
      if(res.data.code == 200) {
        this.setData({memberInfo:res.data.data})
        if(res.data.data.member){
          this.setData({type:1})
        }
      }
    })
  },
  contactStore(){
    wx.makePhoneCall({
      phoneNumber: this.data.memberInfo.merchantInfo.contactsMobile,
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
    this.getMemberInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  returnShop(){
    // wx.redirectTo({
    //   url: '/pages/shopHome/home/home',
    // })
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length-2];//上一页面
    prevPage.setData({
      nowTabbarText: "首页",
    });
    wx.redirectTo({
      url: '/pages/shopHome/home/home',
    })
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
      title: this.data.memberInfo.merchantInfo.nickName,
      path: "/pages/member/card/card?marchantId="+this.data.marchantId,
      imageUrl:''
    }
  }
})