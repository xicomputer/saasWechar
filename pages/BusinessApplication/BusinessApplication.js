// pages/BusinessApplication/BusinessApplication.js
const time = require("../../utils/util")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteCode: '',//邀请码
    initiator: '',//发起人
    isAuthorization: 1,
    startTime: '', //进入时间
    endTime: '', //离开时间
    classList: [],
    isShowClassText: '展开',
    classIndex: -1,
    phoneNumber: '',
    isAgree: true,
    isClickBtn: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.scene){
      const scene = decodeURIComponent(options.scene)
      this.getCodeParams(scene)
    }
    this.getClass()//获得平台分类
  },
  //是否从小程序码进来
  getCodeParams(id){
    let that = this
    let inviteCode
    let initiator
    app.sjrequest('/marchant/queryIdentifica',{id : id} ).then(res=>{
      if(res.data.code == 200) {
        try{
          inviteCode =JSON.parse(res.data.data.scene).inviteCode
          initiator = JSON.parse(res.data.data.scene).initiator
        }catch{
          inviteCode = ''
          initiator = ''
        }
        that.setData({
          inviteCode: inviteCode,
          initiator: initiator
        })
      }
    })
  },
  // 获得平台分类
  getClass() {
    app.shrequest('/merchant/queryMarchantLittleTypeList', { parentId: 1 }).then(res => {
      if (res.data.code == 200) {
        this.setData({
          classList: res.data.data
        })
      }
    })
  },
  // 平台分类是否全部显示
  isShowAllClass() {
    this.setData({
      isShowClassText: this.data.isShowClassText == '展开' ? '收起' : '展开'
    })
  },
  // 获得选中分类下标
  getClassIndex(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      classIndex: index
    })
  },
  // 去登录
  toLogin() {
    wx.navigateTo({
      url: '/pages/shopHome/home/home',
    })
  },
  //获得微信手机号
  getPhoneNumber(e) {
    this.setData({
      isClickBtn: false
    })
    let _this = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
	  let appid= wx.getStorageSync('appid')
	  let openid = wx.getStorageSync('openId1')
      let token = wx.getStorageSync('token')
      let sessionkey = wx.getStorageSync('sessionkey')
      wx.request({
        url: 'https://xssj.letterbook.cn/xssj-third/thirdWxLogin/deciphering',
        method: 'post',
        data: {
		      openid:openid,
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData,
		      appid:appid
        },
        header: {
          'token': token,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          _this.setData({
            phoneNumber: res.data.data.phoneNumber,
            isAuthorization: 3
          })
          wx.showToast({
            title: '绑定成功',
            icon: 'none'
          })
        },
        fail: function () {
          wx.showToast({
            title: '获取失败',
            icon: 'none'
          })
        },
        complete: function (){
          _this.setData({
            isClickBtn: true
          })
        }
      })
    } else {
      this.setData({
        isClickBtn: true
      })
      wx.showModal({
        title: '提示',
        content: '需同意授权才可使用此功能',
      })
    }
  },
  // 协议同意状态
  checkIsAgree() {
    this.setData({
      isAgree: !this.data.isAgree
    })
  },
  // 验证
  verify() {
    if (!this.data.isAgree) {
      wx.showToast({
        title: '请先阅读服务协议！',
        icon: 'none',
      })
      return false
    }
    if (this.data.classIndex == -1) {
      wx.showToast({
        title: '请选择平台分类！',
        icon: 'none'
      })
      return false
    }
    return true
  },
  // 支付
  payment() {
    const _this = this
    if(this.verify()){
      _this.setData({
        isClickBtn: false
      })
      let uniqueId = wx.getStorageSync('uniqueId');
      let token = wx.getStorageSync('token')
      let openId = wx.getStorageSync('openId_1')
      wx.request({
        //接口，
        url: 'https://xssj.letterbook.cn/xssj-third/order/paymentMarchant',
        header: {
          token: token,
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          uniqueId: uniqueId,
          openid: openId,
          orderWay: 3,
          phoneNumber: this.data.phoneNumber,
          industry: this.data.classList[this.data.classIndex].marchantTypeId,
          inviteCode: this.data.inviteCode
        },
        method: 'POST',
        success: function (res) {
          if (res.data.code == 325) {
            wx.showToast({
              title: '您还没有绑定手机号',
              icon: 'none'
            })
          } else {
            wx.requestPayment({
              appId: res.data.data.appId,
              nonceStr: res.data.data.nonceStr, // 支付签名随机串，不长于 32 位
              package: res.data.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
              signType: res.data.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              timeStamp: res.data.data.timeStamp, // 支付签名时间戳，
              paySign: res.data.data.paySign, // 支付签名
              success: function () {
                wx.showModal({
                  content: '注册码已下发到您的手机',
                  confirmText: '我知道了',
                  showCancel: false
                })
              },
              fail: function () {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none'
                })
              },
              complete: function () {
                _this.setData({
                  isClickBtn: true
                })
              }
            });
          }
        }
      })
    }
  },
  // 联系我们
  contactUS(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function () {
        wx.showToast({
          title: '复制成功',
          icon: 'none'
        })
      }
    })
  },
  // 去填写注册资料
  toRegister(){
    wx.navigateTo({
      url: '../kefu/kefu',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    //查看是否授权
    wx.getSetting({
      success: function (res) {
        if (wx.getStorageSync('wx_userinfo_key')) {
          // 已授权
          that.setData({
            isAuthorization: 2
          })
        } else {
          // 没有授权
          that.setData({
            isAuthorization: 1
          })
        }
      }
    });
    this.setData({
      startTime: time.formatNowDate(new Date())
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      endTime: time.formatNowDate(new Date())
    })

    const res = wx.getStorageSync('res')
    const nickName = res.data.data.nickName
    const avatarUrl = res.data.data.avatarUrl
    let data = {
      initiator: this.data.initiator,//发起人
      startTime: this.data.startTime,//开始时间
      endTime: this.data.endTime,//结束时间
      nickName: nickName,//昵称
      headImgUrl: avatarUrl,//头像
    }
    app.shrequest('/merchant/registerAnalysis', data)
  },
  // 分享
  onShareAppMessage(){

  }
})