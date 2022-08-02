// pages/Index/shopHome/components/search/search.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // tempId: {
        //     type: [String, Number],
        //     value: 1
        // },
    },

    /* 组件生命周期 */
    lifetimes: {
        attached: function () {
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
        getBg() {
            var tempId = this.properties.tempId;
            var searchBoxBg = '',
                iptBgClass = '',
                btnBgClass = '';

            switch (tempId) {
                case '3':
                    searchBoxBg = 'search-box-bg2';
                    break;
                default:
                    searchBoxBg = 'search-box-bg1';
            }

            switch (tempId) {
                case '3':
                    iptBgClass = 'ipt-bg2';
                    break;
                default:
                    iptBgClass = 'ipt-bg1';
            }

            switch (tempId) {
                case '1':
                    btnBgClass = 'btn-bg2';
                    break;
                case '2':
                    btnBgClass = 'btn-bg3';
                    break;
                case '4':
                    btnBgClass = 'btn-bg6';
                    break;
                case '3':
                    btnBgClass = 'btn-bg5';
                    break;
                case '5':
                case '6':
                    btnBgClass = 'btn-bg6';
                    break;
                case '7':
                    btnBgClass = 'btn-bg8';
                    break;
                case '9':
                    btnBgClass='btn-bg9'
                    break
                case '8':
                    btnBgClass='btn-bg8s'
                break
                case '10':
                    btnBgClass='btn-bg10'
                    break
                default:
                    btnBgClass = 'btn-bg1';
            }
            this.setData({
                searchBoxBg,
                iptBgClass,
                btnBgClass
            });
        },
        //  订阅商铺
        showDingYue() {
            // 获取用户信息
            var that = this
            let appid = wx.getStorageSync('appid')
            let data = {
                authorizerAppid:appid,
                sceneType:1,
            }
            app.mb2request('/subTemplate/listPriTemplateId',data).then(res=>{
                let tempData = res.data.data
                wx.requestSubscribeMessage({
                    tmplIds: tempData,
                    success: function (res) {
                        wx.getSetting({
                            withSubscriptions: true,
                            success: result => {
                                wx.showToast({
                                    title: '订阅消息成功',
                                })
                                // this.triggerEvent('event', true)
                                // if (result.subscriptionsSetting['jvI8z85nDADGOrxnLxVsfx4JTASr2g80ZxnjkS59BEo'] == 'accept') {
                                //     that.setData({
                                //         status: 2
                                //     })
                                // }
                                // if (res['jvI8z85nDADGOrxnLxVsfx4JTASr2g80ZxnjkS59BEo'] == 'accept') {
                                    let data = {
                                        status: that.data.status,
                                        marchantId: that.data.marchantId,
                                        templateIds: tempData,
                                        appId:appid
                                    }
                                    app.sjrequest('/basic/addsubscription', data).then(res => {
                                        if (res.data.code == 200) {
                                            wx.showToast({
                                                title: '订阅消息成功',
                                            })
                                            this.triggerEvent('event', true)
                                        } else {
                                            wx.showToast({
                                                title: res.data.msg,
                                                icon: 'none'
                                            })
                                        }
                                    })
                                }
                            })
                    },
                    fail(e) {
                        console.log(e)
                        wx.showToast({
                            title: '订阅消息失败,请点击右上角三个点中的设置打开消息订阅开关',
                            icon: 'none'
                        })
                    }
                })
            })
            
        },
    },


})