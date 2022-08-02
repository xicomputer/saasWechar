// pages/member/active/active.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRead: true,//是否已阅读
    marchantId:0 , // 商家id
    id: 0,
    name: '',      // 姓名
    tel:'',        // 手机号
    shipping:{},   // 地址 
    province:'', // 省的编码
    city:'',     // 市的编码
    area:'',   // 区的编码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({marchantId:options.marchantId})
    if(options.id){
      this.setData({id:options.id})
    }
  },
  // 立即激活
  comfirmActive(){
    wx.showLoading({
      title: '激活中',
      mask: true
    })
    if(this.data.name==''){
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return
    }
    if(this.data.tel==''){
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }
    let data = {
      marchantId:this.data.marchantId,
      name:this.data.name,
      phone:this.data.tel
    }
    if(this.data.area){
      data.area= this.data.area
    }
    if(this.data.city){
      data.city = this.data.city
    }
    if(this.data.province){
      data.province = this.data.province
    }
    if(this.data.id&&this.data.id!='null'){
      data.id = this.data.id
    }
    data.address = this.data.address
    app.sjrequest('/member/addMemberApply',data).then(res=>{
      if(res.data.code == 200){
        wx.hideLoading()
        wx.showToast({
          title: '激活成功',
        })
        setTimeout(res=>{
          wx.navigateBack({
            delta: 0,
          })
        },1000)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  changeRead(){
    this.setData({
      isRead: !this.data.isRead
    })
  },
  // 输入姓名
  inputName(e){
    this.setData({
      name:e.detail.value
    })
  },
  // 输入电话
  inputTel(e){
    var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证手机号的正则表达式
    if (!reg.test(e.detail.value)) {
      this.setData({
        tel: ''
      })
      wx.showToast({
        title: '请输入正确的手机号码',
        icon:'none'
      })
    } else {
      this.setData({
        tel: e.detail.value
      })
    }
  },
  // 说明
  toExplain(){
    wx.navigateTo({
      url: '/pages/member/explain/explain',
    })
  },
  // 跳转收货地址
  selectAddress() {
    app.globalData.comefrom ='member'
    wx.navigateTo({
      url: '/pages/Address/AddressList/AddressList'
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
  onShareAppMessage: function () {

  }
})