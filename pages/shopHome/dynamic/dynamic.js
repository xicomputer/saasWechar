// pages/shopHome/dynamic/dynamic.js
const app = getApp()
Page({ 
    /**
     * 页面的初始数据
     */
    data: {
        marchantId:null,
        hotelList:[],
        commentList:[],
        storeDynamicList:[],
        markerInfo:[],
        status:1,
        storeList:[],
        orderSwitch:1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let ids = wx.getStorageSync("merchantId")
        let orderSwitch = wx.getStorageSync("orderSwitch")
        this.setData({marchantId:ids,orderSwitch:orderSwitch})
        this.showMarkerInfo()
    },
    showMarkerInfo() {
        var data={'id':this.data.marchantId}
        app.sjrequest('/marchant/queryMarchantInfo',data).then(res =>{
            if(res.data.code==200){
                var result = res.data.data;
                if(res.data.data.marchantCorrelationList.length){
                    var list = []
                    var hotelList = []
                    res.data.data.marchantCorrelationList.forEach(item=>{
                      if(item.marchantCorrelation.source == 1){list.push(item)}
                      if(item.marchantCorrelation.source == 2){hotelList.push(item)}
                    })
                }
                this.setData({
                    markerInfo: result,
                    hotelList:hotelList
                });
            }
        })
    },
    // 订阅通知
    // 获取订阅通知列表
    getCommunityList(){
        let data = {marchantId:this.data.marchantId,pageCurr:1,pageSize:10,stick:1,isMarchant:0}
        return app.sjrequest('/marchant/queryMarchantComment',data).then(res=>{
        if(res.data.code == 200){
            wx.hideLoading()
            res.data.data.forEach(item=>{
            item.addTime = time.formatTime(item.addTime)
            })
            this.setData({
            commentList:res.data.data
            })
        }else{
            wx.showToast({
            title: res.data.msg,
            icon: 'none'
            })
        }
        })
    },
    //  订阅商铺
    showDingYue() {
        // 获取用户信息
        var that = this
        let appid = wx.getStorageSync('appid')
        let data = {
            authorizerAppid:appid,
            sceneType:4
        }
        app.mb2request('/subTemplate/listPriTemplateId',data).then(res=>{
            let tempData = res.data.data
            wx.requestSubscribeMessage({
                tmplIds: tempData,
                success: function (res) {
                    wx.getSetting({
                        withSubscriptions: true,
                        success: result => {
                            wx.showToast({ title: '订阅消息成功' });
                            let data = {
                                status: that.data.status,
                                marchantId: that.data.marchantId,
                                templateIds: tempData,
                                appId:appid,
                                targetType: 5
                            } 
                            app.sjrequest('/basic/addsubscription', data).then(res => {
                                if (res.data.code == 200) {
                                    wx.showToast({ title: '订阅消息成功' });
                                    that.triggerEvent('event', true)
                                } else {
                                    wx.showToast({title: res.data.msg,icon: 'none'});
                                }
                            })
                        }
                    })
                },
                fail(e) {
                    console.log(e)
                    wx.showToast({
                        title: '订阅消息失败,请点击右上角三个点中的设置打开消息订阅开关',
                        icon: 'none'
                    })
                }
            })
        })
        
    },
    // 获取商家动态
    getStoreDynamicList(){
        let data = {marchantId:this.data.marchantId,pageCurr:1,pageSize:10,isMarchant:1,stick:1}
        return app.sjrequest('/marchant/queryMarchantComment',data).then(res=>{
        if(res.data.code == 200){
            res.data.data.forEach(item=>{
            item.addTime = time.formatDateTime(item.addTime)
            })
            this.setData({
            storeDynamicList:res.data.data
            })
        }
        })
    },
    //  小店排行列表
    getStoreList(){
        let data = {marchantId:this.data.marchantId,pageCurr:1,pageSize:5}
        return app.sjrequest('/marchant/queryMarchantStoreList',data).then(res=>{
        if(res.data.code == 200){
            wx.hideLoading()
            this.setData({
            storeList:res.data.data
            })
        }else{
            wx.showToast({
            title: res.data.msg,
            icon: 'none'
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
})