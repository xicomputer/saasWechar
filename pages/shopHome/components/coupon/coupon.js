// pages/shopHome/components/Article/Article.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    marchantId: String,
    mainBusinessModel: String,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转到优惠券页面
    members() {
      let marchantId = wx.getStorageSync('merchantId')
      wx.navigateTo({
        url: `/pages/Index/couponList/couponList?marchantId=${marchantId}`,
      })
    },

    aciveUrl(e) {
      let url = e.currentTarget.dataset.url
      let marchantId = this.data.marchantId;
      var mainBusinessModel = this.data.mainBusinessModel;
      console.log(marchantId)
      wx.navigateTo({
        url: url + "?marchantId=" + marchantId + '&mainOrderType=' + mainBusinessModel,
      })
    },
  },

})