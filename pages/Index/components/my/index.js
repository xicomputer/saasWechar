// pages/Index/components/my/my.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userInfo:{
      type:Object,
      value:{}
    },
    headList:{
      type:Array,
      value:[]
    },
    toolOrderList:{
      type:Array,
      value:[]
    },
    marchantId:{
      type:Number,
      value:0
    },
    orderNum:{
      type:Array,
      value:[]
    },
    cityOrderNum:{
      type:Array,
      value:[]
    },
    noticeNum:{
      type:Number,
      value:0
    },
    toStoreOrderNum:{
      type:Array,
      value:[]
    },
    isToStore:{
      type:Boolean,
      value:false
    },
    isWuliu:{
      type:Boolean,
      value:false
    },
    isToCity:{
      type:Boolean,
      value:false
    },
    isDistribution:{
      type:Number,
      value:0
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    deliveryOrderList:[
      {
        icon: '/pages/img/my/daifukuan.png',
        name: '待付款'
      },
      {
        icon: '/pages/img/my/daifahuo.png',
        name: '待发货'
      },
      {
        icon: '/pages/img/my/daishouhuo.png',
        name: '待收货'
      },
      {
        icon: '/pages/img/my/daipingjia.png',
        name: '已完成'
      },
      {
        icon: '/pages/img/my/tuikuan.png',
        name: '退款退货'
      },
    ],
    cityOrderList:[
      {
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
    selfOrderList:[
      {
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
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 跳会员
    toMember(){
      wx.navigateTo({
        url: `/pages/member/card/card?marchantId=${this.data.marchantId}`,
      })
    },
    toRegister(){
      wx.navigateToMiniProgram({
        appId: 'wxab96682e938690ad',
      })
    },
    toFenXiao(){
      wx.navigateToMiniProgram({
        appId: 'wxcad66233bce675b4',
        path:`/pages/tabBar/home/home?marchant=${this.data.marchantId}`
      })
    },
    //  我的
    pagesTo(e){
      let idx = e.currentTarget.dataset.idx
      this.triggerEvent('pagesTo',idx)
    },
    //  暂时跳优惠券
    toDetail(e){
      let idx = e.currentTarget.dataset.idx
      this.triggerEvent('toDetail',idx)
    },
  }
})
