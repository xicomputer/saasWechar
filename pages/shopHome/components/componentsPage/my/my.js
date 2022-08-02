let app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    signData: Object,  // 签到数据
    mainBusinessModel: {
      type: String,
    },
    userInfo: {
      type: Object,
      value: {}
    },
    marchantId: {
      type: Number,
      value: 0
    },
    orderNum: {
      type: Array,
      value: []
    },
    cityOrderNum: {
      type: Array,
      value: []
    },
    noticeNum: {
      type: Number,
      value: 0
    },
    toStoreOrderNum: {
      type: Array,
      value: []
    },
    isToStore: {
      type: Boolean,
      value: false
    },
    isWuliu: {
      type: Boolean,
      value: false
    },
    isToCity: {
      type: Boolean,
      value: false
    },
    isDistribution: {
      type: Number,
      value: 0
    },
    CouponsNum: {
      type: [Number, String]
    },
    jifenNum: {
      type: [Number, String],
      value: 0
    },
    activityInfo: {
      type: Object
    },
    list: {
      type: Array,
      value: []
    },
    codeInfo: {
      type: Array,
    },
    orderSwitch: {
      type: [Number, String]
    },
    toolsListNums: {
      type: Object,
      value: {}
    }
  },
  observers: {
    "orderNum": function(nowVal) {
      let count = 0
      for (let item of nowVal) {
        count += item
      }
      this.setData({
        regularOrdersNum: count
      })
    },
    "toStoreOrderNum": function(nowVal) {
      let count = 0
      for (let item of nowVal) {
        count += item
      }
      this.setData({
        bookingOrdersNum: count
      })
    },
    "cityOrderNum": function(nowVal) {
      let count = 0
      for (let item of nowVal) {
        count += item
      }
      this.setData({
        sameOrderNum: count
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 普通订单渲染数据
    regularOrdersNum: 0,  // 普通订单数量
    bookingOrdersNum: 0,  // 活动订单数量
    sameOrderNum: 0,  // 同城订单数量
    memberInfo: '' , // 会员积分
    deliveryOrderList: [{
        icon: 'https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/basics-New%2F%E9%A6%96%E9%A1%B5_slices%2FMy%2F%E7%89%A9%E6%B5%81%E8%AE%A2%E5%8D%95.png',
        name: '物流订单',
        page: "orderList" // 不同的组件，原为普通订单
      },
      {
        icon: 'https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/basics-New%2F%E9%A6%96%E9%A1%B5_slices%2FMy%2F%E5%88%B0%E5%BA%97%E8%AE%A2%E5%8D%95.png',
        name: '到店订单',
        page: "orderListTake"
      },
      {
        icon: 'https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/basics-New%2F%E9%A6%96%E9%A1%B5_slices%2FMy%2F%E5%90%8C%E5%9F%8E%E8%AE%A2%E5%8D%95.png',
        name: '同城订单',
        page: "orderListCity"
      },
    ],

    cityOrderList: [{
        icon: '/pages/img/my/daifukuan.png',
        name: '待付款'
      },
      {
        icon: '/pages/img/my/daifahuo.png',
        name: '待接单'
      },
      {
        icon: '/pages/img/my/city.png',
        name: '待收货'
      },
      {
        icon: '/pages/img/my/daipingjia.png',
        name: '已完成'
      },
      {
        icon: '/pages/img/my/tuikuan.png',
        name: '已退款'
      },
    ],
    reservationList: [ //预定/自取
      {
        name: '待付款',
        icon: 'me_icon1'
      },
      {
        name: '待自取',
        icon: 'me_icon2'
      },
      {
        name: '已完成',
        icon: 'me_icon4'
      },
    ],
    selfOrderList: [{
        icon: '/pages/img/my/daifukuan.png',
        name: '待付款'
      },
      {
        icon: '/pages/img/my/daifahuo.png',
        name: '待使用'
      },
      {
        icon: '/pages/img/my/daipingjia.png',
        name: '已完成'
      }
    ],
    distributionList: [ //同城配送
      {
        name: '待付款',
        icon: 'me_icon1'
      },
      {
        name: '待接单',
        icon: 'me_icon2'
      },
      {
        name: '待收货',
        icon: 'me_icon6'
      },
      {
        name: '已完成',
        icon: 'me_icon4'
      },
      {
        name: '已退款',
        icon: 'me_icon5'
      },
    ],
    // 活动订单渲染数据
    toolList: [
      // {
      // icon: '/pages/img/my/kefu.png', name: '客服',
      // url:'/pages/order/contact/contact'
      // },
      
      {
        icon: 'https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/basics-New%2F%E9%A6%96%E9%A1%B5_slices%2FMy%2F%E7%A7%92%E6%9D%80.png',
        name: '秒杀',
        jump: true,
        url: '/pages/seckill/order-classify/order-classify',
        numKey: 'jsmsOrderCount'
      }
    ],
    // 精选服务渲染数据
    service: [
      // {
      //   name: '我的收藏',
      //   icon: '../static/My/收藏.png',
      //   jump: true,
      //   page: ''
      // },
      {
        name: '我的地址',
        icon: 'https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/basics-New%2F%E9%A6%96%E9%A1%B5_slices%2FMy%2F%E6%94%B6%E8%97%8F.png',
        jump: true,
        url: '/pages/Address/AddressList/AddressList'
      },
      {
        name: '发票信息',
        icon: 'https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/basics-New%2F%E9%A6%96%E9%A1%B5_slices%2FMy%2F%E5%8F%91%E7%A5%A8%E4%BF%A1%E6%81%AF.png',
        jump: true,
        url: '/pages/Invoice/InvoiceList/InvoiceList'
      },
      {
        icon: 'https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/basics-New%2F%E9%A6%96%E9%A1%B5_slices%2FMy%2F%E5%9C%A8%E7%BA%BF%E5%AE%A2%E6%9C%8D.png',
        name: '在线客服',
        url: '/pages/order/contact/contact'
      },
    ],
    headList: [
      // { val: 0, unit: '元',name: '余额' },
      {
        val: 0,
        unit: '分',
        name: '积分'
      },
      {
        val: 0,
        unit: '张',
        name: '优惠券'
      },
    ],
    jifenNum: 0,
  },

  /* 组件生命周期 */
  lifetimes: {
    attached: function () {
      // this.getQueryInte()
      // this.getOrderNum();//获取数量
      this.getMemberInfo()
    },
    detached: function () {

    },
  },

  /* 组件的方法列表 */
  methods: {
    // 跳转激活会员
    toMember() {
      wx.navigateTo({
        url: `/pages/member/card/card?marchantId=${this.data.marchantId}`,
      })
    },
    toRegister() {
      wx.navigateToMiniProgram({
        appId: 'wxab96682e938690ad',
      })
    },
    toFenXiao() {
      wx.navigateToMiniProgram({
        appId: 'wxcad66233bce675b4',
        path: `/pages/tabBar/home/home?marchant=${this.data.marchantId}`
      })
    },
    // 旧跳转接口
    // pagesTo(e) {
    //   let idx = e.currentTarget.dataset.idx;
    //   var configItem = this.data.toolList[idx];
    //   if (configItem.jump) {
    //     wx.navigateTo({
    //       url: configItem.url
    //     });
    //   } else {
    //     this.triggerEvent('pagesTo', idx)
    //   }
    // },
    // 新精选服务跳转接口
    pagesTo(e) {
      let idx = e.currentTarget.dataset.idx;
      var configItem = this.data.service[idx];
      if (configItem.jump) {
        wx.navigateTo({
          url: configItem.url
        });
      } else {
        this.triggerEvent('pagesTo', 0)  //由于父组件触发函数需要0，所以传个零，不然无法进入客服页面
      }
    },
    // 跳转活动页面
    toActive(e) {
      let idx = e.currentTarget.dataset.idx;
      var configItem = this.data.toolList[idx];
      if (configItem.jump) {
        wx.navigateTo({
          url: configItem.url
        });
      }
    },
    //  暂时跳优惠券
    toDetail(e) {
      let idx = e.currentTarget.dataset.idx
      this.triggerEvent('toDetail', idx)
    },

    getQueryInte() {
      let that = this
      app.sjrequest('/integral/queryInte', {
        marchantId: this.data.marchantId
      }).then(res => {
        that.setData({
          jifenNum: res.data.data.score
        })
      })
    },

    // 获取数字
    getOrderNum() {
      var data = {
        type: 2,
        marchantId: this.data.marchantId
      }
      app.sjrequest('/basic/queryCountAmount', data).then(res => {
        var result = res.data.data;
        var orderNum = [
          result.citywideOrderState0,
          result.citywideOrderState1,
          result.citywideOrderState2,
          0, result.citywideRefundState
        ]
        var cityOrderNum = [result.sendState0, result.sendState1, result.sendState2]
        let couponNum = 'headList[1].num';
        var toStoreOrderNum = [result.fetchState0, result.fetchState1, 0];
        this.setData({
          orderNum,
          cityOrderNum,
          toStoreOrderNum,
          [couponNum]: result.countUserCoupons,
          noticeNum: result.sumCount,
        })
      })
    },
    //授权
    bindGetUserInfo(res) {
      wx.getUserProfile({
        lang: 'zh_CN',
        desc: '获取用户信息',
        complete: res => {
          console.log('授权信息=====：', res);
          if (res.encryptedData) {
            this.setData({
              isAuthorization: false
            });
            console.log(res, "5555555555555555")
            wx.setStorageSync('wx_userinfo_key', res);
            //同意授权
            this.login();
          } else {
            //拒绝授权
            setTimeout(() => {
              wx.showToast({
                title: '授权未成功',
                icon: 'none'
              });
            }, 1000);
            this.cancel()
          }
        },
      });
    },
    cancel() {
      var pages = getCurrentPages()
      var beforePage = pages[pages.length - 2]
      wx.navigateBack({
        delta: 0,
        success: function () {
          beforePage.onLoad(app.globalData.options)
        }
      })
    },
    //登录
    login() {
      var that = this;
      var userInfo = wx.getStorageSync('wx_userinfo_key');
      var encryptedData = userInfo.encryptedData;
      var iv = userInfo.iv;
      var openid = wx.getStorageSync('thirdWxOpenId');
      let appid = wx.getStorageSync('appid');
      let data = {
        appid,
        openid,
        encryptedData,
        iv
      }
      wx.showLoading({
        title: '加载中'
      });
      app.sjrequest('/thirdWxLogin/auth', data).then(res => {
        wx.hideLoading();
        that.cancel()
        that.triggerEvent('reload')
      })
    },

    goCoupons() {
      console.log("999")
      wx.navigateTo({
        url: `/pages/Index/couponList/couponList?marchantId=${this.data.marchantId}`,
      })
    },
    goIntegral() {
      wx.navigateTo({
        url: `/pages/Index/integral/integral?marchantId=${this.data.marchantId}`,
      })
    },
    saveImg(e) {
      let img = e.currentTarget.dataset.src
      wx.downloadFile({
        url: img,
        success(e) {
          wx.saveImageToPhotosAlbum({
            filePath: e.tempFilePath,
            success() {
              wx.showToast({
                title: '保存成功',
                icon: "none"
              })
            }
          })
        },
        fail(e) {
          console.log(e)
        }
      })
    },
    aciveUrl(e) {
      let marchantId = this.data.marchantId;
      var mainBusinessModel = this.data.mainBusinessModel;
      wx.navigateTo({
        url: "/pages/shopHome/member/member?marchantId=" + marchantId + '&mainOrderType=' + mainBusinessModel,
      })
    },
    // 展示图片
    goimg(e) {
      let srcArr = []
      for (let arr of this.data.codeInfo) {
        srcArr.push(arr.wechatgroupqrcode)
      }
      wx.previewImage({
        urls: srcArr
      })
    },

    getMemberInfo(){
      let data = { marchantId:this.data.marchantId,type:1}
      app.sjrequest('/member/queryMemberInfo',data).then(res=>{
        if(res.data.code == 200) {
          console.log(res.data.data, '会员积分')
          this.setData({memberInfo:res.data.data})
          if(res.data.data.member){
            this.setData({type:1})
          }
        }
      })
    },
  },
})