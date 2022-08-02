// pages/tabPage/me/me.js
const app = getApp();
const time = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logisticsOrderList:[//物流订单
      {name:'待付款',icon:'me_icon1'},
      {name:'待发货',icon:'me_icon2'},
      {name:'待收货',icon:'me_icon3'},
      {name:'已完成',icon:'me_icon4'},
      {name:'退款退货',icon:'me_icon5'},
    ],
    distributionList:[//同城配送
      {name:'待付款',icon:'me_icon1'},
      {name:'待接单',icon:'me_icon2'},
      {name:'待收货',icon:'me_icon6'},
      {name:'已完成',icon:'me_icon4'},
      {name:'已退款',icon:'me_icon5'},
    ],
    reservationList:[//预定/自取
      {name:'待付款',icon:'me_icon1'},
      {name:'待自取',icon:'me_icon2'},
      {name:'已完成',icon:'me_icon4'},
    ],
    toolList:[//我的工具
      {
        icon: '/pages/img/my/kefu', name: '客服',
        url:'/pages/order/contact/contact'
      },
      {
        icon: '/pages/img/my/shop-cart', name: '购物车',
        url:'/pages/Index/ShopCart/ShopCart'
      },
      {
        icon: '/pages/img/my/wodedontai', name: '评论',
        url:'/pages/Index/dynamic/commentList/commentList'
      },
      {
        icon: '/pages/img/my/notice', name: '优惠券',
        url:'/pages/Index/couponList/couponList'
      },
      {
        icon: '/pages/img/my/paimai_icon', name: '喊价',
        url:`/pages/activity/pmhd/pmEnter/pmEnter`
      },
    ],
    userInfo:{},   // 用户信息
    cartNum:0,     // 购物车数量
    buton:false,
    orderNum: [],   // 物流订单数量
    cityOrderNum: [],  // 同城订单数量
    toStoreOrderNum: [],  // 到店订单数量
    noticeNum: 0,        // 通知数量
    lookedList:[],//我的足迹列表

    statusHeight:'',//状态栏高
    titleBarHeight:'',//标题栏高
    navHeadHeight:'',//头部导航栏高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.getSystemInfoAsync({
      success:res=>{
        var menuButtonInfo=wx.getMenuButtonBoundingClientRect();
        var statusHeight=res.statusBarHeight;
        var titleBarHeigth=menuButtonInfo.height;
        var navHeadHeight=statusHeight+titleBarHeigth+8;
        console.log(navHeadHeight);
        this.setData({navHeadHeight,statusHeight,titleBarHeigth});
      }
    });
    
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
        var wxUserInfo=wx.getStorageSync('wx_userinfo_key') || {};
        that.setData({ 
          userInfo:{
            ...res.data.data,
            nickName:wxUserInfo.userInfo.nickName,
            avatarUrl:wxUserInfo.userInfo.avatarUrl
          } 
        }) 
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  //获得购物车数量
  getCartNum(){
    app.sjrequest('/commodity/countTrolley',{}).then(res =>{
      var countTrolley = res.data.data.countTrolley
      this.setData({cartNum:countTrolley})
    })
  },
  toSetUp(){
    wx.navigateTo({
      url: '/pages/PersonalCenter/setUp/setUp',
    })
  },
  toNotice(){
    wx.navigateTo({
      url: '/pages/Notice/Notice',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 获取数字
  getOrderNum(){
    var data={type:2}
    app.sjrequest('/basic/queryCountAmount',data).then(res =>{
      var list = [res.data.data.citywideOrderState0,res.data.data.citywideOrderState1,res.data.data.citywideOrderState2,0,res.data.data.citywideRefundState]
      var cityList = [res.data.data.sendState0,res.data.data.sendState1,res.data.data.sendState2]
      var list1 = [res.data.data.fetchState0,res.data.data.fetchState1,0]
      this.setData({orderNum:list,cityOrderNum:cityList,toStoreOrderNum:list1,noticeNum:res.data.data.sumCount})
    })
  },

  // 获取足迹
  getLookedList(){
    return app.sjrequest('/marchant/queryFootprintList').then(res=>{
      res.data.data.forEach(item=>{
        item.updateTime = time.formatTimeSec(item.updateTime)
      });
      var lookedList=res.data.data;
      var len=lookedList.length;
      this.setData({
        lookedList: len>1?lookedList.slice(0,1):lookedList
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that =this;
    //查看是否授权
    wx.getSetting({
      success: function (res) {
        if (wx.getStorageSync('wx_userinfo_key')) {
          if(wx.getStorageSync('token')){
            that.setData({
              buton:false
            })
            that.userIf()
            that.getOrderNum()
          }else{
            that.setData({
              buton:true
            })
          }
        } else {
          that.setData({
            buton:true
          })
          //用户没有授权
        }
      }
    });
    this.getCartNum();
    this.getLookedList();
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