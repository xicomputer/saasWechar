// pages/shopHome/activity/activity.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        marchantId:null,
        auctionList:[],
        saleGoodsList:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let ids = wx.getStorageSync("merchantId")
        this.setData({marchantId:ids})
        this.getAuctionList()
        this.getCategoryGoodsList()
    },

    // 获得拍卖列表
    getAuctionList(){
        const params = 
        {
        pageNum: 1,
        pageSize: 4,
        merchantId: this.data.marchantId
        }
        app.request.auctionRequest('/auction/list', params).then((res) =>{
        if(res.data.code == 200){
            const result = res.data.data
            result.forEach(item=>{
            item.startTime = new Date(item.startTime.replace(/-/g, '/')).getTime() - new Date().getTime()
            item.endTime1 = new Date(item.endTime.replace(/-/g, '/')).getTime() - new Date().getTime()
            })
            this.setData({
            auctionList: result
            })
        }
        })
    },
    // 活动
    getCategoryGoodsList(){
        var data={
        'marchantId':this.data.marchantId
        }
        app.sjrequest('/commodity/queryPromotionList',data).then(res =>{
        if(res.data.code==200){
            wx.hideLoading()
            this.setData({
            saleGoodsList: res.data.data
            })
        }else{
            wx.showToast({
            title: res.data.msg,
            icon:'none'
            })
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
    onShareAppMessage: function () {

    }
})