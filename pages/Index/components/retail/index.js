// pages/Index/components/retail/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        shopList:{
            type:Array,
            value:[]
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
        // 跳店铺
        toMarchant(e){
            let idx = e.currentTarget.dataset.idx
            if(this.data.shopList[idx].marchantCorrelation.source == 1) {
            wx.navigateTo({
                url: `/pages/shopHome/home/home?marchantId=${this.data.shopList[idx].id}`,
            })
            }else if(this.data.shopList[idx].marchantCorrelation.source == 2){
            wx.navigateToMiniProgram({
                appId: 'wxef3acba44e5aa9ab',
                path:`pages/hotel/index?hotelId=${this.data.shopList[idx].marchantCorrelation.correlationId}`
            })
            }
            // url="./Index?marchantId={{item.marchantId}}"
        },
        toGoodsDetail(e){
            let id = e.currentTarget.dataset.id
            wx.navigateTo({
              url: '/pages/Index/GoodsDetails/GoodsDetails?id=' + id,
            })
        }
    }
})
