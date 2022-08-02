let app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showShare:false,//显示分享弹窗状态
        showSelSpecification:false,//选择规格弹窗显示状态
        currentBanner:0,//当前banner

        isCountDesabled:false,//禁止改变数量状态
        buyCount:1,//购买数量
        skuList:[],//规格列表
        currentSku:{},//当前选中规格
        goodsSkuId:'',//选择的商品规格id
        isEnd:false,//活动结束状态
        activityInfo:{//活动信息
            detailImgUrls:[]
        },

        downTimes:0,
        downTimeObj:{days:'',hours:'',minutes:'',seconds:''},

        showPoster:false,//海报弹展示状态
        showPurchasing:false,//限购弹窗状态


        imgs:[
            {src:'',width:508,height:508,x:20,y:90},
            {src:'',width:190,height:190,x:338,y:618}
        ],
        rectInfo:[22,756,146,52,26,'#FFBB38'],
        texts:[
            {content:'商家名称商家名称',color:'#616161',size:28,x:274,y:30,center:true},
            {content:'秒杀价:',color:'#1577FF',size:37,x:24,y:676},
            {content:'1759',color:'#1577FF',size:50,x:146,y:668},
            {content:'原价:2500',color:'#fff',size:26,x:95,y:764,isDelLine:true,center:true},
            {content:'立即扫码参与秒杀',color:'#616161',size:18,x:362,y:816},
        ],
        testimgUrl:'',//生成的海报地址

        loginInfo:{},//登录时返回的信息
        shareUrl:'/pages/seckill/detail/detail',//分享地址

        mountAuthGetInfo:false,//挂载授权组件状态
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
        this.synthetic=this.selectComponent('.synthetic');
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
        return {
            title:this.data.loginInfo.nickName+'邀请你参与秒杀活动',
            path:this.data.shareUrl,
            imageUrl:this.data.activityInfo.bannerImgUrls[0]
        }
    },

    /* 分享朋友圈 */ 
    onShareTimeline(){
        return {
            title:this.data.loginInfo.nickName+'邀请你参与秒杀活动',
            imageUrl:this.data.activityInfo.bannerImgUrls[0]
        }
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

    initData(options){
        var activityId=options.activityId;
        var shareUserId=options.shareUserId;
        activityId && (this.activityId=activityId);
        shareUserId && (this.shareUserId=shareUserId);

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
                this.getCodeImg();//获取小程序码图
            }
        });

        this.getDetailInfo();//获取详情数据
    },

    getCodeImg(){
        var appid=this.data.loginInfo.appId;
        var shareUrl=this.data.shareUrl;
        app.sjrequest1('/activityBusiness/createQr',{
            page:shareUrl,
            appId:appid
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                var imgs=this.data.imgs;
                var data=res.data.data;
                imgs[1].src=data;
                this.setData({imgs});
            }
        })
    },

    swiperChange(e){//banner图改变时
        var current=e.detail.current;
        this.setData({currentBanner:current});

        var videoUrl= this.data.activityInfo.videoUrl;
        if(videoUrl){
            var videoContext = wx.createVideoContext('swiperVideo');
            if(current==0){
                // videoContext.play();
            }else{
                videoContext.pause();
            }
        }
    },
    jumpMS(){
              wx.navigateTo({
                  url: '/pages/seckill/order-classify/order-classify',
              });
          },
    jumpConfirmOrder(){//跳转确认订单
        var {buyCount,currentSku,activityInfo} = this.data;
        var limitBuyCount=activityInfo.limitBuyCount;
        var skuCount=currentSku.residueCommoditySkuCount;
        if(buyCount > limitBuyCount && limitBuyCount!==-1){
            return wx.showToast({title:'你还剩'+limitBuyCount+'次限购数量',icon:'none'});
        }

        if(buyCount>skuCount && skuCount!==-1){
            return wx.showToast({title:'您购买的数量超出了库存数',icon:'none'});
        }

        var query={
            buyCount, skuInfo:currentSku,
            goodsName:activityInfo.commodityName,
            userShipping:activityInfo.userShipping || {},
            shareUserId:this.shareUserId || '',
            activityId:this.activityId,
            commodityId:activityInfo.commodityId,
            limitBuyCount,
            orderType:activityInfo.orderTemplate
        }
        var queryStr=JSON.stringify(query);
        queryStr='query='+encodeURIComponent(queryStr);
        this.setData({showSelSpecification:false});
        wx.navigateTo({
            url:'/pages/seckill/confirm-order/confirm-order?'+queryStr,
            events:{
                uploadData:()=>{
                    this.getDetailInfo();
                }
            }
        });
    },

    jumpShop(){
        wx.navigateTo({
            url: '/pages/shopHome/home/home',
        });
    },

    jumpChat(){
        var {marchantLogic,marchantName,merchantId} = this.data.loginInfo;
        wx.navigateTo({
            url: `/pages/order/contact/contact?logoPic=${marchantLogic}&marchantId=${merchantId}&marchantName=${marchantName}`,
        });
    },

    viewAll(){//查看全部发起平团用户
        this.setData({showAllUser:true});
    },

    openShare(){//打开分享
        this.setData({showShare:true});
    },
    closePopup(e){//关闭弹窗
        var attrname=e.currentTarget.dataset.attrname;
        this.setData({[attrname]:false});
    },

    finishFun(){//倒计时完成
        
        

    },

    changeFun(e){//倒计时改变
        var detail=e.detail;
        for(var key in detail){
            var value=detail[key];
            detail[key]=value<10?('0'+value):value;
        }
        this.setData({downTimeObj:detail});
    },

    _parseDate(str,resType) { //resType 取值 'object' | 'number'
        var a = str.split(/[^0-9]+/);
        var date = new Date(a[0], a[1] - 1, a[2], a[3] || 0, a[4] || 0, a[5] || 0);
        return resType == 'number' ? date.getTime() : date;
    },

    getDetailInfo(){//获取详情信息
        app.sjrequest1('/activityBusiness/activityDetail',{
            "activityId":this.activityId,
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                var nowTime=new Date().getTime();
                var data=res.data.data;
                if(data.state==1){//活动未开始
                    var startTime=this._parseDate(data.startTime,'number');
                    var diffTime=startTime-nowTime;
                }else{
                    var endTime=this._parseDate(data.endTime,'number');
                    var diffTime=endTime-nowTime;
                    var isEnd=diffTime<=0;
                    if(isEnd){this.activityEnd();}
                }
                
                var currentSku=data.activityCommoditySkuList.find(item=>item.isDefault==1);
                currentSku || (currentSku=data.activityCommoditySkuList[0]);
                data.price=currentSku.price;
                data.lowPrice=currentSku.livePrice;
                data.orderTypeArr=data.orderTemplate.split(',');

                this.setData({
                    currentSku,
                    activityInfo:data, currentSku,
                    skuList:data.activityCommoditySkuList,
                    goodsSkuId:currentSku.skuId,
                    downTimes:diffTime,
                    // isCountDesabled:data.residueBuyCount==1,
                });
                this.fillCanvasData(data);//填充绘制海报时所需数据
            }
        })
    },

    hideEndPopup(){//隐藏活动结束弹出层
        this.setData({isEnd:false});
    },

    activityEnd(){//显示活动结束弹出并返回首页
        var activityInfo=this.data.activityInfo;
        if(activityInfo.state==1){//活动未开始时的倒计时结束
            var nowTime=new Date().getTime();
            var endTime=this._parseDate(activityInfo.endTime,'number');
            var diffTime=endTime-nowTime;
            activityInfo.state=2;
            this.setData({downTimes:diffTime,activityInfo});
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

    fillCanvasData(data){
        var imgs=this.data.imgs;
        var texts=this.data.texts;
        var skuItem1=data.activityCommoditySkuList[0];
        imgs[0].src=data.bannerImgUrls[0];//skuItem1.imageUrl;//商品图
        texts[0].content=this.data.loginInfo.marchantName;//商家名称
        texts[2].content=skuItem1.livePrice;//秒杀价
        texts[3].content='原价:'+skuItem1.price;//原价
        
        this.setData({imgs,texts});
    },

    selGoodsSku(e){//选择规格
        var skuitem=e.currentTarget.dataset.skuitem;
        var skuId=skuitem.skuId;
        this.setData({
            goodsSkuId:skuId,
            currentSku:skuitem
        });
    },

    handleFlootBtn(){
        var activityInfo=this.data.activityInfo;
        var residueBuyCount=this.data.activityInfo.residueBuyCount;
        if(residueBuyCount==0){//当前用户购买次数用完
            this.setData({showPurchasing:true});
        }else{
            if(activityInfo.state==1){
                wx.showToast({title:'活动还未开始',icon:'none'});
            }else{
                this.setData({showSelSpecification:true});
            }
        }
    },

    minusCount(){
        if(this.data.isCountDesabled){
            this.setData({isCountDesabled:false});
        }
    },

    countChange(e){//购买数量改变
        var buyCount=e.detail.value;
        var currentSku=this.data.currentSku;
        if(buyCount>currentSku.residueCommoditySkuCount){
            this.setData({isCountDesabled:true});
            return wx.showToast({title:'购买数量超出库存数量',icon:'none'});
        }
        this.setData({ buyCount, });
    },

    createPosters(){//创建海报
        this.setData({showShare:false,showPoster:true});
        var testimgUrl=this.data.testimgUrl;
        if(!testimgUrl){
            this.synthetic.startSyntheticImg();
        }
    },

    closePosterPopup(){//关闭海报展示弹窗
        this.setData({showPoster:false});
    },

    getCompleteImg(event){//获取生成的海报地址
        var {url}=event.detail;
        this.setData({ testimgUrl:url});
    },

    savePoster(){//保存海报
        this.synthetic.saveImg();
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