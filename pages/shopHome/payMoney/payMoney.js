// pages/payMoney/money.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsName:'',
        appid:'',
        merchantId:'',
        value:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('支付参数options',options)
        const appid = wx.getStorageSync('appid')
        const merchantId = wx.getStorageSync('merchantId')
        const name = wx.getStorageSync('res').data.data.setInfo.appName
        this.setData({
            goodsName:name,
            appid:appid,
            merchantId:merchantId
        })
       
    },
    //确认付款
    enterMoney(){
        if(!this.data.value){
            wx.showToast({
                title: '请输入金额',
                icon: "none",
                duration: 2000
              })
            return false
        }
        const token = wx.getStorageSync('token')
        let postDatas ={
            money:this.data.value,
            merchantId:this.data.merchantId,
            appId:this.data.appid
        }
        app.sjrequest('/offLineWxPay/pay', postDatas,token).then(res => {
            if (res.data.code === 200){
                console.log(res.data.data)
                wx.requestPayment({ 
                    ...res.data.data,
                    success:res=>{
                        console.log(res)
                        wx.showToast({
                            title: '支付成功',
                            icon: "success",
                            duration: 2000
                          })
                          setTimeout(()=>{
                            wx.redirectTo({
                              url: '/pages/shopHome/home/home',
                            })
                          },1500)
                    }
                });
            }
        })
    },
    getvalue(e){
        var val = e.detail.value;
        this.setData({value:val*100});
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