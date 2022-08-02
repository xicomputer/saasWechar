// pages/seckill/pay-success/pay-success.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderNum:'',//订单号
        goodsName:'',//商品名
        skuName:'',//规格名
        buyCount:'',//购买数量
        orderType:'',//配送方式 1物流 2同城 3预订
        msgText:'',//提示信息副标题
        bookTime:'',//预订时间
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var query=options.query;
        if(query){
            query=decodeURIComponent(query);
            query=JSON.parse(query);
            this.setData({...query},()=>{
                this.getMsgText();
            });
        }
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

    },

    btnHandle(e){
        var type=e.currentTarget.dataset.type;
        if(type==1){
            wx.reLaunch({url:'/pages/shopHome/home/home'});
        }else if(type==2){
            var orderType=this.data.orderType;
            var url=this.getOrderPageUrl(orderType);
            wx.navigateTo({url});
        }
    },

    getOrderPageUrl(type){
        var url='/pages/seckill/';
        type=Number(type);
        switch(type){
            case 1: url+='order-list/order-list';break;
            case 2: url+='local-list/local-list';break;
            case 3: url+='booking-list/booking-list';break;
        }
        return url;
    },

    getMsgText(){
        var type=this.data.orderType;
        var bookTime=this.data.bookTime;
        var msgText='';
        switch(Number(type)){
            case 1: msgText='商家会在48小时内发货，请留意物流信息哦~';break;
            case 2: msgText='商家自主配送，请注意配送信息哦';break;
            case 3: msgText='预计到店时间'+bookTime;break;
        }
        this.setData({msgText});
    }

})