// pages/shopHome/column/column.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        classId:"",
        marchantId:"",
        recommends:[],
        pageNum: 1, // 当前页
        pageSize: 10, // 每页大小
        stopReq:false,//阻止请求分页数据状态
        mainOrderType:'',//主推业务 1物流 2同城 3预订
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.title){
            wx.setNavigationBarTitle({title: options.title})
        }

        this.setBtnTitle(options.mainOrderType);

        this.setData({
           classId:options.id,
           marchantId:options.marchantId,
           mainOrderType:options.mainOrderType || '',
        },()=>{
            if(this.data.classId){
                this.getClassShop()
            }else{
                this.queryRecommendList();
            }
        });
    },
    goshop(e){
        const {name, id} = e.currentTarget.dataset;
        var mainOrderType=this.data.mainOrderType;
        var url='/pages/Index/GoodsDetails/GoodsDetails?id=' + id
        if(mainOrderType==2 || mainOrderType==3){
            mainOrderType==2 && (url+=`&city=1`);//同城
            mainOrderType==3 && (url+=`&reserve=1`);//预订
        }
        wx.navigateTo({url});
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

    /* 分享朋友 */ 
    onShareAppMessage(){},

    /* 分享朋友圈 */ 
    onShareTimeline(){},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.openRefresh=true;
        this.setData({
            pageNum:1,stopReq:false
        },()=>{
            if(this.data.classId){
                this.getClassShop()
            }else{
                this.queryRecommendList();
            }
        });
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if(!this.data.stopReq){
            this.setData({
                pageNum: ++this.data.pageNum
            },()=>{
                if(this.data.classId){
                    this.getClassShop();
                }else{
                    this.queryRecommendList();
                }
            })
        }
    },

    setBtnTitle(mainOrderType){//设置按钮文本
        var btnTitle='';
        switch(Number(mainOrderType)){
            case 1: btnTitle='全国发货';break;
            case 2: btnTitle='同城配送';break;
            case 3: btnTitle='门店团购';break;
        }
        this.setData({btnTitle});
    },

    // 商家推荐商品
    queryRecommendList() {
        var data = {
          'marchantId': this.data.marchantId,
          pageSize: this.data.pageSize, pageCurr: this.data.pageNum
        }
        var mainOrderType=this.data.mainOrderType;
        if(mainOrderType){data.orderTemplate=mainOrderType}

        app.sjrequest('/commodity/queryCommodityList', data).then(res => {
          if (res.data.code == 200) {
            if(this.openRefresh){
                wx.stopPullDownRefresh();
                this.openRefresh=null;
            }
            var result = res.data.data || [];
            var recommends=this.data.recommends;
            var stopReq=result.length!==this.data.pageSize;
            if(this.data.pageNum==1){
                recommends=result
            }else{
                recommends.push(...result);
            }
            this.setData({ recommends,stopReq});
          }
        })
    },

    getClassShop(){
        let data={
            marchantId:this.data.marchantId,
            classifyId:this.data.classId,
            pageCurr: this.data.pageNum,
            pageSize: this.data.pageSize,
        }
        app.sjrequest('/commodity/queryCommodityList',data).then(res=>{
            if(this.openRefresh){
                wx.stopPullDownRefresh();
                this.openRefresh=null;
            }
            if(res.data.code == 200){
                let result = res.data.data;
                var recommends=this.data.recommends;
                var stopReq=result.length!==this.data.pageSize;
                if(this.data.pageNum==1){
                    recommends=result
                }else{
                    recommends.push(...result);
                }
                this.setData({ recommends,stopReq});
            }
          });
    },
    showDingYue(){
        var that = this
            let appid = wx.getStorageSync('appid')
            let data = {
                authorizerAppid:appid,
                sceneTypes:[5,6]
            }
            app.mb2request('/subTemplate/listPriTemplateId',data).then(res=>{
                let tempData = res.data.data
                wx.requestSubscribeMessage({
                    tmplIds: tempData,
                    success: function (res) {
                        wx.getSetting({
                            withSubscriptions: true,
                            success (res) {
                              let data3s = {
                                status: 1,
                                marchantId:  that.data.marchantId,
                                templateIds: tempData,
                                appId:appid
                              }
                              var isSettingFlag = false;
                              if(res.subscriptionsSetting.itemSettings){
                                for(let key in res.subscriptionsSetting.itemSettings){
                                  if(tempData.indexOf(key) > -1){
                                    isSettingFlag = true;
                                    break;
                                  }
                                }
                              }                                    
                              if(isSettingFlag){
                                data3s.status = 2
                              }                                    
                              app.sjrequest('/basic/addsubscription', data3s).then(res => {
                                wx.showToast({
                                    title: '订阅消息成功',
                                })
                              })
                            }
                          })
                    },
                    fail(e) {
                        console.log(e)
                        wx.showToast({
                            title: '订阅消息失败,请点击右上角三个点中的设置打开消息订阅开关',
                            icon: 'none'
                        })
                    }
                })
            })
    },
    /**
     * 用户点击右上角分享
     */
    getDingYue(){
        
    }
})