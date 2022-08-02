// pages/Invoice/NewInvoice/NewInvoice.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: true,
    name: "",
    number: "",
    email: "",
    orderData:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onChange(){
    this.setData({
      checked:!this.data.checked
    })
  },
  Save() {
    console.log(111)
    if(this.data.name==''){
      wx.showToast({
        icon: 'none',
        title: '请输入公司名称',
      })
      return;
    }
    if(this.data.number==""){
      wx.showToast({
        icon: 'none',
        title: '请输入公司税号',
      })
      return;
    }
    if(this.data.email==""){
      wx.showToast({
        icon: 'none',
        title: '请填写邮箱地址',
      })
      return;
    }
    var myReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
  if (myReg.test(this.data.email)) {　　　　
      console.log("true")　
  }else{
    wx.showToast({
        icon: 'none',
        title: '邮箱号错误',
      })
    return;
  }
  wx.showLoading({
    title: '保存中',
    mask: true
  })
    let data = {companyName:this.data.name,companyDp:this.data.number,email:this.data.email,isDefault:this.data.checked?1:0}
    app.sjrequest('/commodity/addInvoice',data).then(res=>{
      if(res.data.code == 200) {
        wx.hideLoading()
        console.log(res.data.data)
        let pages = getCurrentPages()
        let prevPge = pages[pages.length-2]
        wx.navigateBack({
          delta: 0,
          success: (res) => {
            prevPge.showInvoiceList()
          },
          fail: (res) => {},
          complete: (res) => {},
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
      
    })
  },
  updateName(e) {
    this.setData({
      name:e.detail.value.trim()
    })
  },
  updateNumber(e) {
    let value = this.validateNumber(e.detail.value)
    this.setData({
        number: value
    })
  },
  // 校验只能输入数字,英文
  validateNumber(val) {
    return val.replace(/[\W]/g, '')
  },
  updateEmail(e) {
    this.setData({
      email:e.detail.value
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