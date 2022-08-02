// pages/seckill/order-classify/order-classify.js

let app=getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        wuliu:0,//物流订单数
        yuding:0,//预订
        tongcheng:0,//同城
        shouhou:0,//售后
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
        wx.getStorage({
            key:'merchantId',
            success:res=>{
                this.setData({merchantId:res.data},()=>{
                    var typeList=[
                        {orderType:'1',keyName:'wuliu'},{orderType:'3',keyName:'yuding'},
                        {orderType:'2',keyName:'tongcheng'},{keyName:'shouhou'},
                    ];
                    typeList.forEach(item=>{
                        this.getCount(item);
                    })
                });
            }
        });
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

    jumpOrderList(e){
        var type=e.currentTarget.dataset.type;
        var url='/pages/seckill/';
        switch(type){
            case '1': url+='order-list/order-list';break;//秒杀订单列表
            case '2': url+='booking-list/booking-list';break;//预订
            case '3': url+='local-list/local-list';break;//同城
            case '4': url+='refund-order/refund-order';break;//退款售后订单列表
        }
        wx.navigateTo({url});
    },

    getCount(temp){//获取订单数量
        var reqData={
            merchantId:this.data.merchantId,
            isQueryRefundOrder:temp.orderType!=undefined ? false : true,
            templateTag:'JSMS',
        }
        temp.orderType && (reqData.orderType=temp.orderType);
        app.sjrequest1('/activityOrderBusiness/orderCount',reqData).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data;
                var countItem={};
                if(temp.orderType){
                    countItem=data.find(item=>item.orderState!=10000);
                }else{
                    countItem=data.find(item=>item.orderState==10000);
                }
                if(countItem){
                    var keyName=temp.keyName;
                    this.setData({[keyName]:countItem.total});
                }
            }
        })
    },
})