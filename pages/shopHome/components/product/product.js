let app = getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        isWuliu: {
            type: Boolean,
            value: false
        }, //物流
        isToCity: {
            type: Boolean,
            value: false
        }, //同城
        isToStore: {
            type: Boolean,
            value: false
        }, //预订
        mainOrderType: {
            type: String,
            value: ''
        }, //主推业务 1物流 2同城 3预订
        productList: {
            type: Array,
            value: []
        },
        tempId: {
            type: [String, Number],
            value: 1
        },
        marchantId: {
            type: String,
            value: ''
        },
        orderSwitch: {
            type: [Number, String]
        },
        countdown: {
            type: Boolean,
            value: false
        }
    },

    /* 组件生命周期 */
    lifetimes: {
        attached: function () {
          console.log('123',this.isToCity);
        }
    },

    /* 监听数据变化 */
    observers: {
        // 'tempId':function(newVal,oldVal){
        //     if(newVal==1 || newVal==4){
        //         var orderTemplate='';//订单模板 1.物流 2.同城 3.预订
        //         newVal=Number(newVal);
        //         switch(newVal){
        //             case 1: orderTemplate=3;break;
        //             case 4: orderTemplate=2;break;
        //         }
        //         this.setData({orderTemplate},()=>{
        //             this.getClassifyNavList();
        //         });
        //     }
        // },
        'mainOrderType': function (nowVal, oldVal) {
            if (nowVal) {
                var btnTitle = '';
                switch (Number(nowVal)) {
                    case 1:
                        btnTitle = '物流发货';
                        break;
                    case 2:
                        btnTitle = '同城配送';
                        break;
                    case 3:
                        btnTitle = '门店团购';
                        break;
                }
                this.setData({
                    orderTemplate: nowVal,
                    btnTitle
                }, () => {
                    this.getClassifyNavList();
                });
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        tempId: 1,
        btnTitle: '', //


        classItem: '',
        navList: [], //同城、预定分类列表
        goodsList: [],
        pageSize: 10,
        skuList: [], //规格列表
        nowSku: {}, //选中的规格
        goodsData: {}, //同城、预定分类商品信息
        goodsItem: {}, //正在操作的商品信息

        currentIndex: 0,
        JifentimeData: {},
        footImg: '/pages/static/foot_Img.png',

        isCountDesabled: false,
        buyCount: 1, //购买数量
        showBuyPopup: false,
        orderTemplate: '', //订单模板 1.物流 2.同城 3.预订
    },

    /**
     * 组件的方法列表
     */
    methods: {
        changeJfTime(e) {
            this.data.JifentimeData = e.detail
            this.setData({
                JifentimeData: this.data.JifentimeData
            });
        },
        titleClick(e) {
            var item = e.currentTarget.dataset.idx;
            this.setData({
                currentIndex: item
            }, () => {
                this.getProductList();
            });

        },
        toGoodsDetails(e) {
            var id = e.currentTarget.dataset.id;   // 商品ID
            var mainOrderType=this.properties.mainOrderType;   // 商家经营模式
            var url='/pages/Index/GoodsDetails/GoodsDetails?id=' + id
            if(mainOrderType==2 || mainOrderType==3){
                mainOrderType==2 && (url+=`&city=1`);//同城
                mainOrderType==3 && (url+=`&reserve=1`);//预订
            }
            wx.navigateTo({url});
        },
        navito(e) {
            const {
                name,
                id
            } = e.currentTarget.dataset
            wx.navigateTo({
                url: `/pages/Index/GoodsList/GoodsList?category=${name}&marchantId=${this.data.marchantId}&classifyId=${id}`
            })
        },
        goColumn(e) {
            const {
                id,
                name
            } = e.currentTarget.dataset;
            var marchantId = this.data.marchantId;
            var mainOrderType = this.data.orderTemplate;
            var query = `?id=${id}&marchantId=${marchantId}&title=${name}&mainOrderType=${mainOrderType}`
            wx.navigateTo({
                url: '/pages/shopHome/column/column' + query,
            })
        },

        jumpDetail(e) {
            var item = e.currentTarget.dataset.item;
            var orderTemplate = this.data.orderTemplate;
            var {
                marchantId
            } = this.properties;
            var commodityId = item.commodityId;
            var url = '/pages/special_goods/goods_detail/goods_detail?';
            url += `commodityId=${commodityId}&marchantId=${marchantId}&orderTemplate=${orderTemplate}`;
            wx.navigateTo({
                url
            });
        },

        temp1SwitchNav(e) { //切换分类导航
            var item = e.currentTarget.dataset.item;
            this.setData({
                classItem: item
            }, () => {
                this.getProductList();
            });
        },

        countChange(e) { //购买数量改变
            var buyCount = e.detail.value;
            var currentSku = this.data.nowSku;
            if (buyCount > currentSku.stock) {
                this.setData({
                    isCountDesabled: true
                });
                return wx.showToast({
                    title: '购买数量超出库存数量',
                    icon: 'none'
                });
            }
            this.setData({
                buyCount
            });
        },
        minusCount() {
            if (this.data.isCountDesabled) {
                this.setData({
                    isCountDesabled: false
                });
            }
        },

        openBuyPopup(e) { //打开购买弹窗
            var goodsItem = e.currentTarget.dataset.goodinfo;
            this.querySkuList(goodsItem);
        },
        closeBuyPopup() { //关闭购买弹窗
            this.setData({
                showBuyPopup: false
            });
        },


        getClassifyNavList() { //获取分类列表
            var {
                marchantId
            } = this.properties;
            app.sjrequest('/commodity/queryClassify', {
                marchantId,
                orderTemplate: this.data.orderTemplate
            }).then(res => {
                if (res.statusCode == 200 && res.data.code == 200) {
                    var list = res.data.data || [];
                    var classItem = list[0] || {};
                    var goodsData = this.data.goodsData;
                    list.forEach(item => {
                        goodsData['listInfo' + item.id] = {
                            stopReq: false,
                            pageNum: 1,
                            list: []
                        }
                    })

                    this.setData({
                        navList: list,
                        classItem
                    }, () => {
                        this.getProductList();
                    });
                }
            })
        },

        getProductList() { //查询 预订与同城 商品
            var {
                marchantId,
                mainOrderType
            } = this.properties;
            var pageSize = this.data.pageSize;
            var classifyId = this.data.classItem.id;
            var goodsData = this.data.goodsData;
            var goodsItem = goodsData['listInfo' + classifyId];
            app.sjrequest('/commodity/queryCommodityList', {
                marchantId,
                // classifyId,   // 不传此ID，返回所有分类下的所有商品
                pageCurr: goodsItem.pageNum,
                // pageSize,
                orderTemplate: this.data.orderTemplate
            }).then(res => {
                if (res.statusCode == 200 && res.data.code == 200) {
                    var list = res.data.data || [];
                    goodsItem.stopReq = list.length !== pageSize;
                    if (goodsItem.pageNum == 1) {
                        goodsItem.list = list;
                    } else {
                        goodsItem.list.push(...list);
                    }
                    this.setData({
                        goodsData,
                        goodsList: goodsItem.list
                    });
                }
            })
        },

        querySkuList(goodsItem) { //查询规格列表
            var {
                marchantId
            } = this.properties;
            app.sjrequest('/commodity/queryCommoSku', {
                marchantId,
                commodityId: goodsItem.commodityId
            }).then(res => {
                if (res.statusCode == 200 && res.data.code == 200) {
                    var list = res.data.data || [];
                    var nowSku = list[0] || {};
                    this.setData({
                        skuList: list,
                        nowSku
                    });
                }
                this.setData({
                    showBuyPopup: true,
                    goodsItem
                });
            })
        },

        replaceSku(e) { //切换规格
            var item = e.currentTarget.dataset.item;
            this.setData({
                nowSku: item
            });
        },


        /** 加入购物车 */
        addCart() {
            var nowSku = this.data.nowSku;
            var marchantId = this.properties.marchantId;
            var buyCount = this.data.buyCount;
            if (nowSku.stock < buyCount) {
                wx.showToast({
                    title: '库存不足',
                    icon: 'none',
                    duration: 2000
                });
                return;
            }
            var data = {
                'tempSpecId': nowSku.id,
                'commodityId': nowSku.commodityId,
                'amount': this.data.buyCount,
                'marchantId': marchantId,
                'operate': 1
            }
            app.sjrequest('/commodity/addTrolley', data).then(res => {
                if (res.data.code == 200) {
                    wx.showToast({
                        title: '添加成功',
                        icon: 'success'
                    });
                    this.closeBuyPopup();
                }
            })
        },

        /**立即购买 */
        buyNow() {
            var nowSku = this.data.nowSku;
            var orderTemplate = this.data.orderTemplate;
            var marchantId = this.properties.marchantId;
            var buyCount = this.data.buyCount;
            if (buyCount > nowSku.stock) {
                wx.showToast({
                    title: '库存不足',
                    icon: 'none',
                    duration: 2000
                });
                return;
            }

            let data = {
                marchantId,
                orderType: 3,
                commoditys: [{
                    commodityId: nowSku.commodityId,
                    tempSpecId: nowSku.id,
                    amount: buyCount
                }],
            }
            wx.showLoading({
                title: '加载中...'
            });

            var token = wx.getStorageSync('token')
            app.sjrequest1('/order/onekeyAboutOrder', data, token).then(res => {
                if (res.data.code === 200) {
                    wx.hideLoading();
                    app.store.setState({ // 更新 store 数据
                        submitObj: JSON.stringify(res.data.data)
                    });
                    var url = `/pages/order/submitOrder/submitOrder?`;
                    url += `orderType=${orderTemplate}`;
                    wx.navigateTo({
                        url
                    });
                } else {
                    wx.hideLoading()
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            })
        },

    }
})