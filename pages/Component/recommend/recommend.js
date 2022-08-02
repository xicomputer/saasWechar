// pages/Index/components/recommend/recommend.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        recommends: {
            type: Array,
            value: []
        },
        orderSwitch:{
            type:[Number, String]
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        typeModel:1,
        selTabItem:1,
        topTabList:[
            {name:'推荐',id:1},{name:'销量',id:2},{name:'价格',id:3}
        ],
        goodsList:[
            {id:1},
            {id:2},
            {id:2},
            {id:4},
            {id:5},
            {id:6}
        ]
    },

    /**
     * 组件的方法列表
     */
    methods: {
        switchTopTab(e){
            var tid=e.currentTarget.dataset.tid;
            this.setData({selTabItem:tid});
        },

        addCartGoods(e){
            var item=e.currentTarget.dataset.item;
            this.triggerEvent('recommendEvent',{eventType:'addCart',goodsInfo:item});
        },
        goshop(e){
            const {name, id} = e.currentTarget.dataset
            wx.navigateTo({
                url: `/pages/Index/GoodsDetails/GoodsDetails?id=`+id
            })
        },

    }
})
