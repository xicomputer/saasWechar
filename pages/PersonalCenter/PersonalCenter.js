// pages/PersonalCenter/PersonalCenter.js
const app = getApp()
const time = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    followsList:[], // 关注列表
    lookedList: [], // 浏览列表
    userInfo:[],    // 用户信息 
    statusBarHeight: app.globalData.getSystemInfo.statusBarHeight||20,  // 状态栏高度
    menuButtonHeight: app.globalData.MenuButton.height + (app.globalData.MenuButton.top - app.globalData.getSystemInfo.statusBarHeight)*2, // 导航栏高度
    statusAllHeight: app.globalData.getSystemInfo.statusBarHeight+app.globalData.MenuButton.height + (app.globalData.MenuButton.top - app.globalData.getSystemInfo.statusBarHeight)*2,
    menuHeight:app.globalData.MenuButton.height,  // 胶囊高度
    pageCurr:1,
    stopLoad: false,
    buton:false,
    firstIn: true,
    text:'首页',  // tabbar状态
    pmNum:  0, // 拍卖数量
  },
  onLoad: function (options) {
    var that =this;
    //查看是否授权
    wx.getSetting({
      success: function (res) {
        if (wx.getStorageSync('wx_userinfo_key')) {
          if(wx.getStorageSync('token')){
            that.setData({
              buton:false,
              text:'首页',
            })
          }
          //用户已授权
          that.userIf();
          that.getFollows()
          that.getLookedList()
          that.getCartNum()
        } else {
          if(that.data.firstIn){
            that.setData({
              firstIn:false
            })
            wx.navigateTo({
              url: '/pages/shopHome/home/home',
            })
          }
          that.setData({
            text:'我的',
            buton:true
          })
          //用户没有授权
        }
      }
    });
  },
  // 获取关注
  getFollows(){
    wx.showLoading({
      title: '加载中,请稍后',
    })
    let data = {pageCurr: this.data.pageCurr,pageSize: 10}
    app.sjrequest('/marchant/queryConcerns',data).then(res =>{
      if(res.data.code == 200){
        if(res.data.data.length<10){
          this.setData({
            stopLoad:true
          })
        }
        this.setData({
          followsList:this.data.followsList.concat(res.data.data),
          pageCurr:this.data.pageCurr+1
        })
        wx.hideLoading()
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
  },
 // 获取足迹
  getLookedList(){
    return app.sjrequest('/marchant/queryFootprintList').then(res=>{
      res.data.data.forEach(item=>{
        item.updateTime = time.formatTimeSec(item.updateTime)
      })
      this.setData({
        lookedList: res.data.data
      })
    })
  },
  //获得购物车数量
  getCartNum(){
    app.sjrequest('/commodity/countTrolley',{}).then(res =>{
      var countTrolley = res.data.data.countTrolley
      this.setData({cartNum:countTrolley})
    })
  },
  //用户信息
  userIf: function () {
    var that =this;
    app.sjrequest('/userRegister/queryUserInfo').then(res=>{
      if(res.data.code==200){
        wx.setStorage({
          key: 'signature',
          data: res.data.data.signature
        })
        if(res.data.data.phoneNumber){
          wx.setStorage({
            key: 'userPhone',
            data: res.data.data.phoneNumber
          })
        }
        that.setData({
          userInfo:res.data.data
        }) 
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  changeStore(e){
    let idx = e.detail.current
    if(idx==this.data.followsList.length-2&&!this.data.stopLoad){
      this.getFollows()
    }
  },
  editSignature:function(){
    wx.navigateTo({
      url: '../Modify/Modify',
    })
  },
  // 跳店铺
  toStore(e){
    let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/shopHome/home/home?marchantId=' + id,
      })
  },
  // 改变tabbar
  changeTabbar(e){
    let text = e.currentTarget.dataset.text
    this.setData({
      text:text
    })
    if(text == '首页'){
      this.initData()
      this.getFollows()
    }
  },
  toBuy(e){
    wx.navigateTo({
      url: '/pages/Index/GoodsDetails/GoodsDetails?id=' +  e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  initData(){
    this.setData({
      pageCurr:1,
      stopLoad: false,
      followsList:[]
    })
  },
  onShow: function (options) {
    const token = wx.getStorageSync('token')
    if(!this.data.firstIn){
      this.getLookedList()
      this.getState()
      if(token){
        this.getPmNum()
      }
    }
  },
  toStore(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/shopHome/home/home?marchantId=' + id,
    })
  },
  toDetails(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/Index/GoodsDetails/GoodsDetails?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // 获取状态
  getState(){
    return app.sjrequest('/basic/queryCountData',{}).then(res=>{
      this.setData({countData:res.data.data})
    })
  },
  //获取拍卖数量
  getPmNum(){
    app.request.auctionRequest('/bidding/orderAndBiddingCount',{}).then(res=>{
      this.setData({
        pmNum:res.data.data
      })
    })
  },
  onReady: function () {
 
  },
  
})