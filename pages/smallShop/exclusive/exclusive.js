// pages/smallShop/exclusive/exclusive.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        fxBannerList:['https://xssj.letterbook.cn/applet/images/fx_banner1.jpg','https://xssj.letterbook.cn/applet/images/fx_banner2.jpg'],
        distributionAmount:"",
        serviceCharge:"",
        noWithdrawal:"",
        stayAmount:"",
        unWithdrawal:"",
        showExplain:false,
        distributionRules: false,
        showApplied: false,
        showApp: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    toExlpain(){
        this.setData({
            showExplain:true
        })
    },

    onClose: function () {
        this.setData({
          distributionRules: false
        })
        this.setData({
          showApplied: false
        })
        this.setData({
          showApp: false
        })
        this.setData({
          showExplain: false
        })
    },
    goScart(){
        wx.redirectTo({
          url: '/pages/smallShop/Scart/Scart',
        })
    },
    toWithDraw(){
        wx.navigateTo({
            url: `/pages/smallShop/Withdraw/Withdraw`,
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