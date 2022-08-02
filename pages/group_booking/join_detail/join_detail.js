// pages/group_booking/join_detail/join_detail.js

let app=getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        loginInfo:{},//登录时返回的信息
        shareUserId:'',
        activityId:'',
        downTimes:'',
        downTimeObj:{},

        activityInfo:{},
        groupInfo:{},
        skuInfo:{},
        userShipping:{},
        buyCount:1,
        appId:'',
        goodsSkuId:'',
        shareUrl:'/pages/group_booking/join_detail/join_detail',//分享页面
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var scene=options.scene;
        app.globalEvent.$on('loginComplete',()=>{
            if(scene){//扫码进入
                this.getCodeParams(scene);
            }else{
                this.initData(options);
            }

            this.getMerchantInfo();
        });
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
        this.getDetailInfo();
        this.getMerchantInfo();
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
        var groupInfo=this.data.groupInfo || {};
        var query={groupInfo}
        query=JSON.stringify(query);
        query=encodeURIComponent(query);
        return {
            title:this.data.loginInfo.nickName+'邀请你参与拼团活动',
            path:this.data.shareUrl+`&query=${query}`,
            imageUrl:this.data.activityInfo.bannerImgUrls[0]
        }
    },

    /* 分享朋友圈 */ 
    onShareTimeline(){
        var groupInfo=this.data.groupInfo || {};
        var query={groupInfo}
        query=JSON.stringify(query);
        query=encodeURIComponent(query);
        var userId = this.data.loginInfo.userId;
        var activityId=this.data.activityId;
        return {
            title:this.data.loginInfo.nickName+'邀请你参与拼团活动',
            imageUrl:this.data.activityInfo.bannerImgUrls[0],
            query:`query=${query}&activityId=${activityId}&shareUserId=${userId}`
        }
    },

    initData(options){
        var query=decodeURIComponent(options.query);
        var activityId=options.activityId || '';
        var shareUserId=options.shareUserId;
        query=JSON.parse(query);
        var groupInfo=query.groupInfo || {};
        this.getUserOpenGroup(groupInfo);//获取团信息的最新情况

        this.setData({activityId,shareUserId},()=>{
            this.getDetailInfo();
            this.getStoreInfo();
        });
    },

    getCodeParams(id){//扫码进入该页面
        let data = {id} 
        app.sjrequest('/marchant/queryIdentifica',data).then(res=>{
            if(res.statusCode==200 && res.data.code == 200) {
                var data=res.data.data;
                var scene=JSON.parse(data.scene);
                this.initData(scene);
            }
        });
    },

    getStoreInfo(){//获取缓存信息
        var activityId=this.data.activityId;
        wx.getStorage({
            key:'zl_userInfo',
            success:res=>{
                var data=res.data || {};
                var info=data.data.data || {};
                var userId=info.userId;
                var loginInfo={
                    userId,
                    openId:info.setInfo.openId,
                    appId:info.setInfo.appId,
                    nickName:info.nickname,
                    marchantLogic:info.setInfo.headImage,
                    marchantName:info.setInfo.appName,
                    merchantId:info.setInfo.merchantId,
                    userPhone:info.phoneNumber,
                }
                var shareUrl=this.data.shareUrl+'?activityId='+activityId+'&shareUserId='+userId;
                this.codeInfo=data;
                this.setData({loginInfo,shareUrl});
            }
        });
    },

    jumpStrategy(){//跳转攻略
        wx.navigateTo({
            url:'/pages/group_booking/strategy/strategy'
        });
    },

    joinAddress(shipping){//拼接收货地址
        var {provincesName,cityName,areaName,address} = shipping;
        return provincesName+cityName+areaName+address;
    },

    getUserOpenGroup(groupInfo){//查询用户开团
        app.sjrequest1('/activityTTPTBusiness/groupListByActivityId',{
            "activityId":groupInfo.activityId,
            "merchantId":groupInfo.marchantId,
            "status":1,
            "pageSize":30,
            "currentPage":1,
            userId:groupInfo.userId
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data || {};
                var list=data.list || [];
                var newGroupInfo=list.find(item=>item.orderNo==groupInfo.orderNo);
                var endTime=this._parseDate(newGroupInfo.overTime,'number');
                var nowTime=new Date().getTime();
                var diffTime=endTime-nowTime;
                newGroupInfo.diffTimes=diffTime;
                
                this.setData({groupInfo:newGroupInfo});
            }
        })
    },

    jumpAddressList(){//跳转收货地址列表
        app.store.setState({from:'submitOrder'});
        wx.navigateTo({
            url:'/pages/Address/AddressList/AddressList',
            events:{
                addressChange:(data)=>{
                    var shipping=data.shipping;
                    var fullAddress=this.joinAddress(shipping);
                    shipping.fullAddress=fullAddress;
                    this.setData({userShipping:shipping});
                }
            }
        });
    },

    finishFun(){//倒计时完成

    },

    changeFun(e){//倒计时改变
        var detail=e.detail;
        var groupInfo=this.data.groupInfo;

        for(var key in detail){
            var value=detail[key];
            detail[key]=value<10?('0'+value):value;
        }
        groupInfo.downTimeObj=detail;

        this.setData({groupInfo});
    },

    _parseDate(str,resType) { //resType 取值 'object' | 'number'
        var a = str.split(/[^0-9]+/);
        var date = new Date(a[0], a[1] - 1, a[2], a[3] || 0, a[4] || 0, a[5] || 0);
        return resType == 'number' ? date.getTime() : date;
    },

    getDetailInfo(){//获取详情信息
        app.sjrequest1('/activityBusiness/activityDetail',{
            "activityId":this.data.activityId,
        }).then(res=>{
            wx.stopPullDownRefresh();
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data;
                var currentSku=data.activityCommoditySkuList.find(item=>item.isDefault==1);
                currentSku || (currentSku=data.activityCommoditySkuList[0]);
                data.price=currentSku.price;
                data.lowPrice=currentSku.livePrice;
                data.soldCount=data.commodityTotalCount-data.residueCommodityTotalCount;

                var userShipping=data.userShipping || {};
                var {provincesName,cityName,areaName,address} = userShipping;
                userShipping.fullAddress=provincesName+cityName+areaName+address;

                this.setData({
                    skuInfo:currentSku,
                    userShipping,
                    activityInfo:data,
                    goodsSkuId:currentSku.skuId,
                });
            }
        })
    },

    getMerchantInfo(){//获取商家信息
        wx.getStorage({
            key:'zl_userInfo',
            success:res=>{
                var data=res.data || {};
                if(data.statusCode==200 && data.data.code==200){
                    var info=data.data.data || {};
                    var selInfo=info.setInfo || {};
                    this.setData({
                        appId:selInfo.appId
                    });
                }
            }
        });
    },

    settlement(){//结算
        if(this.activation){ return }
        this.activation=true;
        setTimeout(()=>{this.activation=null},1500);

        var {
            userShipping,skuInfo,buyCount,
            shareUserId,appId,commodityId,
        } = this.data;
        var {activityId,orderNo} = this.data.groupInfo;
        var {limitBuyCount,commodityId,marchantId}=this.data.activityInfo;

        var residueCount=skuInfo.residueCommoditySkuCount;
        if(buyCount > residueCount && residueCount!==-1){
            return wx.showToast({title:'您购买的数量超出了库存',icon:'none'});
        }

        if(buyCount > limitBuyCount && limitBuyCount!==-1){
            return wx.showToast({title:'你还剩'+limitBuyCount+'次限购数量',icon:'none'});
        }

        if(!userShipping.id){return wx.showToast({title:'你还未添加收货地址',icon:'none'});}

        var reqData={
            userHippingId:userShipping.id,
            skuId:skuInfo.skuId,
            amount:buyCount, commodityId,
            appId,merchantId:marchantId,
            shareUserId,activityId,
            groupOrderNo:orderNo,
        }
        reqData.isOpenGroup=this.data.buyType==2;

        wx.showLoading({title:'生成订单',mask:true});
        app.sjrequest1('/activityOrderBusiness/wxPay',reqData).then(res=>{
            wx.hideLoading();
            if(res.statusCode==200 && res.data.code==0){
                var data=res.data.data;
                var orderNumber=data.orderNo;
                wx.requestPayment({
                    ...data,
                    success:res=>{
                        const eventChannel = this.getOpenerEventChannel();
                        eventChannel.emit('uploadData');

                        var query={
                            orderNum:data.orderNo,
                            goodsName:this.data.goodsName,
                            skuName:this.data.skuInfo.skuName,
                            buyCount:this.data.buyCount
                        }
                        var queryStr=JSON.stringify(query);
                        queryStr='query='+encodeURIComponent(queryStr);
                        this.subscribeMsg(orderNumber,()=>{
                            wx.redirectTo({
                                url:'/pages/group_booking/pay-success/pay-success?'+queryStr
                            });
                        });
                    },
                    fail:err=>{
                        wx.navigateTo({
                            url:'/pages/group_booking/order-list/order-list?status=0'
                        });
                    }
                });
            }
        })
    },

    subscribeMsg(orderNum,callback){
        var appid=this.data.appId;
        if(appid){
            return app.sjrequest1("/subTemplate/listPriTemplateId",{
                "authorizerAppid":appid, sceneTypes:[1,3,7]
            }).then(res=>{
                if(res.statusCode==200 && res.data.code==200){
                    return res.data.data;
                }
            }).then(tempids=>{
                wx.requestSubscribeMessage({
                    tmplIds:tempids,
                    success:res=>{
                        if(res[tempids[0]]==='accept'){
                            app.sjrequest1('/subscription/add',[
                                {
                                    "marchantid": this.data.merchantId,
                                    "appid": this.data.appid,
                                    "templateid": tempids[0],
                                    "targetid": orderNum,
                                    "targettype": 6,
                                    "status": 1
                                },
                                {
                                    "marchantid": this.data.merchantId,
                                    "appid": this.data.appid,
                                    "templateid": tempids[1],
                                    "targetid": this.data.activityId,
                                    "targettype": 2,
                                    "status": 1
                                },
                                {
                                    "marchantid": this.data.merchantId,
                                    "appid": this.data.appid,
                                    "templateid": tempids[2],
                                    "targetid": this.data.activityId,
                                    "targettype": 2,
                                    "status": 1
                                }
                            ]).then(res=>{
                                if(res.statusCode==200 && res.data.code==0){
                                    wx.showToast({title:'订阅成功',icon:'none'});
                                }
                            });
                        }
                    },
                    complete:res=>{
                        callback();
                    }
                });
            })
        }
    },

    getPhoneNumber(e){
        var detail=e.detail;
        var {appId,openId} = this.data.loginInfo;
        if(detail.iv){
            var {iv,encryptedData}=detail;
            app.sjrequest('/thirdWxLogin/deciphering',{
                appid:appId,openid:openId,iv,encryptedData
            }).then(res=>{
                if(res.statusCode==200 && res.data.code==200){
                    var codeInfo=this.codeInfo;
                    var phone=res.data.data.phoneNumber;
                    var loginInfo=this.data.loginInfo;
                    loginInfo.userPhone=phone;
                    this.setData({loginInfo});
                    if(codeInfo && codeInfo.data && codeInfo.data.data){
                        var resData=codeInfo.data.data;
                        resData.phoneNumber=phone;
                        wx.setStorage({key:'zl_userInfo',data:resData});
                    }
                }
            })
        }
    },

})