// pages/Index/shopHome/components/Tabbar/tabbar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        tabList: {
            type: Array,
            value: []
        },
        markerInfo: {
            type: Object,
            value: {}
        },
        nowTabbarText: {
            type: String
        },

    },
    /* 组件生命周期 */
    lifetimes: {
        attached: function () {
            this.setData({
                addHei: getApp().globalData.isAdapter
            })
            this.tabList = this.properties.tabList
            this.markerInfo = this.properties.markerInfo
            this.nowTabbarText = this.properties.nowTabbarText
        }
    },
    observers: {
        "tabList": function(a) {
            console.log(a,'tab值')
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        wwe: 'bv',
        addHei: 'addHei',
        tabList: [],
        nowTabbarText: '首页',
        markerInfo: {}
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // tabbar
        changeTab(e) {
            let text = e.currentTarget.dataset.text
            this.setData({
                nowTabbarText: text
            })
            if (text == '首页') {
                // wx.setNavigationBarTitle({
                //     title: this.data.markerInfo.nickName
                // })
            }
            if (text == '活动') {
                wx.setNavigationBarTitle({
                    title: '活动'
                })
            }
            if (text == '热卖') {
                wx.setNavigationBarTitle({
                    title: '热卖'
                })
            }
            if (text == '购物车') {
                wx.showLoading({
                    title: '加载中',
                })
                wx.setNavigationBarTitle({
                    title: '购物车'
                })
                wx.pageScrollTo({
                    scrollTop: 0,
                    duration: 0
                })
            }
            if (text == '订阅通知') {
                wx.setNavigationBarTitle({
                    title: '订阅通知'
                })
            }
            if (text == '我的') {
                wx.setNavigationBarTitle({
                    title: '我的'
                })
                wx.pageScrollTo({
                    scrollTop: 0,
                    duration: 0
                })
            }
            if (text == '会员') {
                wx.setNavigationBarTitle({
                    title: '会员'
                })
            }
            if (text == '商品推荐') {
                wx.setNavigationBarTitle({
                    title: '商品推荐'
                })
                wx.pageScrollTo({
                    scrollTop: 0,
                    duration: 0
                })
            }
            this.triggerEvent('myManager', text)
            // if (text == '商家文化') {
            //         let url = e.currentTarget.dataset.url
            //         let marchantId = wx.getStorageSync('merchantId')
            //         wx.navigateTo({
            //             url: url+"?marchantId="+marchantId,
            //         })
            // }
        },
    }
})