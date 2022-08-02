// pages/seckill/refund-order/refund-order.js

let app=getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentStatus:'all',
        topTabList:[
            {status:'all',name:'全部',count:0},{status:1,name:'申请中',count:0},{status:2,name:'已同意',count:0},
            {status:4,name:'退货中',count:0},{status:5,name:'已退款',count:0},{status:3,name:'已拒绝',count:0}
        ],

        showCourierPopup:false,//弹窗显示状态
        handleOrder:{},//操作订单项
        expressCompany:'',//快递公司
        expressNumber:'',//快递单号

        dataList:[],//列表数据
        storeData:{
            tabDataall:{stopReq:false,pageNum:1,list:[]},
            tabData1:{stopReq:false,pageNum:1,list:[]},
            tabData2:{stopReq:false,pageNum:1,list:[]},
            tabData3:{stopReq:false,pageNum:1,list:[]},
            tabData4:{stopReq:false,pageNum:1,list:[]},
            tabData5:{stopReq:false,pageNum:1,list:[]},
        },

        pageSize:10,
        
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
            this.getOrderList();
        }
    },

    closePopup(){//关闭弹窗
        this.setData({showCourierPopup:false});
    },

    openWhyList(){//打开取消订单原因列表选择弹窗
        this.setData({showCancelWhy:true});
    },

    cancelOrder(){//确认取消订单
        this.setData({showCancelWhy:false});
    },

    jumpLogistics(e){
        var orderItem=e.currentTarget.dataset.item;
        var refundInfo= orderItem.activityOrderRefundResponse;
        var {orderNumber,expressCompany,expressNumber} = refundInfo;
        if(expressCompany && expressNumber){
            var query=`wlNumber=${expressNumber}&wlCompany=${expressCompany}&orderNumber=${orderNumber}`;
            wx.navigateTo({
                url:'/pages/order/logistics/logistics?'+query
            });
        }
    },

    handleShowDetail(e){//显示/隐藏详情
        var index=e.currentTarget.dataset.index;
        var dataList=this.data.dataList;
        var orderItem=dataList[index];
        orderItem.showDetail=!orderItem.showDetail;
        this.setData({dataList});
    },

    refreshData(){
        var state=this.data.currentStatus;
        var storeData=this.data.storeData;
        var nowTabData=storeData['tabData'+state];
        nowTabData.pageNum=1;
        nowTabData.stopReq=false;
        this.getOrderList();
        this.getCount();
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

    _getStateText(state){
        var stateText='';
        switch(state){
            case 1: stateText='申请中';break;
            case 5: stateText='已退款';break;
            case 3: stateText='已拒绝';break;
            case 2: stateText='已同意';break;
            case 4: stateText='退货中';break;
        }
        return stateText;
    },

    getOrderList(){
        var {pageSize,merchantId,currentStatus,storeData} = this.data;
        var reqData={
            pageSize:pageSize,
            merchantId:merchantId,
            isQueryRefundOrder:true,
            templateTag:'TTPT'
        }
        var nowTabData={};
        nowTabData=storeData['tabData'+currentStatus];
        if(typeof currentStatus == 'string' && currentStatus.includes('_')){
            reqData.refundStatusList=currentStatus.split('_');
        }else{
            currentStatus!=='all' && (reqData.refundStatus=currentStatus);
        }

        reqData.currentPage=nowTabData.pageNum;//页码

        app.sjrequest1('/activityOrderBusiness/activityOrderPageList',reqData).then(res=>{
            wx.stopPullDownRefresh();
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data;
                var list=data ? data.list : [];
                nowTabData.stopReq=list.length!=pageSize;
                list.forEach(item=>{
                    item.showDetail=false;
                    item.orderStateText=this._getStateText(item.activityOrderRefundResponse.refundStatus);
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

    openSalesReturnPopup(e){
        var orderItem=e.currentTarget.dataset.item;
        var query=orderItem.activityOrderRefundResponse;
        query=JSON.stringify(query);
        query=encodeURIComponent(query);
        wx.navigateTo({
            url:'/pages/seckill/confirm-refund/confirm-refund?query='+query,
            events:{
                uploadData:()=>{
                    this.refreshData();
                }
            }
        });
    },

    confrimSalesReturn(e){//确认退货
        var {expressCompany,expressNumber} = this.data;
        if(!expressCompany){return wx.showToast({title:'请填入物流公司',icon:'none'});}
        if(!expressNumber){return wx.showToast({title:'请填入物流单号',icon:'none'});}

        this.setData({showCourierPopup:false});

        var orderItem=this.data.handleOrder;
        app.sjrequest1('/activityOrderBusiness/userConfirmRefund',{
            orderNumber:orderItem.orderNumber,
            expressCompany,//快递公司
            expressNumber,//快递单号
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                wx.showToast({title:'已确认',icon:'none'});
            }
        });
    },

    scanCode(){//扫码
        wx.scanCode({
            success:res=>{
                var result=res.result;
                this.setData({expressNumber:result});
            },
            fail:err=>{
                console.log('扫码失败：',err);
            }
        });
    },

    getCount(){//获取订单数量
        var topTabList=this.data.topTabList;
        app.sjrequest1('/activityOrderBusiness/orderCount',{
            merchantId:this.data.merchantId,
            isQueryRefundOrder:true,
            templateTag:'JSMS'
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data;
                topTabList.forEach(item=>{
                    var countItem=data.find(temp=>temp.refundStatus==item.status);
                    if(countItem){
                        if([1,2,4].includes(item.status)){item.count=countItem.total;}
                    }else{
                        item.count=0;
                    }
                });
                this.setData({topTabList});
            }
        })
    },

})