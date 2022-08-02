// pages/shopHome/components/Article/Article.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
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
        goIntegral(){  //跳转到优惠券页面
            let merchantId = wx.getStorageSync('merchantId')
            wx.navigateTo({
              url: `/pages/Index/integral/integral?marchantId=${merchantId}`,
            })
          },
    }
})
