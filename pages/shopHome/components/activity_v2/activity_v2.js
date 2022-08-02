let app=getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        marchantId: {
            type: String,
            value: ''
        },
        tempId:{
            type:[String,Number],
            value:1
        },
        shopList: {
            type: Array,
            value: []
        },
        hotelList: {
            type: Array,
            value: []
        },
        activityInfo:{
            type:Object
        },
        activityList:{
            type: Array,
        },
        codeInfo:{
          type: Array,
        },
        saleGoodsList:{
            type: Array,
        },
        exchangeGoodsList:{
            type: Array,
        },
        jifenNum:{
            type:[String,Number],
        },
        saleCanList:{
            type: Array,
        },
        auctionList:{
            type: Array,
        },
        appName:{
            type:String,
        },
        activityInfo:{
            type:Object
        },
        auctionNum:{
            type:[String,Number],
        },
        commentList2s:{
            type: Array,
        },
        signData:{
            type:Object
        }
    },

    /* 组件生命周期 */
    lifetimes:{
        attached:function(){
            // this.recommendedActivity();
            this.getWillActivity();
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        showSale: false,
        receivedSale: false, //是否领取了优惠券
        saleState: '无优惠', //优惠状态
        saleCanList:[],
        timeData:{},
        JifentimeData:{},

        /*  推三反一数据  */
        recommendAty:null,
        recommendTimes:{},
        willList:[],//进行中的活动
        /*-------end--------*/ 
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onChange(e){
            const {index} = e.currentTarget.dataset
            this.data.saleGoodsList[index].timeData = e.detail
            this.setData({
                saleGoodsList: this.data.saleGoodsList
            });
        },
        changeTime(e){
          const {index} = e.currentTarget.dataset
          this.data.auctionList[index].timeData = e.detail
          this.setData({
            auctionList: this.data.auctionList
          });
        },
        changeJfTime(e){
            this.data.JifentimeData = e.detail
            this.setData({
                JifentimeData: this.data.JifentimeData
            });
        },
        saveImg(e){
            let img = e.currentTarget.dataset.src
            console.log(img,"34")
            wx.downloadFile({
            url: img,
            success(e){
                wx.saveImageToPhotosAlbum({
                filePath: e.tempFilePath,
                success(){
                    wx.showToast({
                    title: '保存成功',
                    icon:"none"
                    })
                }
                })
            },
            fail(e){
                console.log(e)
            }
            })
        },
        
        aciveUrl(e){
            let url = e.currentTarget.dataset.url
            let marchantId = this.properties.marchantId
            wx.navigateTo({
                url: url+"?marchantId="+marchantId,
            })
        },

        goimg(e){
            let src = e.currentTarget.dataset.src
            wx.previewImage({
              urls:[src]
            })
        },
         // 优惠弹框
        showSale(){
            if(this.properties.saleCanList.length){
            this.setData({
                showSale:true
            })
            }else{
            wx.showToast({
                title: '暂无优惠',
                icon: 'none'
            })
            }
        },
        closeSale(){
        this.setData({
            showSale:false
        })
        },
        receiveSale(){
        if(this.data.receivedSale){
            wx.showToast({
            title: '已领取优惠券',
            icon: none
            })
            return
        }
        var data = {couponsIds:[]}
        this.properties.saleCanList.forEach(item=>{
            data.couponsIds.push(item.id)
        })
        data.couponsIds = data.couponsIds.toString()
        var token = wx.getStorageSync('token')
        app.sjrequest('/coupons/getCoupons',data,token).then(res=>{
            if (res.data.code == 200 ) {
            this.properties.saleCanList.forEach(item=>{
                item.isDraw = 1
            })
            this.triggerEvent('reCoupons')
            this.setData({
                showSale:false,
                saleState:'已领券',
                receivedSale:true,
                saleCanList:this.data.saleCanList
            })
            wx.showToast({
                title: '领取成功',
                icon:'none'
            })
            }
        })
        },
        receivedSale(){
        wx.showToast({
            title: '已经领取过了',
            icon: 'none'
        })
        this.setData({showSale:false})
        },
        aciveUrl(e){
            let url = e.currentTarget.dataset.url
            let marchantId = this.data.marchantId
            wx.navigateTo({
                url: url+"?marchantId="+marchantId,
            })
        },

        _parseDate(str,resType) { //resType 取值 'object' | 'number'
            var a = str.split(/[^0-9]+/);
            var date = new Date(a[0], a[1] - 1, a[2], a[3] || 0, a[4] || 0, a[5] || 0);
            return resType == 'number' ? date.getTime() : date;
        },

        // 推三反一活动
        recommendedActivity(){
            app.sjrequest1('/activityBusiness/selectOne',{
                merchantId:this.properties.marchantId
            }).then(res=>{
                if(res.statusCode==200 && res.data.code===0 && res.data.data){
                    var data=res.data.data;
                    var endTime=this._parseDate(data.endTime,'number');
                    var nowTime=new Date().getTime();
                    var diffTimes=endTime-nowTime;
                    data.diffTimes=diffTimes;
                    var joinUser=data.activityFinanceResponses;
                    data.joinUser=joinUser?joinUser[0]:[];
                    this.setData({recommendAty:data});
                }
            })
        },

        //查询活动列表
        getWillActivity(){
            app.sjrequest1('/activityBusiness/pageList',{
                "pageSize": 10,
                "currentPage": 1,
                "merchantId": this.properties.marchantId,
                // "state": 2
            }).then(res=>{
                if(res.statusCode==200 && res.data.code===0 && res.data.data){
                    var list=res.data.data.list;
                    list.forEach(item=>{
                        var endTime=this._parseDate(item.endTime,'number');
                        var nowTime=new Date().getTime();
                        var diffTimes=endTime-nowTime;
                        item.diffTimes=diffTimes;
                        item.times={days:0,hours:0,minutes:0,seconds:0}
                    });
                    
                    this.setData({willList:[...list]})
                }
            })
        },

        recommendTimeChange(e){
            var times=e.detail;
            var index=e.currentTarget.dataset.index;
            var willList=this.data.willList;
            times.hours<10 && (times.hours='0'+times.hours);
            times.minutes<10 && (times.minutes='0'+times.minutes);
            times.seconds<10 && (times.seconds='0'+times.seconds);
            willList[index].times=times;
            this.setData({willList:willList});
        },
        
        
        showDingyue(){
            var that = this
            let appid = wx.getStorageSync('appid')
            let data = {
                authorizerAppid:appid,
                sceneType:7
            }
            app.mb2request('/subTemplate/listPriTemplateId',data).then(res=>{
                let tempData = res.data.data
                wx.requestSubscribeMessage({
                    tmplIds: tempData,
                    success: function (res) {
                        wx.getSetting({
                            withSubscriptions: true,
                            success: result => {
                                wx.showToast({ title: '订阅消息成功' })
                                let data = {
                                    status: 1,
                                    marchantId: that.data.marchantId,
                                    templateIds: tempData,
                                    appId:appid,
                                    targetType:2
                                }
                                app.sjrequest('/basic/addsubscription', data).then(res => {
                                    if (res.data.code == 200) {
                                    } else {
                                        wx.showToast({ title: res.data.msg, icon: 'none'})
                                    }
                                })
                            }
                        })
                    },
                    fail(e) {
                        wx.showToast({
                            title: '订阅消息失败,请点击右上角三个点中的设置打开消息订阅开关',
                            icon: 'none'
                        })
                    }
                })
            })
        }
    },

    
})
