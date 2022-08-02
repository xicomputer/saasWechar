// pages/group_booking/detail/detail.js

let app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentBanner: 1, //当前banner下标
        showJoinPopup: false, //拼团弹窗显示状态
        showAllUser: false, //发起拼团用户的所有用户列表显示状态
        showSelSpecification: false, //选择规格弹窗显示状态
        showShare: false, // 分享弹窗显示状态
        showPoster: false, //海报图展示弹窗状态

        loginInfo: {}, //本地缓存用户信息
        userShipping: {}, //地址信息

        buyType: '', //购买类型 1单独购买  2开团
        buyCount: 1, //购买数量
        currentSku: {}, //当前所选规格
        activityInfo: {}, //活动信息
        isEnd: false, //活动结束标识
        skuList: [], //规格列表
        goodsSkuId: '', //商品规格id
        downTimes: '', //倒计时毫秒数
        downTimeObj: {}, //倒计时展示对象
        isCountDesabled: false, //禁止改变数量状态
        expectGroup: {}, //期望参与的团信息

        imgs: [{
                src: '',
                width: 508,
                height: 508,
                x: 20,
                y: 90
            },
            {
                src: '',
                width: 190,
                height: 190,
                x: 338,
                y: 618
            }
        ],
        rectInfo: [22, 756, 146, 52, 26, '#FFBB38'],
        texts: [{
                content: '商家名称商家名称',
                color: '#616161',
                size: 28,
                x: 162,
                y: 30
            },
            {
                content: '拼团价:',
                color: '#1577FF',
                size: 37,
                x: 24,
                y: 650
            },
            {
                content: '1759',
                color: '#1577FF',
                size: 50,
                x: 146,
                y: 645
            },
            {
                content: '3人拼团立省241',
                color: '#616161',
                size: 26,
                x: 24,
                y: 710
            },
            {
                content: '原价:2500',
                color: '#fff',
                size: 26,
                x: 95,
                y: 764,
                isDelLine: true,
                center: true
            },
            {
                content: '立即扫码参与拼团',
                color: '#616161',
                size: 18,
                x: 362,
                y: 816
            },
        ],
        testimgUrl: '', //生成的海报地址

        groupList: { //开团列表信息
            pageSize: 10,
            pageNum: 1,
            stopReq: false,
            list: []
        },
        userOpenGroup: [], //当前用户的开团

        reason: '', //理由

        testimgUrl: '', //海报图

        refresherStatus: true, //下拉刷新状态
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var scene = options.scene;
        app.globalEvent.$on('loginComplete', () => {
            if (scene) { //扫码进入
                this.getCodeParams(scene);
            } else {
                this.initData(options);
            }
        });
        app.globalEvent.$on('loginReject', () => {
            this.initData(options);
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.synthetic = this.selectComponent('.synthetic');
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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
    onPullDownRefresh: function () {
        this.getDetailInfo(); //获取详情数据
        this.getOpenGroupList(); //查询开团列表
        this.getUserOpenGroup(); //查询当前用户的开团信息
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        var activityId = this.activityId;
        var userId = this.data.loginInfo.userId;
        var groupInfo = this.data.userOpenGroup[0];
        var path = '';
        if (groupInfo) {
            var query = {
                groupInfo
            }
            query = JSON.stringify(query);
            query = encodeURIComponent(query);
            var path = '/pages/group_booking/join_detail/join_detail';
            path = path + '?activityId=' + activityId + '&shareUserId=' + userId;
            path += `&query=${query}`;
        } else {
            var path = '/pages/group_booking/detail/detail';
            path = path + '?activityId=' + activityId + '&shareUserId=' + userId;
        }

        return {
            title: this.data.loginInfo.nickName + '邀请你参与拼团活动',
            path,
            imageUrl: this.data.activityInfo.bannerImgUrls[0]
        }
    },

    /* 分享朋友圈 */
    onShareTimeline() {
        return {
            title: this.data.loginInfo.nickName + '邀请你参与拼团活动',
            imageUrl: this.data.activityInfo.bannerImgUrls[0]
        }
    },

    scrolltolower() { //scroll-view滚动到底部
        var groupList = this.data.groupList;
        if (!groupList.stopReq) {
            groupList.pageNum++;
            this.setData({
                groupList
            }, () => {
                this.getOpenGroupList();
            });
        }
    },

    refresherpulling() { //scroll-view下拉
        setTimeout(() => {
            this.setData({
                refresherStatus: false
            });
        }, 1000);

    },

    refresherrefresh() { //scroll-view下拉刷新触发
        var groupList = this.data.groupList;
        groupList.pageNum = 1;
        groupList.stopReq = false;
        this.setData({
            groupList
        }, () => {
            this.getOpenGroupList();
        });
    },

    getCodeParams(id) { //扫码进入该页面
        let data = {
            id
        }
        app.sjrequest('/marchant/queryIdentifica', data).then(res => {
            if (res.statusCode == 200 && res.data.code == 200) {
                var data = res.data.data;
                var scene = JSON.parse(data.scene);
                this.initData(scene);
            }
        });
    },

    initData(options) {
        var activityId = options.activityId;
        var shareUserId = options.shareUserId;
        activityId && (this.activityId = activityId);
        shareUserId && (this.shareUserId = shareUserId);

        wx.getStorage({
            key: 'zl_userInfo',
            success: res => {
                var data = res.data || {};
                var info = data.data.data || {};
                var userId = info.userId;
                var loginInfo = {
                    userId,
                    openId: info.setInfo.openId,
                    appId: info.setInfo.appId,
                    nickName: info.nickname,
                    marchantLogic: info.setInfo.headImage,
                    marchantName: info.setInfo.appName,
                    merchantId: info.setInfo.merchantId,
                    userPhone: info.phoneNumber,
                }
                this.codeInfo = data;
                this.setData({
                    loginInfo
                }, () => {
                    this.getOpenGroupList(); //查询开团列表
                    this.getUserOpenGroup(); //查询当前用户的开团信息
                });
                this.getCodeImg(); //获取小程序码图
            }
        });

        this.getDetailInfo(); //获取详情数据
    },

    getCodeImg() {
        var appid = this.data.loginInfo.appId;
        var activityId = this.activityId;
        var userId = this.data.loginInfo.userId;
        var groupInfo = this.data.userOpenGroup[0];
        var path = '';
        if (groupInfo) {
            var query = {
                groupInfo
            }
            query = JSON.stringify(query);
            query = encodeURIComponent(query);
            var path = '/pages/group_booking/join_detail/join_detail';
            path = path + '?activityId=' + activityId + '&shareUserId=' + userId;
            path += `&query=${query}`;
        } else {
            var path = '/pages/group_booking/detail/detail';
            path = path + '?activityId=' + activityId + '&shareUserId=' + userId;
        }

        app.sjrequest1('/activityBusiness/createQr', {
            page: path,
            appId: appid
        }).then(res => {
            if (res.statusCode == 200 && res.data.code === 0) {
                var imgs = this.data.imgs;
                var data = res.data.data;
                imgs[1].src = data;
                this.setData({
                    imgs
                });
            }
        })
    },

    _parseDate(str, resType) { //resType 取值 'object' | 'number'
        var a = str.split(/[^0-9]+/);
        var date = new Date(a[0], a[1] - 1, a[2], a[3] || 0, a[4] || 0, a[5] || 0);
        return resType == 'number' ? date.getTime() : date;
    },

    getDetailInfo() { //获取详情信息
        app.sjrequest1('/activityBusiness/activityDetail', {
            "activityId": this.activityId,
        }).then(res => {
            wx.stopPullDownRefresh();
            if (res.statusCode == 200 && res.data.code === 0) {
                var nowTime = new Date().getTime();
                var data = res.data.data;
                if (data.state == 1) {
                    var startTime = this._parseDate(data.startTime, 'number');
                    var diffTime = startTime - nowTime;
                } else {
                    var endTime = this._parseDate(data.endTime, 'number');
                    var diffTime = endTime - nowTime;
                    var isEnd = diffTime <= 0;
                    if (isEnd) {
                        this.activityEnd();
                    }
                }

                var currentSku = data.activityCommoditySkuList.find(item => item.isDefault == 1);
                currentSku || (currentSku = data.activityCommoditySkuList[0]);
                data.price = currentSku.price;
                data.lowPrice = currentSku.livePrice;
                data.soldCount = data.commodityTotalCount - data.residueCommodityTotalCount;

                var userShipping = data.userShipping || {};
                if (userShipping) {
                    var {
                        provincesName,
                        cityName,
                        areaName,
                        address
                    } = userShipping;
                    userShipping.fullAddress = provincesName + cityName + areaName + address;
                }

                data.orderTypeArr = data.orderTemplate.split(',');

                this.setData({
                    currentSku,
                    userShipping,
                    activityInfo: data,
                    skuList: data.activityCommoditySkuList,
                    goodsSkuId: currentSku.skuId,
                    downTimes: diffTime,
                });
                this.fillCanvasData(data); //填充绘制海报时所需数据
            }
        })
    },

    hideEndPopup() { //隐藏活动结束弹出层
        this.setData({
            isEnd: false
        });
    },

    activityEnd() { //显示活动结束弹出并返回首页
        var activityInfo = this.data.activityInfo;
        if (activityInfo.state == 1) { //活动未开始时的倒计时结束
            var nowTime = new Date().getTime();
            var endTime = this._parseDate(activityInfo.endTime, 'number');
            var diffTime = endTime - nowTime;
            activityInfo.state = 2;
            this.setData({
                downTimes: diffTime,
                activityInfo
            });
        } else {
            this.setData({
                isEnd: true
            });
            var activityShop = 'pages/shopHome/home/home';
            var pages = getCurrentPages();
            var len = pages.length;
            var delta = -1;
            var isHas = false;
            for (var i = (len - 1); i >= 0; i--) {
                var item = pages[i];
                delta++;
                if (item.route == activityShop) {
                    isHas = true;
                    break;
                }
            }
            setTimeout(() => {
                if (isHas) {
                    wx.navigateBack({
                        delta
                    });
                } else {
                    wx.redirectTo({
                        url: '/' + activityShop
                    });
                }
            }, 3000);
        }
    },

    fillCanvasData(data) {
        var imgs = this.data.imgs;
        var texts = this.data.texts;
        var skuItem1 = data.activityCommoditySkuList[0];
        imgs[0].src = data.bannerImgUrls[0]; //skuItem1.imageUrl;//商品图
        texts[0].content = this.data.loginInfo.marchantName; //商家名称
        texts[2].content = skuItem1.livePrice; //秒杀价
        var difference = skuItem1.price - skuItem1.livePrice;
        difference = Number(difference.toFixed(2));
        texts[3].content = data.groupOfNumber + '人拼团立省' + difference; //拼团人数
        texts[4].content = '原价:' + skuItem1.price; //原价

        this.setData({
            imgs,
            texts
        });
    },

    getUserOpenGroup() { //获取当前用户开团
        app.sjrequest1('/activityTTPTBusiness/groupListByActivityId', {
            "activityId": this.activityId,
            "merchantId": this.data.loginInfo.merchantId,
            "status": 1,
            "pageSize": 10,
            "currentPage": 1,
            userId: this.data.loginInfo.userId
        }).then(res => {
            if (res.statusCode == 200 && res.data.code === 0) {
                var data = res.data.data || {};
                var list = data.list || [];

                list.forEach(item => {
                    var nowTimes = new Date().getTime();
                    var endTimes = this._parseDate(item.endTime, 'number');
                    var diffTimes = endTimes - nowTimes;
                    item.diffTimes = diffTimes;
                    item.downTimeObj = {};
                });
                this.setData({
                    userOpenGroup: list
                });
            }
        })
    },

    getOpenGroupList() { //获取开团列表
        var groupList = this.data.groupList;
        app.sjrequest1('/activityTTPTBusiness/groupListByActivityId', {
            "activityId": this.activityId,
            "merchantId": this.data.loginInfo.merchantId,
            "status": 1,
            "pageSize": groupList.pageSize,
            "currentPage": groupList.pageNum
        }).then(res => {
            if (res.statusCode == 200 && res.data.code === 0) {
                var data = res.data.data || {};
                var list = data.list || [];
                groupList.stopReq = list.length !== groupList.pageSize;

                list.forEach(item => {
                    var nowTimes = new Date().getTime();
                    var endTimes = this._parseDate(item.overTime, 'number');
                    var diffTimes = endTimes - nowTimes;
                    item.diffTimes = diffTimes;
                    item.downTimeObj = {};
                });

                if (groupList.pageNum == 1) {
                    groupList.list = list;
                } else {
                    groupList.list.push(...list);
                }
            }
            this.setData({
                groupList
            });
        })
    },

    handleShareBtnClick() { // 分享弹窗
        this.setData({
            showShare: !this.data.showShare
        })
    },

    jumpJoinDetail() { //跳转参团详情页
        var activityId = this.activityId;
        var query = {
            groupInfo: this.data.expectGroup,
        }
        query = JSON.stringify(query);
        query = 'query=' + encodeURIComponent(query);
        wx.navigateTo({
            url: '/pages/group_booking/join_detail/join_detail?' + query + `&activityId=${activityId}`
        });
    },

    swiperChange(e) { //banner图改变时
        var current = e.detail.current;
        this.setData({
            currentBanner: current + 1
        });

        var videoUrl = this.data.activityInfo.videoUrl;
        if (videoUrl) {
            var videoContext = wx.createVideoContext('swiperVideo');
            if (current == 0) {
                // videoContext.play();
            } else {
                videoContext.pause();
            }
        }
    },

    viewAll() { //查看全部发起平团用户
        this.setData({
            showAllUser: true
        });
    },

    goJoin(e) { //点击去拼团
        var expectGroup = e.currentTarget.dataset.item;
        var endTime = this._parseDate(expectGroup.overTime, 'number');
        var nowTime = new Date().getTime();
        var diffTime = endTime - nowTime;
        expectGroup.diffTimes = diffTime;

        if (this.data.showAllUser) {
            this.setData({
                showJoinPopup: true,
                showAllUser: false,
                expectGroup
            });
        } else {
            this.setData({
                showJoinPopup: true,
                expectGroup
            });
        }
    },
    closePopup(e) { //关闭弹窗
        var attrname = e.currentTarget.dataset.attrname;
        this.setData({
            [attrname]: false
        });
    },

    jumpShop() {
        wx.navigateTo({
            url: '/pages/shopHome/home/home'
        });
    },

    jumpChat() {
        var {
            marchantLogic,
            marchantName,
            merchantId
        } = this.data.loginInfo;
        wx.navigateTo({
            url: `/pages/order/contact/contact?logoPic=${marchantLogic}&marchantId=${merchantId}&marchantName=${marchantName}`,
        });
    },

    jumpAddressList() { //跳转收货地址列表
        app.store.setState({
            from: 'submitOrder'
        });
        wx.navigateTo({
            url: '/pages/Address/AddressList/AddressList',
            events: {
                addressChange: (data) => {
                    var shipping = data.shipping;
                    shipping.fullAddress = this.joinAddress(shipping);
                    this.setData({
                        userShipping: shipping
                    });
                }
            }
        });
    },

    joinAddress(shipping) { //拼接收货地址
        var {
            provincesName,
            cityName,
            areaName,
            address
        } = shipping;
        return provincesName + cityName + areaName + address;
    },

    changeFun(e) { //倒计时改变
        var detail = e.detail;
        var index = e.currentTarget.dataset.index;
        var expectGroup = e.currentTarget.dataset.groupinfo;
        var groupList = this.data.groupList;

        for (var key in detail) {
            var value = detail[key];
            detail[key] = value < 10 ? ('0' + value) : value;
        }

        if (index != undefined) {
            groupList.list[index].downTimeObj = detail;
            this.setData({
                groupList
            });
        } else if (expectGroup) {
            expectGroup.downTimeObj = detail;
            this.setData({
                expectGroup
            });
        } else {
            this.setData({
                downTimeObj: detail
            });
        }
    },

    handleFlootBtn(e) {
        var type = e.currentTarget.dataset.type; //用于判断 拼团 还是 独购
        var activityInfo = this.data.activityInfo;
        if (activityInfo.state == 1) {
            wx.showToast({
                title: '活动还未开始',
                icon: 'none'
            });
        } else {
            this.setData({
                showSelSpecification: true,
                buyType: type
            });
        }
    },

    selSkuFun(e) { //选择规格
        var skuItem = e.currentTarget.dataset.skuitem;
        this.setData({
            goodsSkuId: skuItem.skuId,
            currentSku: skuItem
        });
    },

    textChange(e) { //输入理由
        var value = e.detail.value;
        this.setData({
            reason: value
        });
    },

    countChange(e) { //购买数量改变
        var buyCount = e.detail.value;
        var currentSku = this.data.currentSku;
        if (buyCount > currentSku.residueCommoditySkuCount) {
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

    minusCount() { //减数量
        if (this.data.isCountDesabled) {
            this.setData({
                isCountDesabled: false
            });
        }
    },

    jumpComfirmOrder() { //跳转确认订单页
        var activityInfo = this.data.activityInfo;
        var buyCount = this.data.buyCount;
        var skuInfo = this.data.currentSku;
        var userShipping = this.data.userShipping;
        var buyType = this.data.buyType; //购买类型 1单独购买 2开团
        var query = {
            skuInfo,
            buyCount,
            userShipping,
            buyType,
            goodsName: activityInfo.commodityName,
            activityId: this.activityId,
            commodityId: activityInfo.commodityId,
            shareUserId: this.shareUserId,
            orderType: activityInfo.orderTemplate
        };
        query = JSON.stringify(query);
        query = 'query=' + encodeURIComponent(query);

        this.setData({
            showSelSpecification: false
        });
        wx.navigateTo({
            url: '/pages/group_booking/confirm-order/confirm-order?' + query
        });
    },

    createPosters() { //创建海报
        this.setData({
            showShare: false,
            showPoster: true
        });
        var testimgUrl = this.data.testimgUrl;
        if (!testimgUrl) {
            this.synthetic.startSyntheticImg();
        }
    },

    closePosterPopup() { //关闭海报展示弹窗
        this.setData({
            showPoster: false
        });
    },

    getCompleteImg(event) { //获取生成的海报地址
        var {
            url
        } = event.detail;
        this.setData({
            testimgUrl: url
        });
    },

    savePoster() { //保存海报
        this.synthetic.saveImg();
    },

    getPhoneNumber(e) {
        var detail = e.detail;
        var {
            appId,
            openId
        } = this.data.loginInfo;
        if (detail.iv) {
            var {
                iv,
                encryptedData
            } = detail;
            app.sjrequest('/thirdWxLogin/deciphering', {
                appid: appId,
                openid: openId,
                iv,
                encryptedData
            }).then(res => {
                if (res.statusCode == 200 && res.data.code == 200) {
                    var codeInfo = this.codeInfo;
                    var phone = res.data.data.phoneNumber;
                    var loginInfo = this.data.loginInfo;
                    loginInfo.userPhone = phone;
                    this.setData({
                        loginInfo
                    });
                    if (codeInfo && codeInfo.data && codeInfo.data.data) {
                        var resData = codeInfo.data.data;
                        resData.phoneNumber = phone;
                        wx.setStorage({
                            key: 'zl_userInfo',
                            data: resData
                        });
                    }
                }
            })
        }
    },

})