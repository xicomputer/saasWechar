// pages/Index/components/hotel/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        hotelList:{
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
    toHotelStore(e){
        let id = e.currentTarget.dataset.id
        wx.navigateToMiniProgram({
            appId: 'wxef3acba44e5aa9ab',
            path:`pages/hotel/index?hotelId=${id}`
        })
        },
    }
})
