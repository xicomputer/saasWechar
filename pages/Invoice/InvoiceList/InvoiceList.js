// pages/Invoice/InvoiceList/InvoiceList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: "1",
    Invoice: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showInvoiceList();
  },
  backOrder(e) {
    let { from } = app.store.getState()
    if (from === 'submitOrder') {
      let itemObj = e.currentTarget.dataset.item
      var pages = getCurrentPages()
      var currPage = pages[pages.length - 1] // 当前页面
      var prevPage = pages[pages.length - 2]
      var invoice = 'submitObj.invoice'
      prevPage.setData({
        [invoice]: itemObj
      })
      // 更新 store 数据
      app.store.setState({
        from: ''
      })
      wx.navigateBack({
        delta: 1,
      })
    }
  },
  showInvoiceList() {
    var that = this
    app.sjrequest('/commodity/queryInvoice').then(res => {
      console.log('发票列表',res.data.data);
      this.setData({
        Invoice:res.data.data
      })
      that.data.Invoice.forEach((item, index) => {
        if (item.isDefault == 1) {
          this.setData({
            radio:item.id
          })
        }
      });
    });
  },
  change(e) {
    console.log(e.detail);
    let data = {invoiceId:e.detail}
    app.sjrequest('/commodity/defaultInvoice',data).then(res => {
      if(res.data.code = 200) {
        this.setData({radio:e.detail})
      }
    })
  },
  /**删除 */
  clickDel(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认删除此发票吗？',
      success: function (sm) {
        if (sm.confirm) {
            // 用户点击了确定 可以调用删除方法了
            let data ={id:e.currentTarget.dataset.id}
            app.sjrequest('/commodity/delInvoice',data).then(res=>{
              console.log(res)
              that.showInvoiceList()
          })
          } else if (sm.cancel) {
            console.log('用户点击取消')
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