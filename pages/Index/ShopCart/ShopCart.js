// pages/tabBar/cart/cart.js
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
const app = getApp()
Page({
    useStore: true,
    /**
     * 页面的初始数据
     */
    data: {
        openOverlay: false,
        isClose: false, // 是否关店
        index: 0,
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
        cartShop: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            cartShop: {
                ...app.globalData.setInfo
            }
        })
        let ids = wx.getStorageSync('merchantId')
        this.setData({
            marchantId: ids
        })
        // this.getCartData()
    },
    getCartData() {
        // 使用社交token
        const data = this.data.marchantId == -1 ? {} : {marchantId: this.data.marchantId}
        return app.sjrequest('/commodity/queryTrolleyList', data).then(res => {
            if (res.data.code === 200) {
                wx.hideLoading()
                this.setData({
                    shopCartlist: res.data.data
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
            url: '../GoodsDetails/GoodsDetails?id=' + e.currentTarget.dataset.commodityid + activityStr,
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
                        [listItem]: !this.data.shopCartlist[pid].isSelect
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
                    var listItem = 'shopCartlist[' + i + '].isSelect'
                    data.push({
                        trolleyId: it.trolleyId,
                        isPitch: 0
                    })
                    this.setData({
                        [listItem]: true,
                    })
                })
            })
        } else {
            arr.forEach((el, i) => {
                el.commoditys.forEach((it, ind) => {
                    var listItem = 'shopCartlist[' + i + '].isSelect'
                    data.push({
                        trolleyId: it.trolleyId,
                        isPitch: 1
                    })
                    this.setData({
                        [listItem]: true,
                    })
                })
            })
        }
        app.sjrequest1('/commodity/operatorIsPitch', data).then(res => {
            const token = wx.getStorageSync('token')
            let data = this.data.marchantId == -1 ? {} : {
                marchantId: this.data.marchantId
            }
            app.sjrequest('/commodity/queryTrolleyList', data, token).then(res => {
                console.log(res)
                if (res.data.code === 200) {
                    this.setData({
                        shopCartlist: res.data.data,
                        isAll: !this.data.isAll
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
        })
        // if (allSelect) {
        //     this.setData({
        //         isAll: true
        //     })
        // } else {
        //     this.setData({
        //         isAll: false
        //     })
        // }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        wx.showLoading({
            title: '加载中',
        })
        this.getCartData()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: async function () {
        wx.showLoading({
            title: '加载中',
        })
        await this.getCartData()
        wx.stopPullDownRefresh()
        setTimeout(function () {
            wx.hideLoading({
                success() {
                    wx.showToast({
                        title: '刷新成功',
                    })
                }
            })
        }, 1000)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log('调用原生页面触底事件')
    },
    changeTime(e) {
        const {
            index
        } = e.currentTarget.dataset
        this.data.shopCartlist[0].commoditys[index].timeData = e.detail
        this.setData({
            shopCartlist: this.data.shopCartlist
        });
    }
    /**
     * 用户点击右上角分享
     */
})