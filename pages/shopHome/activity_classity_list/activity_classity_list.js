// pages/shopHome/activity_classity_list/activity_classity_list.js

let app=getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        nowClassId:'',
        classNavList:[],

        type:'',// JSMS 秒杀  TTPT 拼团

        dataList:[],
        listDatas:{},

        pageSize:10,

        classId:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var type=options.type;
        var classId=options.classid;
        if(classId){
            this.setData({nowClassId:classId,classId})
        }

        wx.setNavigationBarTitle({
            title:type=="TTPT"?'拼团活动':'秒杀活动'
        });

        this.setData({type},()=>{
            var merchantId=wx.getStorageSync('merchantId');
            this.merchantId=merchantId;
            this.getClassityList();
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

    switchClass(e){//切换分类
        var classId=e.currentTarget.dataset.classid;
        this.setData({nowClassId:classId},()=>{
            this.getActivityGoodsList();
        });
    },

    getClassityList(){//获取分类列表
        app.sjrequest1('/activityCommodityBusiness/commodityClassifyPageList',{
            "pageSize": 20,
            "currentPage": 1,
            "merchantId": this.merchantId,
            "templateTag": this.data.type
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data || {};
                var list=data.list || [];
                list=list.filter(item=>{return item.activityList!==null});
                var nowClassId=this.data.nowClassId;
                if(!nowClassId){
                    nowClassId=list[0]?list[0].id:'';
                }
                
                var listDatas={};
                list.forEach(item=>{
                    var keyName='list'+item.id;
                    listDatas[keyName]={stopReq:false,pageNum:1,list:[]}
                });

                this.setData({
                    classNavList:list,
                    nowClassId,listDatas
                },()=>{
                    this.getActivityGoodsList();
                });
            }
        })
    },

    _parseDate(str,resType) { //resType 取值 'object' | 'number'
        var a = str.split(/[^0-9]+/);
        var date = new Date(a[0], a[1] - 1, a[2], a[3] || 0, a[4] || 0, a[5] || 0);
        return resType == 'number' ? date.getTime() : date;
    },

    getActivityGoodsList(){//获取活动商品列表
        var nowClassId=this.data.nowClassId;
        if(!nowClassId){return;}
        var listDatas=this.data.listDatas;
        var listObj=listDatas['list'+nowClassId];

        app.sjrequest1('/activityBusiness/pageList',{
            "pageSize": this.data.pageSize,
            "currentPage": listObj.pageNum,
            "merchantId": this.merchantId,
            // "state": 2,
            "templateTag":this.data.type,
            "commodityClassifyId": nowClassId,
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data || {};
                var list=data.list || [];
                listObj.stopReq=list.length!=this.data.pageSize;
                list.forEach(item=>{
                    var nowTime=new Date().getTime();
                    if(item.state==1){//活动未开始
                        var startTime=this._parseDate(item.startTime,'number');
                        item.diffTimes=startTime-nowTime;
                    }else{
                        var endTime=this._parseDate(item.endTime,'number');
                        item.diffTimes=endTime-nowTime;
                    }
                    
                    item.times={days:0,hours:0,minutes:0,seconds:0}

                    item.activityCommoditySkuList=item.activityCommoditySkuList || [];
                    var skuItem=item.activityCommoditySkuList[0] || {};
                    item.imageUrl=item.bannerImgUrls[0];
                    item.price=skuItem.price;
                    item.lowPrice=skuItem.livePrice;

                    var percentNum=item.residueCommodityTotalCount/item.commodityTotalCount;
                    percentNum*=100;
                    item.percentNum=Number(percentNum.toFixed(2));

                    var saveAmount=item.price-item.lowPrice;
                    item.saveAmount=parseInt(saveAmount);
                });

                if(listObj.pageNum==1){
                    listObj.list=list;
                }else{
                    listObj.list.push(...list);
                }
                
                this.setData({listDatas,dataList:listObj.list});
            }
        })
    },

    changeTime(e){
        var detail=e.detail;
        var index=e.currentTarget.dataset.index;
        var dataList=this.data.dataList;
        for(var key in detail){
            var value=detail[key];
            detail[key]=value<10?('0'+value):value;
        }
        dataList[index].times=detail;
        this.setData({dataList});
    },

    finishFun(e){//到计时结束
        var index=e.currentTarget.dataset.index;
        var dataList=this.data.dataList;
        var item=dataList[index];
        if(item && item.state==1){
            var nowTime=new Date().getTime();
            var endTime=this._parseDate(item.endTime,'number');
            item.diffTimes=endTime-nowTime;
            item.state=2;
            this.setData({dataList});
        }
    },

    jumpDetail(e){
        var type=this.data.type;
        var activityId=e.currentTarget.dataset.activityid;
        var url='';
        if(type=='JSMS'){
            url='/pages/seckill/detail/detail?activityId='+activityId;
        }else if(type=='TTPT'){
            url='/pages/group_booking/detail/detail?activityId='+activityId;
        }
        wx.navigateTo({url});
    }
})