// pages/AuthLogin/AuthLogin.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user = wx.getStorageSync('zl_userInfo')
    if(user){
      this.setData({userInfo:user})
    }
    this.loginWxCode();
  },
  cancel(){
    var pages = getCurrentPages()
    var beforePage = pages[pages.length - 2]
    wx.navigateBack({
      delta: 0,
      success:function(){
        beforePage.onLoad(app.globalData.options)
      }
    })
  },

  //授权
bindGetUserInfo(res){
  wx.getUserProfile({
    lang:'zh_CN',desc:'获取用户信息',
    complete:res=>{
      console.log('授权信息=====：',res);
      if (res.encryptedData) {
        this.setData({ isAuthorization: false });
        wx.setStorageSync('wx_userinfo_key',res);
        //同意授权
        this.login();
      } else {
        //拒绝授权
        setTimeout(()=>{
          wx.showToast({ title: '授权未成功',icon: 'none'});
        },1000);
        this.cancel()
      }
    },
  });
},

loginWxCode(){
  wx.login({
    success: function (res) {
      const accountInfo = wx.getAccountInfoSync();
      var appid=accountInfo.miniProgram.appId;
      if (res.code) {
        var code=res.code
        let data = {appid,code}
        app.sjrequest('/thirdWxLogin/code',data).then(res=>{
          wx.setNavigationBarTitle({
            title: res.data.data.appName?res.data.data.appName:""
          })
          console.info(res)
          wx.setStorage({data: res.data.data.merchantId,key: 'merchantId'});
          wx.setStorage({data: res.data.data.openId,key: 'thirdWxOpenId'});
          wx.setStorage({key: 'openId1', data: res.data.data.openId})
          wx.setStorage({data: res.data.data.openId,key: 'openId_1'});
          wx.setStorage({data: res.data.data.sessionKey,key: 'sessionkey'});
          wx.setStorage({data: appid,key: 'appid'});
        })
      }
    }
  });
},

//登录
login() {
  var that =this;
    var userInfo=wx.getStorageSync('wx_userinfo_key');
    var encryptedData = userInfo.encryptedData;
    var iv = userInfo.iv;    
    var openid=wx.getStorageSync('thirdWxOpenId');

    var appid=wx.getStorageSync('appid');
    let data = {appid,openid,encryptedData,iv}
    wx.showLoading({ title: '加载中'});
    app.sjrequest('/thirdWxLogin/auth',data).then(res=>{
      wx.hideLoading();
      wx.setStorage({key: 'res',data: res});
      wx.setStorage({ key: 'zl_userInfo',data: res });
      wx.setStorage({ key: 'zl_jwt',data: res.data.data.jwt});
      wx.setStorage({ key: 'token', data: res.data.data.token });
      let data = {
        openId: res.data.data.unionid,
        nickname: res.data.data.nickName,
        headimgurl: res.data.data.avatarUrl,
        openId2:res.data.data.openid
      }
      // if (res.data.code == 200) {
      //   app.sjrequest('/userRegister/weChatLogin',data).then(res=>{
      //     const result = res.data.data
      //     const params = {
      //       userId: result.userId,
      //       headImgUrl: result.headimgurl,
      //       nickName: result.nickname
      //     }
      
      //     that.cancel()
      //   })
      //   var encryptInfo = res.data.data;
      //   wx.setStorage({key: 'uniqueId',data: encryptInfo.unionId})
      // }
      that.cancel()
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
   
})