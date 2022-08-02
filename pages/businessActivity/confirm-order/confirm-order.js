let app=getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        message:'',//留言
        totalAmount:0,
        buyCount:1,
        goodsName:'',
        activityId:'',//活动id
        commodityId:'',//商品id
        shareUserId:'',//分享用户id
        skuInfo:{},//规格信息
        userShipping:{},//地址信息
        fullAddress:'',//完整收货地址
        appid:'',
        merchantId:'',
        merchantAddress:'',//商家地址
        orderType:'',//商家支持的配送方式
        arriveTime:'',//预订时间

        orderTemplate:'',//订单模板 1.物流 2.同城 3.预订
        showDateTime:false,
        radioList:[],//配送方式列表
        minDate: new Date().getTime(),
        currentDate: new Date().getTime(),
        showBookTime:'',
        isLocal:false,//与商家是否在同一个城市
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var query=options.query || '';
        query=decodeURIComponent(query);
        query=JSON.parse(query);
        this.joinRadioList(query.orderType);
        var livePrice=query.skuInfo.livePrice;
        var buyCount=query.buyCount;
        var totalAmount=this.computedTotalAmount(livePrice,buyCount);
        var fullAddress=this.joinAddress(query.userShipping);
        this.setData({...query,totalAmount,fullAddress});
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.getStorage({
            key:'merchantId',
            success:res=>{
                this.setData({merchantId:res.data},()=>{
                    this.getMerchantInfo();
                });
            }
        });
        wx.getStorage({
            key:'appid',
            success:res=>{this.setData({appid:res.data});}
        })
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

    },

    jumpAddressList(){//跳转收货地址列表
        app.store.setState({from:'submitOrder'});
        wx.navigateTo({
            url:'/pages/Address/AddressList/AddressList',
            events:{
                addressChange:(data)=>{
                    var shipping=data.shipping;
                    var fullAddress=this.joinAddress(shipping);
                    this.setData({userShipping:shipping,fullAddress},()=>{
                        this.checkLocal();//校验同城地址
                    });
                }
            }
        });
    },

    checkLocal(){//校验同城地址
        var userShipping=this.data.userShipping;
        var merchantAddress=this.data.merchantAddress;
        var {provincesName,cityName,areaName} = userShipping;
        var res1=merchantAddress.includes(provincesName);
        var res2=merchantAddress.includes(cityName);
        var isLocal=res1 && res2;
        this.setData({isLocal});
    },

    joinRadioList(orderTemplate){//组合配送方式列表
        orderTemplate=orderTemplate || '';
        var list=[{name:'物流发货',value:1},{name:'同城配送',value:2},{name:'预定自取',value:3}];
        var radioList=[];
        list.forEach(item=>{
            var bool=orderTemplate.includes(item.value);
            if(bool){radioList.push(item);}
        });
        this.setData({radioList});
    },

    radioChange(e){
        var value=e.detail.value;
        this.setData({orderTemplate:value});
    },

    openSelDateTime(){
        var minDate=new Date().getTime();
        this.setData({ showDateTime:true ,minDate});
    },

    confirmDateTime(e){//确定选择日期时间
        var detail=e.detail;
        var date=new Date(detail);
        var year=date.getFullYear();
        var month=date.getMonth()+1;
        month<10 && (month='0'+month);
        var dayNum=date.getDate();
        dayNum<10 && (dayNum='0'+dayNum);
        var hour=date.getHours();
        hour<10 && (hour='0'+hour);
        var minute=date.getMinutes();
        minute<10 && (minute='0'+minute);
        var showBookTime=`${year}年${month}月${dayNum}日${hour}时${minute}分`;
        var arriveTime=`${year}-${month}-${dayNum} ${hour}:${minute}:00`;
        this.setData({currentDate:detail,showBookTime,showDateTime:false,arriveTime});
    },

    cancelSelDateTime(){
        this.setData({ showDateTime:false });
    },

    getMerchantInfo(){
        var data={'id':this.data.merchantId}
        app.sjrequest('/marchant/queryMarchantInfo',data).then(res=>{
            if(res.statusCode==200 && res.data.code==200){
                var data=res.data.data;
                var merchantAddress=data.entirelyAddress;
                this.setData({merchantAddress},()=>{
                    this.checkLocal();//校验同城地址
                });
            }
        })
    },

    settlement(){//结算
        if(this.activation){ return }
        this.activation=true;
        setTimeout(()=>{this.activation=null},1500);

        var {
            userShipping,skuInfo,buyCount,merchantId,arriveTime,
            message,activityId,shareUserId,appid,commodityId,
            orderTemplate,isLocal
        } = this.data;

        if(!orderTemplate){return wx.showToast({title:'请选择配送方式',icon:'none'});}

        var reqData={  
            commodityId,//商品id,
            appId:appid,//appid
            merchantId:merchantId,//商家id
            activityId,//活动id
            amount:buyCount,//购买数量
            message,//用户留言
            skuId:skuInfo.skuId,//商品规格id
            orderType:orderTemplate,//配送方式
        }
        shareUserId && (reqData.shareUserId=shareUserId);//分享者id
        
        if(orderTemplate!=3 && !userShipping.id){//除了预订 其他配送方式需要校验地址
            return wx.showToast({title:'你还未添加收货地址',icon:'none'});
        }else{ reqData.userHippingId=userShipping.id }

        if(orderTemplate==3){//预订需要添加预订时间
            if(arriveTime){
                reqData.arriveTime=arriveTime;
            }else{
                return wx.showToast({title:'请选择预订时间',icon:'none'});
            }
        }

        if(orderTemplate==2 && !isLocal){
            return wx.showToast({title:'您的收货地址不在同城范围内',icon:'none'});
        }

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
                       
                        wx.setStorage({
                            key:'orderTemplate_key',
                            data:orderTemplate,
                            success:()=>{
                            }
                        });
                        this.subscribeMsg(orderNumber,()=>{
                            wx.navigateBack();
                        });
                    }
                });
            }
        })
    },

    subscribeMsg(orderNum,callback){
        var appid=this.data.appid;
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

    countChange(e){//购买数量改变
        var buyCount=e.detail.value;
        var totalAmount=this.data.totalAmount;
        var livePrice=this.data.skuInfo.livePrice;
        totalAmount=buyCount*livePrice;
        totalAmount=totalAmount.toFixed(2);
        totalAmount=Number(totalAmount);
        this.setData({buyCount,totalAmount});
    },

    computedTotalAmount(price,count){//计算总金额
        var totalNum=price*count;
        totalNum=totalNum.toFixed(2);
        return Number(totalNum);
    },

    joinAddress(shipping){//拼接收货地址
        var {provincesName,cityName,areaName,address} = shipping;
        return provincesName+cityName+areaName+address;
    },

    messageChange(e){//输入留言
        var value=e.detail.value;
        this.setData({message:value});
    },
})