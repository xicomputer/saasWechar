// pages/shopHome/CityList/CityList.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        listType:"",//1.物流 2.同城 3.预订
        marchantId:"",
        recommends:[],
        pageCurr:1,
        pageSize:10,
        orderTemplate:"",
        orderSwitch:null,
        stopReq:false,//阻止请求状态
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let orderSwitch = wx.getStorageSync('orderSwitch')
        this.setData({listType:options.listType,marchantId:options.marchantId,orderSwitch:orderSwitch})
        if(options.listType == 3){
            this.setData({orderTemplate:"3"})
            wx.setNavigationBarTitle({
                title:"本店可(预订商品)"
            })
        }
        if(options.listType == 2){
            this.setData({orderTemplate:"2"})
            wx.setNavigationBarTitle({
                title:"本店可(同城配送商品)"
            })
        }
        if(options.listType == 1){
            this.setData({orderTemplate:"1"})
            wx.setNavigationBarTitle({
                title:"本店可(物流商品)"
            })
        }
        this.queryRecommendList()
    },

    queryRecommendList() {
        var data = {
          'marchantId': this.data.marchantId,
          pageSize: this.data.pageSize,
          pageCurr: this.data.pageCurr,
          orderTemplate:this.data.orderTemplate
        }
        app.sjrequest('/commodity/queryCommodityList', data).then(res => {
            wx.stopPullDownRefresh();
            if (res.data.code == 200) {
                var result = res.data.data;
                var stopReq=result.length!==this.data.pageSize;
                var recommends=this.data.recommends;
                if(this.data.pageCurr==1){
                    recommends=result;
                }else{
                    recommends.push(...result);
                }
                this.setData({ recommends,stopReq });
            }
        })
    },

    toDetails(e){
        var id = e.currentTarget.dataset.id;
        var listType=this.data.listType;
        let type='';
        listType==3 && (type="&reserve=1");
        listType==2 && (type="&city=1");
        wx.navigateTo({
            url: '/pages/Index/GoodsDetails/GoodsDetails?id=' +id+type
        })
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
        this.setData({pageCurr:1,stopReq:false},()=>{
            this.queryRecommendList()
        });
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if(!this.data.stopReq){
            var pageCurr=this.data.pageCurr;
            pageCurr++;
            this.setData({pageCurr},()=>{
                this.queryRecommendList()
            });
        }
    },

})