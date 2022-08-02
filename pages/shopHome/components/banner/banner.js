// pages/Index/shopHome/components/banner/banner.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        jifenNum:{
            type:[String,Number],
            value:0      
        },
        addcouponList:{
            type:[String,Number],
            value:0      
        },
        userInfo:{
            type:Object,
            value:{}
          },
        tempId:{
            type:[String,Number],
            value:1
        },
        banners: {
            type: Array,
            value: []
        },
        appName: {
            type: [String],
            value: []
        },
        settingImg:{
            type:Object
        },
        mainOrderType:{type:String,value:''},
        mainBanner: {
            type:[Array, Object]
        }
    },
    
    /* 组件生命周期 */
    lifetimes:{
        attached:function(){
           console.log( 9999,this.properties)
            this.getTempClass();
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        isShowbanner:false,
        aaa:'',
        swiperHeight:'',
        itemContent:'',
        noticeBox:'',
        contentBox:'',
        textColor:''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        goIntegral(){
            let merchantId = wx.getStorageSync('merchantId')
            wx.navigateTo({
              url: `/pages/Index/integral/integral?marchantId=${merchantId}`,
            })
          },
        gotomy(){
            wx.setNavigationBarTitle({
                title: '我的'
            })
            let text = "我的"
            this.triggerEvent('myManager', text)
        },
        members(){
            let marchantId = wx.getStorageSync('merchantId')
            wx.navigateTo({
                url: `/pages/Index/couponList/couponList?marchantId=${marchantId}`,
              })
        },
        getTempClass(){
            var tempId=this.properties.tempId+'';
            var swiperHeight='',itemContent='';
            switch(tempId){
                case '12': swiperHeight='swiper-height4';break;
                default : swiperHeight='swiper-height1';
            }

            switch(tempId){
                case '12': itemContent='item-content2';break;
                default : itemContent='item-content1';
            }

            this.setData({swiperHeight,itemContent});
        },
        goShopDeatial(e){
            var id = e.currentTarget.dataset.id;
            var mainOrderType=this.properties.mainOrderType;
            var url='/pages/Index/GoodsDetails/GoodsDetails?id=' + id
            if(mainOrderType==2 || mainOrderType==3){
                mainOrderType==2 && (url+=`&city=1`);//同城
                mainOrderType==3 && (url+=`&reserve=1`);//预订
            }
            if (id) {
                wx.navigateTo({url})
            }
        },
    }
})
