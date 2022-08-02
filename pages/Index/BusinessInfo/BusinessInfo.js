// pages/Index/BusinessInfo/BusinessInfo.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shopInfo:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.getShopInfo()
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

    getShopInfo(){
        let ids = wx.getStorageSync('merchantId')
        app.sjrequest('/marchant/subjectInfo',{merchantId:ids}).then(res=>{
            let info = res.data.data
            if(info.subjectType.indexOf("INDIVIDUAL")){
                info.type = true
            }else{
                info.type = false
            }
            this.setData({
                shopInfo:info
            })
        })
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

    showImg(){
        let img = this.data.shopInfo.licenseUrl;
        // wx.previewImage({urls:[img]});

        var query={imgUrl:img};
        query=encodeURIComponent(JSON.stringify(query));
        wx.navigateTo({
            url:'/pages/Index/preview-protect-img/preview-protect-img?query='+query
        });
    },
    /**
     * 用户点击右上角分享
     */
})