// pages/shopHome/components/tj-tg-ms-activity/tj-tg-ms-activity.js

let app = getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        marchantId: {
            type: [String, Number],
            value: ''
        },
        tempId: {
            type: [String, Number],
            value: ''
        },
        activityType: {
            type: String,
            value: ''
        },
        homeActivity: {
            type: Array,
        }
    },

    /* 组件生命周期 */
    lifetimes: {
        ready: function () {}
    },
    /**
     * 组件的初始数据
     */
    data: {
        activityTitle: '', //活动标题
        activityListNew: [],  // 存储处理好的活动
        templateTag: 'JSMS', //活动类型 TTPT TJFL JSMS
        dataList: [], //存储某个活动的商品
    },

    /* 监听数据 */
    observers: {
        'homeActivity': function (nowVal) {
            nowVal.forEach((item, index) => {
                this.data.activeIcon.forEach((i) => {
                    if (item.code == i.code) {
                        item.icon = i.icon
                        item.url = i.url
                    }
                })
            })
            this.setData({
                activityListNew: nowVal
            })
        },
        'activityType': function (nowVal, oldVal) {
            this.setData({
                templateTag: nowVal
            }, () => {
                if (nowVal) {
                    this.getDataList();
                    this.getText()
                    this.getTypeTitle(); //获取活动标题
                }
            });
        },
        "tempId": function (nowVal, oldVal) {
            if (nowVal) {
                var tempBg = 'temp-box-bg-';
                nowVal = Number(nowVal);
                switch (nowVal) {
                    case 1:
                    case 3:
                    case 4:
                        tempBg += nowVal;
                        break;
                }
                this.setData({
                    tempBg
                });
            }
        },
    },

    /**
     * 组件的方法列表
     */
    methods: {
        jumpMore(e) { //跳转更多列表
            let activityTag = e.currentTarget.dataset.activitytag
            var url = '/pages/special_goods/activity-classify/activity-classify';
            url += `?tagType=${activityTag}&marchantId=${this.properties.marchantId}`;
            wx.navigateTo({
                url
            });
        },

        getTypeTitle() {
            var type = this.data.templateTag;
            var title = '';
            switch (type) {
                case 'TTPT':
                    title = '拼团';
                    break;
                case 'TJFL':
                    title = '邀三退一';
                    break;
                case 'JSMS':
                    title = '秒杀';
                    break;
            }
            this.setData({
                activityTitle: title
            });
        },

        //查询活动列表
        getDataList() {
            var {
                templateTag
            } = this.data;
            app.sjrequest1('/activityBusiness/pageList', {
                "pageSize": 6,
                "currentPage": 1,
                "merchantId": this.properties.marchantId,
                // "state": 2,
                templateTag,
            }).then(res => {
                if (res.statusCode == 200 && res.data.code === 0) {
                    var data = res.data.data || {};
                    var list = data.list || [];
                    list.forEach(item => {
                        var skuList = item.activityCommoditySkuList || [];
                        var defSku = skuList[0] || {};
                        var showPrice = defSku.livePrice + '';
                        var priceArr = showPrice.split('.') || [];
                        item.priceArr = priceArr;
                        item.imageUrl = item.bannerImgUrls[0];
                    });
                    this.setData({
                        dataList: list
                    });
                }
            })
        },

        jumpDetail(e) { //跳转单个商品详情   ，新需求不需要此接口，因为首页不显示货单商品，只显示图片
            var item = e.currentTarget.dataset.item;
            var {
                activityId,
                templateTag
            } = item;
            var url = '';
            if (templateTag == 'TJFL') {
                url = '/pages/businessActivity/activity_detail/activity_detail';
                url += '?activityid=' + activityId;
            } else if (templateTag == 'JSMS') {
                url = '/pages/seckill/detail/detail?activityId=' + activityId;
            } else if (templateTag == 'TTPT') {
                url = '/pages/group_booking/detail/detail?activityId=' + activityId;
            }
            wx.navigateTo({
                url
            });
        }
    }
})