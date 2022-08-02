var app=getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        activityId:'',
        userList:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //var userList=decodeURIComponent(options.userlist);
        var activityId=options.activityId;
        this.setData({
            activityId:activityId,
            //userList:JSON.parse(userList)
        },()=>{
            this.getDataList();
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

    },

    getDataList(){
        app.sjrequest1('/activityBusiness/activityDetail',{
            activityId:this.data.activityId
        }).then(res=>{
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data;
                var actyList=data.activityFinanceResponses;
                var tempArr=[];
                if(actyList){
                    actyList.forEach(item=>{
                        tempArr.push(...item.financeUnitResponses);
                    });
                }
                this.setData({userList:actyList});
            }
        })
    }
})