// pages/Index/Index.js
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import {
  getMainColor
} from '../../../utils/image-main-color.js'
const time = require('../../../utils/util')
const app = getApp()
const formate = require("../../../utils/util")

Page({
  tiemoutId: null, // 存储定时器
  tiemoutId2: null,
  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    navbarInitTop: 0, //导航栏初始化距顶部的距离
     isFixedTop: false, //是否固定顶部
    addcouponList1:[],
    addcouponList2:[],
    addcouponList3:[],
    isOpenSignIn: 0 ,   //签到活动是否开启  1开启 0关闭
    mainBanner: [], // banner主推图片，永远只有一条商品
    isShowSub: true, // 是否显示订阅浮窗
    hotLiveList: [], // 直播列表
    isTiktok: false, // 是否打开抖音复制口令
    isShowSignInPopup: true, // 是否显示签到活动的弹窗提示
    pageScrolling: false, // 页面正在滑动
    TTPTactivity: [], // 天天拼团活动
    JSMSactivity: [], // 急速秒杀活动
    TJFLactivity: [], // 退一反三活动
    addcouponList: [], // 优惠券列表的长度  .length
    isshowHead: false,
    marqueePace: 1, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    marquee_margin: 30,
    size: 32,
    interval: 20, // 时间间隔
    tempBaseUrl: 'https://xssj.letterbook.cn/applet/images/',
    statusBarHeight: app.globalData.getSystemInfo.statusBarHeight || 20, // 状态栏高度
    menuButtonLeft: app.globalData.MenuButton.left,
    menuButtonHeight: app.globalData.MenuButton.height + (app.globalData.MenuButton.top - app.globalData.getSystemInfo.statusBarHeight) * 2, // 导航栏高度
    statusAllHeight: app.globalData.getSystemInfo.statusBarHeight + app.globalData.MenuButton.height + (app.globalData.MenuButton.top - app.globalData.getSystemInfo.statusBarHeight) * 2,
    menuHeight: app.globalData.MenuButton.height, // 胶囊高度
    loadedList: {}, //记录已加载的tabbar页
    tempId: '',
    titleFlag: false,
    TypesNum: null,
    pageBg: '',
    topBoxBg: '', //顶部商家信息背景
    statusHeight: '', //状态栏高
    navTitleHeight: '', //标题栏高
    isAdapter: false,
    isClose: false, // 是否关店
    isWuliu: false, // 开启物流
    isToStore: false, // 开启到店
    isToCity: false, // 开启同城
    status: 1,
    status1: 1,
    orderSwitch: null, //开启支付
    navs: [{
        name: '购物车',
        src: '../../../img/my/menu-gwc.png',
        url: './ShopCart/ShopCart',
        inAnimation: 'menu-in-animation1',
        outAnimation: 'menu-out-animation1',
        bottom: '280rpx',
        right: '80rpx'
      },
      {
        name: '我的',
        src: '../../../img/my/menu-wd.png',
        url: '/pages/tabPage/me/me',
        bottom: '150rpx',
        right: '160rpx',
        inAnimation: 'menu-in-animation2',
        outAnimation: 'menu-out-animation2',
      },
      {
        name: '返回',
        src: '../../../img/my/menu-fh.png',
        url: 'top',
        bottom: '20rpx',
        right: '80rpx',
        inAnimation: 'menu-in-animation3',
        outAnimation: 'menu-out-animation3',
      }
    ],
    uniqueId: '', // 用户标识
    noticeContent: '',
    buton: true,
    showFollow: false, // 关注弹框
    toolList: [],
    marchantId: -1,
    noticeNum: 0,
    orderType: 0,
    markerInfo: [], //商家信息
    goodsList: [], //商品
    personnel: '', //关注
    shopList: [], //零售店铺
    hotelList: [], // 酒店店铺
    ltSix: [],
    lgFive: [],
    saleGoodsList: [],
    hotSaleGoodsList: [],
    videoList: [],
    nowSaleGoods: {},
    activeEnter: false,
    showTaskPop: false, // 任务弹框
    taskText: '你已完成发布动态任务获取3积分', // 任务文字
    shopIndex: 0,
    isFixed: false, // 是否吸顶
    isPromotion: false,
    isPromotionIcon: false,
    isDiscount: false,
    saleCanList: [],
    saleState: '已领取',

    show: false, //下单弹框
    skuList: [], //规格列表
    skuActive: null, //当前规格
    goodsData: {}, //当前商品数据
    buyNum: 1, //购买数量
    index: 0, //方式索引
    // tabbar
    nowTabbarText: '首页',
    tabList: [],
    recommends: [],
    tabList1: [{
        img: 'https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/basics-New%2F%E5%BA%95%E9%83%A8_slices%2F%E9%A6%96%E9%A1%B5%E6%9B%BF%E6%8D%A22.png',
        imgActive: 'https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/basics-New/%E5%BA%95%E9%83%A8_slices/%E9%A6%96%E9%A1%B5%403x.png',
        text: '首页',
        isHave: true
      },
      // {
      //   img:'/image/index/index7.png',
      //   imgActive:'/image/index/index7_active.png',
      //   text:'热卖',
      //   isHave:true
      // },
      {
        img: 'https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/basics-New%2F%E5%BA%95%E9%83%A8_slices%2F%E9%A6%96%E9%A1%B5%402x(1).png',
        imgActive: 'https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/basics-New/%E5%BA%95%E9%83%A8_slices/%E9%A6%96%E9%A1%B5%403x%20%281%29.png',
        text: '商品',
        isHave: true
      },
      {
        img: 'https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/basics-New/%E5%BA%95%E9%83%A8_slices/icon-%E9%9F%B3%E5%93%8D%20%403x.png',
        imgActive: 'https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/basics-New/%E5%BA%95%E9%83%A8_slices/icon-%E9%9F%B3%E5%93%8D%20%403x.png',
        text: '商家文化',
        isHave: true
      },
      // {
      //   img:'/image/index/index6.png',
      //   imgActive:'/image/index/index6_active.png',
      //   text:'会员',
      //   isHave:true
      // },
      {
        img: 'https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/basics-New%2F%E5%BA%95%E9%83%A8_slices%2Ficon-%E9%9F%B3%E5%93%8D%20%402x.png',
        // img: '/image/index/index5.png',
        // imgActive: '/image/index/index5_active.png',
        imgActive: 'https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/basics-New/%E5%BA%95%E9%83%A8_slices/Group%203206%403x.png',
        text: '购物车',
        isHave: true
      },
      // {
      //   img:'/image/index/index3.png',
      //   imgActive:'/image/index/index3_active.png',
      //   text:'订阅通知',
      //   isHave:true
      // },
      {
        img: 'https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/basics-New%2F%E5%BA%95%E9%83%A8_slices%2F%E6%88%91%E7%9A%84%201%402x.png',
        imgActive: 'https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/basics-New/%E5%BA%95%E9%83%A8_slices/%E6%88%91%E7%9A%84%201%403x.png',
        text: '我的',
        isHave: true
      },
    ],
    // 订阅通知
    weekList: ['星期日', '已签到', '未签到', '签到', '星期四', '星期五', '星期六'],
    commentList: [], // 评论列表
    storeDynamicList: [], // 商家动态列表
    storeList: [], // 小店排行列表
    // 我的
    headList: [
      // {
      //   num: 0,
      //   unit: '元',
      //   name: '余额',
      // },
      // {
      //   num: 0,
      //   unit: '张',
      //   name: '会员卡',
      // },
      {
        num: 0,
        unit: '分',
        name: '积分',
      },
      {
        num: 0,
        unit: '张',
        name: '优惠券',
      },
    ],
    toolOrderList: [{
        icon: '/pages/img/my/kefu.png',
        name: '客服',
        url: '/pages/order/contact/contact'
      },
      {
        icon: '/pages/img/my/shop-cart.png',
        name: '购物车',
        url: '/pages/Index/ShopCart/ShopCart'
      },
      {
        icon: '/pages/img/my/wodedontai.png',
        name: '评论',
        url: '/pages/Index/dynamic/commentList/commentList'
      },
      {
        icon: '/pages/img/my/notice.png',
        name: '优惠券',
        url: '/pages/Index/couponList/couponList'
      },
      {
        icon: '/pages/img/my/paimai_icon.png',
        name: '喊价',
        url: `/pages/activity/pmhd/pmEnter/pmEnter`
      },
      {
        icon: '/pages/img/my/store_apply.png',
        name: '小店申请',
      },
      {
        icon: '/pages/img/my/ruzhu.png',
        name: '商家入驻',
      },
      {
        icon: '/pages/img/my/price.png',
        name: '我的中奖',
        url: `/pages/shopHome/prize/prize`
      }
    ],
    isIntegral: 0, // 是否进入订阅通知
    userInfo: {}, // 用户信息
    orderNum: [], // 订单数字
    cityOrderNum: [], // 同城配送订单数字
    toStoreOrderNum: [], // 到店订单数字
    // 购物车
    openOverlay: false,

    show1: false,
    value: '',
    num: '',
    isAll: false,
    shopCartlist: [],
    listItem: '',
    // 热卖
    videoList: [],
    hotSaleGoodsList: [], // 热卖商品列表
    nowSaleGoods: {}, // 当前热卖商品
    isLogin: false,
    bgFlag: true,
    countDown: '', //积分活动倒计时
    timeData: {},
    overTime: false, // 倒计时结束,
    appName: "",
    pageBgScorll: "",
    CouponsNum: 0,
    NickFlag: false,
    codeFlag: false,
    codeImg: "",
    memberInfo: {},
    Moments: "0",
    codeInfo: [],
    toShoplist: [], //同城商品
    toShoplist2: [], //预订商品
    logisticsList: [], //物流商品
    settingImg: {},
    orderCount: 0, //销量数
    accessCount: 0, //访问数
    textFlag: true,
    ArticleList: [], // 商家文化数据
    shopListOther: [],
    businessInfo: {},
    memberGoodsList: [],
    commentList2s: [],
    businessItem: [{
        name: "全国发货"
      },
      {
        name: "到店自取"
      },
      {
        name: "同城配送"
      },
      {
        name: '拼团专区'
      },
      {
        name: "秒杀专区"
      },
      {
        name: "推荐返利"
      },
      {
        name: "会员专区"
      },
      {
        name: "商家文化"
      },
    ],
    currentIndex: "全国发货",
    auctionNum: 0,
    activityList: [{
        imgUrl: "https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/static/temp-hanjia.png",
        name: "全民喊价专场",
        linkUrl: "/pages/activity/pmhd/list/list"
      },
      {
        imgUrl: "https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/static/temp-jifen.png",
        name: "积分换好礼",
        linkUrl: "/pages/Index/integral/integral"
      },
    ],
    exchangeGoodsList: [],
    auctionList: [],
    signData: {},
    mmNotag: true,

    toolsListNums: {}, //个人中心我的工具红点数量
    tsfyOrderCount: 0, //推三反一订单数量

    topMenuList: [], //头部切换菜单
    nowMenuItem: {}, //当前激活的菜单项
    pushType: '', //首页推送活动类型 TJFL JSMS TTPT

    showActivityRkInfo: { //活动入口弹窗显示状态 信息
      popupBox: false,
      TJFL: false,
      TTPT: false,
      JSMS: false,
    },

    showHideStyle: '', //控制浏览用户显示隐藏样式 'show-bur'显示 'hide-bur'隐藏
    subscriptIndex: 0, //
    browseUser: [],

    mainBusinessModel: '', //主推页面字段 1物流 2预订 3同城
    mainGoodsList: [], //主推业务商品 物流 同城 预订  暂时代替商家推荐与banner中的商品，这个字段只显示4个商品
  },

  /**
   * 生命周期函数--监听页面加载
   */
 
  onLoad: function (options) {
    let imgFlag = app.globalData.imgFlag;
    // this.progressiveLoad()
    wx.setBackgroundColor({
      backgroundColor: '#111833', // 窗口的背景色为白色
    });

    if (options.currentIndex) {
      this.setData({
        currentIndex: options.currentIndex
      })
    }
    //
    if (app.globalData.scene == "1154") {
      let list = this.data.tabList1;
      var skinId = options.skinId;
      if (skinId > 4) {
        list[1].text = '商品推荐';
      }
      this.setData({
        isShare: true,
        tabList: list,
        appName: options.appName,
        pageBg: "bg_AllPage" + (options.skinId),
        topBoxBg: 'top-box-bg' + (options.skinId),
        tempId: skinId,
        marchantId: options.marchantId || -1,
        mmNotag: false
      }, () => {
        // this.getTopMenu(options.marchantId); //获取头部切换菜单
        // this.getActivity(options.marchantId)  // 获取活动列表
        this.indexShow();
        setTimeout(() => {
          this.queryBrowseUser();
        }, 4000); //获取浏览用户
      });

      if (!imgFlag) { // 获取商家上传的视频
        this.getImgUrl()
      }

    } else {
      app.userLogin(true).then(async (res) => {
        // let skinId = app.globalData.setInfo.skinId || "1";
        let skinId = ""
        if (app.globalData.setInfo.skinId == 13) {
          skinId = 3.1;
        } else {
          //  skinId = app.globalData.setInfo.skinId || "1";
          skinId = 3.1;
        }
        // let skinId = 3.1|| "1";
        let ids = app.globalData.setInfo.merchantId;
        if (!res.nickname && res !== 'true') {
          this.setData({
            NickFlag: true
          });
        }

        // let list = this.data.tabList1;
        if (skinId > 4) {
          list[1].text = '商品推荐';
        }
        if (!res.orderSwitch) {
          list.splice(2, 1);
        }

        this.setData({
          // tabList: list,
          businessInfo: app.globalData.setInfo,
          appName: app.globalData.setInfo.appName,
          pageBg: "bg_AllPage" + (skinId),
          topBoxBg: 'top-box-bg' + (skinId),
          tempId: skinId,
          marchantId: ids || -1,
          orderSwitch: res.orderSwitch
        }, () => {
          this.getTopMenu(ids); //获取头部切换菜单
          this.indexShow();
          setTimeout(() => {
            this.queryBrowseUser();
          }, 4000); //获取浏览用户
        });

        if (!imgFlag) { // 获取商家上传的视频
          this.getImgUrl()
        }

        if (options.scene) {
          const scene = decodeURIComponent(options.scene)
          await this.getCodeParams(scene);
        } else {
          this.setData({
            personnel: options.personnel || '',
            uniqueId: options.uniqueId || ''
          });
        }

       
      })
    }

    let loadedList = this.data.loadedList;
    loadedList[options.nowPage ? options.nowPage : "首页"] = true;
    this.setData({
      nowTabbarText: options.nowPage || "首页",
      loadedList: loadedList
    });
    this.getLiveList() // 获取直播间列表
    
   

  },

  onReady() {    
    setTimeout(() => {
      var environment = app.globalData.environment;
      this.setData({
        environment
      });
    }, 2500);
  },



  indexShow() {
    this.getShopList()
    this.getShopList2()
    this.getLogisticsList();
    this.getUserInfo()
    if (this.data.uniqueId) {
      this.getShareState()
    }
    // this.shopRecommendList()//5.30注
    // this.queryRecommendList() //商家推荐商品//5.30注
    // this.getCategoryGoods() //获得分类商品//5.30注
    this.isShowSale() //促销弹框
    // this.getLiveList() // 获取直播列表//5.30注
    // this.getCategoryGoodsList()//5.30注
    // this.getIsOpenSignIn()  //是否开启签到
    this.getMemberGoodsList()
    this.getOrderNums()
    this.getSignData()
    // this.shopRecommendList2()//5.30注
    // this.isShowPromotion()//5.30
    this.setData({
      activeStatuList: app.globalData.activeStatuList,
      isAdapter: app.globalData.isAdapter
    })
    // this.getWidth()//文字特效//5.30注
    this.getArticle()
    // this.WXgroup()//5.30注
    // this.getMemberInfo()//5.30注
    this.showMarkerInfo()
    // this.getIntegralInfo()
    // this.getAuctionList()
    // this.getUserIntegral()//5.30注
    this.getCommunityList()
    this.getCouponList()
    // this.getWillActivity('TTPT')  // 三个活动的接口//5.30注
    this.getWillActivity('JSMS')
    // this.getWillActivity('TJFL')//5.30注
  },
  //是否从小程序码进来
  getCodeParams(id) {
    let data = {
      id: id
    }
    let that = this
    return app.sjrequest('/marchant/queryIdentifica', data).then(res => {
      if (res.data.code == 200) {
        that.setData({
          scene: JSON.parse(res.data.data.scene),
          marchantId: JSON.parse(res.data.data.scene).id
        })
        app.globalData.marchantId = JSON.parse(res.data.data.scene).id
        if (that.data.scene.pid) {
          this.setData({
            personnel: that.data.scene.pid
          })
        }
        that.onShow()
      }
    })
  },
  
  // /activityBusiness/pageList

  //通知移植
  
 
   
  //通知end  
   
// 获取首页三个活动的数据， 调用三次
  getWillActivity(templateTag) {
    app.sjrequest1('/activityBusiness/pageList', {
      "merchantId": this.data.marchantId,
      templateTag,
    }).then(res => {
      if (res.statusCode == 200 && res.data.code === 0 && res.data.data) {
        var list = res.data.data.list;
        list.forEach(item => {
          var nowTime = new Date().getTime();
          if (item.state == 1) { //活动未开始
            var startTime = this._parseDate(item.startTime, 'number');
            var diffTimes = startTime - nowTime;
          } else {
            var endTime = this._parseDate(item.endTime, 'number');
            var diffTimes = endTime - nowTime;
          }

          item.diffTimes = diffTimes;
          item.times = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          }

          item.activityCommoditySkuList = item.activityCommoditySkuList || [];
          var skuItem = item.activityCommoditySkuList[0] || {};
          item.imageUrl = item.bannerImgUrls[0];
          item.price = skuItem.price;
        });
        var keyName = templateTag + 'activity';
        this.setData({
          [keyName]: list
        });
        console.log(this.data[keyName], keyName + '')
      }
    })
  },

  getTopMenu(marchantId) { //5至8模板顶部导航菜单
    app.sjrequest1('/appletMenu/list', {
      marchantId
    }).then(res => {
      if (res.statusCode == 200 && res.data.code === 0) {
        var data = res.data.data || [];
        var nowMenuItem = data[0] || {};
        var currentIndex = nowMenuItem.name;

        var tempArr = ['TTPT', 'TJFL', 'JSMS'];
        var showActivityRkInfo = this.data.showActivityRkInfo;
        var pushType = '';
        data.forEach(item => {
          var bool = tempArr.includes(item.code);
          if (bool && !pushType) {
            pushType = item.code
          }
          if (bool) {
            showActivityRkInfo.popupBox = true;
            showActivityRkInfo[item.code] = true;
            this.setData({
              showActivityRkInfo
            });
          }
        });
        this.setData({
          topMenuList: data,
          nowMenuItem,
          currentIndex,
          pushType
        });
      }
    });
  },


  // 获得积分倒计时
  geteCountDown() {
    let data = {
      marchantId: this.data.marchantId,
      type: 3
    }
    app.sjrequest('/integral/operateSignin', data).then(res => {
      if (res.data.code == 200) {
        let time1 = time.formatTimeSec(res.data.data.countDownTime || '')
        time1 = new Date(time1.replace(/-/g, '/')).getTime() - new Date().getTime()
        this.setData({
          countDown: time1
        })
      }
    })
  },
  changeTime(e) {
    this.setData({
      timeData: e.detail,
    });
  },
  // 倒计时结束
  overTime() {
    this.setData({
      overTime: true
    })
  },
  // 完成任务
  toFinishTask(e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url + '?marchantId=' + this.data.marchantId,
    })
  },

  //获得购物车数量
  getCartNum() {
    var data = {
      marchantId: this.data.marchantId
    }
    app.sjrequest('/commodity/countTrolley', data).then(res => {
      if (res.data.code == 200) {
        var countTrolley = res.data.data.countTrolley
        this.setData({
          cartNum: countTrolley
        })
      }
    })
  },
  // 跳会员
  toMember() {
    wx.navigateTo({
      url: `/pages/member/card/card?marchantId=${this.data.marchantId}`,
    })
  },
  // 跳会员
  toIntergral() {
    wx.navigateTo({
      url: `/pages/Index/integral/integral?marchantId=${this.data.marchantId}`,
    })
  },
  /**图片预览 */
  imgClick(e) {
    var src = e.currentTarget.dataset.src
    var imgList = e.currentTarget.dataset.list
    var list = []
    for (var index = 0; index < imgList.length; index++) {
      list[index] = imgList[index].httpAddress
    }
    wx.previewImage({
      current: src,
      urls: list
    })
  },
  /**商家基本信息 */
  showMarkerInfo() {
    var data = {
      'id': this.data.marchantId
    }
    app.sjrequest('/marchant/queryMarchantInfo', data).then(res => {
      console.log(res, '商家基本信息')
      if (res.data.code == 200) {
        var result = res.data.data;
        var businessInfo = this.data.businessInfo;
        businessInfo.headImage = result.logoPic;
        businessInfo.nickName = result.nickName;
        businessInfo.notify = result.notify
        businessInfo.status = result.status
        businessInfo.personalDetails = result.personalDetails
        businessInfo.entirelyAddress = result.entirelyAddress
        businessInfo.labelsList = result.labelsList
        businessInfo.openingTime = result.openingTime
        businessInfo.telephone = result.telephone
        businessInfo.address = result.address
        businessInfo.latitude = result.latitude
        businessInfo.longitude = result.longitude
        
     
        this.setData({
          businessInfo,
          
        });

        this.getMainGoods(result.mainBusinessModel); // 获取商家今日推荐商品
        this.getMainBanner(); // 获取banner图片和商品
        wx.setStorage({
          key: 'mainBusinessModel_key',
          data: result.mainBusinessModel
        });

        if (result.businessModel) {
          let listItem = this.data.businessItem;
          if (result.businessModel.indexOf('1') != -1) {
            this.setData({
              isWuliu: true
            })
          }

          if (result.businessModel.indexOf('2') != -1) {
            this.setData({
              isToCity: true
            })
            
          } else {
            listItem.map((res, index) => {
              if (res.name == "同城配送") {
                listItem.splice(index, 1)
              }
            })
          }
         
          if (result.businessModel.indexOf('3') != -1) {
            this.setData({
              isToStore: true
            })
          } else {
            listItem.map((res, index) => {
              if (res.name == "到店自取") {
                listItem.splice(index, 1)
              }
            })
          }
          if (this.data.isToStore) {
            this.data.tabList1[2].isHave = false
          
        }
          this.setData({
            businessItem: listItem
          })
        }
        let orderType = result.businessModel.split(',').sort()
        orderType = orderType[0]
        this.setData({
          orderType: orderType
        })
        // if(!result.isfans&&!this.data.buton){
        //   this.setData({
        //     showFollow:true
        //   })
        // }
        if (result.thepointSins) {
          result.thepointSins.forEach((item) => {
            item.addTime = formate.formatDate(item.addTime)
          })
        }
        var noticeTxt = ''
        if (result.notify) {
          result.notify.forEach(item => {
            noticeTxt = noticeTxt + item.content
          })
        }

        if (res.data.data.marchantCorrelationList.length) {
          var list = []
          var hotelList = []
          res.data.data.marchantCorrelationList.forEach(item => {
            if (item.marchantCorrelation.source == 1) {
              list.push(item)
            }
            if (item.marchantCorrelation.source == 2) {
              hotelList.push(item)
            }
          })
        }
        //result.shopTemplateId=7;测试赋值
        this.setData({
          tabList: this.data.tabList1,
          markerInfo: result,
          noticeContent: result.notify,
          shopList: list,
          hotelList: hotelList,
          mainBusinessModel: result.mainBusinessModel, //主推页面 物流 预订 同城
        });
      } else if (res.data.code == 338) {
        this.setData({
          isClose: true
        })
      }
    })
  },
  // 分享转发
  getShareState() {
    let data = {
      marchantId: this.data.marchantId,
      uniqueId: this.data.uniqueId,
      type: 4
    }
    app.sjrequest('/transiter/onTransmit', data).then(res => {})
  },




  async showDingYue1() {
    // 订阅
    var that = this
    wx.requestSubscribeMessage({
      tmplIds: [app.globalData.sj_commodity_modify, app.globalData.sj_commodity_add],
      success: function (res) {
        wx.getSetting({
          withSubscriptions: true,
          success: result => {
            if (result.subscriptionsSetting['5TDTuj6Dq289EzrnzvpHD3Y_MEranwSWe8bON7IJsNc'] == 'accept' || result.subscriptionsSetting['7Xn5f85WfODTkVQqQCWxNGuJA95Lm8jGYFYef0pnveI'] == 'accept') {
              that.setData({
                status1: 2
              })
              console.log('总是订阅')
            } else {
              console.log('订阅1次')
            }
            if (res['5TDTuj6Dq289EzrnzvpHD3Y_MEranwSWe8bON7IJsNc'] == 'accept' || res['7Xn5f85WfODTkVQqQCWxNGuJA95Lm8jGYFYef0pnveI'] == 'accept') {
              let data = {
                status: that.data.status1,
                marchantId: that.data.marchantId,
                templateIds: '5TDTuj6Dq289EzrnzvpHD3Y_MEranwSWe8bON7IJsNc,7Xn5f85WfODTkVQqQCWxNGuJA95Lm8jGYFYef0pnveI'
              }
              app.sjrequest('/basic/addsubscription', data).then(res => {
                if (res.data.code == 200) {
                  let isDingYue = 'markerInfo.subscribe1'
                  that.setData({
                    [isDingYue]: 1
                  })
                  wx.showToast({
                    title: '订阅消息成功',
                  })
                } else {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  })
                }
              })
            }
          }
        })
      },
      fail() {
        wx.showToast({
          title: '订阅消息失败,请点击右上角三个点中的设置打开消息订阅开关',
          icon: 'none'
        })
      }
    })
  },
  // 个人中心
  toMy() {
    wx.switchTab({
      url: '/pages/tabPage/me/me',
    })
  },

  /** 商家推荐商品 **/
  queryRecommendList() {
    var data = {
      'marchantId': this.data.marchantId,
      pageSize: 10,
      pageNum: 1
    }
    app.sjrequest('/commodity/queryRecommendList', data).then(res => {
      if (res.data.code == 200) {
        var result = res.data.data
        this.setData({
          recommends: result
        })
      }
    })
  },
  /** 店铺推荐 */
  shopRecommendList() {
    var data = {
      'marchantId': this.data.marchantId
    }
    app.sjrequest('/marchant/queryRecommendList', data).then(res => {
      if (res.data.code == 200) {
        var result = res.data.data
        this.setData({
          shopList: result,
        })
      }
    })
  },
  scroll(e) {
    this.setData({
      shopIndex: Math.round(e.detail.scrollLeft / 529 * 2)
    })
  },
  /** 添加关注 */
  addDelConcerns() {
    var data = {
      'marchantId': this.data.marchantId,
      'type': 1
    }
    if (this.data.personnel != 0) {
      data.saleUniqueId = this.data.personnel
    }
    app.sjrequest('/marchant/operateConcerns', data).then(res => {
      if (res.data.code == 200) {
        wx.showToast({
          title: '关注成功！',
          icon: 'success'
        })


        this.data.markerInfo.isfans = 1
        this.setData({
          markerInfo: this.data.markerInfo,
          showFollow: false
        })
      }
    })
  },

  // 关闭关注弹框
  closeFollow() {
    this.setData({
      showFollow: false
    });
  },

  /** 获得分类商品 */
  getCategoryGoods() {
    var orderTemplate = wx.getStorageSync('mainBusinessModel_key')
    var data = {
      'marchantId': this.data.marchantId,
      orderTemplate,
      pageCurr: 1,
      pageSize: 20
    }
    app.sjrequest('/commodity/queryClassifyCommodityList', data).then(res => {
      if (res.data.code == 200) {
        // res.data.data.forEach(item => {
        //   var dataList={'marchantId':this.data.marchantId,'classifyId':item.id,'pageCurr':1,'pageSize':5}
        //   app.sjrequest('/commodity/queryCommodityList',dataList).then(result =>{
        //     if(result.data.code==200){
        //       item.list = result.data.data
        //     }
        let items = []
        res.data.data.map((item, index) => {
          if (item.commodityList.length != 0) {
            items.push(item)
          }
        })
        this.setData({
          goodsList: items
          
        });
        //   })
        // });
        
      }
      console.log(this.data.goodsList,'set');
    })
  },
  /** 查看商品详情 */
  toGoodsDetails(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/Index/GoodsDetails/GoodsDetails?id=' + id
    })
  },
  /** 加入购物车 */
  addCart(e) {
    var item = e.item || e.currentTarget.dataset.item
    item.itemText = ''
    this.setData({
      goodsData: item,
      buyNum: 1,
      skuActive: null,
      show: true,
    })
    this.getSku(item.commodityId);

    // var item = e.currentTarget.dataset.item

    // var data={
    //   'tempSpecId':item.tempSkuId,
    //   'commodityId':item.commodityId,
    //   'amount':1,
    //   'marchantId':this.data.marchantId,
    //   'operate':1
    // }
    // app.sjrequest('/commodity/addTrolley',data).then(res =>{
    //   if(res.data.code==200){
    //     this.getCartNum()
    //     wx.showToast({
    //       title:'添加成功',
    //       icon:'success'
    //     })
    //   }
    // })
  },
  // 获得商品规格
  getSku(commodityId) {
    var that = this
    var data = {
      'commodityId': commodityId,
      marchantId: this.data.marchantId
    }
    app.sjrequest('/commodity/queryCommoSku', data).then(res => {
      if (res.data.code == 200) {
        that.setData({
          skuList: res.data.data,
          goodsData: res.data.data[0]
        })
        res.data.data.forEach((item, index) => {
          let skuItem = 'skuList[' + index + '].active'
          if (item.isDefault == 1) {
            that.setData({
              [skuItem]: true,
              goodsData: item
            })
          } else {
            that.setData({
              [skuItem]: false
            })
          }
        })
      }
    })
  },
  //关闭商品弹框
  onClose1() {
    this.setData({
      show: false,
    })
  },
  // 切换 sku
  handleSelectSku(e) {
    if (this.data.skuActive === e.currentTarget.dataset.index) {
      return
    } else {
      this.setData({
        skuActive: e.currentTarget.dataset.index
      })
      this.data.skuList.forEach((el, i) => {
        let skuItem = 'skuList[' + i + '].active'
        this.setData({
          [skuItem]: false
        })
      })
      let skuItem = 'skuList[' + this.data.skuActive + '].active'
      this.setData({
        [skuItem]: true,
        goodsData: this.data.skuList[this.data.skuActive]
      })
    }
  },
  // 编辑数量
  handleEdit(e) {
    if (e.currentTarget.dataset.type === 'minus') {
      // 减一
      if (this.data.buyNum === 1) {
        wx.showToast({
          title: '数量不能少于1',
          icon: 'none'
        })
        return
      } else {
        this.setData({
          buyNum: this.data.buyNum - 1
        })
      }
    } else {
      // 加一
      this.setData({
        buyNum: this.data.buyNum + 1
      })
    }
  },
  // 加入购物车
  handlePopupAddCart() {
    var data = {
      'tempSpecId': this.data.goodsData.id,
      'commodityId': this.data.goodsData.commodityId,
      'amount': this.data.buyNum,
      'marchantId': this.data.marchantId,
      'operate': 1
    }
    app.sjrequest('/commodity/addTrolley', data).then(res => {
      if (res.data.code == 200) {
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        })
        this.getCartNum()
      }
    })
  },
  //确认下单
  surexf() {
    if (this.data.goodsData.stock == 0) {
      wx.showToast({
        title: '暂无库存',
        icon: 'none'
      })
      return
    }
    let jsonData = {
      marchantId: this.data.marchantId,
      orderType: this.data.orderType,
      commoditys: [{
        commodityId: this.data.goodsData.commodityId,
        tempSpecId: this.data.goodsData.id,
        amount: this.data.buyNum
      }]
    }
    // 使用社交token
    const token = wx.getStorageSync('token')
    app.sjrequest1('/order/onekeyAboutOrder', jsonData, token).then(res => {
      if (res.data.code === 200) {
        // 更新 store 数据
        app.store.setState({
          submitObj: JSON.stringify(res.data.data)
        })
        wx.navigateTo({
          url: '/pages/order/submitOrder/submitOrder'
        })
      }
    })
    // }
  },
  /** 获取秒杀数据 */
  getSeckill() {
    const data = {
      merchantId: this.data.marchantId
    }
    var token = wx.getStorageSync('token')
    app.sjrequest1('/activity/findActivityState', data, token).then(res => {
      if (res.data.code == 200) {
        var list = res.data.data
        list.forEach(item => {
          switch (item.state) {
            case -1:
              item.name = '未开放';
              break;
            case 0:
              item.name = '未发布';
              break;
            case 1:
              item.name = '未开始';
              break;
            case 2:
              item.name = '进行中';
              break;
            case 3:
              item.name = '已结束';
              break;
          }
        })
        this.setData({
          toolList: res.data.data
        })
      }
    })
  },
  /** 去秒杀 */
  toSeckill(e) {
    var index = e.currentTarget.dataset.index
    if (this.data.toolList[index].state == 1 || this.data.toolList[index].state == 2) {
      wx.navigateTo({
        url: this.data.toolList[index].url + '?marchantId=' + this.data.marchantId
      })
    } else {
      wx.showToast({
        title: '活动' + this.data.toolList[index].name,
        icon: 'none'
      })
    }
  },
  //判断弹什么框
  isShowWhatBox() {
    const that = this
    let activeStatuList = that.data.activeStatuList
    let listIndex = -1
    // 判断是否弹过促销框和优惠框
    let flag = 0 //0-都没弹过，1-都弹过，2-只弹过促销框，3-只弹过优惠框
    activeStatuList.forEach((item, index) => {
      if (item.marchantId == that.data.marchantId) {
        if (item.isPromotion == true) {
          if (item.isDiscount == true) {
            flag = 1 //都弹过
          } else {
            flag = 2 //只弹过促销框
            listIndex = index
          }
          return
        }
        if (item.isDiscount == true) {
          if (item.isPromotion == true) {
            flag = 1 //都弹过
          } else {
            flag = 3 //只弹过优惠框
            listIndex = index
          }
          return
        }
      }
    })
    // flag：0-都没弹过，1-都弹过，2-只弹过促销框，3-只弹过优惠框
    if (flag == 0) { //都没弹过
      activeStatuList.push({
        marchantId: that.data.marchantId,
        isPromotion: true,
        isDiscount: false,
        discountNum: 0
      })
      that.setData({
        // isPromotion: true
        isPromotionIcon: true
      })
      // 优惠判断
      that.isShowSale()
    } else if (flag == 1 || flag == 2) { //都弹过、弹过促销框
      that.setData({
        isPromotionIcon: true
      })
      // 优惠判断
      that.isShowSale()
    } else if (flag == 3) { //弹过优惠框
      activeStatuList[listIndex].isPromotion = true
      that.setData({
        isPromotion: true
      })
      // 优惠判断
      that.isShowSale()
    }
    app.globalData.activeStatuList = this.data.activeStatuList
  },
  /** 促销是否弹窗 */
  isShowPromotion() {
    const data = {
      'marchantId': this.data.marchantId
    }
    app.sjrequest('/commodity/queryPromotionList', data).then(res => {
      if (res.data.code == 200) {
        if (res.data.data.length) {
          this.isShowWhatBox() //判断弹什么框
        }
      }
    })
  },
  // 关闭促销弹窗
  promotionClose() {
    this.setData({
      isPromotion: false,
      isPromotionIcon: true
    })
    this.isShowSale()
  },
  // 进入促销列表
  promotionEnter() {
    this.setData({
      isPromotion: false,
      isPromotionIcon: true
    })
    wx.navigateTo({
      url: './promotionList/promotionList?marchantId=' + this.data.marchantId + '&marchantName=' + this.data.markerInfo.nickName,
    })
  },
  // 进入游戏抽奖列表
  yxcjEnter() {
    wx.navigateTo({
      url: '/pages/activity/yxcj/activeList/activeList?marchantId=' + this.data.marchantId,
    })
  },
  // 优惠是否弹框
  isShowSale() {
    let data = {
      marchantId: this.data.marchantId
    }
    app.sjrequest('/coupons/queryCouponsGet', data).then(res => {
      if (res.data.code == 200) {
        if (res.data.data.length) {
          let saleCanList = []
          res.data.data.forEach((item) => {
            let endTime = formate.formatDateTime2(item.endTime)
            item.endTime = endTime.split(" ")[0]
            let startTime = formate.formatDateTime2(item.startTime)
            item.startTime = startTime.split(" ")[0]
            if (item.isDraw == 0) {
              saleCanList.push(item)
              this.setData({
                isDiscount: true,
                saleState: '点击领券'
              })
            }
            item.endTime = formate.formatDate(item.endTime)
          })
          this.setData({
            saleCanList: saleCanList
          })
          app.globalData.activeStatuList = this.data.activeStatuList
        }
      }
    })

  },
  // 关闭优惠弹窗
  closeSale() {
    this.setData({
      isDiscount: false,
    })
  },
  receiveSale() {
    var data = {
      couponsIds: []
    }
    this.data.saleCanList.forEach(item => {
      if (item.isDraw == 0) {
        data.couponsIds.push(item.id)
      }
    })
    data.couponsIds = data.couponsIds.toString()
    var token = wx.getStorageSync('token')
    app.sjrequest('/coupons/getCoupons', data, token).then(res => {
      if (res.data.code == 200) {
        this.setData({
          isDiscount: false
        })
        wx.showToast({
          title: '领取成功',
          icon: 'none'
        })
        this.getCouponList()
        this.reCoupons()
      }
    })
  },

  toMe() {
    wx.switchTab({
      url: '/pages/tabPage/me/me',
    })
  },

  // tabbar
  changeTab(e) {
    // 接收传过来的tab名称
    let text = e.detail;
    let loadedList = this.data.loadedList;
    loadedList[text] = true;
    this.setData({
      nowTabbarText: text,
      loadedList: loadedList
    })
    // 切换category-pages组件后，开始渲染里面的rig-height组件高度
    if (text == '首页') {
      wx.setNavigationBarTitle({
        title: this.data.appName ? this.data.appName : ""
      })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
    }
    wx.navigationStyle
    if (text == '活动') {
      wx.setNavigationBarTitle({
        title: '活动'
      })
      // this.getCategoryGoodsList()//5.30注
      // this.getAuctionList()
    }
    if (text == '热卖') {
      wx.setNavigationBarTitle({
        title: '热卖'
      });
      // this.getVideoList()//5.30注
    }
    if (text == '购物车') {
      wx.showLoading({
        title: '加载中'
      });
      this.getCartData();
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
      wx.setNavigationBarTitle({
        title: '购物车'
      });
    }
    if (text == '订阅通知') {
      wx.setNavigationBarTitle({
        title: '订阅通知'
      });
    }
    if (text == '我的') {
      this.getOrderNum()
      this.getUserIntegral()
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
      wx.setNavigationBarTitle({
        title: '我的'
      });
    }
    if (text == '会员') {
      wx.setNavigationBarTitle({
        title: '会员'
      });
    }
    if (text == '商品推荐') {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
      wx.setNavigationBarTitle({
        title: '商品推荐'
      });
    }

    if (text == '活动专区') {
      wx.setNavigationBarTitle({
        title: '活动专区'
      })
    }
  },



  // 去下单
  goBuy(e) {
    var item = e.currentTarget.dataset.item
    item.stock = '请选择规格'
    item.itemText = '请选择规格'
    this.setData({
      goodsData: item,
      buyNum: 1,
      skuActive: null,
      show: true
    })
    this.getSku(item.id)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
    let appName = extConfig.appName ? extConfig.appName : ""
    wx.hideHomeButton(); //隐藏返回首页按钮

   

    var _this = this;
var query = wx.createSelectorQuery()
 query.select('#navbar').boundingClientRect();
 query.selectViewport().scrollOffset();
 query.exec(function(res) {
   console.log(res,'topppppppppp');
   _this.setData({
    navbarInitTop: res[0].top
   })
 })

    if (this.data.marchantId != -1) {
      this.getCartNum()
      this.getUserInfo()
      this.getUserIntegral()
      this.getOrderNum()
      this.geteCountDown() //获得积分任务列表
    }
    if (this.data.nowTabbarText == '我的') {}
  },
  // 获取数字
  getOrderNum() {
    var data = {
      type: 2,
      marchantId: this.data.marchantId
    }
    app.sjrequest('/basic/queryCountAmount', data).then(res => {
      var result = res.data.data || {};
      var orderNum = [
        result.citywideOrderState0,
        result.citywideOrderState1,
        result.citywideOrderState2,
        0, result.citywideRefundState,
      ]
      var cityOrderNum = [result.sendState0, result.sendState1, result.sendState2]
      let couponNum = 'headList[1].num';
      var toStoreOrderNum = [result.fetchState0, result.fetchState1, 0];

      var toolsListNums = this.data.toolsListNums;
      toolsListNums = {
        tsfyOrderCount: result.tsfyOrderCount, //推荐返利订单数
        jsmsOrderCount: result.jsmsOrderCount, //秒杀订单数
        ttptOrderCount: result.ttptOrderCount, //拼团订单数
      }

      this.setData({
        orderNum,
        cityOrderNum,
        toStoreOrderNum,
        [couponNum]: result.countUserCoupons,
        noticeNum: result.sumCount,
        CouponsNum: result.countUserCoupons,
        toolsListNums,
      })
    })
  },
  toWrite() {
    wx.navigateTo({
      url: `/pages/Index/dynamic/postComment/postComment?marchantId=${this.data.marchantId}`
    })
  },
  // 点赞/取消
  operationPraise(e) {
    const {
      id,
      idx
    } = e.currentTarget.dataset
    let data = {
      commentId: id
    }
    return app.sjrequest('/marchant/operationPraise', data).then(res => {
      let isPraise = 'commentList[' + idx + '].isPraise'
      let praise = 'commentList[' + idx + '].praise'
      if (this.data.commentList[idx].isPraise) {
        this.setData({
          [isPraise]: 0,
          [praise]: this.data.commentList[idx].praise - 1
        })
      } else {
        this.setData({
          [isPraise]: 1,
          [praise]: this.data.commentList[idx].praise + 1
        })
      }
    })
  },
  // 更多评论
  toMore() {
    wx.navigateTo({
      url: `/pages/Index/dynamic/commentList/commentList?marchantId=${this.data.marchantId}&stick=1`,
    })
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  //  我的
  pagesTo(e) {
    var idx = e.detail
    switch (idx) {
      case 0:
        wx.navigateTo({
          url: this.data.toolOrderList[idx].url + `?marchantId=${this.data.marchantId}&marchantName=${this.data.markerInfo.nickName}&logoPic=${this.data.markerInfo.logoPic}`,
        })
        break;
      case 2:
        wx.navigateTo({
          url: this.data.toolOrderList[idx].url + `?marchantId=${this.data.marchantId}` + `&stick=2`,
        })
        break;
      case 5:
        wx.navigateToMiniProgram({
          appId: 'wxcad66233bce675b4',
          path: `/pages/tabBar/home/home?marchant=${this.data.marchantId}`
        })
      default:
        wx.navigateTo({
          url: this.data.toolOrderList[idx].url + `?marchantId=${this.data.marchantId}`,
        })
    }
  },
  // 跳推广中心
  jumptuiguan(){
    wx.showToast({
      title: '暂未开放',icon:'none'
    })
    // wx.navigateTo({
    //   url: `/pages/extension/list/list?marchantId=${this.data.marchantId}`,
    // })
  },
  jumpTel(){
      wx.makePhoneCall({
        phoneNumber: this.data.businessInfo.telephone
      })
  },
  toWebViewPage(e) {
    var link = e.currentTarget.dataset.link;
    wx.navigateTo({
        url: '/pages/shopHome/webView/webView?link=' + link,
    });
},

  // 跳会员
  toMember() {
    wx.navigateTo({
      url: `/pages/member/card/card?marchantId=${this.data.marchantId}`,
    })
  },
  //  暂时跳优惠券

  // 获取优惠券列表
  getCouponList() {

    let data = {
      marchantId: this.data.marchantId
    }

    return app.sjrequest('/coupons/queryCouponsList', data).then(res => {

      if (res.data.code == 200) {
        console.log(res.data,'addcouponList');
        wx.hideLoading()
        this.setData({
          addcouponList: res.data.data.couponsList1.length,
          addcouponList1:res.data.data.couponsList1,
          addcouponList2:res.data.data.couponsList2,
          addcouponList3:res.data.data.couponsList3
          
        })
        setTimeout(() => {
          this.setData({
            loading: false
          })
        }, 500)
      }
    })
  },


  toDetail(e) {
    let idx = e.detail
    switch (idx) {
      case 0:
        if (this.data.isIntegral) {
          wx.navigateTo({
            url: '/pages/Index/integral/integral?marchantId=' + this.data.marchantId,
          })
        } else {
          wx.showToast({
            title: '商家未开放',
            icon: 'none'
          })
        }
        break;
      case 1:
        wx.navigateTo({
          url: '/pages/Index/couponList/couponList?marchantId=' + this.data.marchantId,
        })
        break;
      default:
        wx.showToast({
          title: '敬请期待',
          icon: 'none'
        })
    }
  },
  // 获取用户信息
  getUserInfo() {
    let data = {
      marchantId: this.data.marchantId
    }
    app.sjrequest('/userRegister/queryUserInfo', data).then(res => {
      if (res.data.code == 200) {
        wx.hideLoading()
        if (res.data.data.uniqueId) {
          wx.setStorage({
            data: res.data.data.uniqueId,
            key: 'uniqueId1',
            activityInfo: res.data.data
          })
        }

        // if(res.data.data.community==0){   // 未开启订阅通知
        //   let tabs = 'tabList1[5].isHave'
        //   this.setData({
        //     [tabs]:false
        //   })
        // }else{
        //   let tabs = 'tabList1[4].isHave'
        //   this.setData({
        //     [tabs]:false
        //   })
        // }
        // if(!res.data.data.statusv){   // 热卖是否开启
        //   let tabs = 'tabList1[1].isHave'
        //   this.setData({
        //     [tabs]:false
        //   })
        // }
        // if(!res.data.data.statusm){   // 会员是否开启
        //   let tabs = 'tabList1[3].isHave'
        //   this.setData({
        //     [tabs]:false
        //   })
        // }

        var wxUserInfo = wx.getStorageSync('wx_userinfo_key') || {};

        var businessItem = this.data.businessItem;
        var promotionStatus = res.data.data.promotionStatus;
        if (promotionStatus != 1) {
          var index = businessItem.findIndex(item => item.name == '秒杀');
          index !== -1 && businessItem.splice(index, 1);
        }

        var statusm = res.data.data.statusm;
        if (statusm != 1) {
          var index = businessItem.findIndex(item => item.name == '会员专区');
          index !== -1 && businessItem.splice(index, 1);
        }
        var activityList = this.data.activityList;
        var hasActive = res.data.data.hasActive;
        if (hasActive != 1) {
          var index = activityList.findIndex(item => item.name == '全民喊价专场');
          index !== -1 && activityList.splice(index, 1);
        }
        var integralSettingStatus = res.data.data.integralSettingStatus;
        if (integralSettingStatus != 1) {
          var index = activityList.findIndex(item => item.name == '积分换好礼');
          index !== -1 && activityList.splice(index, 1);
        }
        if (hasActive != 1 && integralSettingStatus != 1 && promotionStatus != 1) {
          var index = businessItem.findIndex(item => item.name == '活动专区');
          index !== -1 && businessItem.splice(index, 1);
        }

        this.setData({
          userInfo: {
            ...res.data.data,
            avatarUrl: wxUserInfo.userInfo.avatarUrl,
            nickName: wxUserInfo.userInfo.nickName,
          },
          businessItem,
          activityList
        })
      }
    })
  },
  //  查询用户积分
  getUserIntegral() {
    let data = {
      marchantId: this.data.marchantId
    }
    return app.sjrequest('/integral/queryInte', data).then(res => {
      if (res.data.code == 200) {
        let integral = 'headList[0].num'
        this.setData({
          jifenNum: res.data.data.score,
          isIntegral: res.data.data.isopen,
          [integral]: res.data.data.isopen ? res.data.data.score : 0
        })
      }
    })
  },
  //刷新数据
  reload() {
    this.getUserInfo()
  },
  //刷新数据
  reCoupons() {
    this.isShowSale()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  getCartData() {
    // 使用社交token
    const data = this.data.marchantId == -1 ? {} : {
      marchantId: this.data.marchantId
    }
    return app.sjrequest('/commodity/queryTrolleyList', data).then(res => {
      if (res.data.code === 200) {
        wx.hideLoading()
        this.setData({
          shopCartlist: res.data.data
        })
        this.disposeData()
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },



  //跳转商品详情
  toGoodsdetail(e) {
    wx.navigateTo({
      url: '/pages/Index/GoodsDetails/GoodsDetails?id=' + e.currentTarget.dataset.commodityid,
    })
  },
  toStore(e) {
    wx.navigateTo({
      url: '/pages/shopHome/home/home?marchantId=' + e.currentTarget.dataset.marchantid,
    })
  },

  // 监听输入的值
  handleInput(e) {
    if (e.detail.value != '') {
      let value = this.validateNumber(e.detail.value)
      this.setData({
        value: parseInt(value)
      })
    }
  },
  // 校验只能输入数字
  validateNumber(val) {
    return val.replace(/^(0+)|[^\d]+/g, '')
  },
  // 弹框确定事件
  confirm(e) {
    if (this.data.value > this.data.shopCartlist[this.data.editObj.pi].commoditys[this.data.editObj.ci].inventory) {
      Toast('该宝贝不能购买更多哦')
    } else {
      var goodItem = 'shopCartlist[' + this.data.editObj.pi + '].commoditys[' + this.data.editObj.ci + '].amount'
      this.setData({
        [goodItem]: this.data.value
      })
      this.changeCartInfo(this.data.editObj.pi, this.data.editObj.ci)
    }
  },
  // 弹框取消
  onClose() {
    this.setData({
      close: false
    });
  },




  // 处理数据
  disposeData() {
    const arr = this.data.shopCartlist
    var allSelect = true
    if (arr.length == 0) {
      allSelect = false
    }
    arr.forEach((el, i) => {
      var listItem = 'shopCartlist[' + i + '].hj'
      var listItemSelect = 'shopCartlist[' + i + '].isSelect'
      var num = 0
      var isSelet = true
      el.commoditys.forEach((it, idx) => {
        if (it.isPitch) {
          num += it.originalPrice * it.amount * 100
        } else {
          isSelet = false
          allSelect = false
        }
      })
      this.setData({
        [listItem]: num / 100,
        [listItemSelect]: isSelet
      })
    })

    this.setData({
      isAll: allSelect
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    app.userLogin(true).then(res => {
      console.log(res, '下拉刷新')
      // let skinId = app.globalData.setInfo.skinId ? app.globalData.setInfo.skinId : "1"
      let skinId = '3.1' // 下拉刷新不改变模板，上面代码为改变模板
      this.setData({
        appName: app.globalData.setInfo.appName,
        pageBg: "bg_AllPage" + (skinId),
        topBoxBg: 'top-box-bg' + (skinId),
        tempId: skinId,
        orderSwitch: res.orderSwitch
      })
      if (!res.orderSwitch) {
        let list = this.data.tabList1
        list.splice(2, 1)
        this.setData({
          tabList: list
        })
      } else {
        this.setData({
          tabList: this.data.tabList1
        })
      }
      this.indexShow();
      app.globalEvent.$emit('homeRefresh')
    })
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 2000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  scrollParev(e) {
    var that = this
    clearTimeout(this.queryTime);
    this.queryTime = setTimeout(function () {
      that.setData({
        isFixed: e.detail.isFixed
      })
    }, 100);
  },
  /**
   * 用户点击右上角分享
   */
  onShareTimeline: function () {
    let skinId = this.data.tempId;
    let appName = app.globalData.setInfo.appName;
    return {
      query: 'marchantId=' + this.data.marchantId + '&Moments=1' + '&skinId=' + skinId + '&appName=' + appName + '&orderSwitch=' + this.data.orderSwitch + '&currentIndex=' + this.data.currentIndex +'&nowTabbarText=' + this.data.nowTabbarText,
    }
  },
  onShareAppMessage: function () {
    let uniqueId = wx.getStorageSync('uniqueId1');
    return {
      title: this.data.markerInfo.nickName,
      path: "/pages/shopHome/home/home?marchantId=" + this.data.marchantId + '&uniqueId=' + uniqueId + '&nowPage=' + this.data.nowTabbarText + '&orderSwitch=' + this.data.orderSwitch + '&currentIndex=' + this.data.currentIndex + '&skinId=' + skinId + "&sss=1111",
      imageUrl: this.data.markerInfo.homeImg[0],
    }
  },
  // 获取视频列表
  // getVideoList(){
  //   let data ={marchantId:this.data.marchantId}
  //   return app.sjrequest('/commodity/queryVideoCommodityList',data).then(res=>{
  //     if(res.data.code == 200){
  //       wx.hideLoading()
  //       let list = []
  //       if(res.data.data.length){
  //         res.data.data.forEach((item,index)=>{
  //           list.push({id:index,url:item.videoUrl})
  //         })
  //         this.setData({
  //           videoList:list,
  //           hotSaleGoodsList:res.data.data,
  //           nowSaleGoods:res.data.data[0]
  //         })
  //       }

  //     }else{
  //       wx.showToast({
  //         title: res.data.msg,
  //         icon:'none'
  //       })
  //     }
  //   })
  // },
  toBuy(e) {
    wx.navigateTo({
      url: `/pages/Index/GoodsDetails/GoodsDetails?id=${e.currentTarget.dataset.id}`,
    })
  },
  // 改变视频
  bindchange(e) {
    this.setData({
      nowSaleGoods: this.data.hotSaleGoodsList[e.detail.activeId]
    })
  },

  //处理推荐页面组件事件
  parseRecommendEvent(e) {
    var eventType = e.eventType;
    if (eventType == 'addCart') {
      this.addCart({
        item: e.goodsInfo
      });
    }
  },
  //获取系统信息
  getSystem: function () {
    wx.getSystemInfo({
      success: res => {
        var statusHeight = res.statusBarHeight;
        var {
          height,
          top
        } = wx.getMenuButtonBoundingClientRect();
        var diff = top - statusHeight;
        var navTitleHeight = height + diff * 2;
        this.setData({
          statusHeight,
          navTitleHeight
        });
      },
    });
  },
  myManager(e) {
    this.setData({
      nowTabbarText: e.detail
    })
  },

  changeType(e) {
    let data = e.currentTarget.dataset
    this.setData({
      tempId: data.id + 1
    })
  },
  bgHide() {
    app.globalData.imgFlag = true
    this.setData({
      bgFlag: false
    })
  },
  onPageScroll: function (e) {
    // console.log(this.data.settingImg.top.fileurl.length > 1 ,'6669998');
    var that = this;
  var scrollTop = parseInt(e.scrollTop); //滚动条距离顶部高度
  var isSatisfy
  //判断'滚动条'滚动的距离 和 '元素在初始时'距顶部的距离进行判断
  if (this.data.settingImg.top == null) {
    isSatisfy = scrollTop + 188 >= that.data.navbarInitTop   ? true : false;    
  }else{
    isSatisfy = scrollTop >= that.data.navbarInitTop   ? true : false;
  }
  // isSatisfy = scrollTop >= that.data.navbarInitTop   ? true : false;

  //为了防止不停的setData, 这儿做了一个等式判断。 只有处于吸顶的临界值才会不相等
  if (that.data.isFixedTop === isSatisfy) {
    return false;
  }
  that.setData({
    isFixedTop: isSatisfy
   });
 
  
    if (e.scrollTop >= 100) {
      this.setData({
        pageBgScorll: "bgsss" + this.data.tempId,
        titleFlag: true
      })
      this.setData({
        isshowHead: true
      })
    } else {
      this.setData({
        pageBgScorll: "",
        titleFlag: false
      })
      this.setData({
        isshowHead: false
      })
    }
  },
  // 骨架屏
  progressiveLoad() {
    setTimeout(() => {
      this.setData({
        loading: false
      })
    }, 1000)
  },
  // 获取视频列表 this.data.marchantId
  // getVideoList() {
  //   let data = {
  //     marchantId: this.data.marchantId
  //   }
  //   app.sjrequest('/commodity/queryVideoCommodityList', data).then(res => {
  //     if (res.data.code == 200) {
  //       wx.hideLoading()
  //       let list = []
  //       if (res.data.data.length) {
  //         res.data.data.forEach((item, index) => {
  //           list.push({
  //             id: index,
  //             url: item.videoUrl
  //           })
  //         })
  //         this.setData({
  //           videoList: list,
  //           hotSaleGoodsList: res.data.data,
  //           nowSaleGoods: res.data.data[0]
  //         })
  //       }
  //     }
  //   })
  // },




  jumpApplet(e) {
    var appId = e.currentTarget.dataset.appid;
    wx.navigateToMiniProgram({
      appId
    });
  },

  bindGetUserInfo() {
    if (this.emitAuto) {
      return;
    }
    this.emitAuto = true;
    setTimeout(() => {
      this.emitAuto = null
    }, 1000);

    wx.getUserProfile({
      lang: 'zh_CN',
      desc: '获取用户信息',
      complete: res => {
        console.log('授权信息=====：', res);
        if (res.encryptedData) {
          this.setData({
            isAuthorization: false
          });
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
      that.reload()
      that.setData({
        NickFlag: false
      })
    })
  },

  showCode(code) {
    this.setData({
      codeFlag: true,
      codeImg: code.detail[0].wechatgroupqrcode,
      codeName: code.detail[0].wechatgroupname
    })
  },

  closeCode() {
    this.setData({
      codeFlag: false
    })
  },
  getShopList() {
    var data = {
      'marchantId': this.data.marchantId,
      pageSize: 10,
      pageCurr: 1,
      orderTemplate: 2
    }
    app.sjrequest('/commodity/queryCommodityList', data).then(res => {
      if (res.data.code == 200) {
        var result = res.data.data
        this.setData({
          toShoplist: result
        })
      }
    })
  },
  getShopList2() {
    var data = {
      'marchantId': this.data.marchantId,
      pageSize: 10,
      pageCurr: 1,
      orderTemplate: 3
    }
    app.sjrequest('/commodity/queryCommodityList', data).then(res => {
      if (res.data.code == 200) {
        var result = res.data.data
        this.setData({
          toShoplist2: result
        })
      }
    })
  },

  getLogisticsList() { //获取物流商品
    app.sjrequest('/commodity/queryCommodityList', {
      'marchantId': this.data.marchantId,
      pageSize: 10,
      pageCurr: 1,
      orderTemplate: 1
    }).then(res => {
      if (res.data.code == 200) {
        var result = res.data.data
        this.setData({
          logisticsList: result
        });
      }
    })
  },

  WXgroup() {
    let merchantId = this.data.marchantId
    app.sjrequest('/marchant/selectGroupQr', {
      merchantId
    }).then(res => {
      console.log(res,'resres');
      this.setData({
        codeInfo: res.data.data
        // codeImg:res.data.data.detail[0].wechatgroupqrcode,
        // codeName:res.data.data.detail[0].wechatgroupname
      })
    })
  },
  // 商家文化跳转页面
  aciveUrl(e) {
    let url = e.currentTarget.dataset.url
    let marchantId = this.data.marchantId;
    var mainBusinessModel = this.data.mainBusinessModel;
    wx.navigateTo({
      url: url + "?marchantId=" + marchantId + '&mainOrderType=' + mainBusinessModel,
    })
  },
  //  获取商家开屏页视频
  getImgUrl() {
    let merchantId = this.data.marchantId
    app.sjrequest('/marchant/selectAdvertising', {
      merchantId: merchantId
    }).then(res => {
      if (res.data.data?.top?.fileurl) {
        res.data.data.top.fileurl = res.data.data.top.fileurl.split(',')
      }
      console.log(res.data.data, '商家视频')
      this.setData({
        settingImg: res.data.data
      })
    })
  },
  getWidth() {
    var that = this;
    var length = that.data.appName.length * that.data.size; //文字长度
    var windowWidth = 200; // 屏幕宽度
    that.setData({
      length: length,
      windowWidth: windowWidth
    });
    that.scrolltxt(); // 第一个字消失后立即从右边出现
  },
  scrolltxt: function () {
    var that = this;
    var length = that.data.length; //滚动文字的宽度
    var windowWidth = that.data.windowWidth; //屏幕宽度
    if (length > windowWidth) {
      this.setData({
        textFlag: false
      });
      var interval = setInterval(function () {
        var maxscrollwidth = length + that.data.marquee_margin; //滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
        var crentleft = that.data.marqueeDistance;
        if (crentleft < maxscrollwidth) { //判断是否滚动到最大宽度
          that.setData({
            marqueeDistance: crentleft + that.data.marqueePace
          })
        } else {
          that.setData({
            marqueeDistance: 0 // 直接重新滚动
          });
          clearInterval(interval);
          that.scrolltxt();
        }
      }, that.data.interval);
    } else {
      that.setData({
        marquee_margin: "1000"
      }); //只显示一条不滚动右边间距加大，防止重复显示
    }
  },
  // 商家文化接口
  getArticle() {
    let merchantId = this.data.marchantId
    app.sjrequest('/marchant/selectArticle', {
      merchantId
    }).then(res => {
      let list = this.data.tabList1
      if (res.data.data.length) {
        let listItem = this.data.businessItem
        listItem.map((res, index) => {
          if (res.name == "商家文化") {
            listItem.splice(index, 1)
          }
        })
      }
      console.log(res.data.data.length,this.data.isToCity,'datadata');

      // ?. es6语法，如果有就往后读，如果没有就不往后读
      // if (res.data.data.length <= 0 && this.data.settingImg.top == null) {//6.1注
      if (res.data.data.length <= 0) {
        //只要没传商品文化 直接就不显示
        list[2].isHave = false
      }
      this.setData({
        tabList: list,
        ArticleList: res.data.data
      });
      
      // 做一层判断，如果商家有商家文化就开启，没有商家文化就关闭底部Tab栏
    })
  },

  titleClick(e) {
    var item = e.currentTarget.dataset.item;
    let title = item.name;
    this.setData({
      currentIndex: title,
      nowMenuItem: item
    });
  },

  // 促销
  getCategoryGoodsList() {
    var data = {
      'marchantId': this.data.marchantId
    }
    app.sjrequest('/commodity/queryPromotionList', data).then(res => {
      if (res.data.code == 200) {
        wx.hideLoading()
        this.setData({
          saleGoodsList: res.data.data
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  getMemberGoodsList() {
    var data = {
      marchantId: this.data.marchantId
    }
    app.sjrequest('/commodity/queryMemberCommodityList', data).then(res => {
      if (res.data.code == 200) {
        wx.hideLoading()
        this.setData({
          memberGoodsList: res.data.data
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  getOrderNums() { //获取 访问数 销量数
    var data = {
      merchantId: this.data.marchantId
    }
    app.sjrequest('/marchant/dataAnalysis', data).then(res => {
      if (res.statusCode == 200 && res.data.code == 200) {
        var data = res.data.data || {};
        var accessCount = data.accessCount;
        if (accessCount > 10000) {
          accessCount = accessCount / 10000;
          accessCount = accessCount.toFixed(1) + '万';
        }
        this.setData({
          accessCount,
          orderCount: data.orderCount
        });
      }
    })
  },
  goSaleShop(e) {
    let url = e.currentTarget.dataset.url
    let marchantId = this.data.marchantId
    wx.navigateTo({
      url: url + "?marchantId=" + marchantId,
    })
  },
  getMemberInfo() {
    let data = {
      marchantId: this.data.marchantId,
      type: 1
    }
    app.sjrequest('/member/queryMemberInfo', data).then(res => {
      if (res.data.code == 200) {
        this.setData({
          memberInfo: res.data.data
        })
      }
    })
  },
  shopRecommendList2() {
    var data = {
      'marchantId': this.data.marchantId
    }
    app.sjrequest('/marchant/queryRecommendList', data).then(res => {
      if (res.data.code == 200) {
        var result = res.data.data
        console.log(result,'店铺000');
        this.setData({
          shopListOther: result,
        })
      }
    })
  },
  getIntegralInfo() {
    let data = {
      marchantId: this.data.marchantId
    }
    return app.sjrequest('/integral/queryPrize', data).then(res => {
      if (res.data.code == 200) {
        wx.hideLoading()
        this.setData({
          exchangeGoodsList: res.data.data
        })
      }
    })
  },
  getAuctionList() {
    const params = {
      pageNum: 1,
      pageSize: 2,
      merchantId: this.data.marchantId
    }
    app.request.auctionRequest('/auction/list', params).then((res) => {
      if (res.data.code == 200) {
        let result = res.data.data
        this.setData({
          auctionList: this.data.auctionList.concat(result),
          auctionNum: res.data.total
        })
      }
    })
  },
  // 获取订阅通知列表
  getCommunityList() {
    let data = {
      marchantId: this.data.marchantId,
      pageCurr: 1,
      pageSize: 10,
      stick: 1,
      isMarchant: 1
    }
    return app.sjrequest('/marchant/queryMarchantComment', data).then(res => {
      if (res.data.code == 200) {
        this.setData({
          commentList2s: res.data.data
        })
      }
    })
  },
  // 查询签到接口
  getSignData() {
    let data = {
      marchantId: this.data.marchantId,
      type: 2
    }
    app.sjrequest('/integral/operateSignin', data).then(res => {
      if (res.data && res.data.data && res.data.data.countDownTime) {
        let time1 = time.formatTimeSec(res.data.data.countDownTime)
        res.data.data.countDownTime = new Date(time1.replace(/-/g, '/')).getTime() - new Date().getTime()
        this.setData({
          signData: res.data.data
        })
      }
    })
  },



  // 弹窗活动入口跳转切换
  toActivity(e) {
    var type = e.currentTarget.dataset.type;
    var topMenuList = this.data.topMenuList;
    var tempId = this.data.tempId;
    var menuItem = topMenuList.find(item => {
      return item.code == type
    });
    if (tempId > 4) {
      this.setData({
        currentIndex: menuItem.name,
        nowMenuItem: menuItem
      });
    } else {
      if (type == 'TJFL') {
        wx.navigateTo({
          url: '/pages/businessActivity/class_list/class_list'
        });
      } else {
        wx.navigateTo({
          url: '/pages/shopHome/activity_classity_list/activity_classity_list?type=' + type
        });
      }
    }

    var showActivityRkInfo = this.data.showActivityRkInfo;
    showActivityRkInfo.popupBox = false;
    this.setData({
      showActivityRkInfo
    });
  },

  closeActivityRkPopup() { //关闭 活动入口弹窗
    var showActivityRkInfo = this.data.showActivityRkInfo;
    showActivityRkInfo.popupBox = false;
    this.setData({
      showActivityRkInfo
    });
  },

  queryBrowseUser() { //查询浏览用户
    app.sjrequest('/marchant/viewRecordList', {
      merchantId: this.data.marchantId,
    }).then(res => {
      if (res.statusCode == 200 && res.data.code == 200) {
        var list = res.data.data || [];
        this.setData({
          browseUser: list
        }, () => {
          this.showBrowseUser();
        });
      }
    }).catch(err => {})
  },

  _parseDate(str, resType) { //resType 取值 'object' | 'number'
    var a = str.split(/[^0-9]+/);
    var date = new Date(a[0], a[1] - 1, a[2], a[3] || 0, a[4] || 0, a[5] || 0);
    return resType == 'number' ? date.getTime() : date;
  },

  _omputedDate(dateStr) { //计算事件发生距离当前的时间
    var createDate = this._parseDate(dateStr, 'number');
    var nowDate = new Date().getTime();
    var milliseconds = nowDate - createDate;
    var UNITS = {
      '年': 31557600000,
      '月': 2629800000,
      '天': 86400000,
      '小时': 3600000,
      '分钟': 60000,
      '秒': 1000
    }
    var humanize = '';
    for (var key in UNITS) {
      if (milliseconds >= UNITS[key]) {
        humanize = Math.floor(milliseconds / UNITS[key]) + key + '前';
        break;
      }
    }
    return humanize || '刚刚';
  },

  showBrowseUser() { //展示浏览用户
    var subscriptIndex = this.data.subscriptIndex; //当前浏览用户下标
    var browseUser = this.data.browseUser; //浏览用户列表
    if (subscriptIndex == browseUser.length) {
      setTimeout(() => {
        this.setData({
          subscriptIndex: 0,
          browseUser: []
        }, () => {
          this.queryBrowseUser();
        });
      }, 30000);
    } else {
      var itemUser = browseUser[subscriptIndex];
      var humanize = this._omputedDate(itemUser.createTime);
      itemUser.humanize = humanize;
      this.setData({
        showHideStyle: 'show-bur',
        browseUser
      }, () => {
        setTimeout(() => {
          this.setData({
            showHideStyle: 'hide-bur'
          });
          setTimeout(() => {
            subscriptIndex += 1;
            this.setData({
              showHideStyle: '',
              subscriptIndex
            }, () => {
              setTimeout(() => {
                this.showBrowseUser();
              }, 1000);
            });
          }, 1000);
        }, 4000);
      });
    }
  },
  // 获取今日推荐列表
  async getMainGoods(orderTemplate) {
    app.sjrequest('/commodity//homeRecommendList', {
      marchantId: this.data.marchantId,
    }).then(res => {
      if (res.data.code == 200) {
        var result = res.data.data;
        this.setData({
          mainGoodsList: result
        });
      }
    })
  },

  // 监听页面滑动处理抖音和优惠券动画
  touchMove() {
    clearTimeout(this.tiemoutId)
    clearTimeout(this.tiemoutId2)
    this.tiemoutId = setTimeout(() => {
      this.setData({
        pageScrolling: true
      })
    }, 300)
  },
  touchEnd() {
    clearTimeout(this.tiemoutId2)
    this.tiemoutId2 = setTimeout(() => {
      this.setData({
        pageScrolling: false
      })
    }, 1500)
  },
  true() {}, // 此函数不做任何处理，阻止底层页面滑动
  // 跳转到优惠券页面
  members() {
    let marchantId = wx.getStorageSync('merchantId')
    wx.navigateTo({
      url: `/pages/Index/couponList/couponList?marchantId=${marchantId}`,
    })
  },

  // 611开始
  onClickAdd() {
    this.data.isFold = !this.data.isFold
    this.data.isShow = false
    console.log(this.data.isFold,'999666');
  },
  //611结束

  isShowTiktok() {
    this.setData({
      isTiktok: true
    })
  },
  // 复制抖音口令
  copyTiktok() {
    wx.setClipboardData({
      data: this.data.noticeContent[0].content
    })
  },
  // 关闭抖音弹窗
  closeTiktok() {
    this.setData({
      isTiktok: false
    })
  },
  // 关闭签到弹窗
  closeSignInPopup() {
    this.setData({
      isShowSignInPopup: false
    })
  },

  showDingYue() {
    // 获取用户信息
    var that = this
    let appid = wx.getStorageSync('appid')
    let data = {
      authorizerAppid: appid,
      sceneTypes: [4, 7]
    }
    wx.getSetting({
      withSubscriptions: true,
      success: res => {
        console.log(res, '授权状态')
      }
    })
    app.mb2request('/subTemplate/listPriTemplateId', data).then(res => {
      let tempData = res.data.data
      wx.requestSubscribeMessage({
        tmplIds: tempData,
        success: function (res) {
          that.setData({
            isShowSub: false
          })
          wx.getSetting({
            withSubscriptions: true,
            success: result => {
              wx.showToast({
                title: '订阅消息成功'
              });
              that.setData({
                isShowSub: false
              })
            }
          })
        },
        fail(e) {
          console.log('订阅失败')
          that.setData({
            isShowSub: false
          })
          wx.showToast({
            title: '订阅消息失败,请点击右上角三个点中的设置打开消息订阅开关',
            icon: 'none'
          })
        }
      })
    })
  },
  async getLiveList() {
    let appId = wx.getStorageSync('appid')
    let marchantId = Number(wx.getStorageSync('merchantId'))
    let data = {
      appId,
      marchantId,
      start: 0, // 起始拉取房间，start = 0 表示从第 1 个房间开始拉取
      limit: 10 // 每次拉取的个数上限，不要设置过大，建议 100 以内
    }
    try {
      let res = await app.sjrequest('/live/create/liveList', data)
      let resData = res.data.rows.splice(0, 2)
      this.setData({
        hotLiveList: resData
      })
    } catch (error) {
      console.log(error)
    }
  },
  // 会员中心进入

  // 获取banner图片和商品
  async getMainBanner() {
    try {
      let merchantId = this.data.marchantId
      let res = await app.mb2request("/advertising/queryAdvertising", {
        merchantId
      })
      if (res.data.code == 200) {
        this.setData({
          mainBanner: res.data.data
        })
      }
    } catch (error) {

    }
  },
  

  jumpMore(e) { //跳转更多列表
    let activityTag = e.currentTarget.dataset.activitytag
    var url = '/pages/special_goods/activity-classify/activity-classify';
    url += `?tagType=${activityTag}&marchantId=${this.properties.marchantId}`;
    wx.navigateTo({
      url
    });
  },
  membersEnt() {
    console.log(this.data.userInfo, '商家信息')
    wx.navigateTo({
      url: `/pages/member/card/card?marchantId=${this.data.marchantId}`,
    })
  },
  // 跳转到签到h5页面
  toSignActivity() {
    wx.navigateTo({
      url: `../../sign-inActivity/sign-inActivity`,
    })
  },

  goIntegral() {
    wx.navigateTo({
      url: `/pages/Index/integral/integral?marchantId=${this.data.marchantId}`,
    })
  },
  goimg(e) {
    console.log(this.data.codeInfo,'icon');
    let srcArr = []
      for (let arr of this.data.codeInfo) {
        srcArr.push(arr.wechatgroupqrcode)
      }
      wx.previewImage({
        urls: srcArr
      })
    
    
  },
  goCoupons() {
    console.log("999")
    wx.navigateTo({
      url: `/pages/Index/couponList/couponList?marchantId=${this.data.marchantId}`,
    })
  },
  // 跳转至领取优惠劵页
  jumpVolume(){
    wx.navigateTo({
      url: `/pages/Index/volume/volume?marchantId=${this.data.marchantId}`,
    })
  },
  // 跳转支付页面
  jumpPayMoney(){
    wx.navigateTo({
      url: '/pages/shopHome/payMoney/payMoney'
    })
  },
  // 跳转缺省页
  jumpDefault(e){
    let query = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/shopHome/defaultPage/defaultPage?query=' + query
    })
  },
  // 查询商家是否开启签到活动
  async getIsOpenSignIn() {
      let res = await app.sjrequest1('/operation/startStatus', {
        merchantId: this.data.marchantId,
        operationType: 0
      })
      if (res.data.code == 200) {
        console.log(res, '是否开启活动')
        this.setData({
          isOpenSignIn: res.data.data
        })
      }
  }
})