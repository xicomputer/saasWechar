// pages/retail/Withdraw/Withdraw.js
const app = getApp()
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [],
    type: '',
    play: false,
    showApplied: false,
    money: 0,
    commissionList: [],
    cardType: "储蓄卡", //卡类型
    value: '',
    commission: [],
    balance: "",//余额
    commissionJson: [],
    headImgUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type
    this.setData({
      type: type,
      headImgUrl:options.headImgUrl
    })
    this.pageUp();

  },
  onChange(event) {
    // var index = this.data.result.findIndex((item) => {

    //   return item == checkbox.marchantId
    // })
    this.setData({
      result: event.detail,
    });


  },
  toggle(e) {
    var that = this;
    var id = e.currentTarget.dataset.index
    var idx = e.currentTarget.dataset.id
     //判断当前点击的是否在复选框中
     var index = this.data.result.findIndex((item) => {

      return item == idx
    })
    console.log(index)
    var money = that.data.money
    if (index != -1) {
      console.log('选中了')
      this.data.commissionJson.splice(id, 0, {
        marchantId: +that.data.commissionList[id].marchantId,
        servantsMoney: +that.data.commissionList[id].servantsMoney
      })
      //console.log(this.data.commissionJson)
    
      const servantsMoney = that.data.commissionList[id].servantsMoney
        const money =that.data.money
        const total = (money*1000*1000 + servantsMoney*1000*1000)/1000/1000
        that.setData({money:total})
      
    } else {
      console.log('没选中')
      that.data.commissionJson[id].isDelete = true
      
      let money = that.data.money
      let servantsMoney = that.data.commissionList[id].servantsMoney
      const total = (money*1000*1000 - servantsMoney*1000*1000)/1000/1000
        that.setData({money:total})
    }
  },
  

  pageUp: function () {
  },
  showApplyToast() {
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
  // onShareAppMessage: function () {

  // }
})