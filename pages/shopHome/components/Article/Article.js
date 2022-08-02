// pages/shopHome/components/Article/Article.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        ArticleList:{
            type:Array
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

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
    }
})
