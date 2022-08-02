// pages/special_goods/goods_detail/goods_detail.js

let app=getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        marchantId:'',
        commodityId:'',
        goodsInfo:{},
        skuList:[],//规格列表
        nowSku:{},//选中规格
        marchantInfo:{},//商家信息

        isCountDesabled:false,
        buyCount:1,//购买数量
        showBuyPopup:false,
        orderTemplate:'',//订单模板 1.物流 2.同城 3.预订

        showSale:false,
        saleCanList:[],//优惠券列表
        saleState:'无优惠',
        receivedSale: true, //是否领取了优惠券
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title:this.data.goodsInfo.commodityName
        }
    },

    /* 朋友圈分享 */ 
    onShareTimeline(){
        return {
            title:this.data.goodsInfo.commodityName
        }
    },

    initData(options){
        this.setData({
            marchantId:options.marchantId || '',
            commodityId:options.commodityId || '',
            orderTemplate:options.orderTemplate || '',
        },()=>{
            this.getGoodsInfo();
            this.querySkuList();
            this.getShopInfo();//获取商家信息
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

    jumpPage(e){
        var type=e.currentTarget.dataset.type;
        if(type==1){//客服
            var marchantId=this.data.marchantId;
            var {nickName,headImg} = this.data.marchantInfo;
            wx.navigateTo({
                url: `/pages/order/contact/contact?logoPic=${headImg}&marchantId=${marchantId}&marchantName=${nickName}`,
            });
        }else{//店铺
            wx.navigateTo({
                url: '/pages/shopHome/home/home',
            });
        }
    },

    openSale(){//打开优惠卷列表
        if(this.data.saleCanList.length){
            this.setData({ showSale:true });
        }else{
            wx.showToast({title:'无优惠劵',icon:'none'});
        }
    },

    closeSale(){//关闭优惠卷列表
        this.setData({ showSale:false });
    },

    getGoodsInfo(){//获取商品详情
        app.sjrequest('/commodity/queryCommodityInfo',{
            commodityId:this.data.commodityId
        }).then(res=>{
            console.log('商品详情：',res);
            if(res.statusCode==200 && res.data.code==200){
                var goodsInfo=res.data.data || {};
                var saleCanList=goodsInfo.commodityCouponsList;
                var saleState='无优惠',receivedSale=true;
                if(saleCanList.length) {
                    saleState='已领券';
                    saleCanList.forEach(item=>{
                        if(item.isDraw == 0){
                            saleState='可领券';
                            receivedSale=false;
                        }
                    })
                }
                this.setData({
                    goodsInfo,saleCanList,saleState,receivedSale
                });
            }
        })
    },

    querySkuList(){//查询规格列表
        var {marchantId,commodityId} = this.data;
        app.sjrequest('/commodity/queryCommoSku',{
            marchantId,commodityId
        }).then(res=>{
            if(res.statusCode==200 && res.data.code==200){
                var list=res.data.data || [];
                var nowSku=list[0] || {};
                this.setData({skuList:list,nowSku});
            }
        })
    },

    replaceSku(e){//切换规格
        var item=e.currentTarget.dataset.item;
        this.setData({nowSku:item});
    },

    countChange(e){//购买数量改变
        var buyCount=e.detail.value;
        var currentSku=this.data.nowSku;
        if(buyCount>currentSku.stock){
            this.setData({isCountDesabled:true});
            return wx.showToast({title:'购买数量超出库存数量',icon:'none'});
        }
        this.setData({ buyCount });
    },
    minusCount(){
        if(this.data.isCountDesabled){
            this.setData({isCountDesabled:false});
        }
    },

    openBuyPopup(e){//打开购买弹窗
        var marchantInfo=this.data.marchantInfo;
        if(marchantInfo.merchantId){
            this.setData({showBuyPopup:true});
        }else{
            wx.showToast({title:'还未登录',icon:'none'});
        }
    },
    closeBuyPopup(){//关闭购买弹窗
        this.setData({showBuyPopup:false});
    },


    /**立即购买 */
    buyNow() {
        var nowSku=this.data.nowSku;
        var marchantId=this.data.marchantId;
        var buyCount=this.data.buyCount;
        var orderTemplate=this.data.orderTemplate;
        if(buyCount>nowSku.stock){
            wx.showToast({
                title: '库存不足',icon: 'none',duration: 2000
            }); return;
        }

        let data = {
            marchantId, orderType:3,
            commoditys: [{
                commodityId: nowSku.commodityId,
                tempSpecId: nowSku.id,
                amount: buyCount
            }],
        }
        wx.showLoading({ title: '加载中...'});

        var token = wx.getStorageSync('token')
        app.sjrequest1('/order/onekeyAboutOrder', data, token ).then(res => {
            if (res.data.code === 200) {
                wx.hideLoading();
                app.store.setState({// 更新 store 数据
                    submitObj: JSON.stringify(res.data.data)
                });
                var url=`/pages/order/submitOrder/submitOrder?`;
                url+=`orderType=${orderTemplate}`;
                wx.navigateTo({url});
            }else{
                wx.hideLoading()
                wx.showToast({title: res.data.msg,icon: 'none'})
            }
        })
    },

    getShopInfo(){
        let ids = this.data.marchantId
        app.sjrequest('/marchant/subjectInfo',{
            merchantId:ids
        }).then(res=>{
            if(res.statusCode==200 && res.data.code==200){
                var data=res.data.data;
                var marchantInfo=data.appletInfo;
                this.setData({marchantInfo});
            }
        })
    },

    //跳转商家信息展示页
    jumpMarchantInfo(){
        wx.navigateTo({
            url:'/pages/Index/BusinessInfo/BusinessInfo'
        });
    },
    
    receiveSale(){
        var saleCanList=this.data.saleCanList;
        if(this.data.receivedSale){
          wx.showToast({ title: '已领取优惠券',icon: none}); return;
        }
        var data = {couponsIds:[]}
        saleCanList.forEach(item=>{
          data.couponsIds.push(item.id);
        });
        data.couponsIds = data.couponsIds.toString()
        var token = wx.getStorageSync('token')
        app.sjrequest('/coupons/getCoupons',data,token).then(res=>{
          if (res.data.code == 200 ) {
            saleCanList.forEach(item=>{ item.isDraw = 1 });
            this.setData({
              showSale:false,
              saleState:'已领券',
              receivedSale:true,
              saleCanList:saleCanList
            });
            wx.showToast({title: '领取成功',icon:'none'});
          }
        })
    },
    receivedSaleFun(){
        wx.showToast({title: '已经领取过了', icon: 'none'})
        this.setData({showSale:false});
    },


    swiperChange(e){
        var current=e.detail.current;
        var videoUrl= this.data.goodsInfo.videoUrl;
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