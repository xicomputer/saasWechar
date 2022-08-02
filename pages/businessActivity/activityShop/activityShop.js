let app=getApp();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        appid:'',//小程序appid
        merchantId:'',//商家id

        pageSize:10,
        pageNum:1,
        stopReq:false,

        dataList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var activityId=options.activityId;
        var merchantId=options.merchantId;
        var classId=options.classId;
        activityId && (this.activityId=activityId);
        classId && (this.classId=classId);
        if(!merchantId){
            let merchantId = wx.getStorageSync('merchantId');
            this.setData({merchantId:merchantId});
        }

        if(options.classname){
            wx.setNavigationBarTitle({
              title: options.classname,
            });
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        var merchantId = wx.getStorageSync('merchantId');
        if(merchantId){
            this.merchantId=merchantId;
            this.setData({merchantId:merchantId});
        }
        
        wx.getStorage({//获取小程序appid
            key:'appid',
            success:res=>{
                this.setData({appid:res.data});
            }
        });
        
        this.getAllActivity();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if(this.merchantId){
            this.getAllActivity();
        }
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
        this.refreshList();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        var {pageNum,stopReq} =this.data;
        if(!stopReq){
            pageNum++;
            this.setData({pageNum},()=>{
                this.getAllActivity();
            });
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        var query=`activityId=${this.activityId}&merchantId=${this.merchantId}`;
        return {
            path:'/pages/businessActivity/activityShop/activityShop?'+query
        }
    },

    /* 分享朋友圈 */
    onShareTimeline(){
        return {
            query:`activityId=${this.activityId}&merchantId=${this.merchantId}`
        }
    },

    toDetail(e){
        var activityId=e.currentTarget.dataset.atyid;
        wx.navigateTo({
            url:'/pages/businessActivity/activity_detail/activity_detail?activityid='+activityId
        });
    },

    jumpJoinDetail(e){//跳转参与详情
        var item=e.currentTarget.dataset.item;
        var orderState=item.orderState;
        var orderNum=item.orderNo;
        wx.navigateTo({
            url:'/pages/businessActivity/order_list/order_list?orderState='+orderState+'&orderNo='+orderNum
        });
    },

    _parseDate(str,resType) { //resType 取值 'object' | 'number'
        var a = str.split(/[^0-9]+/);
        var date = new Date(a[0], a[1] - 1, a[2], a[3] || 0, a[4] || 0, a[5] || 0);
        return resType == 'number' ? date.getTime() : date;
    },

    scrollActivityItem(){
        if(this.activityId){
            setTimeout(()=>{
                wx.pageScrollTo({
                    selector:'.activity-'+this.activityId,
                    complete:res=>{this.activityId=null;}
                });
            },500);
        }
    },

    //查询活动列表
    getAllActivity(){
        app.sjrequest1('/activityBusiness/pageList',{
            pageSize:this.data.pageSize, 
            currentPage:this.data.pageNum,
            merchantId:this.merchantId,
            // state:2,
            commodityClassifyId:this.classId,
            templateTag:'TJFL',
        }).then(res=>{
            wx.stopPullDownRefresh();
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data || {};
                var list=data.list || [];
                var dataList=this.data.dataList;

                this.data.stopReq=list.length!==this.data.pageSize;
                list.forEach(item=>{
                    var nowDate=new Date().getTime();
                    if(item.state==1){
                        var startDate=this._parseDate(item.startTime,'number');
                        item.diffTimes=startDate-nowDate;
                    }else{
                        var endDate=this._parseDate(item.endTime,'number');
                        item.isEnd=endDate-nowDate<=0;
                        item.diffTimes=endDate-nowDate;
                    }
        
                    item.times={days:0,hours:0,minutes:0,seconds:0};

                    var skuList=item.activityCommoditySkuList || [];
                    var skuItem=skuList[0] || {};
                    item.imageUrl=item.bannerImgUrls[0];
                    item.lowPrice=skuItem.livePrice;
                    item.price=skuItem.price;
                });

                if(this.data.pageNum==1){
                    dataList=list;
                }else{
                    dataList.push(...list);
                }

                this.setData({dataList},()=>{
                    this.scrollActivityItem();
                });
            }
        })
    },

    refreshList(){
        this.setData({stopReq:false,pageNum:1},()=>{
            this.getAllActivity();
        });
    },

    activityEnd(e){
        var activityId=e.currentTarget.dataset.atyid;
        var list=this.data.dataList;
        var tempIndex=list.findIndex(item=>item.activityId==activityId);
        var tempObj=list[tempIndex];
        tempObj.isEnd=true;
        list.splice(tempIndex,1);

        this.setData({dataList:list});
    },

    timeChange(e){
        var index=e.currentTarget.dataset.index;
        var detail=e.detail;
        for(var key in detail){
            var value=detail[key];
            detail[key]=value<10?('0'+value):value;
        }

        var list=this.data.dataList;
        if(list[index]){ 
            list[index].times=detail;
        }
       
        this.setData({dataList:list});
    },

    finishFun(e){//倒计时结束
        var index=e.currentTarget.dataset.index;
        var list=this.data.dataList;
        var item = list[index];
        if(item && item.state==1){ 
            var nowDate=new Date().getTime();
            var endDate=this._parseDate(item.endTime,'number');
            item.diffTimes=endDate-nowDate;
            item.state=2;
            this.setData({dataList:list});
        }
    },

    getSubscribeTempId(sceneType){//获取订阅消息模板id
        var appid=this.data.appid;
        if(appid){
            return app.sjrequest1("/subTemplate/listPriTemplateId",{
                "authorizerAppid":appid, sceneType
            }).then(res=>{
                if(res.statusCode==200 && res.data.code==200){
                    return res.data.data;
                }
            })
        }
    },

    newActivitySubscribe(){//订阅新活动提醒
        this.getSubscribeTempId('7').then(tempids=>{
            console.log('模板id:',tempids);
            wx.requestSubscribeMessage({
                tmplIds:tempids,
                success:res=>{
                    if(res[tempids[0]]==='accept'){
                        app.sjrequest1('/subscription/add',[
                            {
                                "marchantid": this.data.merchantId,
                                "appid": this.data.appid,
                                "templateid": tempids[0],
                                "targetid": '',
                                "targettype": 2,
                                "status": 1
                            }
                        ]).then(res=>{
                            if(res.statusCode==200 && res.data.code==0){
                                wx.showToast({title:'订阅成功',icon:'none'});
                            }
                        });
                    }
                }
            });
        });
    },

    activityStrartSubscribe(e){//订阅活动开始提醒
        var atyid=e.currentTarget.dataset.atyid;
        this.getSubscribeTempId('8').then(tempids=>{
            wx.requestSubscribeMessage({
                tmplIds:tempids,
                success:res=>{
                    if(res[tempids[0]]==='accept'){
                        app.sjrequest1('/subscription/add',[
                            {
                                "marchantid": this.data.merchantId,
                                "appid": this.data.appid,
                                "templateid": tempids[0],
                                "targetid": atyid,
                                "targettype": 2,
                                "status": 1
                            }
                        ]).then(res=>{
                            if(res.statusCode==200 && res.data.code==0){
                                wx.showToast({title:'订阅成功',icon:'none'});
                            }
                        });
                    }
                }
            });
        });
    },

})