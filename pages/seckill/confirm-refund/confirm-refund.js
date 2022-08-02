var app=getApp();

// pages/seckill/confirm-refund/confirm-order.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        expressNum:'',
        expressName:'',
        refundOrderInfo:{},
        merchantAddress:{},//商家地址
        downTime:{},
        times:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var query=options.query;
        query=decodeURIComponent(query);
        query=JSON.parse(query);
        var merchantAddress=query.shippingAddressMerchant || '{}';
        merchantAddress=JSON.parse(merchantAddress);
        this.setData({refundOrderInfo:query, merchantAddress});

        this.computedTimes(query.updateTime);//技术倒技术毫秒数
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

    },

    _parseDate(str,resType) { //resType 取值 'object' | 'number'
        var a = str.split(/[^0-9]+/);
        var date = new Date(a[0], a[1] - 1, a[2], a[3] || 0, a[4] || 0, a[5] || 0);
        return resType == 'number' ? date.getTime() : date;
    },

    computedTimes(upTime){//计算倒计时毫秒数
        var totalTimes=2*86400000;
        var uptimes=this._parseDate(upTime,'number');
        var nowTimes=new Date().getTime();
        var times=totalTimes-(nowTimes-uptimes);
        this.setData({times});
    },

    copyAddress(){//复制文本
        var addressText= this.data.merchantAddress.contactAddress;
        wx.setClipboardData({
            data:addressText,
            success:res=>{wx.showToast({title:'复制成功',icon:'none'});},
            fail:err=>{console.log('复制操作失败：',err);}
        });
    },

    iptChange(e){//输入事件
        var keyName=e.currentTarget.dataset.keyname;
        var value=e.detail.value;
        this.setData({[keyName]:value});
    },

    scanCode(){//扫码
        wx.scanCode({
            success:res=>{
                var result=res.result;
                this.setData({expressNum:result});
            },
            fail:err=>{
                console.log('扫码失败：',err);
            }
        });
    },
    
    confrimSalesReturn(){//确认退货
        var {expressName,expressNum} = this.data;
        if(!expressName){return wx.showToast({title:'请填入物流公司',icon:'none'});}
        if(!expressNum){return wx.showToast({title:'请填入物流单号',icon:'none'});}

        var refundOrderInfo=this.data.refundOrderInfo;
        app.sjrequest1('/activityOrderBusiness/userConfirmRefund',{
            orderNumber:refundOrderInfo.orderNumber,
            expressCompany:expressName,//快递公司
            expressNumber:expressNum,//快递单号
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                wx.showToast({title:'操作成功',icon:'none'});
                var eventChange=this.getOpenerEventChannel();
                eventChange.emit('uploadData');
                wx.navigateBack();
            }
        });
    },

    finishFun(){},

    changeFun(e){
        var detail=e.detail;
        for(var key in detail){
            var value=detail[key];
            detail[key]=value<10?('0'+value):value;
        }
        this.setData({downTime:detail});
    },
})