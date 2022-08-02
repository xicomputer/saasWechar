let app=getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        appid:'',
        merchantId:'',
        activityId:'',//活动id
        activityTimes:{},//倒计时数据
        btnDisabled:false,
        detailData:{},//商品信息
        labelList:[],//保障详情数据
        showXS:false,//保障详情显示状态
        isEnd:false,
        rebatedUserList:[],
        detailInfo:{},
        hasPushed:[],//已推信息
        userList:[],//参与用户列表
        addressFill:'',//组合的完整地址
        showAddressPopup:false,//显示填写收货地址提示弹窗状态
        userShipping:{},//地址信息
        securityLabel:['放心购','材质保障','限时折扣','假一罚十'],
        supportToShop:['购买','到店','完成'],
        logistics:['购买','接单发货','收货完成'],
        shareUrl:'/pages/businessActivity/activity_detail/activity_detail',
        nickName:'',//用户昵称

        joinUserList1:[],
        joinUserList2:[],
        joinUserList:[],

        userInfo:{},//code接口返回的用户信息
        userPhone:'',//用户手机号

        marchantLogic:'',//商家log
        marchantName:'',//商家名称

        orderPageUrl:'',//查看订单调整的对应订单页面地址
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
        });
        app.globalEvent.$on('loginReject',()=>{
            this.initData(options);
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
        var activityId = this.activityId;
        this.getActivityDetail(activityId);
        this.participationUserList(activityId);
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
        var title='';
        if(this.data.nickName){
            title=`${this.data.nickName} 邀请您参与${this.data.detailInfo.templateName}活动，一起免费赚商品！`
        }else{
            title=this.data.detailInfo.title
        }
        return {
            title:title,
            path:this.data.shareUrl,
            imageUrl:this.data.detailInfo.coverImage,
        }
    },

    /* 分享朋友圈 */
    onShareTimeline(){
        var title='';
        if(this.data.nickName){
            title=`${this.data.nickName} 邀请您参与${this.data.detailInfo.templateName}活动，一起免费赚商品！`
        }else{
            title=this.data.detailInfo.title
        }
        return {
            title:title,
        }
    },

    initData(options){
        var activityId=options.activityid;
        this.activityId=activityId;
        this.setData({activityId:activityId});
        this.getActivityDetail(activityId);
        this.participationUserList(activityId);

        wx.getStorage({
            key:'zl_userInfo',
            success:res=>{
                var data=res.data;
                if(data.statusCode==200 && data.data.code==200){
                    var info=data.data.data;
                    var userId=info.userId;
                    var shareUrl=this.data.shareUrl+'?activityid='+activityId+'&shareUserId='+userId;
                    var nickName=info.nickname;
                    var marchantLogic=info.setInfo.headImage;
                    var marchantName=info.setInfo.appName;
                    this.setData({
                        shareUrl,nickName,marchantLogic,marchantName,
                        appid:info.setInfo.appId,
                        merchantId:info.setInfo.merchantId,
                        userInfo:info,
                        userPhone:info.phoneNumber,
                    });
                }
            }
        });
        
        if(options.shareUserId){
            this.shareUserId=options.shareUserId;
            this.addRecord(activityId);
        }
        this.appid=wx.getStorageSync('appid');
    },

    getCodeParams(id){
        let data = {id : id} 
        return app.sjrequest('/marchant/queryIdentifica',data).then(res=>{
            if(res.statusCode==200 && res.data.code == 200) {
                var data=res.data.data;
                var scene=JSON.parse(data.scene);
                this.initData(scene);
            }
        });
    },

    handleBuy(){
        wx.navigateTo({
            url:'/pages/businessActivity/order_list/order_list'
        });
    },

    jumpShop(){
        wx.navigateTo({
            url: '/pages/shopHome/home/home',
        });
    },

    jumpChat(){
        var {marchantLogic,marchantName} = this.data;
        wx.navigateTo({
            url: `/pages/order/contact/contact?logoPic=${marchantLogic}&marchantId=${this.marchantId}&marchantName=${marchantName}`,
        });
    },

    jumpPoster(){
        var query=encodeURIComponent(this.data.shareUrl);
        wx.navigateTo({
            url:'/pages/businessActivity/posters/posters?shareUrl='+query
        });
    },

    // 跳转收货地址
    selectAddress() {
        app.globalData.comefrom ='goodsDetail'
        wx.navigateTo({
            url: '/pages/Address/AddressList/AddressList',
            complete:(res)=>{this.hideAddressPopup();}
        })
    },

    //跳转参与用户列表
    jumpJoinUserList(){
        var query='?activityId='+this.data.activityId;
        wx.navigateTo({
            url:'/pages/businessActivity/joinuser_list/joinuser_list'+query
        });
    },

    hideLabel(){ //关闭打开保障详情
        this.setData({showXS:!this.data.showXS}) 
    },

    hideAddressPopup(){
        this.setData({showAddressPopup:false});
    },

    getParams(){//查商品信息/commodity/queryCommodityInfo
        app.sjrequest1('/activityCommodityBusiness/queryCommodityInfo',{
            activityId:this.activityId,
            commodityId:this.data.detailInfo.commodityId,
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data;
                this.setData({ detailData:data },()=>{
                    // this.getLabelList();
                });
            }
        })
    },

    getJoinUser(){//查询参与活动用户
        app.sjrequest1('/activityTJFLBusiness/pullJoinList',{
            "pageSize": 8,
            "currentPage": 1,
            "activityId": this.activityId
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0 && res.data.data){
                var list=res.data.data;
                if(list.length){
                    this.setData({joinUserList:[...list]},()=>{
                        this.startTime();
                    });
                }else{
                    setTimeout(()=>{this.getJoinUser()},10000)
                }
            }
        })
    },

    startTime(){//开始跑定时器展现参与用户
        var joinUserList=this.data.joinUserList;
        var i=0, len=joinUserList.length;
        var joinUserList1=this.data.joinUserList1;
        var joinUserList2=this.data.joinUserList2;
        var inter=setInterval(()=>{
            var item=joinUserList.shift();
            i++;
            if(i%2==0){
                joinUserList2.shift();
                joinUserList2.push(item);
            }else{
                joinUserList1.shift();
                joinUserList1.push(item);
            }
            if(i==len){
                clearInterval(inter);inter=null;
                this.getJoinUser();
            }
            this.setData({joinUserList1,joinUserList2});
        },6000)
    },

    //获取标签列表
    getLabelList(){
        let data = {labelIntros:this.data.detailData.arrLabels}
        app.sjrequest('/commodity/queryLabelIntro',data).then(res=>{
            this.setData({labelList:res.data.data})
        });
    },

    findFreightStr(){
        this.getActivityDetail();
    },

    _parseDate(str,resType) { //resType 取值 'object' | 'number'
        var a = str.split(/[^0-9]+/);
        var date = new Date(a[0], a[1] - 1, a[2], a[3] || 0, a[4] || 0, a[5] || 0);
        return resType == 'number' ? date.getTime() : date;
    },

    viewOrder(e){//查看任务详情
        var item=e.currentTarget.dataset.item || {};
        var orderState=item.orderState || '';
        var orderNum=item.orderNo || '';
        var orderPageUrl=this.data.orderPageUrl;
        wx.navigateTo({
            url:orderPageUrl+'?orderState='+orderState+'&orderNo='+orderNum
        });
    },

    getJumpOrderUrl(orderTemplate){
        var orderType=Number(orderTemplate || 1);
        var url='/pages/businessActivity/';
        switch(orderType){
            case 1: url+='order_list/order_list';break;
            case 2: rul+='local-list/local-list';break;
            case 3: url+='booking-list/booking-list';break;
        }
        this.setData({orderPageUrl:url});
    },

    hideEndPopup(){//隐藏活动结束弹出层
        this.setData({isEnd:false});
    },

    //活动详情
    getActivityDetail(){
        app.sjrequest1('/activityBusiness/activityDetail',{
            activityId:this.activityId
        }).then(res=>{
            wx.stopPullDownRefresh();
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data;
                var nowDate=new Date().getTime();
                if(data.state==1){//未开始
                    var startDate=this._parseDate(data.startTime,'number');
                    data.diffTimes=startDate-nowDate;
                }else{
                    var endDate=this._parseDate(data.endTime,'number');
                    data.diffTimes=endDate-nowDate;
                    var isEnd=data.diffTimes<=0;
                    if(isEnd){this.activityEnd();}
                }

                this.marchantId=data.marchantId;

                var userShipping=data.userShipping || {};
                var addressKeyName=['provincesName','cityName','areaName','address'];
                var addressFill='';
                addressKeyName.forEach(item=>{//组合完整地址
                    if(userShipping[item]){addressFill+=userShipping[item];}
                });

                var skuItem1=data.activityCommoditySkuList[0] || {};
                data.livePrice=skuItem1.livePrice;
                data.imageUrl=skuItem1.imageUrl;
                
                data.preferences=JSON.parse(data.preferences);

                //计算已参与用户跳转对应订单列表地址 物流 同城 预订
                var joinState=data.currentJoinStatus;//用户参与状态
                if(joinState==1){
                    var orderTemplate=wx.getStorageSync('orderTemplate_key');
                    this.getJumpOrderUrl(orderTemplate);
                }else{
                    wx.setStorage({key:'orderTemplate_key',data:''});
                }

                data.orderTypeArr=data.orderTemplate.split(',');

                this.setData({
                    detailInfo:data,  addressFill, userShipping,
                    hasPushed:data.activityFinanceResponses || [],
                },()=>{ this.getParams() });
            }
        })
    },

    timeChange(e){
        var times=e.detail;
        times.days<10 && (times.days='0'+times.days);
        times.hours<10 && (times.hours='0'+times.hours);
        times.minutes<10 && (times.minutes='0'+times.minutes);
        times.seconds<10 && (times.seconds='0'+times.seconds);
        this.setData({activityTimes:times});
    },

    addRecord(activityId){//增加分享记录
        app.sjrequest1('/activityBusiness/addShareRecord',{
            activityId,
            shareUserId:this.shareUserId
        }).then(res=>{
            console.log('新增记录',res);
        })
    },

    participationUserList(activityId){//活动参与用户列表
        app.sjrequest1('/activityTJFLBusiness/financePageList',{
            pageSize:20,
            currentPage:1,
            activityId,
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data;
                data && this.setData({userList:data.list});
            }
        })
    },

    buyNow(){//立即购买
        if(this.data.btnDisabled){return;}
        this.setData({btnDisabled:true});
        setTimeout(()=>{this.setData({btnDisabled:false});},1500);

        var detailInfo=this.data.detailInfo;
        var {
            commodityId,marchantId,activityId,joinNumberResidue,
            residueCommodityTotalCount,state
        } = detailInfo;

        if(state==1){return wx.showToast({title:'活动还未开始',icon:'none'});}

        if(joinNumberResidue===0 || residueCommodityTotalCount==0){
            if(residueCommodityTotalCount==0){return wx.showToast({title:'商品已售息',icon:'none'})};
            if(joinNumberResidue===0){return wx.showToast({title:'参与次数已使用完',icon:'none'})};
        }else{
            wx.showLoading({title:'正在下单',mask:true});
            var data={
                commodityId,//商品id,
                appId:this.data.appid,//appid
                merchantId:marchantId,//商家id
                activityId,//活动id
                amount:1,//购买数量
                message:'',//用户留言
                skuId:'',//商品规格id
            }
            this.shareUserId && (data.shareUserId=this.shareUserId);//分享者id
            this.data.userShipping.id && (data.userHippingId=this.data.userShipping.id);//收货地址id

            app.sjrequest1('/activityOrderBusiness/wxPay',data).then(res=>{
                wx.hideLoading();
                if(res.statusCode==200 && res.data.code===0){
                    var data=res.data.data;
                    wx.requestPayment({
                        ...data,
                        success:res=>{
                            this.getActivityDetail();
                            if(!this.data.addressFill){
                                this.setData({showAddressPopup:true});return;
                            }

                            this.subscribeMsg(data.orderNo,()=>{
                                wx.navigateTo({
                                    url:'/pages/businessActivity/order_list/order_list'
                                });
                            });
                        },
                        fail:err=>{console.log('支付失败：',err);}
                    });
                }else{
                    wx.showToast({title:res.data.info || '请求异常',icon:'none'});
                }
            }).catch(err=>{ wx.hideLoading(); })
        }
    },

    jumpConfirmOrder(){//跳转确认订单
        var detailInfo=this.data.detailInfo;
        var {
            commodityId,marchantId,activityId,joinNumberResidue,
            residueCommodityTotalCount,state,orderTemplate
        } = detailInfo;

        if(state==1){return wx.showToast({title:'活动还未开始',icon:'none'});}

        if(joinNumberResidue===0 || residueCommodityTotalCount==0){
            if(residueCommodityTotalCount==0){
                return wx.showToast({title:'商品已售息',icon:'none'})
            };
            if(joinNumberResidue===0){
                return wx.showToast({title:'参与次数已使用完',icon:'none'})
            };
        }

        var query={
            buyCount:1, activityId, commodityId, marchantId,
            skuInfo:detailInfo.activityCommoditySkuList[0],
            goodsName:detailInfo.commodityName,
            userShipping:detailInfo.userShipping || {},
            shareUserId:this.shareUserId || '',
            orderType:orderTemplate
        }
        var queryStr=JSON.stringify(query);
        queryStr='query='+encodeURIComponent(queryStr);
        this.setData({showSelSpecification:false});
        wx.navigateTo({
            url:'/pages/businessActivity/confirm-order/confirm-order?'+queryStr,
            events:{
                uploadData:()=>{ this.getActivityDetail();}
            }
        });
    },

    activityEnd(){//显示活动结束弹出并返回首页
        var detailInfo = this.data.detailInfo;
        if(detailInfo.state==1){//未开始的倒计时结束
            var nowDate=new Date().getTime();
            var endDate=this._parseDate(detailInfo.endTime,'number');
            detailInfo.diffTimes=endDate-nowDate;
            detailInfo.state=2;
            this.setData({detailInfo});
        }else{
            this.setData({isEnd:true});
            var activityShop='pages/shopHome/home/home';
            var pages=getCurrentPages();
            var len=pages.length; var delta=-1;
            var isHas=false;
            for(var i=(len-1);i>=0;i--){
                var item=pages[i]; delta++;
                if(item.route==activityShop){isHas=true;break;}
            }
            setTimeout(()=>{
                if(isHas){
                    wx.navigateBack({delta});
                }else{
                    wx.redirectTo({url:'/'+activityShop});
                }
            },3000);
        }
    },

    subscribeMsg(orderNum,callback){
        var appid=this.data.appid;
        if(appid){
            return app.sjrequest1("/subTemplate/listPriTemplateId",{
                "authorizerAppid":appid, sceneTypes:[1,7,9]
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
                                    "targetid": this.activityId,
                                    "targettype": 2,
                                    "status": 1
                                },
                                {
                                    "marchantid": this.data.merchantId,
                                    "appid": this.data.appid,
                                    "templateid": tempids[2],
                                    "targetid": this.activityId,
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

    swiperChange(e){
        var current=e.detail.current;
        var videoUrl= this.data.detailInfo.videoUrl;
        if(videoUrl){
            var videoContext = wx.createVideoContext('swiperVideo');
            if(current==0){
                // videoContext.play();
            }else{
                videoContext.pause();
            }
        }
    }

})