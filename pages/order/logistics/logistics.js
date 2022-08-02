// pages/order/logistics/logistics.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wlList: [],
    step: 1,
    active:3,
    message:'',
    wlNumber:'',
    wlCompany:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wlNumber: options.wlNumber,
      wlCompany: options.wlCompany,
      orderNumber:options.orderNumber
    },()=>{this.getWlList()});
    
  },
//获得物流信息
getWlList(){
  var {wlNumber,orderNumber} = this.data;
  var data={'expressNo':wlNumber,orderNumber}
  app.sjrequest('/order/queryLogisticsDetails',data).then(res =>{
    if(res.data.code==200){
      var logistics = JSON.parse(res.data.data.logistics)
      if(logistics.status==0){
        var list = logistics.result.list
        this.setData({
          wlList:list
        })
      }else{
        this.setData({
          message:logistics.msg
        })
      }
    }
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
   
})