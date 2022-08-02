// pages/shopHome/components/union/union.js
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
    },

    /**
     * 组件的初始数据
     */
    data: {
        tempBaseUrl:'https://xssj.letterbook.cn/applet/images/',

    },

    /**
     * 组件的方法列表
     */
    methods: {
        jumpApplet(e){
            var appId=e.currentTarget.dataset.appid;
            wx.navigateToMiniProgram({appId});
        },
    }
})
