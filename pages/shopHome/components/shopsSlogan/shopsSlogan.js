// pages/Index/shopHome/components/search/search.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
  
    properties: {
        ArticleList: {
            type: Array
        },
        marchantId: {
            type: [String, Number],
            value: ''
        },
        settingImg: {
            type: [Object, Number, String, Array]
        }
        // subscribe: {
        //     type: Number,
        //     value: 1
        // },
        // heights:{
        //     type: [String, Number],
        // },
        // fixed:{
        //     type:Boolean,
        //     value:true,
        // }
    },
    observers: {},
    /* 组件生命周期 */
    lifetimes: {
        attached: function () {
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        settingImg: [] // 存储商家上传的视频
    },

    /**
     * 组件的方法列表
     */
    methods: {
        aciveUrl(e) {
            let url = e.currentTarget.dataset.url
            let marchantId = this.data.marchantId;
            var mainBusinessModel = this.data.mainBusinessModel;
            wx.navigateTo({
                url: url + "?marchantId=" + marchantId + '&mainOrderType=' + mainBusinessModel,
            })
        },
        toWebViewPage(e) {
            var link = e.currentTarget.dataset.link;
            wx.navigateTo({
                url: '/pages/shopHome/webView/webView?link=' + link,
            });
        },

       
    },


})