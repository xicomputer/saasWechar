let app=getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentIndex:0,
        currentState:1,
        tabList:[
            {name:'待发货',state:1},{name:'待收货',state:2},{name:'已完成',state:4}
        ],
        
        dataList1:{pageNum:1,stopReq:false,list:[]},
        dataList2:{pageNum:1,stopReq:false,list:[]},
        dataList4:{pageNum:1,stopReq:false,list:[]},
        currentList:[],

        juinUserInfo:{},//参与用户信息
        showOrderItme:'',//展示的订单样式类
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var marchantId=wx.getStorageSync('merchantId');
        this.marchantId=marchantId;
        var orderState=options.orderState || 1;
        var orderNo=options.orderNo;
        var currentIndex=0;
        switch(Number(orderState)){
            case 1: currentIndex=0;break;
            case 2: currentIndex=1;break;
            case 4: currentIndex=2;break;
        }

        this.setData({ 
            currentState:orderState, currentIndex ,
            showOrderItme:orderNo ? ('.order-'+orderNo) : '',
        },()=>{
            this.getDataList(orderState);
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
        this.refreshList();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        var state=this.data.currentState;
        var cDataList=this.data['dataList'+state];
        if(!cDataList.stopReq){
            cDataList.pageNum++
            this.setData({['dataList'+state]:cDataList},()=>{
                this.getDataList(state);
            });
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    onChange(e){
        var index=e.detail.index;
        var state=this.data.tabList[index].state;
        var currentList=this.data['dataList'+state].list;
        this.setData({
            currentList, 
            currentState:state,
            currentIndex:index,
        },()=>{
           this.getDataList(state);
        });
    },

    getDataList(state=1){//订单列表
        var cDataList=this.data['dataList'+state];
        app.sjrequest1('/activityOrderBusiness/activityOrderPageList',{
            pageSize:10,
            currentPage:cDataList.pageNum,
            orderState:this.data.currentState,
            templateTag:'TJFL',
            isQueryRefundOrder:false,
            orderType:'1'
        }).then(res=>{
            wx.stopPullDownRefresh();
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data || {};
                var list=data.list || [];
                cDataList.stopReq=list.length!==10;
                list.forEach(item=>{
                    if(item.shippingAddress){
                        item.shippingAddress=JSON.parse(item.shippingAddress);
                    }
                });
                
                if(cDataList.pageNum==1){
                    cDataList.list=list;
                }else{
                    cDataList.list.push(...list);
                }

                this.setData({
                    ['dataList'+state]:cDataList,
                    currentList:cDataList.list,
                },()=>{
                    this.scrollOrderItem();
                });
            }
        })
    },

    scrollOrderItem(){
        var showOrderItme=this.data.showOrderItme;
        if(showOrderItme){
            setTimeout(()=>{
                wx.pageScrollTo({ 
                    selector:showOrderItme,
                    complete:res=>{this.setData({showOrderItme:''});}
                });
            },0);
        }
    },

    getParams(){//查商品信息
        app.sjrequest('/commodity/queryCommodityInfo',{
            storeId:this.marchantId,
            commodityId:this.data.detailInfo.commodityId
        }).then(res=>{
            if(res.statusCode==200 && res.data.code==200){
                var data=res.data.data;
                this.setData({ detailData:data },()=>{
                    this.getLabelList();
                });
            }
        })
    },

    toChat(e){
        wx.getStorage({
            key:'res',
            success:res=>{
                var data=res.data;
                if(data.statusCode==200 && data.data.code==200){
                    data=data.data.data;
                    var logoPic=data.setInfo.headImage;
                    var nickName=data.setInfo.appName;
                    wx.navigateTo({
                        url: `/pages/order/contact/contact?logoPic=${logoPic}&marchantId=${this.marchantId}&marchantName=${nickName}`,
                    });
                }
            }
        })
    },

    confirmGoods(e){//确认收货/order/updateCityOrder
        var item=e.currentTarget.dataset.item;
        var marchantId=wx.getStorageSync('merchantId');
        app.sjrequest1('/activityOrderBusiness/confirmOrder',{
            // uniqueId:item.orderNumber,
            // orderState: 4,
            // marchantId,
            // receivingType: 1,//0仅收货 1确认收货
            orderNumber:item.orderNumber
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                wx.showToast({title:'已收货'});
                this.refreshList();
            }
        })
    },

    refreshList(){
        var state=this.data.currentState;
        var cDataList=this.data['dataList'+state];
        cDataList.stopReq=false;
        cDataList.pageNum=1;
        this.setData({['dataList'+state]:cDataList},()=>{
            this.getDataList(state);
        });
    },
        

})