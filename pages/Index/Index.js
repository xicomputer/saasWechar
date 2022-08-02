// pages/Index/Index.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const time = require('../../utils/util')
const app = getApp()
const formate = require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAdapter: false,
    isClose: false,  // 是否关店
    isWuliu:  false, // 开启物流
    isToStore:false, // 开启到店
    isToCity:false,  // 开启同城
    status:1,
    status1:1,
		navs: [
      {
        name: '购物车',
        src: '../../../img/my/menu-gwc.png',
        url: './ShopCart/ShopCart',
        inAnimation:'menu-in-animation1',
        outAnimation:'menu-out-animation1',
        bottom: '280rpx',
        right: '80rpx'
      },
      {
        name: '我的',
        src: '../../../img/my/menu-wd.png',
        url: '/pages/tabPage/me/me',
        bottom: '150rpx',
        right: '160rpx',
        inAnimation:'menu-in-animation2',
        outAnimation:'menu-out-animation2',
      },
      {
        name: '返回',
        src: '../../../img/my/menu-fh.png',
        url: 'top',
        bottom: '20rpx',
        right: '80rpx',
        inAnimation:'menu-in-animation3',
        outAnimation:'menu-out-animation3',
      }
    ],
    uniqueId:'',   // 用户标识
    noticeContent:'',
    buton:true,
    showFollow: false, // 关注弹框
    toolList:[],
    marchantId:-1,
    noticeNum:0,
    orderType:0,
    markerInfo:[],//商家信息
    goodsList:[],//商品
    personnel:'',//关注
    shopList:[],//零售店铺
    hotelList:[], // 酒店店铺
    ltSix:[],
    lgFive:[],
    activeEnter:false,
    showTaskPop: false, // 任务弹框
    taskText:'你已完成发布动态任务获取3积分',    // 任务文字
    shopIndex:0,
    isFixed: false,  // 是否吸顶
    isPromotion:false,
    isPromotionIcon:false,
    isDiscount: false,
    saleCanList:[],
    saleState:'已领取',
    show: false,//下单弹框
    skuList:[],//规格列表
    skuActive: null,//当前规格
    goodsData:{},//当前商品数据
    buyNum:1,//购买数量
    index: 0,//方式索引
    // tabbar
    nowTabbarText:'首页',
    tabList:[],
    tabList1:[
      {
        img:'/image/index/index1.png',
        imgActive:'/image/index/index1_active.png',
        text:'首页',
        isHave:true
      },
      {
        img:'/image/index/index7.png',
        imgActive:'/image/index/index7_active.png',
        text:'热卖',
        isHave:true
      },
      {
        // img:'/image/index/index2.png',
        // imgActive:'/image/index/index2_active.png',
        // text:'活动',
        // isHave:true
        img:'/image/index/index1.png',
        imgActive:'/image/index/index1_active.png',
        text:'商品推荐',
        isHave:true
      },
      {
        img:'/image/index/index6.png',
        imgActive:'/image/index/index6_active.png',
        text:'会员',
        isHave:true
      },
      {
        img:'/image/index/index5.png',
        imgActive:'/image/index/index5_active.png',
        text:'购物车',
        isHave:true
      },
      {
        img:'/image/index/index3.png',
        imgActive:'/image/index/index3_active.png',
        text:'订阅通知',
        isHave:true
      },
      {
        img:'/image/index/index4.png',
        imgActive:'/image/index/index4_active.png',
        text:'我的',
        isHave:true
      },
      
    ],
    // 促销
    saleGoodsList:[],
    auctionList:[],
    // 会员
    memberGoodsList:[],
    // 订阅通知
    weekList:['星期日','已签到','未签到','签到','星期四','星期五','星期六'],
    commentList:[], // 评论列表
    storeDynamicList:[], // 商家动态列表
    storeList:[], // 小店排行列表
    // 我的
    headList:[
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
    toolOrderList:[
      {
        icon: '/pages/img/my/kefu.png',
        name: '客服',
        url:'/pages/order/contact/contact'
      },
      {
        icon: '/pages/img/my/shop-cart.png',
        name: '购物车',
        url:'/pages/Index/ShopCart/ShopCart'
      },
      {
        icon: '/pages/img/my/wodedontai.png',
        name: '评论',
        url:'/pages/Index/dynamic/commentList/commentList'
      },
      {
        icon: '/pages/img/my/notice.png',
        name: '我的优惠券',
        url:'/pages/Index/couponList/couponList'
      },
      {
        icon: '/pages/img/my/paimai_icon.png',
        name: '喊价',
        url:`/pages/activity/pmhd/pmEnter/pmEnter`
      },
      {
        icon: '/pages/img/my/store_apply.png',
        name: '小店申请',
      },
    ],
    isIntegral:0, // 是否进入订阅通知
    userInfo:{}, // 用户信息
    orderNum:[],  // 订单数字
    cityOrderNum:[],  // 同城配送订单数字
    toStoreOrderNum:[],  // 到店订单数字
    // 购物车
    openOverlay: false,
    editObj: {
        pi: '',
        ci: '',
        value: ''
    },
    show1: false,
    value: '',
    num: '',
    isAll: false,
    shopCartlist: [],
    listItem: '',
    // 热卖
    videoList:[],
    hotSaleGoodsList:[],  // 热卖商品列表
    nowSaleGoods:{},  // 当前热卖商品

    
    countDown:'',//积分活动倒计时
    timeData:{},
    overTime:false,  // 倒计时结束
    activityList:[{},{},{},{},{}],//活动列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 是否是iso
    app.globalData.options = options;
    
    if(options.scene){
      const scene = decodeURIComponent(options.scene)
      await this.getCodeParams(scene)
    }else{
      if(options.personnel){
        this.setData({
          personnel:options.personnel
        })
      }
      if(options.uniqueId){
        this.setData({uniqueId:options.uniqueId})
      }
      this.setData({
        marchantId: options.marchantId||-1,
      },()=>{
        if(options.nowTabbarText){
          this.setData({nowTabbarText:'热卖'});
          this.getVideoList();
        }
      });
    }
    this.setData({
      activeStatuList: app.globalData.activeStatuList,
      isAdapter:app.globalData.isAdapter
    })
    var that = this
    //查看是否授权
    wx.getSetting({
      success: function (res) {
        if (wx.getStorageSync('wx_userinfo_key')) {
          // 已授权
          if(wx.getStorageSync('token')){
            that.setData({
              buton:false
            })
          }
          that.getUserInfo()
          //that.getSeckill()//获得活动数据
          that.showMarkerInfo()//商家信息
          if(that.data.uniqueId){
            that.getShareState()
          }
          that.queryRecommendList()//商品热卖
          that.getCategoryGoods()//获得分类商品
          // that.getCartNum()//获得购物车数字
          // that.shopRecommendList()//店铺推荐
          that.isShowSale()//促销弹框
          // that.getUserIntegral()
        } else {
          //用户没有授权
          that.setData({
            buton:true
          })
          wx.navigateTo({
            url: '/pages/shopHome/home/home',
          })
        }
      }
    });
  }, 
  //是否从小程序码进来
  getCodeParams(id){
    let data = {id : id} 
    let that = this
    return app.sjrequest('/marchant/queryIdentifica',data).then(res=>{
      if(res.data.code == 200) {
        that.setData({
          scene: JSON.parse(res.data.data.scene),
          marchantId: JSON.parse(res.data.data.scene).id
        })
        app.globalData.marchantId = JSON.parse(res.data.data.scene).id
        if(that.data.scene.pid){
          this.setData({
            personnel: that.data.scene.pid
          })
        }
        that.onShow()
      }
    })
  },
  // 获取积分任务
  // getTaskList(){
  //   let data = {marchantId:this.data.marchantId}
  //   return app.sjrequest('/integral/queryMyTaskList',data).then(res=>{
  //     this.setData({
  //       taskList:res.data.data
  //     })
  //     this.geteCountDown()
  //   })
  // },
  // 获得积分倒计时
  geteCountDown(){
    let data = {marchantId:this.data.marchantId,type:3}
    app.sjrequest('/integral/operateSignin',data).then(res=>{
      if(res.data.code == 200){
        let time1 = time.formatTimeSec(res.data.data.countDownTime || '')
        time1 = new Date(time1.replace(/-/g, '/')).getTime() - new Date().getTime()
        this.setData({countDown:time1})
      }
    })
  },
  changeTime(e){
    this.setData({
      timeData: e.detail,
    });
  },
  // 倒计时结束
  overTime(){
    this.setData({overTime:true})
  },
    // 完成任务
    toFinishTask(e){
      let url = e.currentTarget.dataset.url
      wx.navigateTo({
        url: url + '?marchantId=' + this.data.marchantId,
      })
    },
    
  //获得购物车数量
  getCartNum(){
    var data={marchantId:this.data.marchantId}
    app.sjrequest('/commodity/countTrolley',data).then(res =>{
      if(res.data.code==200){
        var countTrolley = res.data.data.countTrolley
        this.setData({cartNum:countTrolley})
      }
    })
  },
  // 跳会员
  toMember(){
    wx.navigateTo({
      url: `/pages/member/card/card?marchantId=${this.data.marchantId}`,
    })
  },
  // 跳会员
  toIntergral(){
    wx.navigateTo({
      url: `/pages/Index/integral/integral?marchantId=${this.data.marchantId}`,
    })
  },
  /**图片预览 */
  imgClick(e){
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
    var data={'id':this.data.marchantId}
    app.sjrequest('/marchant/queryMarchantInfo',data).then(res =>{
      if(res.data.code==200){
        var result = res.data.data;
        console.log('详情信息：',res);
        if(result.businessModel){
          if(result.businessModel.indexOf('1')!=-1){
            this.setData({isWuliu:true})
          }
          if(result.businessModel.indexOf('2')!=-1){
            this.setData({isToCity:true})
          }
          if(result.businessModel.indexOf('3')!=-1){
            this.setData({isToStore:true})
          }
        }
        let orderType = result.businessModel.split(',').sort()
        orderType = orderType[0]
        this.setData({orderType:orderType})
        // if(!result.isfans&&!this.data.buton){
        //   this.setData({
        //     showFollow:true
        //   })
        // }
        if(result.thepointSins){
          result.thepointSins.forEach((item) =>{
            item.addTime = formate.formatDate(item.addTime)
          })
        }
        var noticeTxt = ''
        if(result.notify){
          result.notify.forEach(item=>{
            noticeTxt = noticeTxt + item.content
          })
        }

        if(res.data.data.marchantCorrelationList.length){
          var list = []
          var hotelList = []
          res.data.data.marchantCorrelationList.forEach(item=>{
            if(item.marchantCorrelation.source == 1){list.push(item)}
            if(item.marchantCorrelation.source == 2){hotelList.push(item)}
          })
        }
        //result.shopTemplateId=7;测试赋值
        this.setData({
          tabList: this.data.tabList1,
          markerInfo: result,
          noticeContent:noticeTxt,
          shopList:list,
          hotelList:hotelList
        });
        wx.setNavigationBarTitle({
          title: this.data.markerInfo.nickName
        })
      }else if(res.data.code == 338){
        this.setData({
          isClose:true
        })
      }
    })
  },
  // 分享转发
  getShareState(){
    let data = {marchantId:this.data.marchantId,uniqueId:this.data.uniqueId,type:4}
    app.sjrequest('/transiter/onTransmit',data).then(res=>{})
  },
  showDingYue(){
    // 获取用户信息
    var that = this
    wx.requestSubscribeMessage({
      tmplIds: [app.globalData.sj_publish_article],
      success: function(res){ 
        wx.getSetting({
          withSubscriptions:true,
          success: result => {
            if(result.subscriptionsSetting['jvI8z85nDADGOrxnLxVsfx4JTASr2g80ZxnjkS59BEo']=='accept'){
              that.setData({status: 2})
            }
            if(res['jvI8z85nDADGOrxnLxVsfx4JTASr2g80ZxnjkS59BEo'] == 'accept'){
              let data = {status:that.data.status,marchantId:that.data.marchantId,templateIds:'jvI8z85nDADGOrxnLxVsfx4JTASr2g80ZxnjkS59BEo'}
              app.sjrequest('/basic/addsubscription',data).then(res=>{
                if(res.data.code == 200) {
                  let isDingYue = 'markerInfo.subscribe'
                  that.setData({
                    [isDingYue]:1
                  })
                  wx.showToast({
                    title: '订阅消息成功',
                  })
                }else{
                  wx.showToast({
                    title: res.data.msg,
                    icon:'none'
                  })
                }
              })
            }
          }
        })
        
      },
      fail(e){
        console.log(e)
        wx.showToast({
          title: '订阅消息失败,请点击右上角三个点中的设置打开消息订阅开关',
          icon:'none'
        })
      }
    })
  },
  async showDingYue1(){
    // 订阅
    var that = this
    wx.requestSubscribeMessage({
      tmplIds: [app.globalData.sj_commodity_modify,app.globalData.sj_commodity_add],
      success: function(res){
         wx.getSetting({
          withSubscriptions:true,
          success: result => {
            if(result.subscriptionsSetting['5TDTuj6Dq289EzrnzvpHD3Y_MEranwSWe8bON7IJsNc']== 'accept'||result.subscriptionsSetting['7Xn5f85WfODTkVQqQCWxNGuJA95Lm8jGYFYef0pnveI'] == 'accept'){
              that.setData({status1: 2})
              console.log('总是订阅')
            }else{
              console.log('订阅1次')
            }
            if(res['5TDTuj6Dq289EzrnzvpHD3Y_MEranwSWe8bON7IJsNc'] == 'accept'||res['7Xn5f85WfODTkVQqQCWxNGuJA95Lm8jGYFYef0pnveI'] == 'accept'){
              let data = {status:that.data.status1,marchantId:that.data.marchantId,templateIds:'5TDTuj6Dq289EzrnzvpHD3Y_MEranwSWe8bON7IJsNc,7Xn5f85WfODTkVQqQCWxNGuJA95Lm8jGYFYef0pnveI'}
              app.sjrequest('/basic/addsubscription',data).then(res=>{
                if(res.data.code == 200) {
                  let isDingYue = 'markerInfo.subscribe1'
                  that.setData({
                    [isDingYue]:1
                  })
                  wx.showToast({
                    title: '订阅消息成功',
                  })
                }else{
                  wx.showToast({
                    title: res.data.msg,
                    icon:'none'
                  })
                }
              })
            }
          }
        })
      },
      fail(){
        wx.showToast({
          title: '订阅消息失败,请点击右上角三个点中的设置打开消息订阅开关',
          icon:'none'
        })
      }
    })
  },
  // 个人中心
  toMy(){
    wx.switchTab({
      url: '/pages/tabPage/me/me',
    })
  },
  /** 商品热卖 */
  queryRecommendList() {
    var data={'marchantId':this.data.marchantId}
    app.sjrequest('/commodity/queryRecommendList',data).then(res =>{
      if(res.data.code==200){
        var result = res.data.data
        this.setData({
          ltSix: result.slice(0,5),
          lgFive: result.slice(5)
        })
      }
    })
  },
  /** 店铺推荐 */
  shopRecommendList() {
    var data={'marchantId':this.data.marchantId}
    app.sjrequest('/marchant/queryRecommendList',data).then(res =>{
      if(res.data.code==200){
        var result = res.data.data
        this.setData({
          shopList: result,
        })
      }
    })
  },
  scroll(e){
    this.setData({
      shopIndex: Math.round(e.detail.scrollLeft/529*2)
    })
  },
  /** 添加关注 */
  addDelConcerns() {
    var data={'marchantId':this.data.marchantId,'type':1}
    if(this.data.personnel!=0){
      data.saleUniqueId = this.data.personnel
    }
    app.sjrequest('/marchant/operateConcerns',data).then(res =>{
      if(res.data.code==200){
        wx.showToast({
          title: '关注成功！',
          icon: 'success'
        })
        this.data.markerInfo.isfans=1
        this.setData({
          markerInfo: this.data.markerInfo,
          showFollow:false
        })
      }
    })
  },
  // 关闭关注弹框
  closeFollow(){
    this.setData({
      showFollow: false
    })
  },
  /** 获得分类商品 */
  getCategoryGoods() {
    var data={'marchantId':this.data.marchantId}
    app.sjrequest('/commodity/queryClassifyCommodityList',data).then(res =>{
      if(res.data.code==200){
        // res.data.data.forEach(item => {
        //   var dataList={'marchantId':this.data.marchantId,'classifyId':item.id,'pageCurr':1,'pageSize':5}
        //   app.sjrequest('/commodity/queryCommodityList',dataList).then(result =>{
        //     if(result.data.code==200){
        //       item.list = result.data.data
        //     }
            this.setData({
              goodsList: res.data.data
            })
        //   })
        // });
      }
    })
  },
  /** 查看商品详情 */
  toGoodsDetails(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url:'/pages/Index/GoodsDetails/GoodsDetails?id='+id
    })
  },
 /** 加入购物车 */
 addCart(e){
  var item = e.item || e.currentTarget.dataset.item
  item.itemText = ''
  this.setData({
    goodsData:item,
    buyNum:1,
    skuActive:null,
    show:true,
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
  getSku(commodityId){
    var that = this
    var data={'commodityId':commodityId,marchantId:this.data.marchantId}
    app.sjrequest('/commodity/queryCommoSku',data).then(res =>{
      if(res.data.code==200){
        that.setData({
          skuList: res.data.data,
          goodsData: res.data.data[0]
        })
        res.data.data.forEach((item,index)=>{
          let skuItem = 'skuList[' + index + '].active'
          if(item.isDefault == 1) {
            that.setData({
              [skuItem]: true,
              goodsData: item
            })
          }else{
            that.setData({
              [skuItem]: false
            })
          }
        })
      }
    })
  },
    //关闭商品弹框
onClose1(){
  this.setData({
    show:false,
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
          title:'数量不能少于1',
          icon:'none'
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
  var data={
    'tempSpecId':this.data.goodsData.id,
    'commodityId':this.data.goodsData.commodityId,
    'amount':this.data.buyNum,
    'marchantId':this.data.marchantId,
    'operate':1
  }
  app.sjrequest('/commodity/addTrolley',data).then(res =>{
    if(res.data.code==200){
      wx.showToast({
        title:'添加成功',
        icon:'success'
      })
      this.getCartNum()
    }
  })
},
  //确认下单
  surexf(){
        if(this.data.goodsData.stock==0){
          wx.showToast({
            title:'暂无库存',
            icon:'none'
          })
          return 
        }
        console.log(this.data.orderType)
        let jsonData = {
            marchantId: this.data.marchantId,
            orderType: this.data.orderType,
            commoditys: [
              {
                commodityId: this.data.goodsData.commodityId,
                tempSpecId: this.data.goodsData.id,
                amount: this.data.buyNum
              }
            ]
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
  getSeckill(){
    const data ={merchantId:this.data.marchantId}
    var token = wx.getStorageSync('token')
    app.sjrequest1('/activity/findActivityState',data,token).then(res =>{
      if(res.data.code==200){
        var list = res.data.data
        list.forEach(item =>{
          switch(item.state){
            case -1:item.name = '未开放';break;
            case 0:item.name = '未发布';break;
            case 1:item.name = '未开始';break;
            case 2:item.name = '进行中';break;
            case 3:item.name = '已结束';break;
          }
        })
        this.setData({
          toolList:res.data.data
        })
      }
    })
  },
   /** 去秒杀 */
  toSeckill(e){ 
    var index = e.currentTarget.dataset.index
    if(this.data.toolList[index].state==1 || this.data.toolList[index].state==2){
      wx.navigateTo({
        url:this.data.toolList[index].url+'?marchantId='+this.data.marchantId
      })
    }else{
      wx.showToast({
        title:'活动'+this.data.toolList[index].name,
        icon:'none'
      })
    }
  },  
  //判断弹什么框
  isShowWhatBox(){
    const that = this
    let activeStatuList = that.data.activeStatuList
    let listIndex = -1
    // 判断是否弹过促销框和优惠框
    let flag = 0//0-都没弹过，1-都弹过，2-只弹过促销框，3-只弹过优惠框
    activeStatuList.forEach((item,index) =>{
      if(item.marchantId==that.data.marchantId){
        if(item.isPromotion==true){
          if(item.isDiscount==true){
            flag = 1//都弹过
          }else{
            flag = 2//只弹过促销框
            listIndex = index
          }
          return
        }
        if(item.isDiscount==true){
          if(item.isPromotion==true){
            flag = 1//都弹过
          }else{
            flag = 3//只弹过优惠框
            listIndex = index
          }
          return
        }
      }
    })
    // flag：0-都没弹过，1-都弹过，2-只弹过促销框，3-只弹过优惠框
    if(flag==0){//都没弹过
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
    }else if(flag==1 || flag==2){//都弹过、弹过促销框
      that.setData({
        isPromotionIcon: true
      })
      // 优惠判断
      that.isShowSale()
    }else if(flag==3){//弹过优惠框
      activeStatuList[listIndex].isPromotion=true
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
    const data={'marchantId':this.data.marchantId}
    app.sjrequest('/commodity/queryPromotionList',data).then(res =>{
      if(res.data.code==200){
        if(res.data.data.length){
          this.isShowWhatBox()//判断弹什么框
        }
      }
    })
  },
  // 关闭促销弹窗
  promotionClose(){
    this.setData({
      isPromotion:false,
      isPromotionIcon:true
    })
    this.isShowSale()
  },
  // 进入促销列表
  promotionEnter(){
    this.setData({
      isPromotion:false,
      isPromotionIcon:true
    })
    wx.navigateTo({
      url: './promotionList/promotionList?marchantId='+this.data.marchantId+'&marchantName='+this.data.markerInfo.nickName,
    })
  },
  // 进入游戏抽奖列表
  yxcjEnter(){
    wx.navigateTo({
      url: '/pages/activity/yxcj/activeList/activeList?marchantId='+this.data.marchantId,
    })
  },
  // 优惠是否弹框
  isShowSale(){
    let data={marchantId:this.data.marchantId}
    app.sjrequest('/coupons/queryCouponsGet',data).then(res=>{
      if(res.data.code == 200) {
        if(res.data.data.length){
          let saleCanList = []
          res.data.data.forEach((item) =>{
            if(item.isDraw==0){              
              saleCanList.push(item)
              this.setData({
                isDiscount:true,
                saleState: '点击领券'
              })
            }
            item.endTime = formate.formatDate(item.endTime)
          })          
          this.setData({
            saleCanList:saleCanList
          })
          app.globalData.activeStatuList = this.data.activeStatuList
        }
      }
    })
    
  },
  // 关闭优惠弹窗
  closeSale(){
    this.setData({
      isDiscount:false,
    })
  },
  receiveSale(){
    var data = {couponsIds:[]}
    this.data.saleCanList.forEach(item=>{
      if(item.isDraw==0){
        data.couponsIds.push(item.id)
      }
    })
    data.couponsIds = data.couponsIds.toString()
    var token = wx.getStorageSync('token')
    app.sjrequest('/coupons/getCoupons',data,token).then(res=>{
      if (res.data.code == 200 ) {
        this.setData({
          isDiscount:false
        })
        wx.showToast({
          title: '领取成功',
          icon:'none'
        })
      }
    })
  },
    
  toMe(){
    wx.switchTab({
      url: '/pages/tabPage/me/me',
    })
  },
 
  // tabbar
  changeTab(e){
    let text = e.currentTarget.dataset.text
    this.setData({
      nowTabbarText: text
    })
    if(text == '首页'){
      wx.setNavigationBarTitle({
        title: this.data.markerInfo.nickName
      })
    }
    if(text == '活动'){
      wx.setNavigationBarTitle({
        title: '活动'
      })
      this.getCategoryGoodsList()
      this.getAuctionList()
    }
    if(text == '热卖'){
      wx.setNavigationBarTitle({
        title: '热卖'
      })
      this.getVideoList()
    }
    if(text == '购物车') {
      wx.showLoading({
        title: '加载中',
      })
      this.getCartData()
      wx.setNavigationBarTitle({
        title: '购物车'
      })
    }
    if(text == '订阅通知'){
      wx.setNavigationBarTitle({
        title: '订阅通知'
      })
    }
    if(text == '我的') {
      wx.setNavigationBarTitle({
        title: '我的'
      })
    }
    if(text == '会员'){
      this.getMemberGoodsList()
      wx.setNavigationBarTitle({
        title: '会员'
      })
    }
    if(text == '商品推荐'){
      this.getMemberGoodsList()
      wx.setNavigationBarTitle({
        title: '商品推荐'
      })
    }
  },
  // 活动
  getCategoryGoodsList(){
    var data={
      'marchantId':this.data.marchantId
    }
    app.sjrequest('/commodity/queryPromotionList',data).then(res =>{
      if(res.data.code==200){
        wx.hideLoading()
        this.setData({
          saleGoodsList: res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
  },
  // 获得拍卖列表
  getAuctionList(){
    const params = 
    {
      pageNum: 1,
      pageSize: 4,
      merchantId: this.data.marchantId
    }
    app.request.auctionRequest('/auction/list', params).then((res) =>{
      if(res.data.code == 200){
        const result = res.data.data
        result.forEach(item=>{
          item.startTime = new Date(item.startTime.replace(/-/g, '/')).getTime() - new Date().getTime()
          item.endTime1 = new Date(item.endTime.replace(/-/g, '/')).getTime() - new Date().getTime()
        })
        this.setData({
          auctionList: result
        })
      }
    })
  },
  // 会员
  getMemberGoodsList(){
    var data={marchantId:this.data.marchantId}
    app.sjrequest('/commodity/queryMemberCommodityList',data).then(res =>{
      if(res.data.code==200){
        wx.hideLoading()
        this.setData({
          memberGoodsList: res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
  },
  // 去下单
  goBuy(e){
    var item = e.currentTarget.dataset.item
    item.stock='请选择规格'
    item.itemText='请选择规格'
    this.setData({
      goodsData:item,
      buyNum:1,
      skuActive:null,
      show:true
    })
    this.getSku(item.id)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton();//隐藏返回首页按钮
    if(this.data.marchantId != -1){
      this.getCartNum()
      this.getOrderNum()
      this.getUserIntegral()
      this.geteCountDown()//获得积分任务列表
    }
  },


  // 订阅通知
  // 获取订阅通知列表
  getCommunityList(){
    let data = {marchantId:this.data.marchantId,pageCurr:1,pageSize:10,stick:1,isMarchant:0}
    return app.sjrequest('/marchant/queryMarchantComment',data).then(res=>{
      if(res.data.code == 200){
        wx.hideLoading()
        res.data.data.forEach(item=>{
          item.addTime = time.formatTime(item.addTime)
        })
        this.setData({
          commentList:res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  // 获取商家动态
  getStoreDynamicList(){
    let data = {marchantId:this.data.marchantId,pageCurr:1,pageSize:10,isMarchant:1,stick:1}
    return app.sjrequest('/marchant/queryMarchantComment',data).then(res=>{
      if(res.data.code == 200){
        res.data.data.forEach(item=>{
          item.addTime = time.formatDateTime(item.addTime)
        })
        this.setData({
          storeDynamicList:res.data.data
        })
      }
    })
  },

  //  小店排行列表
  getStoreList(){
    let data = {marchantId:this.data.marchantId,pageCurr:1,pageSize:5}
    return app.sjrequest('/marchant/queryMarchantStoreList',data).then(res=>{
      if(res.data.code == 200){
        wx.hideLoading()
        this.setData({
          storeList:res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  toWrite(){
    wx.navigateTo({
      url: `/pages/Index/dynamic/postComment/postComment?marchantId=${this.data.marchantId}`
    })
  },
  // 点赞/取消
  operationPraise(e){
    const {id,idx} = e.currentTarget.dataset
    console.log(id,idx)
    let data = {commentId:id}
    return app.sjrequest('/marchant/operationPraise',data).then(res=>{
      let isPraise = 'commentList['+idx+'].isPraise'
      let praise = 'commentList['+idx+'].praise'
      if(this.data.commentList[idx].isPraise){
        this.setData({
          [isPraise]:0,
          [praise]:this.data.commentList[idx].praise - 1
        })
      }else{
        this.setData({
          [isPraise]:1,
          [praise]:this.data.commentList[idx].praise + 1
        })
      }
    })
  },
  // 更多评论
  toMore(){
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
  pagesTo(e){
    var idx = e.detail
    switch(idx){
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
          path:`/pages/tabBar/home/home?marchant=${this.data.marchantId}`
        })
      default:
        wx.navigateTo({
          url: this.data.toolOrderList[idx].url + `?marchantId=${this.data.marchantId}`,
        })
    }
  },
  // 跳会员
  toMember(){
    wx.navigateTo({
      url: `/pages/member/card/card?marchantId=${this.data.marchantId}`,
    })
  },
  //  暂时跳优惠券
  toDetail(e){
    let idx = e.detail
    switch(idx){
      case 0 :
        if(this.data.isIntegral){
          wx.navigateTo({
            url: '/pages/Index/integral/integral?marchantId=' + this.data.marchantId,
          })
        }else{
          wx.showToast({
            title: '商家未开放',
            icon: 'none'
          })
        }
        break;
      case 1 :
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
  getUserInfo(){
    let data = { marchantId: this.data.marchantId}
    app.sjrequest('/userRegister/queryUserInfo',data).then(res=>{
      if(res.data.code==200){
        wx.hideLoading()
        if(res.data.data.uniqueId){
          wx.setStorage({
            data: res.data.data.uniqueId,
            key: 'uniqueId1',
          })
        }
        if(res.data.data.community==0){   // 未开启订阅通知
          let tabs = 'tabList1[5].isHave'
          this.setData({
            [tabs]:false
          })
        }else{
          let tabs = 'tabList1[4].isHave'
          this.setData({
            [tabs]:false
          })
        }
        if(!res.data.data.statusv){   // 热卖是否开启
          let tabs = 'tabList1[1].isHave'
          this.setData({
            [tabs]:false
          })
        }
        if(!res.data.data.statusm){   // 会员是否开启
          let tabs = 'tabList1[3].isHave'
          this.setData({
            [tabs]:false
          })
        }

        var wxUserInfo=wx.getStorageSync('wx_userinfo_key')||{};
        this.setData({
          userInfo:{
            ...res.data.data,
            avatarUrl:wxUserInfo.userInfo.avatarUrl,
            nickName:wxUserInfo.userInfo.nickName,
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
  //  查询用户积分
  getUserIntegral(){
    let data = { marchantId: this.data.marchantId }
    return app.sjrequest('/integral/queryInte',data).then(res=>{
      if(res.data.code == 200){
        let integral = 'headList[0].num'
        this.setData({
          isIntegral:res.data.data.isopen,
          [integral]:res.data.data.isopen?res.data.data.score:0
        })
      }
    })
  },
  // 获取数字
  getOrderNum(){
    var data={type:2,marchantId:this.data.marchantId}
    app.sjrequest('/basic/queryCountAmount',data).then(res =>{
      var list = [res.data.data.citywideOrderState0,res.data.data.citywideOrderState1,res.data.data.citywideOrderState2,0,res.data.data.citywideRefundState]
      var cityList = [res.data.data.sendState0,res.data.data.sendState1,res.data.data.sendState2]
      let couponNum = 'headList[1].num'
      var list1 = [res.data.data.fetchState0,res.data.data.fetchState1,0]
      this.setData({orderNum:list,cityOrderNum:cityList,toStoreOrderNum:list1,[couponNum]:res.data.data.countUserCoupons,noticeNum:res.data.data.sumCount})
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },
  getCartData() {
    // 使用社交token
    const data = this.data.marchantId==-1?{}:{marchantId:this.data.marchantId}
    return app.sjrequest('/commodity/queryTrolleyList',data).then(res => {
        if (res.data.code === 200) {
            wx.hideLoading()
            this.setData({
              shopCartlist: res.data.data
            })
            this.disposeData()
        }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
        }
    })
},
 //确认消费方式
 surexf1(){
  let jsonData = {
      marchantId: this.data.listItem.marchantId,
      orderType:this.data.orderType,
      commoditys: []
  }
  this.data.listItem.commoditys.forEach(el => {
      jsonData.commoditys.push({
          commodityId: el.commodityId,
          tempSpecId: el.tempSpecId,
          amount: el.amount
      })
  })
  console.log(jsonData)
  // 使用社交token
  const token = wx.getStorageSync('token')
  wx.showLoading({
      title: '结算中'
  })
  app.sjrequest1('/order/onekeyAboutOrder', jsonData, token).then(res => {
      wx.hideLoading()
      if (res.data.code === 200) {
          // 更新 store 数据
          app.store.setState({
              submitObj: JSON.stringify(res.data.data)
          })
          wx.navigateTo({
              url: '/pages/order/submitOrder/submitOrder'
          })
      }else{
          wx.hideLoading()
          wx.showToast({
              title: res.data.msg,
              icon: 'none'
          })
      }
  })
},

// 去结算
handleGoSettlement(e) {
    var pi = e.currentTarget.dataset.pi
    console.log('去结算', pi)
    // if (!this.data.list[pi].isSelect) {
        // Toast('未选中对于的商品!')
        // console.log(this.data.list[pi])
    // } else {
        var isSelect = false
        this.data.shopCartlist[pi].commoditys.forEach(el => {
            if (el.isPitch) isSelect = true
        })
        if (isSelect) {
            const arr = []
            this.data.shopCartlist[pi].commoditys.forEach(el => {
                if (el.isPitch) arr.push(el)
            })
            const listItem = {
                ...this.data.shopCartlist[pi],
                commoditys: arr
            }
            console.log(listItem)
            this.setData({
                openOverlay: true,
                listItem: listItem
            })
            this.surexf1()
        } else {
            Toast('未选中对应的商品!')
        }
    // }
},
//跳转商品详情
toGoodsdetail(e){
    wx.navigateTo({
      url: '/pages/Index/GoodsDetails/GoodsDetails?id=' + e.currentTarget.dataset.commodityid,
    })
},
toStore(e){
    wx.navigateTo({
        url: '/pages/shopHome/home/home?marchantId=' + e.currentTarget.dataset.marchantid,
    })
},
// 修改购物车信息
changeCartInfo(storeIndex,goodsIndex){
    let that = this
    let params = this.data.shopCartlist[storeIndex].commoditys[goodsIndex]
    let data = {
        tempSpecId:params.tempSpecId,
        commodityId:params.commodityId,
        marchantId:params.marchantId,
        amount: params.amount,
        operate: 3
    }
    app.sjrequest('/commodity/addTrolley',data).then(res=>{
        if(res.data.code == 200) {
            that.getCartData()
        }
    })
},
// 编辑 num
handleEditNum(e) {
    console.log(e)
    let pi = e.currentTarget.dataset.pi
    let ci = e.currentTarget.dataset.ci
    let type = e.currentTarget.dataset.type
    
    var goodItem = 'shopCartlist[' + pi + '].commoditys[' + ci + '].amount'
    if (type === 'add') {
        if (this.data.shopCartlist[pi].commoditys[ci].amount === this.data.shopCartlist[pi].commoditys[ci].inventory) {
            Toast('该宝贝不能购买更多哦')
        } else {
            // 加一
            this.setData({
                [goodItem]: this.data.shopCartlist[pi].commoditys[ci].amount + 1
            })
        }
    } else if (type === 'minus') {
        // 减一
        if (this.data.shopCartlist[pi].commoditys[ci].amount === 1) {
            this.setData({
                [goodItem]: 1
            })
        } else {
            this.setData({
                [goodItem]: this.data.shopCartlist[pi].commoditys[ci].amount - 1
            })
        }
    } else {
        // 编辑
        this.setData({
            "editObj.pi": pi,
            "editObj.ci": ci,
            value: this.data.shopCartlist[pi].commoditys[ci].amount,
            show1: true
        })
    }
    this.changeCartInfo(pi,ci)
},
// 监听输入的值
handleInput(e) {
    if(e.detail.value!=''){
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
    if (this.data.value >  this.data.shopCartlist[this.data.editObj.pi].commoditys[this.data.editObj.ci].inventory) {
        Toast('该宝贝不能购买更多哦')
    } else {
        var goodItem = 'shopCartlist[' + this.data.editObj.pi + '].commoditys[' + this.data.editObj.ci + '].amount'
        this.setData({
            [goodItem]: this.data.value
        })
        this.changeCartInfo(this.data.editObj.pi,this.data.editObj.ci)
    }
},
// 弹框取消
onClose() {
    this.setData({ close: false });
},
// 删除 购物车数据
delete() {
    const postIds = []
    this.data.shopCartlist.forEach(el => {
        el.commoditys.forEach(it => {
            if (it.isPitch) {
                postIds.push(it.trolleyId)
            }
        })
    })
    if (postIds.length) {
        Dialog.alert({
            title: '提示',
            message: '确认将宝贝删除',
            showCancelButton: true,
            cancelButtonText: '我再想想',
            confirmButtonText: '删除'
        }).then(() => {
            var postDatas = {
                trolleyIds: postIds.join(',')
            }
            
            // 使用社交token
            const token = wx.getStorageSync('token')
            app.sjrequest('/commodity/deleteTrolley', postDatas, token).then(res => {
                if (res.data.code === 200) {
                    this.getCartData()
                }
            })
        });
    } else {
        wx.showToast({
          title: '您还没择宝贝哦！',
          icon: 'none'
        })
    }
    this.disposeData()
},
// 商品选中事件
handleGoodItemSelect(e) {
    var pid = e.currentTarget.dataset.pid
    var cid = e.currentTarget.dataset.cid
    var isPitch,trolleyId
    trolleyId = this.data.shopCartlist[pid].commoditys[cid].trolleyId
    if(this.data.shopCartlist[pid].commoditys[cid].isPitch == 0){
        isPitch = 1
    }
    if(this.data.shopCartlist[pid].commoditys[cid].isPitch == 1){
        isPitch = 0
    }
    let data = [{trolleyId,isPitch}]
    app.sjrequest1('/commodity/operatorIsPitch',data).then(res=>{
        this.getCartData()
    })
    this.disposeData()
},
// 选中商家事件
async handleGoodsSelect(e) {
    var pid = e.currentTarget.dataset.pid
    var commoditys = this.data.shopCartlist[pid].commoditys
    let data = []
    if (this.data.shopCartlist[pid].isSelect) {
      commoditys.forEach(item=>{
            data.push({trolleyId:item.trolleyId,isPitch:0})
        })
    } else {
      commoditys.forEach(item=>{
            data.push({trolleyId:item.trolleyId,isPitch:1})
        })
    }
    app.sjrequest1('/commodity/operatorIsPitch',data).then(res=>{
        const token = wx.getStorageSync('token')
        let data = this.data.marchantId==-1?{}:{marchantId:this.data.marchantId}
        app.sjrequest('/commodity/queryTrolleyList',data, token).then(res => {
            if (res.data.code === 200) {
                var listItem = 'shopCartlist[' + pid + '].isSelect'
                this.setData({
                  shopCartlist: res.data.data,
                    [listItem]: !this.data.shopCartlist[pid].isSelect
                })
                this.disposeData()
            }
        })
    })
    
},
// 全选
selectAll() {
    let arr = this.data.shopCartlist
    let data = []
    if (this.data.isAll) {
        arr.forEach((el, i) => {
            el.list.forEach((it, ind) => {
                var listItem = 'shopCartlist[' + i + '].isSelect'
                data.push({trolleyId:it.trolleyId,isPitch:0})
                this.setData({
                    [listItem]: true,
                })
            })
        })
    } else {
        arr.forEach((el, i) => {
            el.commoditys.forEach((it, ind) => {
                var listItem = 'shopCartlist[' + i + '].isSelect'
                data.push({trolleyId:it.trolleyId,isPitch:1})
                this.setData({
                    [listItem]: true,
                })
            })
        })
    }
    app.sjrequest1('/commodity/operatorIsPitch',data).then(res=>{
        const token = wx.getStorageSync('token')
        let data = this.data.marchantId==-1?{}:{marchantId:this.data.marchantId}
        app.sjrequest('/commodity/queryTrolleyList',data, token).then(res => {
            console.log(res)
            if (res.data.code === 200) {
                this.setData({
                    shopCartlist: res.data.data,
                    isAll: !this.data.isAll
                })
                this.disposeData()
            }
        })
    })
},
// 处理数据
disposeData() {
    const arr = this.data.shopCartlist
    var allSelect = true
    if(arr.length==0){
        allSelect = false
    }
    arr.forEach((el, i) => {
        var listItem = 'shopCartlist[' + i + '].hj'
        var listItemSelect = 'shopCartlist[' + i + '].isSelect'
        var num = 0
        var isSelet = true    
        el.commoditys.forEach((it, idx) => {
            if (it.isPitch) {
                num += it.originalPrice* it.amount * 100
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
    })
    // if (allSelect) {
    //     this.setData({
    //         isAll: true
    //     })
    // } else {
    //     this.setData({
    //         isAll: false
    //     })
    // }
},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getUserInfo()
    this.getCartNum()//获得购物车数字
    //this.getSeckill()//获得活动数据
    this.showMarkerInfo()//商家信息
    if(this.data.uniqueId){
      this.getShareState()
    }
    this.queryRecommendList()//商品热卖
    this.getCategoryGoods()//获得分类商品
    // this.shopRecommendList()//店铺推荐
    this.isShowSale()//优惠弹框
    // this.getUserIntegral()

    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 2000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  scrollParev(e){
    var that = this
    clearTimeout(this.queryTime);
    this.queryTime = setTimeout(function() {
      console.log(e.detail.isFixed)
        that.setData({
          isFixed:e.detail.isFixed
        })
    }, 100);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let uniqueId = wx.getStorageSync('uniqueId1')
    return {
      title: this.data.markerInfo.nickName,
      path: "/pages/shopHome/home/home?marchantId="+this.data.marchantId+'&uniqueId='+uniqueId,
      imageUrl:this.data.markerInfo.homeImg[0]
    }
  },
  // 获取视频列表
  getVideoList(){
    let data ={marchantId:this.data.marchantId}
    return app.sjrequest('/commodity/queryVideoCommodityList',data).then(res=>{
      if(res.data.code == 200){
        wx.hideLoading()
        let list = []
        if(res.data.data.length){
          res.data.data.forEach((item,index)=>{
            list.push({id:index,url:item.videoUrl})
          })
          this.setData({
            videoList:list,
            hotSaleGoodsList:res.data.data,
            nowSaleGoods:res.data.data[0]
          })
        }
        
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
  },
  toBuy(e){
    wx.navigateTo({
      url: `/pages/Index/GoodsDetails/GoodsDetails?id=${e.currentTarget.dataset.id}`,
    })
  },
  // 改变视频
  bindchange(e){
    console.log(e.detail)
    this.setData({
      nowSaleGoods:this.data.hotSaleGoodsList[e.detail.activeId]
    })
  },

  //处理推荐页面组件事件
  parseRecommendEvent(e){
    console.log(e);
    var eventType=e.eventType;
    if(eventType=='addCart'){
      this.addCart({item:e.goodsInfo});
    }
  },
})