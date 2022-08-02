// pages/Index/integral/integral.js
const app = getApp()
const time = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toolList: [ // 工具列表
      {
        text: '总积分',
        img: '/pages/img/index/integral1.png',
        url: '/pages/Index/integral/myIntegral/myIntegral'
      },
      {
        text: '进入店铺',
        img: '/pages/img/index/integral2.png',
        url: '/pages/shopHome/home/home'
      },
      {
        text: '兑换记录',
        img: '/pages/img/index/integral3.png',
        url: '/pages/Index/integral/integralRecord/integralRecord'
      }
    ],
    taskList: [], // 任务列表
    uniqueId: '', // 用户标识
    isClose: false, // 是否关店
    showGoodsDetail: false, // 是否显示商品详情
    showSelectType: false, // 是否显示配送方式
    isFinishSign: false, // 是否显示签到成功
    isSubmit: false, // 是否提交
    isFirst: true, // 是否第一次进入
    selectType: 0, // 选择配送的方式
    typeList: [ // 配送方式列表
      {
        name: '到店自取',
        class: 'selectType_title_item_active1'
      },
      {
        name: '商家配送',
        class: 'selectType_title_item_active2'
      }
    ],
    showTaskPop: false, // 任务弹框
    taskText: '你已完成分享积分任务获取1积分', // 任务文字
    marchantId: 0, // 商家id
    exchangeGoodsList: [], // 可兑换商品列表
    nowGoodsDetail: {}, //当前商品详情
    userintegral: 0, //用户积分
    toStoreContactMan: '', // 到店的联系人
    toStoreAddress: '', // 到店的地址
    toStoreTel: '', // 到店的联系电话
    logisticsContactMan: '', // 配送的联系人
    logisticsAddress: '', // 配送的地址 
    logisticsTel: '', // 配送的联系电话
    messageValue: '', // 留言
    hideTabs: true, // 是否有tab类型选择
    weekList: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    minDate: new Date().getTime(), // 可选最小时间
    maxDate: new Date().getTime() + 6 * 24 * 60 * 60 * 1000, // 可选最大时间
    showTimeSelect: false, // 选择时间弹框
    currentDate: '', // 当前选择框时间中间变量
    selectedTime: '', // 当前所选时间
    community: 0, // 是否开启订阅通知
    haveSignIn: false, // 是否有签到
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
    timeData: {},
    signData: {},
    nowDay: -1, //今天的时间
    isOverTime: false, // 活动倒计时弹框
    logoPic: '', // 商家头像
    getShopInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    app.globalData.options = options
    app.userLogin().then(async (res) => {
      if (options.scene) {
        const scene = decodeURIComponent(options.scene)
        await this.getCodeParams(scene)
      } else {
        if (options.uniqueId) {
          this.setData({
            uniqueId: options.uniqueId
          })
        }
        this.setData({
          marchantId: options.marchantId
        })
      }
      console.log(this.data.marchantId)
      var that = this
      //查看是否授权
      wx.getSetting({
        success: function (res) {
          if (wx.getStorageSync('wx_userinfo_key')) {
            that.getIntegralInfo()
            that.getSignData()
            that.getUserIntegral()
            that.getTaskList()
            if (that.data.uniqueId) {
              that.getShareState()
            }
          } else {
            wx.navigateTo({
              url: '/pages/shopHome/home/home',
            })
          }
        }
      });
      let nowDay = new Date().getDay()
      if (nowDay == 0) {
        nowDay = 7
      }
      this.setData({
        nowDay: nowDay,
        isFirst: false
      })
      this.getShopInfo()
    })

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
          marchantId: JSON.parse(res.data.data.scene).id
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
        console.log(res.data.data.merchantInfo.telephone, '用户到店自取联系电话')
        this.setData({
          userintegral: res.data.data.score,
          toStoreContactMan: res.data.data.merchantInfo.legalPerson || res.data.data.merchantInfo.nickName,
          logoPic: res.data.data.merchantInfo.logoPic,
          toStoreTel: res.data.data.merchantInfo.telephone,
          community: res.data.data.merchantInfo.community,
          nickName: res.data.data.merchantInfo.nickName,
          toStoreAddress: res.data.data.merchantInfo.entirelyAddress
        })
      } else if (res.data.code == 338) {
        this.setData({
          isClose: true
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  // 获取任务
  getTaskList() {
    let data = {
      marchantId: this.data.marchantId
    }
    return app.sjrequest('/integral/queryMyTaskList', data).then(res => {
      console.log(res, '我的任务')
      res.data.data.forEach(item => {
        if (item.type == 6) {
          this.setData({
            haveSignIn: true
          })
        }
      })
      let TaskList = res.data.data
      TaskList.map(res => {
        if (res.jump == "/pages/Index/Index") {
          res.jump = "/pages/shopHome/home/home"
        }
      })
      this.setData({
        taskList: res.data.data
      })
    })
  },
  // 查询积分商品信息
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
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  // 显示商品详情弹框
  showDetail(e) {
    let idx = e.currentTarget.dataset.idx
    this.setData({
      showGoodsDetail: true,
      nowGoodsDetail: this.data.exchangeGoodsList[idx]
    })
  },
  // 关闭商品详情弹框
  closeDetail() {
    this.setData({
      showGoodsDetail: false
    })
  },
  // 分享转发
  getShareState() {
    let data = {
      marchantId: this.data.marchantId,
      uniqueId: this.data.uniqueId,
      type: 5
    }
    app.sjrequest('/transiter/onTransmit', data).then(res => {})
  },
  // 显示方式选择
  showSelectType(e) {
    let idx = e.currentTarget.dataset.idx
    if (idx >= 0) {
      this.setData({
        nowGoodsDetail: this.data.exchangeGoodsList[idx]
      })
    }
    if (this.data.nowGoodsDetail.score > this.data.userintegral) {
      wx.showToast({
        title: '您的积分不足',
        icon: 'none'
      })
      return
    }
    if (this.data.nowGoodsDetail.rest == 0) {
      wx.showToast({
        title: '库存不足',
        icon: 'none'
      })
      return
    }
    if (this.data.nowGoodsDetail.disbursement == 3) { //两种都有
      this.setData({
        hideTabs: false,
        selectType: 0
      })
    } else { // 只有一种
      this.setData({
        hideTabs: true,
        selectType: this.data.nowGoodsDetail.disbursement - 1
      })
    }
    this.setData({
      showSelectType: true,
      showGoodsDetail: false,
    })
  },
  // 显示方式选择
  closeType() {
    this.setData({
      showSelectType: false
    })
  },
  // 更改配送方式
  changeType(e) {
    this.setData({
      selectType: e.currentTarget.dataset.index
    })
  },
  // 选择配送地址
  toSelectAddress() {
    if (this.data.selectType == 1) {
      app.globalData.comefrom = 'integral'
      wx.navigateTo({
        url: '/pages/Address/AddressList/AddressList',
      })
    }
  },
  // 获得留言信息
  getMessageValue(e) {
    this.setData({
      messageValue: e.detail.value.trim()
    })
  },
  //  选择时间弹框
  showTimeSelect() {
    this.setData({
      showTimeSelect: true,
      currentDate: new Date(this.data.currentDate).getTime()
    })
  },
  //  关闭选择时间弹框
  closeTimeSelect() {
    this.setData({
      showTimeSelect: false
    })
  },
  onInput(event) { // 确认时间
    this.setData({
      currentDate: this.formatDate(event.detail),
      selectedTime: this.formatDate(event.detail)
    })
    this.closeTimeSelect()
  },
  // 兑换
  exchangeIn() {
    let that = this
    wx.showLoading({
      title: '兑换中',
      mask: true
    })
    if (!this.data.isSubmit) {
      this.setData({
        isSubmit: !this.data.isSubmit
      })
      let data = {
        marchantId: this.data.marchantId,
        presentId: this.data.nowGoodsDetail.id,
        getWay: this.data.selectType + 1,
        message: this.data.messageValue
      }
      if (this.data.selectType == 0) { // 到店
        if (!this.data.selectedTime) {
          wx.showToast({
            title: '请选择到店时间',
            icon: 'none'
          })
          this.setData({
            isSubmit: false
          })
          return
        }
        data.address = this.data.toStoreAddress
        data.contacts = this.data.toStoreContactMan
        data.contactsWay = this.data.toStoreTel
        data.arriveTime = this.data.selectedTime
      }
      if (this.data.selectType == 1) { //  配送
        if (!this.data.logisticsAddress) {
          wx.showToast({
            title: '请选择联系方式',
            icon: 'none'
          })
          this.setData({
            isSubmit: false
          })
          return
        }
        data.address = this.data.logisticsAddress
        data.contacts = this.data.logisticsContactMan
        data.contactsWay = this.data.logisticsTel
      }
      wx.requestSubscribeMessage({
        tmplIds: [app.globalData.sj_shipments],
        complete: function () {
          return app.sjrequest('/integral/exchangeIn', data).then(res => {
            if (res.data.code == 200) {
              wx.showToast({
                title: '兑换成功'
              })
              that.setData({
                showSelectType: false
              })
              setTimeout(res => {
                that.setData({
                  isSubmit: false
                })
                wx.navigateTo({
                  url: `/pages/Index/integral/integralRecord/integralRecord?marchantId=${that.data.marchantId}`,
                })
              }, 1000)
            } else {
              that.setData({
                isSubmit: false
              })
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          })
        }
      })
    }
  },
  formatDate(date) {
    var date = new Date(date);
    var YY = date.getFullYear() + '-';
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    return YY + MM + DD;
  },
  // 完成任务
  toFinishTask(e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url + '?marchantId=' + this.data.marchantId,
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
    if (!this.data.isFirst) {
      this.getUserIntegral()
      this.getTaskList()
      this.getIntegralInfo()
    }
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
  changeTime(e) {
    this.setData({
      timeData: e.detail,
    });
  },
  // 签到
  signIn() {
    let that = this
    let data = {
      marchantId: this.data.marchantId,
      type: 1
    }
    app.sjrequest('/integral/operateSignin', data).then(res => {
      if (res.data.code == 200) {
        this.setData({
          isFinishSign: true
        })
        that.getUserIntegral()
        that.getSignData()
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
      console.log(res, '查询签到数据')
      if (res.data.code == 200) {
        let time1 = time.formatTimeSec(res.data.data.countDownTime)
        console.log(time1, '时间')
        res.data.data.countDownTime = new Date(time1.replace(/-/g, '/')).getTime() - new Date().getTime();
        this.setData({
          signData: res.data.data
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  // 倒计时结束
  overActivity() {
    this.setData({
      isOverTime: true
    })
  },
  // 关闭签到页面
  closeSign() {
    this.setData({
      isFinishSign: false
    })
  },
  // 关闭页面
  closePages() {
    wx,
    wx.redirectTo({
      url: '/pages/shopHome/home/home?marchantId=' + this.data.marchantId,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let uniqueId = wx.getStorageSync('uniqueId1')
    console.log(uniqueId, "444444")
    if (e.target) {
      let setInfo = app.globalData.setInfo
      return {
        title: this.data.shopInfo.appletInfo.nickName + "做任务赚积分兑商品",
        path: e.target.dataset.url + "?marchantId=" + this.data.marchantId + '&uniqueId=' + uniqueId,
        imageUrl: e.target.dataset.url == '/pages/shopHome/home/home' ? setInfo.headImage : 'https://xssj.letterbook.cn/applet/images/integral_share_img.png'
      }
    }
    return {
      title: this.data.nickName,
      path: "/pages/Index/integral/integral?marchantId=" + this.data.marchantId + '&uniqueId=' + uniqueId,
      imageUrl: 'https://xssj.letterbook.cn/applet/images/integral_share_img.png'
    }
  },
  getShopInfo() {
    let ids = this.data.marchantId
    app.sjrequest('/marchant/subjectInfo', {
      merchantId: ids
    }).then(res => {
      this.setData({
        shopInfo: res.data.data
      })
      console.log("res:", res)
    })
  },
})