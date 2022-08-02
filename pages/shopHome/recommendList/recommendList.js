// pages/shopHome/CityList/CityList.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        GoodsList: [], // 今日推荐数据
        marchantId: '', // 商户ID
        mainOrderType: '' // 当前商户运营模式ID 1, 2, 3
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let mainOrderType = options.mainOrderType
        var marchantId = wx.getStorageSync('merchantId')
        this.setData({
            marchantId,
            mainOrderType
        })
        this.getMainGoods()
    },

    getMainGoods() { //查询主推业务商品 物流 同城 预订  代替商家推荐与banner中的商品
        app.sjrequest('/commodity/queryCommodityList', {
            'marchantId': this.data.marchantId,
            pageSize: 20,
            pageCurr: 1,
        }).then(res => {
            if (res.data.code == 200) {
                var result = res.data.data;
                this.setData({
                    GoodsList: result
                });
            }
            console.log(this.data.GoodsList, '商家推荐')
        })
    },
    // 去往当个商品详情页
    toGoodsDetails(e) {
        var id = e.currentTarget.dataset.id;
        var mainOrderType = this.data.mainOrderType;
        var url = '/pages/Index/GoodsDetails/GoodsDetails?id=' + id
        if (mainOrderType == 2 || mainOrderType == 3) {
            mainOrderType == 2 && (url += `&city=1`); //同城
            mainOrderType == 3 && (url += `&reserve=1`); //预订
        }
        wx.navigateTo({
            url
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

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

    /* 分享朋友 */
    onShareAppMessage() {},

    /* 分享朋友圈 */
    onShareTimeline() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},

})