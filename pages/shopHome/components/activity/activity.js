// pages/Index/shopHome/components/activity/activity.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        commentList: Array,
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
    },

    /* 组件生命周期 */
    lifetimes:{
        attached:function(){
            // this.getActiveList();
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        tempBg:'',
    },

    // 监听数据
    observers:{
        "tempId":function(nowVal,oldVal){
            if(nowVal){
                this.setData({tempBg:'temp-bg'+nowVal});
            }
        },
    },

    /**
     * 组件的方法列表
     */
    methods: {
        goSaleShop(e){
            let url = e.currentTarget.dataset.url
            let marchantId = wx.getStorageSync('merchantId')
            wx.navigateTo({
                url: url,
            })
        },
        
        //获得活动列表
        getActiveList(){
            const data={'marchantId':this.properties.marchantId,'sourceType':'applet'}
            app.sjrequest('/activity/queryActivityList',data).then(res =>{
                console.log('活动列表：====',res);
            })
        },
    }
})
