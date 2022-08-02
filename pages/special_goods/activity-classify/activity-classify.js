// pages/special_goods/activity-classify/activity-classify.js

let app=getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        scrollHeight:0,
        menuBtnInfo:{},

        templateTag:'',//活动类型 TTPT TJFL JSMS
        merchantId:'',//商家id

        nowClassId:'',//当前分类id
        classNavList:[],//分类列表

        loginInfo:{},//登录返回的信息

        dataList:[],//
        listDatas:{},

        pageSize:10,

        classId:'',
        topImgUrl:'https://xinshusj-1301305452.cos.ap-guangzhou.myqcloud.com/static/',
        refresherStatus:false,//下拉刷新状态 true下拉刷新已触发 false下拉刷新未触发
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options, '拼团接收的参数')
        app.globalEvent.$on('loginComplete',()=>{
            this.initData(options);
        });
        app.globalEvent.$on('loginReject',()=>{
            this.initData(options);
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.computedScrollHeight();
        var menuBtnInfo=app.globalData.MenuButton;
        this.setData({menuBtnInfo});
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
    onShareAppMessage(){
        var activityTitle=this.getActivityTitle();
        return {
            title:this.data.loginInfo.nickName+'邀请你参与'+activityTitle+'活动',
        }
    },

    /* 分享朋友圈 */ 
    onShareTimeline(){
        var activityTitle=this.getActivityTitle();
        return {
            title:this.data.loginInfo.nickName+'邀请你参与'+activityTitle+'活动'
        }
    },

    getActivityTitle(){
        var templateTag=this.data.templateTag;
        var activityTitle='';
        switch(templateTag){
            case 'TJFL': activityTitle='邀三退一';break;
            case 'JSMS': activityTitle='秒杀';break;
            case 'TTPT': activityTitle='拼团';break;
        }
        return activityTitle;
    },

    initData(options){
        var merchantId = options.marchantId;
        this.merchantId=merchantId;

        var tagType=options.tagType;
        this.setData({templateTag:tagType},()=>{
            this.getClassityList();
            this.joinTopImgUrl();//拼接顶部图片地址方法
        });

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
                this.setData({loginInfo});
            }
        });
    },

    jumpDetail(e){
        var item=e.currentTarget.dataset.item;
        var type=item.templateTag;
        var activityId=item.activityId;
        var url='';
        if(type=='JSMS'){
            url='/pages/seckill/detail/detail?activityId='+activityId;
        }else if(type=='TTPT'){
            url='/pages/group_booking/detail/detail?activityId='+activityId;
        }else if(type=='TJFL'){
            url='/pages/businessActivity/activity_detail/activity_detail';
            url+=`?activityid=${activityId}`
        }
        wx.navigateTo({url});
    },

    joinTopImgUrl(){//拼接顶部图片地址
        var type=this.data.templateTag;
        var imgUrl=this.data.topImgUrl;
        switch(type){
            case 'JSMS': imgUrl+='jsms-top-img.png';break;
            case 'TTPT': imgUrl+='ttpt-top-img.png';break;
            case 'TJFL': imgUrl+='tjfl-top-img.png';break;
        }
        this.setData({topImgUrl:imgUrl});
    },

    computedScrollHeight(){//计算scroll-view高度
        wx.createSelectorQuery()
        .select('.list-scroll-box')
        .boundingClientRect(res=>{
            this.setData({scrollHeight:res.height});
        }).exec();
    },

    breakPage(){//返回页面
        var pagesList=getCurrentPages();
        if(pagesList.length>1){
            wx.navigateBack();
        }else{
            wx.navigateTo({
                url:'/pages/shopHome/home/home'
            });
        }
    },

    switchClass(e){//切换分类
        var classId=e.currentTarget.dataset.classid;
        this.setData({nowClassId:classId},()=>{
            this.getActivityGoodsList();
        });
    },

    getClassityList(){//获取分类列表
        console.log('分享页面也进来了这个函数')
        app.sjrequest1('/activityCommodityBusiness/commodityClassifyPageList',{
            "pageSize": 20,
            "currentPage": 1,
            "merchantId": this.merchantId,
            "templateTag": this.data.templateTag
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data || {};
                var list=data.list || [];
                list=list.filter(item=>item.activityList!==null);
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
            "templateTag":this.data.templateTag,
            "commodityClassifyId": nowClassId,
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data || {};
                var list=data.list || [];
                listObj.stopReq=list.length!=this.data.pageSize;
                list.forEach(item=>{

                    item.activityCommoditySkuList=item.activityCommoditySkuList || [];
                    var skuItem=item.activityCommoditySkuList[0] || {};
                    item.imageUrl=item.bannerImgUrls[0];
                    item.price=skuItem.price;
                    item.lowPrice=skuItem.livePrice;

                    var percentNum=item.residueCommodityTotalCount/item.commodityTotalCount;
                    percentNum*=100;
                    item.percentNum=Number(percentNum.toFixed(2));

                    //计算销售总数量
                    item.salesTotalCount=item.commodityTotalCount-item.residueCommodityTotalCount;

                    var saveAmount=item.price-item.lowPrice;
                    item.saveAmount=parseInt(saveAmount);
                });

                if(listObj.pageNum==1){
                    listObj.list=list;
                }else{
                    listObj.list.push(...list);
                }
                
                this.setData({listDatas,dataList:listObj.list},()=>{
                    console.log(this.data.dataList);
                });
            }
        })
    },

    refresherpulling(){//下拉刷新被下拉
        this.setData({refresherStatus:true},()=>{
            setTimeout(()=>{
                this.setData({refresherStatus:false});
            },1000);
        })
    },

    refresherrefresh(){//下拉刷新被触发
        var listDatas=this.data.listDatas;
        var nowClassId=this.data.nowClassId;
        var nowListObj=listDatas['list'+nowClassId] || {};
        nowListObj.pageNum=1;
        nowListObj.stopReq=false;
        this.setData({listDatas},()=>{
            this.getActivityGoodsList();
        });
    },

    scrolltolower(){//滚动到底部
        var listDatas=this.data.listDatas;
        var nowClassId=this.data.nowClassId;
        var nowListObj=listDatas['list'+nowClassId] || {};
        if(!nowListObj.stopReq){
            nowListObj.pageNum++;
            this.setData({listDatas},()=>{
                this.getActivityGoodsList();
            });
        }
    },
    
})