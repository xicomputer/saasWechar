// pages/shopHome/components/hotVideo/hotVideo.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        marchantId:{
            type:[String,Number],
        },
        videoList:{
            type:Array,
            value:[]
        },
        tempId:{
            type:[String,Number],
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
        toVideo(e){
            let item = e.currentTarget.dataset.item
            wx.navigateTo({
              url: `/pages/Index/videoDetail/videoDetail?marchantId=${item.marchantId}&id=${item.videoId}`,
            })
        },
        moreVideo(){
            wx.navigateTo({
                url: `/pages/shopHome/hot/hot?marchantId=${this.data.marchantId}`,
              })
        }
    }
})
