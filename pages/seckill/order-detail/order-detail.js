// pages/seckill/order-detail/order-detail.js

let app=getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        appId:'',
        orderState:'',
        adornUrl:'../imgs/dfh.png',

        topTitle:'',//头部标题

        showCancelWhy:false,//弹窗显示状态
        whyNum:0,//取消原因序号
        whyList:[
            {content:'信息填写错误',whyNum:1},
            {content:'不想买了',whyNum:2},
            {content:'卖家问题',whyNum:3},
            {content:'其他',whyNum:-1},
        ],
        whyType:1,//原因类型 1取消订单 2退款
        whyPopupTitle:'',//原因弹窗标题
        reasonText:'',//理由

        orderInfo:{},//订单信息
        logisticsInfo:{},//物流信息
        nowLogisticsItem:{},//物流最新节点信息
        shippingAddress:{},//地址信息
        fullAddress:'',//完整收货地址

        isOverdue:false,//待支付订单是否过期
        downTimeObj:{minutes:'',seconds:''},

        residueDay:3,//剩余自动确认收货天数
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var orderNum=options.orderNum;
        var orderState=options.state;
        if(orderNum){
            this.orderNum=orderNum;
            this.getOrderDetailInfo();
        }

        if(orderState){
            this.setPageTitle(orderState);
            this.setData({orderState});
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.getStorage({
            key:'appid',
            success:res=>{
                this.setData({appId:res.data});
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

    setPageTitle(state){//设置页码标题
        var navTitle='', topTitle='', adornUrl='';
        switch(Number(state)){
            case 0: 
                navTitle='待付款';topTitle='等待您的付款';
                adornUrl='../imgs/dfk.png';
                break;
            case 1: 
                navTitle='待发货';topTitle='等待商家发货';
                adornUrl='../imgs/dfh.png';
                break;
            case 2: 
                navTitle='待收货';topTitle='等待您收货';
                adornUrl='../imgs/dsh.png';
                break;
            case 3: 
                navTitle='已取消';adornUrl='../imgs/yqx.png';
                break;
            case 4: 
                navTitle='已完成';topTitle='买家已确认收货';
                adornUrl='../imgs/ywc.png'
                break;
        }
        wx.setNavigationBarTitle({title:navTitle});
        this.setData({topTitle,adornUrl});
    },

    jumpLogisticsShow(){//跳转物流信息展示
        var logisticsInfo=this.data.logisticsInfo;
        var query=`wlNumber=${logisticsInfo.number}&wlCompany=${logisticsInfo.expName}&orderNumber=${logisticsInfo.orderNumber}`;
        wx.navigateTo({
            url:'/pages/order/logistics/logistics?'+query
        });
    },

    closePopup(){//关闭弹窗
        this.setData({showCancelWhy:false});
    },

    openWhyList(e){//打开取消订单原因列表选择弹窗
        var type=e.currentTarget.dataset.type;
        var orderItem=this.data.orderInfo;
        if(orderItem.activityOrderRefundResponse){//申请了退款
            wx.navigateTo({url:'/pages/seckill/refund-order/refund-order'});
        }else{
            var title=type==0?'选择取消理由':'选择退款原因';
            this.setData({showCancelWhy:true, whyType:type, whyPopupTitle:title});
        }
    },

    selectWhy(e){//选择理由
        var whyNum=e.currentTarget.dataset.whynum;
        if(this.data.whyNum!=whyNum){
            this.setData({whyNum});
        }
    },

    textareaChange(e){//输入框内容改变
        var value=e.detail.value;
        this.setData({reasonText:value});
    },

    popupConfrimHandle(){//原因弹窗确认操作
        var whyType=this.data.whyType;
        var whyNum=this.data.whyNum;
        var whyList=this.data.whyList;
        var whyItem=whyList.find(item=>item.whyNum==whyNum) || {};
        var reasonText=whyNum==-1 ? this.data.reasonText : whyItem.content;
        if(whyType==1){
            this.cancelOrder(reasonText);
        }else if(whyType==2){
            this.applyRefund(reasonText);
        }
    },

    cancelOrder(reasonText){//确认取消订单
        if(!reasonText){return wx.showToast({title:'请选择原因',icon:'none'});}
        this.setData({showCancelWhy:false});
        app.sjrequest1('/activityOrderBusiness/cancelOrder',{
            orderNumber:this.orderNum,
            refundReason:reasonText,//退款原因
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                wx.showToast({title:'操作成功',icon:'none'});
                dataList.splice(index,1);
                this.setData({dataList});
                const eventChannel = this.getOpenerEventChannel();
                eventChannel.emit('uploadOrderList');
                wx.navigateBack();
            }
        });
    },

    applyRefund(reasonText){//确认申请退款
        var state=this.data.orderInfo.orderState;
        var reqUrl='';
        switch(state){
            case 1: reqUrl='/activityOrderBusiness/beforeSendCommodityRefund';break;//待发货退款
            case 4: reqUrl='/activityOrderBusiness/afterSendCommodityRefund';break;//收货后退款
        }
        app.sjrequest1(reqUrl,{
            orderNumber:this.orderNum,
            refundReason:reasonText,//退款原因
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                wx.showToast({title:'操作成功',icon:'none'});
            }
        })
    },

    jumpAddressList(){//跳转收货地址列表
        if(this.data.fullAddress){return;}

        app.store.setState({from:'submitOrder'});
        wx.navigateTo({
            url:'/pages/Address/AddressList/AddressList',
            events:{
                addressChange:(data)=>{
                    var shipping=data.shipping;
                    var fullAddress=this.joinAddress(shipping);
                    this.setData({userShipping:shipping,fullAddress});
                }
            }
        });
    },

    getLogisticsInfo(){//获取物流信息
        app.sjrequest1('/activityOrderBusiness/queryLogisticsDetails',{
            expressNumber:this.data.orderInfo.expressNo,
            orderNumber:this.data.orderInfo.orderNumber
        }).then(res=>{
            console.log('物流信息：',res);
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data;
                var info=JSON.parse(data);
                var nowLogisticsItem=info.result.list[0];
                this.setData({logisticsInfo:info.result, nowLogisticsItem});
            }
        })
    },

    joinAddress(shipping){//拼接收货地址
        var {provincesName,cityName,areaName,address} = shipping;
        return provincesName+cityName+areaName+address;
    },

    _parseDate(str,resType) { //resType 取值 'object' | 'number'
        var a = str.split(/[^0-9]+/);
        var date = new Date(a[0], a[1] - 1, a[2], a[3] || 0, a[4] || 0, a[5] || 0);
        return resType == 'number' ? date.getTime() : date;
    },

    getOrderDetailInfo(){
        app.sjrequest1('/activityOrderBusiness/detailOrder',{
            orderNumber:this.orderNum
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data;
                var shippingAddress=JSON.parse(data.shippingAddress);
                var fullAddress=this.joinAddress(shippingAddress);
                if(data.orderState===0){
                    var totalBuyTimes=15*60*1000;
                    var orderTimes=this._parseDate(data.orderTime,'number');
                    var nowTimes=new Date().getTime();
                    var diffTimes=nowTimes-orderTimes;//时间差毫秒数
                    var downTimes=totalBuyTimes-diffTimes;//剩余时间
                    var isOverdue=downTimes<=0;
                    this.setData({isOverdue,downTimes});
                }else if(data.orderState===2){
                    var nowTimes=new Date().getTime();
                    var deliveryTimes=this._parseDate(data.deliveryTime,'number');
                    var diffTimes=deliveryTimes-nowTimes;
                    this.setData({downTimes:diffTimes});
                }
                this.setData({orderInfo:data,shippingAddress,fullAddress},()=>{
                    if(data.expressNo){this.getLogisticsInfo();}
                });

                this.computedSurplus(data.deliveryTime);//计算剩余收货时间
            }
        });
    },

    computedSurplus(deliveryTime){
        if(deliveryTime){
            var totalTimes=3*86400000;
            var nowTimes=new Date().getTime();
            var deliveryTimes=this._parseDate(deliveryTime,'number');
            var downTimes=totalTimes-(nowTimes-deliveryTimes);
            this.setData({downTimes});
        }
    },

    finishFun(){//倒计时完成
        this.setData({isOverdue:true});
    },
    changeFun(e){//倒计时改变
        var detail=e.detail;
        for(var key in detail){
            var value=detail[key];
            detail[key]=value<10?('0'+value):value;
        }
        this.setData({downTimeObj:detail});
    },

    remindDelivery(){//提醒发货
        var orderInfo=this.data.orderInfo;
        app.sjrequest1('/activityOrderBusiness/sendDeliverySms',{
            orderNumber:orderInfo.orderNumber
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                wx.showToast({title:'已提醒',icon:'none'});
            }else{
                wx.showToast({title:res.data.info||'已提醒',icon:'none'});
            }
        });
    },

    goPay(){//待支付订单 去支付
        if(this.activation){ return }
        this.activation=true;
        setTimeout(()=>{this.activation=null},1500);

        var orderInfo=this.data.orderInfo;
        var {appId} = this.data;

        wx.showLoading({title:'请求支付',mask:true});
        app.sjrequest1('/activityOrderBusiness/wxPay',{
            orderNumber:orderInfo.orderNumber,
            merchantId:orderInfo.marchantId, appId,
        }).then(res=>{
            wx.hideLoading();
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data;
                wx.requestPayment({
                    ...data,
                    success:res=>{
                        var query={
                            orderNum:data.orderNo,
                            goodsName:orderInfo.commodityName,
                            skuName:orderInfo.skuName,
                            buyCount:orderInfo.amount
                        }
                        var queryStr=JSON.stringify(query);
                        queryStr='query='+encodeURIComponent(queryStr);
                        wx.navigateTo({
                            url:'/pages/seckill/pay-success/pay-success?'+queryStr
                        });
                    }
                });
            }
        });
    },

    jumpGoodsDetail(){//重新购买时 跳转活动商品详情
        var orderInfo=this.data.orderInfo;
        wx.navigateTo({
            url:'/pages/seckill/detail/detail?activityId='+orderInfo.activityId
        });
    },

    jumpEvaluate(){//跳转评价页面
        var orderInfo=this.data.orderInfo;

        app.globalData.marchantId = orderInfo.marchantId;//商家id
        app.globalData.commodityId = orderInfo.commodityId;//商品id
        app.globalData.commodityLogo = orderInfo.imageUrl;//商品图片
        app.globalData.commodityName = orderInfo.commodityName;//商品名称
        app.globalData.orderUniqueId = orderInfo.orderNumber;//订单uid

        wx.navigateTo({
            url:'/pages/order/postGoodsComment/postGoodsComment'
        });
    },

    confirmDelivery(){//确认收货
        var orderInfo=this.data.orderInfo;
        
        app.sjrequest1('/activityOrderBusiness/confirmOrder',{
            orderNumber:orderInfo.orderNumber
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                wx.showToast({title:'已收货',icon:'none'});
                const eventChannel = this.getOpenerEventChannel();
                eventChannel.emit('uploadOrderList');
                wx.navigateBack();
            }
        })
    },

    delOrder(){//删除订单
        var orderInfo=this.data.orderInfo;

        // activityOrderBusiness/deleteOrder 
        app.sjrequest1('/activityOrderBusiness/cancelOrder',{
            orderNumber:orderInfo.orderNumber
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                wx.showToast({title:'已删除',icon:'none'});
            }
        })
    },

    contactMerchant(){//联系商家
        wx.getStorage({
            key:'zl_userInfo',
            success:res=>{
                var data=res.data;
                if(data.statusCode==200 && data.data.code==200){
                    var info=data.data.data;
                    var appName=info.setInfo.appName;
                    var headImage=info.setInfo.headImage;
                    var merchantId=this.data.orderInfo.marchantId;
                    wx.navigateTo({
                        url: `/pages/order/contact/contact?logoPic=${headImage}&marchantId=${merchantId}&marchantName=${appName}`,
                    });
                }
            }
        });
    },

})