// pages/shopHome/components/ToCity/ToCity.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        tempId: {
            type: [String, Number],
            value: ''
        },
        headImage:{
          type:String
        },
        shopList: {
            type: Array
        }, //同城
        shopList2: {
            type: Array
        }, //预订
        logisticsList: {
            type: Array
        }, //物流
        marchantId: {
            type: [String, Number],
        },
        isToCity: {
            type: Boolean,
            value: false
        },
        nickName:{
          type:String
        },
        isToStore: {
            type: Boolean,
            value: false
        },
        isWuliu: {
            type: Boolean,
            value: false
        },
        msg: {
            type: String,
        },
        shopType: {
            type: String
        },
        address: {
            type: String,
        },
        mainOrderType: {
            type: String
        }
    },

    /* 组件生命周期 */
    lifetimes: {
        attached: function () {
         
        }
    },
    
    observers: { //监听数据
        'tempId': function (nowVal, oldVal) {
            var bgColor = '',
                tempBox = '';
            switch (nowVal) {
                case 1:
                case 4:
                case 3:
                    tempBox = 'temp-box-' + nowVal;
                    break;
                case 5:
                    bgColor = 'top-msg-bg1';
                    break;
                case 6:
                    bgColor = 'top-msg-bg2';
                    break;
                case 7:
                    bgColor = 'top-msg-bg3';
                    break;
                case 8:
                    bgColor = 'top-msg-bg4';
                    break;
                case 3.1:
                    tempBox = 'temp-box-' + 31;
                    break;
            }
            this.setData({
                listTopMsgBg: bgColor,
                tempBox
            });
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        listTopMsgBg: '',
        tempBox: '',
    },

    /**
     * 组件的方法列表
     */
    methods: {
        jumpGoodsList(e) { //跳转商品列表
            var type = e.currentTarget.dataset.type;
            var marchantId = this.properties.marchantId;
            var url = '/pages/shopHome/CityList/CityList';
            url += `?listType=${type}&marchantId=${marchantId}`;
            wx.navigateTo({
                url
            });
        },

        jumpGoodsDetail(e) { //跳转商品详情
            let id = e.currentTarget.dataset.id;
            let type = e.currentTarget.dataset.type;
            console.log(id, type, 'id和type')
            let url = `/pages/Index/GoodsDetails/GoodsDetails?id=${id}`;
            if (type != 1) {
                type == 2 && (url += `&city=1`); //同城
                type == 3 && (url += `&reserve=1`); //预订
            }
            wx.navigateTo({
                url
            });
        },

        rePage(e) {
            var id = e.currentTarget.dataset.id
            if (this.properties.shopType == "book") {
                wx.navigateTo({
                    url: '/pages/Index/GoodsDetails/GoodsDetails?id=' + id + "&reserve=1"
                })
            } else {
                wx.navigateTo({
                    url: '/pages/Index/GoodsDetails/GoodsDetails?id=' + id + "&city=1"
                })
            }
        }
    }
})