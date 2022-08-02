// pages/Index/shopHome/components/componentsPage/shopCart/shopCart.js
import Toast from '../../../../../miniprogram_npm/@vant/weapp/toast/toast'
import Dialog from '../../../../../miniprogram_npm/@vant/weapp/dialog/dialog';
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      mainOrderType:{type:String,value:''},

        shopCartlist: {
            type: Array
        },
        marchantId: {
            type: [Number, String],
            value: ''
        },
        mainOrderType: {
            type: String,
            value: ''
        },
    },

    /* 组件生命周期 */
    lifetimes: {
        attached: function () {
            this.setData({
                addHei: getApp().globalData.isAdapter
            })

            // this.getCartData()
            this.marchantId = this.properties.marchantId
            this.setData({
                cartShop: {
                    ...app.globalData.setInfo
                }
            });

            app.globalEvent.$on('homeRefresh', () => {
                this.getLikeCommodityList();
            })
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        addHei: false,
        marchantId: null,
        sopenOverlay: false,
        isClose: false, // 是否关店
        index: 0,
        cartShop: {},
        editObj: {
            pi: '',
            ci: '',
            value: ''
        },
        show: false,
        value: '',
        num: '',
        isAll: false,
        shopCartlist: [],
        listItem: '',
        marchantId: -1,
        orderType: 0,
        subtotal: 0,

        likeGoodsList: [], //猜你喜欢商品
    },

    // 监听数据
    observers: {
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
            console.log(btnTitle,'btnTitle');

            this.setData({
                btnTitle
            });
        }
    },
        'marchantId': function (nowVal) {
            if (nowVal) {
                this.getLikeCommodityList();
            }
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        getCartData() {
            // 使用社交token
            const data = this.data.marchantId == -1 ? {} : {
                marchantId: this.data.marchantId
            }
            return app.sjrequest('/commodity/queryTrolleyList', data).then(res => {
                if (res.data.code === 200) {
                    wx.hideLoading()
                    this.setData({
                        shopCartlist: res.data.data,
                        subtotal: res.data.data[0] ? res.data.data[0].subtotal : "0"
                    })
                    this.disposeData()
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            })
        },
        // //选择消费方式
        // checkxf(e){
        //     this.setData({
        //         index:e.currentTarget.dataset.index
        //     })
        // },
        //关闭消费方式
        closexf() {
            this.setData({
                openOverlay: false
            })
            // wx.showTabBar()
            this.setData({
                index: 0
            })
        },
        //确认消费方式
        surexf() {
            let jsonData = {
                marchantId: this.data.listItem.marchantId,
                orderType: this.data.orderType,
                commoditys: []
            }
            this.data.listItem.commoditys.forEach(el => {
                jsonData.commoditys.push({
                    commodityId: el.commodityId,
                    tempSpecId: el.tempSpecId,
                    amount: el.amount
                })
            })
            console.log(jsonData)
            // 使用社交token
            const token = wx.getStorageSync('token')
            wx.showLoading({
                title: '结算中'
            })
            app.sjrequest1('/order/onekeyAboutOrder', jsonData, token).then(res => {
                wx.hideLoading()
                if (res.data.code === 200) {
                    // 更新 store 数据
                    app.store.setState({
                        submitObj: JSON.stringify(res.data.data)
                    })
                    wx.navigateTo({
                        url: '/pages/order/submitOrder/submitOrder'
                    })
                } else if (res.data.code == 338) {
                    wx.hideLoading()
                    this.setData({
                        isClose: true
                    })
                } else {
                    wx.hideLoading()
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            })
        },
        // 去结算
        handleGoSettlement(e) {
            var pi = e.currentTarget.dataset.pi
            let orderType = this.data.shopCartlist[pi].businessModel.split(',').sort()
            orderType = orderType[0]
            this.setData({
                orderType: orderType
            })
            console.log('去结算', pi)
            // if (!this.data.list[pi].isSelect) {
            // Toast('未选中对于的商品!')
            // console.log(this.data.list[pi])
            // } else {
            var isSelect = false
            this.data.shopCartlist[pi].commoditys.forEach(el => {
                if (el.isPitch) isSelect = true
            })
            if (isSelect) {
                const arr = []
                this.data.shopCartlist[pi].commoditys.forEach(el => {
                    if (el.isPitch) arr.push(el)
                })
                const listItem = {
                    ...this.data.shopCartlist[pi],
                    commoditys: arr
                }
                console.log(listItem)
                this.setData({
                    openOverlay: true,
                    listItem: listItem
                })
                this.surexf()
            } else {
                Toast('未选中对应的商品!')
            }
            // }
        },
        //跳转商品详情
        toGoodsdetail(e) {
            let activityStr = ''
            if (e.currentTarget.dataset.activity) {
                activityStr = '&activityId=' + e.currentTarget.dataset.activity
            }
            wx.navigateTo({
                url: '/pages/Index/GoodsDetails/GoodsDetails?id=' + e.currentTarget.dataset.commodityid + activityStr,
            })
        },
        toStore(e) {
            wx.navigateTo({
                url: '/pages/shopHome/home/home?marchantId=' + e.currentTarget.dataset.marchantid,
            })
        },
        // 修改购物车信息
        changeCartInfo(storeIndex, goodsIndex) {
            let that = this
            let params = this.data.shopCartlist[storeIndex].commoditys[goodsIndex]
            let data = {
                tempSpecId: params.tempSpecId,
                commodityId: params.commodityId,
                marchantId: params.marchantId,
                amount: params.amount,
                operate: 3
            }
            app.sjrequest('/commodity/addTrolley', data).then(res => {
                try {
                    console.log("333")
                } catch (error) {
                    console.log("444")
                }
                if (res.data.code == 200) {
                    that.getCartData()
                }
            })
        },
        // 编辑 num
        handleEditNum(e) {
            console.log(e)
            let pi = e.currentTarget.dataset.pi
            let ci = e.currentTarget.dataset.ci
            let type = e.currentTarget.dataset.type

            var goodItem = 'shopCartlist[' + pi + '].commoditys[' + ci + '].amount'
            if (type === 'add') {
                if (this.data.shopCartlist[pi].commoditys[ci].amount === this.data.shopCartlist[pi].commoditys[ci].inventory) {
                    Toast('该宝贝不能购买更多哦')
                } else {
                    // 加一
                    this.setData({
                        [goodItem]: this.data.shopCartlist[pi].commoditys[ci].amount + 1
                    })
                }
            } else if (type === 'minus') {
                // 减一
                if (this.data.shopCartlist[pi].commoditys[ci].amount === 1) {
                    this.setData({
                        [goodItem]: 1
                    })
                } else {
                    this.setData({
                        [goodItem]: this.data.shopCartlist[pi].commoditys[ci].amount - 1
                    })
                }
            } else {
                // 编辑
                this.setData({
                    "editObj.pi": pi,
                    "editObj.ci": ci,
                    value: this.data.shopCartlist[pi].commoditys[ci].amount,
                    show: true
                })
            }
            this.changeCartInfo(pi, ci)
        },
        // 监听输入的值
        handleInput(e) {
            if (e.detail.value != '') {
                let value = this.validateNumber(e.detail.value)
                this.setData({
                    value: parseInt(value)
                })
            }
        },
        // 校验只能输入数字
        validateNumber(val) {
            return val.replace(/^(0+)|[^\d]+/g, '')
        },
        // 弹框确定事件
        confirm(e) {
            if (this.data.value > this.data.shopCartlist[this.data.editObj.pi].commoditys[this.data.editObj.ci].inventory) {
                Toast('该宝贝不能购买更多哦')
            } else {
                var goodItem = 'shopCartlist[' + this.data.editObj.pi + '].commoditys[' + this.data.editObj.ci + '].amount'
                this.setData({
                    [goodItem]: this.data.value
                })
                this.changeCartInfo(this.data.editObj.pi, this.data.editObj.ci)
            }
        },
        // 弹框取消
        onClose() {
            this.setData({
                close: false
            });
        },
        // 删除 购物车数据
        delete() {
            const postIds = []
            this.data.shopCartlist.forEach(el => {
                el.commoditys.forEach(it => {
                    if (it.isPitch) {
                        postIds.push(it.trolleyId)
                    }
                })
            })

            if (postIds.length) {
                Dialog.alert({
                    title: '提示',
                    context: this,
                    message: '确认将宝贝删除',
                    showCancelButton: true,
                    cancelButtonText: '我再想想',
                    confirmButtonText: '删除'
                }).then(() => {
                    var postDatas = {
                        trolleyIds: postIds.join(',')
                    }

                    // 使用社交token
                    const token = wx.getStorageSync('token')
                    app.sjrequest('/commodity/deleteTrolley', postDatas, token).then(res => {
                        if (res.data.code === 200) {
                            this.getCartData()
                        }
                    })
                });
            } else {
                wx.showToast({
                    title: '您还没择宝贝哦！',
                    icon: 'none'
                })
            }
            this.disposeData()
        },

        // 商品选中事件
        handleGoodItemSelect(e) {
            var pid = e.currentTarget.dataset.pid
            var cid = e.currentTarget.dataset.cid
            var isPitch, trolleyId
            trolleyId = this.data.shopCartlist[pid].commoditys[cid].trolleyId
            if (this.data.shopCartlist[pid].commoditys[cid].isPitch == 0) {
                isPitch = 1
            }
            if (this.data.shopCartlist[pid].commoditys[cid].isPitch == 1) {
                isPitch = 0
            }
            let data = [{
                trolleyId,
                isPitch
            }]
            app.sjrequest1('/commodity/operatorIsPitch', data).then(res => {
                this.getCartData()
            })
            this.disposeData()
        },
        // 选中商家事件
        async handleGoodsSelect(e) {
            var pid = e.currentTarget.dataset.pid
            var commoditys = this.data.shopCartlist[pid].commoditys
            let data = []
            if (this.data.shopCartlist[pid].isSelect) {
                commoditys.forEach(item => {
                    data.push({
                        trolleyId: item.trolleyId,
                        isPitch: 0
                    })
                })
            } else {
                commoditys.forEach(item => {
                    data.push({
                        trolleyId: item.trolleyId,
                        isPitch: 1
                    })
                })
            }
            app.sjrequest1('/commodity/operatorIsPitch', data).then(res => {
                const token = wx.getStorageSync('token')
                let data = this.data.marchantId == -1 ? {} : {
                    marchantId: this.data.marchantId
                }
                app.sjrequest('/commodity/queryTrolleyList', data, token).then(res => {
                    if (res.data.code === 200) {
                        var listItem = 'shopCartlist[' + pid + '].isSelect'
                        this.setData({
                            shopCartlist: res.data.data,
                            [listItem]: !this.data.shopCartlist[pid].isSelect,
                            subtotal: res.data.data[0] ? res.data.data[0].subtotal : "0"
                        })
                        this.disposeData()
                    }
                })
            })
        },

        // 全选
        selectAll() {
            let arr = this.data.shopCartlist
            let data = []
            if (this.data.isAll) {
                arr.forEach((el, i) => {
                    el.commoditys.forEach((it, ind) => {
                        var listItem = 'shopCartlist[' + i + '].isSelect';
                        data.push({
                            trolleyId: it.trolleyId,
                            isPitch: 0
                        });
                        this.setData({
                            [listItem]: true
                        });
                    });
                });
            } else {
                arr.forEach((el, i) => {
                    el.commoditys.forEach((it, ind) => {
                        var listItem = 'shopCartlist[' + i + '].isSelect'
                        data.push({
                            trolleyId: it.trolleyId,
                            isPitch: 1
                        })
                        this.setData({
                            [listItem]: true
                        });
                    })
                })
            }

            app.sjrequest1('/commodity/operatorIsPitch', data).then(res => {
                const token = wx.getStorageSync('token')
                let data = this.data.marchantId == -1 ? {} : {
                    marchantId: this.data.marchantId
                }
                app.sjrequest('/commodity/queryTrolleyList', data, token).then(res => {
                    if (res.data.code === 200) {
                        this.setData({
                            shopCartlist: res.data.data,
                            isAll: !this.data.isAll,
                            subtotal: res.data.data[0] ? res.data.data[0].subtotal : "0"
                        })
                        this.disposeData()
                    }
                })
            })
        },

        // 处理数据
        disposeData() {
            const arr = this.data.shopCartlist
            var allSelect = true
            if (arr.length == 0) {
                allSelect = false
            }
            arr.forEach((el, i) => {
                var listItem = 'shopCartlist[' + i + '].hj'
                var listItemSelect = 'shopCartlist[' + i + '].isSelect'
                var num = 0
                var isSelet = true
                el.commoditys.forEach((it, idx) => {
                    if (it.isPitch) {
                        num += it.originalPrice * it.amount * 100
                    } else {
                        isSelet = false
                        allSelect = false
                    }
                })
                this.setData({
                    [listItem]: num / 100,
                    [listItemSelect]: isSelet
                })
            })

            this.setData({
                isAll: allSelect
            });
        },
        changeTime(e) {
            let shopCartlist = this.properties.shopCartlist
            const {
                index
            } = e.currentTarget.dataset
            var detail = e.detail;
            detail.days < 10 && (detail.days = '0' + detail.days);
            detail.hours < 10 && (detail.hours = '0' + detail.hours);
            detail.minutes < 10 && (detail.minutes = '0' + detail.minutes);
            detail.seconds < 10 && (detail.seconds = '0' + detail.seconds);
            shopCartlist[0].commoditys[index].timeData = detail;
            this.setData({
                shopCartlist: shopCartlist
            });
        },

        // getLikeCommodityList(){//猜你喜欢商品, 旧需求，直接请求
        //     app.sjrequest('/marchant/likeCommodityList',{
        //         merchantId:this.properties.marchantId
        //     }).then(res=>{
        //         console.log('猜你喜欢商品',res);
        //         if(res.statusCode==200 && res.data.code==200){
        //             var list=res.data.data;
        //             this.setData({likeGoodsList:list});
        //         }
        //     })
        // },
        async getLikeCommodityList() { //猜你喜欢商品, 新，当前主经营模式是什么就返回什么样的商品
            try {
                let data = {
                    marchantId: this.properties.marchantId,
                    orderTemplate: String(this.properties.mainOrderType)
                }
                console.log(data, '猜你喜欢商品请求数据')
                let res = await app.sjrequest('/commodity/queryCommodityList', data)
                console.log('猜你喜欢商品', res);
                if (res.statusCode == 200 && res.data.code == 200) {
                    var list = res.data.data;
                    this.setData({
                        likeGoodsList: list
                    });
                }
            } catch (error) {
                console.log(error)
            }

        },

        jumpGoodsDetail(e) {
            var id = e.currentTarget.dataset.item.commodityId;
            var mainOrderType = this.properties.mainOrderType;
            var url = '/pages/Index/GoodsDetails/GoodsDetails?id=' + id
            if (mainOrderType == 2 || mainOrderType == 3) {
                mainOrderType == 2 && (url += `&city=1`); //同城
                mainOrderType == 3 && (url += `&reserve=1`); //预订
            }
            wx.navigateTo({
                url
            });
        },

    }
})