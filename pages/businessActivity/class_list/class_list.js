let app=getApp();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        appid:'',//小程序appid
        merchantId:'',//商家id
        
        dataList:[],
        pageSize:10,
        pageNum:1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var activityId=options.activityId;
        var merchantId=options.merchantId;
        activityId && (this.activityId=activityId);
        if(merchantId){
            this.merchantId=merchantId;
            this.setData({merchantId:merchantId});
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
        
        this.getClassList();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if(this.merchantId){
            this.getClassList();
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
        this.getClassList();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        
    },

   /* 分享朋友 */ 
   onShareAppMessage(){},

   /* 分享朋友圈 */ 
   onShareTimeline(){},

    toDetail(e){
        var activityId=e.currentTarget.dataset.atyid;
        wx.navigateTo({
            url:'/pages/businessActivity/activity_detail/activity_detail?activityid='+activityId
        });
    },

    toMoreList(e){
        var classId=e.currentTarget.dataset.classid;
        var classname=e.currentTarget.dataset.classname;
        var qurey=`classId=${classId}&classname=${classname}`;

        wx.navigateTo({
            url:'/pages/businessActivity/activityShop/activityShop?'+qurey,
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

    getClassList(){//获取分类活动列表
        this.setData({dataList:[]},()=>{
            app.sjrequest1('/activityCommodityBusiness/commodityClassifyPageList',{
                "pageSize": 30,
                "currentPage": 1,
                "merchantId": this.merchantId,
                "templateTag": "TJFL"
            }).then(res=>{
                wx.stopPullDownRefresh();
                if(res.statusCode==200 && res.data.code==0 && res.data.data){
                    var classTypeList=res.data.data.list || [];
                    classTypeList.forEach(temp=>{
                        var activityList=temp.activityList || {};
                        var list=activityList.list || [];
                        list.forEach(item=>{
                            var nowDate=new Date().getTime();
                            if(item.state==1){//活动未开始
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
                            item.imageUrl=item.bannerImgUrls[0];//skuItem.imageUrl;
                            item.lowPrice=skuItem.livePrice;
                            item.price=skuItem.price;
                        });
                    });
                    this.setData({dataList:classTypeList});
                }
            });
        });
    },

    timeChange(e){
        var index=e.currentTarget.dataset.index;
        var tindex=e.currentTarget.dataset.tindex;
        var times=e.detail;
        for(var key in times){
            var value=times[key];
            times[key]=value<10?('0'+value):value;
        }

        var list=this.data.dataList;
        if(list[tindex].activityList.list[index]){ 
            list[tindex].activityList.list[index].times=times;
        }

        this.setData({dataList:list});
    },

    finishFun(e){//倒计时结束
        var index=e.currentTarget.dataset.index;
        var tindex=e.currentTarget.dataset.tindex;
        var list=this.data.dataList;
        var item=list[tindex].activityList.list[index];
        if(item && item.state==1){ 
            var nowDate=new Date().getTime();
            var endDate=this._parseDate(item.endTime,'number');
            item.diffTimes=endDate-nowDate;
            item.state=2;
            this.setData({dataList:list});
        }
    },

    

})