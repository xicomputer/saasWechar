// pages/shopHome/components/culture/culture.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        tempId:{
            type:[String,Number],
            value:""
        },
        ArticleList: {
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
        toWebViewPage(e){
          var link=e.currentTarget.dataset.link;
          wx.navigateTo({
            url:'/pages/shopHome/webView/webView?link='+link,
          });
        },
        goMore(){
            wx.navigateTo({
              url: '/pages/shopHome/cultureLIst/cultureList',
            })
        }
    }
})
