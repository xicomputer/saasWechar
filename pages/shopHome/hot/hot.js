// pages/shopHome/hot/hot.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hotSaleGoodsList:[],
        marchantId:null,
        videoList:[],
        nowSaleGoods:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //wx.getStorageSync("merchantId")
        let ids = wx.getStorageSync("merchantId")
        this.setData({marchantId:ids})
        this.getVideoList()
    },
    // 获取视频列表
    getVideoList(){
        let data ={marchantId:this.data.marchantId}
        return app.sjrequest('/commodity/queryVideoCommodityList',data).then(res=>{
        if(res.data.code == 200){
            wx.hideLoading()
            let list = []
            if(res.data.data.length){
            res.data.data.forEach((item,index)=>{
                list.push({id:index,url:item.videoUrl})
            })
            this.setData({
                videoList:list,
                hotSaleGoodsList:res.data.data,
                nowSaleGoods:res.data.data[0]
            })
            }
            
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