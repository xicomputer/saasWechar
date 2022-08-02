// pages/Index/integral/integralRecord/integralRecord.js
const app = getApp() 
const time = require('../../../../utils/util')
import drawQrcode from "../../../../utils/api/weapp.qrcode.min.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    marchantId:0,  // 商家id
    pageCurr:1,    // 分页
    pageSize:10,
    stopLoading: false, // 是否触底
    exchangeRecordList:[], // 兑换记录列表
    verification:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    this.setData({
      marchantId:options.marchantId
    })
    this.getRecordList()
  },
  // 获取兑换记录列表
  getRecordList(){
    let data = {marchantId:this.data.marchantId,pageCurr:this.data.pageCurr,pageSize:this.data.pageSize}
    return app.sjrequest('/integral/queryExchange',data).then(res=>{
      if(res.data.code == 200) {
        wx.hideLoading()
        res.data.data.forEach(item=>{  // 处理时间
          if(item.addTime){
            item.addTime = time.formatTimeSec(item.addTime)
          }
          if(item.arriveTime){
            item.arriveTimes = time.formatDate(item.arriveTimes)
          }
        })
        this.setData({
          exchangeRecordList:[...this.data.exchangeRecordList,...res.data.data],
          pageCurr:this.data.pageCurr + 1
        })
        if(res.data.data.length<10){ // 到底了
          this.setData({
            stopLoading: true
          })
        }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  // 清楚数据
  clearData(){
    this.setData({
      pageCurr:1,    // 分页
      stopLoading: false, // 是否触底
      exchangeRecordList:[], // 兑换记录列表
    })
  },
  catch(){
    return
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
  // 确认收货
  comfirmGet(e){
    var that = this
    let integralNumber = e.currentTarget.dataset.num
    wx.showModal({
      title: '提示',
      content: '确认已收货吗？',
      success: function (sm) {
        if (sm.confirm) {
            // 用户点击了确定 可以调用删除方法了
            let data = {integralNumber:integralNumber}
            wx.showLoading({
              title: '加载中',
            })
            app.sjrequest('/integral/confirmationReceiving',data).then(res=>{
              if(res.data.code ==200){
                that.clearData()
                that.getRecordList()
              }else{
                wx.showToast({
                  title: res.data.msg,
                  icon:'none'
                })
              }
            })
          } else if (sm.cancel) {
            console.log('用户点击取消')
          }
        }
    })
  },
   //显示二维码
   showQR(e){
    let integralNumber = e.currentTarget.dataset.num
    this.setData({
      showQRCode: true
    })
    let data = {integralNumber:integralNumber}
    app.sjrequest('/integral/queryVerification',data).then(res=>{
      this.setData({
        verification: res.data.data.verification
      })
      drawQrcode({
        width: 110,
        height: 110,
        canvasId: 'myQrcode',
        text: res.data.data.verification
      })
    })
  },
  onCloseQR() {
    this.setData({ 
      showQRCode: false
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh:async function () {
    wx.showLoading({
      title: '加载中',
      })
      this.clearData()
      await this.getRecordList()
      wx.stopPullDownRefresh()
      setTimeout(res=>{
          wx.showToast({
            title: '刷新成功',
          })
        },200)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(!this.data.stopLoading){
      wx.showLoading({
        title: '加载中',
        mask:true
      })
      this.getRecordList()
    }
  },

  copyOrder(e){
    var order=e.currentTarget.dataset.order;
    wx.setClipboardData({
      data:order,
      success(res){
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})