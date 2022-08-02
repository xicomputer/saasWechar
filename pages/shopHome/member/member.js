// pages/shopHome/member/member.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        memberGoodsList:[],
        userInfo:{},
        isIntegral:0,
        marchantId:null,
        orderSwitch:null,
        mainOrderType:'',//主推业务 1物流 2同城 3预订
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.orderSwitch!=undefined){
            let orderSwitch  =options.orderSwitch
            let ids =options.marchantId
            this.setData({marchantId:ids,orderSwitch:orderSwitch})
        }else{
            let orderSwitch  = wx.getStorageSync('orderSwitch')
            let ids = wx.getStorageSync("merchantId")
            this.setData({marchantId:ids,orderSwitch:orderSwitch})
        }

        this.setData({mainOrderType:options.mainOrderType || ""},()=>{
            this.getUserInfo()
            this.getMemberGoodsList()
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
    // 会员
    getMemberGoodsList(){
        var data={marchantId:this.data.marchantId}
        var mainOrderType=this.data.mainOrderType;
        if(mainOrderType){data.orderTemplate=mainOrderType}

        app.sjrequest('/commodity/queryMemberCommodityList',data).then(res =>{
        if(res.data.code==200){
            wx.hideLoading()
            this.setData({
            memberGoodsList: res.data.data
            })
        }else{
            wx.showToast({
            title: res.data.msg,
            icon:'none'
            })
        }
        })
    },
    // 跳转到激活会员
    toMember(){
        wx.navigateTo({
        url: `/pages/member/card/card?marchantId=${this.data.marchantId}`,
        })
    },
    // 获取用户信息 ，如果是会员显示memberleve字段，如果不是则没有此字段
    getUserInfo(){
        let data = { marchantId: this.data.marchantId}
        app.sjrequest('/userRegister/queryUserInfo',data).then(res=>{
        if(res.data.code==200){
            wx.hideLoading()
            if(res.data.data.uniqueId){
            wx.setStorage({
                data: res.data.data.uniqueId,
                key: 'uniqueId1',
            })
            }
            // if(res.data.data.community==0){   // 未开启订阅通知
            //   let tabs = 'tabList1[5].isHave'
            //   this.setData({
            //     [tabs]:false
            //   })
            // }else{
            //   let tabs = 'tabList1[4].isHave'
            //   this.setData({
            //     [tabs]:false
            //   })
            // }
            // if(!res.data.data.statusv){   // 热卖是否开启
            //   let tabs = 'tabList1[1].isHave'
            //   this.setData({
            //     [tabs]:false
            //   })
            // }
            // if(!res.data.data.statusm){   // 会员是否开启
            //   let tabs = 'tabList1[3].isHave'
            //   this.setData({
            //     [tabs]:false
            //   })
            // }

            var wxUserInfo=wx.getStorageSync('wx_userinfo_key')||{};
            this.setData({
                userInfo:{
                    ...res.data.data,
                    avatarUrl:wxUserInfo.userInfo.avatarUrl,
                    nickName:wxUserInfo.userInfo.nickName,
            }}) 
            console.log(this.data.userInfo, 'userInfo')
        }else{
            wx.showToast({
            title: res.data.msg,
            icon: 'none'
            })
        }
        })
    },
    goshop(e){
        const {name, id} = e.currentTarget.dataset;
        var mainOrderType=this.properties.mainOrderType;
        var url=`/pages/Index/GoodsDetails/GoodsDetails?id=`+id+`&memberShow=1`
        if(mainOrderType==2 || mainOrderType==3){
            mainOrderType==2 && (url+=`&city=1`);//同城
            mainOrderType==3 && (url+=`&reserve=1`);//预订
        }
        wx.navigateTo({url});
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
        let uniqueId = wx.getStorageSync('uniqueId1')
        return {
            title: this.data.markerInfo.nickName,
            path: "pages/shopHome/member/member?marchantId="+this.data.marchantId+'&orderSwitch='+this.data.orderSwitch,
        }
    },
})