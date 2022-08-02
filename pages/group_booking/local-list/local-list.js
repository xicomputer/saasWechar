// pages/group_booking/local-list/local-list.js
let app=getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentStatus:0,
        topTabList:[
            {status:0,name:'待付款',count:0},{status:1,name:'待接单',count:0},
            {status:2,name:'待收货',count:0},{status:4,name:'已完成',count:0}
        ],

        showCancelWhy:false,//弹窗显示状态
        whyNum:0,//取消原因序号
        popupTitle:'',//理由弹窗标题
        reasonText:'',//理由
        whyList:[
            {content:'信息填写错误',whyNum:1},
            {content:'不想买了',whyNum:2},
            {content:'卖家问题',whyNum:3},
            {content:'其他',whyNum:-1,msgText:''},
        ],

        dataList:[],//列表数据
        storeData:{
            tabDataall:{stopReq:false,pageNum:1,list:[]},
            tabData0:{stopReq:false,pageNum:1,list:[]},
            tabData1:{stopReq:false,pageNum:1,list:[]},
            tabData2:{stopReq:false,pageNum:1,list:[]},
            tabData3:{stopReq:false,pageNum:1,list:[]},
            tabData4:{stopReq:false,pageNum:1,list:[]},
        },

        merchantId:'',//商家id

        operateOrder:{},//操作订单

        pageSize:10,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var status=options.status;
        if(status!==undefined){
            this.setData({currentStatus:status});
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

        wx.getStorage({
            key:'merchantId',
            success:res=>{
                this.setData({merchantId:res.data},()=>{
                    this.getOrderList();
                    this.getCount();
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
        this.refreshData();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        var state=this.data.currentStatus;
        var storeData=this.data.storeData;
        var nowTabData=storeData['tabData'+state];
        if(!nowTabData.stopReq){
            nowTabData.pageNum++;
            this.setData({storeData},()=>{
                this.getOrderList();
            });
        }
    },

    refreshData(){//刷新列表数据
        var state=this.data.currentStatus;
        var storeData=this.data.storeData;
        var nowTabData=storeData['tabData'+state];
        nowTabData.pageNum=1;
        nowTabData.stopReq=false;
        this.setData({storeData},()=>{this.getOrderList();});
    },

    jumpDetail(e){//跳转订单详情
        var orderItem=e.currentTarget.dataset.item;
        var queryStr=`orderNum=${orderItem.orderNumber}&state=${orderItem.orderState}`
        wx.navigateTo({
            url:'/pages/group_booking/order-detail/order-detail?'+queryStr,
            events:{
                uploadOrderList:()=>{
                    this.refreshData();
                    this.getCount();
                }
            }
        });
    },

    jumpGoodsDetail(e){//重新购买时 跳转活动商品详情
        var orderItem=e.currentTarget.dataset.item;
        wx.navigateTo({
            url:'/pages/group_booking/detail/detail?activityId='+orderItem.activityId
        });
    },

    jumpEvaluate(e){//跳转评价页面
        var orderItem=e.currentTarget.dataset.item;

        app.globalData.marchantId = orderItem.marchantId;//商家id
        app.globalData.commodityId = orderItem.commodityId;//商品id
        app.globalData.commodityLogo = orderItem.imageUrl;//商品图片
        app.globalData.commodityName = orderItem.commodityName;//商品名称
        app.globalData.orderUniqueId = orderItem.orderNumber;//订单uid

        wx.navigateTo({
            url:'/pages/order/postGoodsComment/postGoodsComment'
        });
    },

    closePopup(){//关闭弹窗
        this.setData({showCancelWhy:false});
    },

    openWhyList(e){//打开取消订单原因列表选择弹窗
        var orderItem=e.currentTarget.dataset.item;
        var orderState=orderItem.orderState;
        if(orderItem.activityOrderRefundResponse){//申请了退款
            wx.navigateTo({url:'/pages/group_booking/refund-order/refund-order'});
        }else{
            var popupTitle=orderState===0?'选择取消理由':'选择退款理由';
            this.setData({showCancelWhy:true, popupTitle, operateOrder:orderItem});
        }
    },

    popupConfrimHandle(){//确认取消订单
        var whyList=this.data.whyList;
        var whyNum=this.data.whyNum;
        var whyItem=whyList.find(item=>item.whyNum==whyNum) || {};
        var reasonText=whyNum==-1?this.data.reasonText:whyItem.content;
        if(!reasonText){return wx.showToast({title:'请选择原因',icon:'none'})}

        var operateOrder=this.data.operateOrder;
        var dataList=this.data.dataList;
        var index=dataList.findIndex(item=>item.orderNumber==operateOrder.orderNumber);
        var storeData=this.data.storeData;
        var status=operateOrder.orderState;
        var reqUrl='';
        switch(status){
            case 0: reqUrl='/activityOrderBusiness/cancelOrder';break;//取消订单
            case 1: reqUrl='/activityOrderBusiness/beforeSendCommodityRefund';break;//待发货退款
            case 4: reqUrl='/activityOrderBusiness/afterSendCommodityRefund';break;//收货后退款
        }

        this.setData({showCancelWhy:false});
        app.sjrequest1(reqUrl,{
            orderNumber:operateOrder.orderNumber,
            refundReason:reasonText,//原因
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                wx.showToast({title:'操作成功',icon:'none'});
                this.refreshData();
                this.getCount();//更新数量标识
            }
        });
    },

    remindDelivery(e){//提醒发货
        var orderItem=e.currentTarget.dataset.item;
        app.sjrequest1('/activityOrderBusiness/sendDeliverySms',{
            orderNumber:orderItem.orderNumber
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                wx.showToast({title:'已提醒',icon:'none'});
            }
        });
    },

    goPay(e){//待支付订单 去支付
        if(this.activation){ return }
        this.activation=true;
        setTimeout(()=>{this.activation=null},1500);

        var orderItem=e.currentTarget.dataset.item;
        var {merchantId,appId} = this.data;
        var dataList=this.data.dataList;
        var index=dataList.findIndex(item=>item.orderNumber==orderItem.orderNumber);
        var storeData=this.data.storeData;

        wx.showLoading({title:'请求支付',mask:true});
        app.sjrequest1('/activityOrderBusiness/wxPay',{
            orderNumber:orderItem.orderNumber,
            merchantId,appId,
        }).then(res=>{
            wx.hideLoading();
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data;
                wx.requestPayment({
                    ...data,
                    success:res=>{
                        var tempArr=dataList.splice(index,1);
                        tempArr[0].orderState=1;
                        storeData.tabData1.list.unshift(...tempArr);
                        this.setData({dataList,storeData});
                        this.getCount();//更新数量标识

                        var query={
                            orderNum:data.orderNo,
                            goodsName:orderItem.commodityName,
                            skuName:orderItem.skuName,
                            buyCount:orderItem.amount
                        }
                        var queryStr=JSON.stringify(query);
                        queryStr='query='+encodeURIComponent(queryStr);
                        wx.navigateTo({
                            url:'/pages/group_booking/pay-success/pay-success?'+queryStr
                        });
                    }
                });
            }
        });
    },

    confirmDelivery(e){//确认收货
        var orderItem=e.currentTarget.dataset.item;
        var dataList=this.data.dataList;
        var index=dataList.findIndex(item=>item.orderNumber==orderItem.orderNumber);
        var storeData=this.data.storeData;
        
        app.sjrequest1('/activityOrderBusiness/confirmOrder',{
            orderNumber:orderItem.orderNumber
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                wx.showToast({title:'已收货',icon:'none'});
                var tempArr=dataList.splice(index,1);
                tempArr[0].orderState=4;
                storeData.tabData4.list.unshift(...tempArr);
                this.setData({dataList,storeData});
                this.getCount();//更新数量标识
            }
        })
    },

    contactMerchant(e){//联系商家
        wx.getStorage({
            key:'zl_userInfo',
            success:res=>{
                var data=res.data;
                if(data.statusCode==200 && data.data.code==200){
                    var info=data.data.data;
                    var appName=info.setInfo.appName;
                    var headImage=info.setInfo.headImage;
                    wx.navigateTo({
                        url: `/pages/order/contact/contact?logoPic=${headImage}&marchantId=${this.data.merchantId}&marchantName=${appName}`,
                    });
                }
            }
        });
    },

    delOrder(e){//删除订单
        var orderItem=e.currentTarget.dataset.item;
        var dataList=this.data.dataList;
        var index=dataList.findIndex(item=>item.orderNumber==orderItem.orderNumber);

        // activityOrderBusiness/deleteOrder 
        app.sjrequest1('/activityOrderBusiness/cancelOrder',{
            orderNumber:orderItem.orderNumber
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                wx.showToast({title:'已删除',icon:'none'});
                dataList.splice(index,1);
                this.setData({dataList});
            }
        })
    },

    switchStatus(e){//切换顶部导航状态
        var status=e.currentTarget.dataset.status;
        var currentStatus=this.data.currentStatus;
        if(currentStatus!=status){
            this.setData({currentStatus:status},()=>{
                var storeData=this.data.storeData;
                var list=storeData['tabData'+status].list;
                if(list.length==0){ 
                    this.getOrderList();
                }else{
                    this.setData({dataList:list});
                }
            });
        }
    },

    selectWhy(e){
        var whyNum=e.currentTarget.dataset.whynum;
        if(this.data.whyNum!=whyNum){
            this.setData({whyNum});
        }
    },

    textareaChange(e){//输入框内容改变
        var value=e.detail.value;
        this.setData({reasonText:value});
    },

    _getStateText(state,isDelete){
        var stateText='';
        switch(state){
            case 0: stateText='待付款';break;
            case 1: stateText='待接单';break;
            case 2: stateText='待收货';break;
            case 4: stateText='已完成';break;
        }
        return stateText;
    },

    _joinUserAddress(shippingInfo){//拼接用户地址
        var {provincesName,cityName,areaName,address} = shippingInfo;
        return provincesName+cityName+areaName+address;
    },

    _parseDate(str,resType) { //resType 取值 'object' | 'number'
        var a = str.split(/[^0-9]+/);
        var date = new Date(a[0], a[1] - 1, a[2], a[3] || 0, a[4] || 0, a[5] || 0);
        return resType == 'number' ? date.getTime() : date;
    },

    getOrderList(){
        var {pageSize,merchantId,currentStatus,storeData} = this.data;
        var reqData={
            pageSize:pageSize,
            merchantId:merchantId,
            isQueryRefundOrder:false,
            templateTag:'TTPT',
            orderType:'2'
        }
        var nowTabData={};
        nowTabData=storeData['tabData'+currentStatus];
        currentStatus!=='all' && (reqData.orderState=currentStatus);

        if(currentStatus==3){//查退款订单
            reqData.isQueryRefundOrder=true;
            reqData.refundStatus=5;
        }

        reqData.currentPage=nowTabData.pageNum;//页码

        app.sjrequest1('/activityOrderBusiness/activityOrderPageList',reqData).then(res=>{
            wx.stopPullDownRefresh();
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data;
                var list=data ? data.list : [];
                nowTabData.stopReq=list.length!=pageSize;
                list.forEach(item=>{
                    if(item.orderState===0){
                        var totalBuyTimes=15*60*1000;
                        var orderTimes=this._parseDate(item.orderTime,'number');
                        var nowTimes=new Date().getTime();
                        var diffTimes=nowTimes-orderTimes;//时间差毫秒数
                        var remaining=totalBuyTimes-diffTimes;//剩余时间
                        item.downTimes=remaining;
                        item.downTimeObj={minutes:'',seconds:''}
                    }
                    item.shippingInfo=JSON.parse(item.shippingAddress || '{}');
                    item.userAddress=this._joinUserAddress(item.shippingInfo);
                    item.orderStateText=this._getStateText(item.orderState,item.isDelete);
                });

                if(nowTabData.pageNum==1){
                    nowTabData.list=list;
                }else{
                    nowTabData.list.push(...list);
                }

                this.setData({dataList:nowTabData.list});
            }
        })
    },

    finishFun(e){//倒计时完成
        var index=e.currentTarget.dataset.index;
        var dataList=this.data.dataList;
        dataList[index].downTimes=0;
    },
    changeFun(e){//倒计时改变
        var index=e.currentTarget.dataset.index;
        var detail=e.detail;
        for(var key in detail){
            var value=detail[key];
            detail[key]=value<10?('0'+value):value;
        }
        var dataList=this.data.dataList;
        dataList[index].downTimeObj=detail;
        this.setData({dataList});
    },

    getCount(){//获取订单数量
        var topTabList=this.data.topTabList;
        app.sjrequest1('/activityOrderBusiness/orderCount',{
            merchantId:this.data.merchantId,
            isQueryRefundOrder:false,
            templateTag:'TTPT',
            orderType:'2'
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data;
                topTabList.forEach(item=>{
                    var countItem=data.find(temp=>temp.orderState==item.status);
                    if(countItem){
                        if(!(item.status==4 || item.status==3)){
                            item.count=countItem.total;
                        }
                    }else{
                        item.count=0;
                    }
                });
                this.setData({topTabList});
            }
        })
    },

})