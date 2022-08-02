const app = getApp()
const time = require('../../../utils/util')
Page({
    useStore: true,
    data: {
        name: '',
        userInfo: {},
        isLoad: false,
        userInfoSj: {},
        storeId: '',
        storeData: {}, //小店的参数
        goodsList: '',
        selectGoods:{}, // 选中的商品
        userList:[1,2,3],
        toBottom:false, // 小店商品是否触底
        pageCurr:1,
        pageSize:10,
    },
    onLoad: function (options) {
        const storeId = wx.getStorageSync('storeId')
        this.setData({
            storeId: storeId || 'storeId is undefiner'
        })
        this.getMyInfo()
        this.getScartData()
    },
    getMyInfo() {
    },
    getScartData() {
    },
    // 倒计时结束
    finishedCountDown(e){
        let idx = e.currentTarget.dataset.idx
        this.data.goodsList[idx].ishide = true
        this.setData({
            goodsList:this.data.goodsList
        })
    },
    // 关闭管理
    closeManage(){
        this.data.goodsList.forEach(item=>{
            item.showManage = false
        })
        this.setData({
            goodsList:this.data.goodsList
        })
    },
    // 小店 设置抢购
    setActivity(){
        var item = this.data.selectGoods
        wx.navigateTo({
          url: `/pages/smallShop/setSale/setSale?id=${item.id}&goodsImg=${item.imagList[0]}&originalPrice=${item.originalPrice}&lowPrice=${item.lowPrice}&commodityName=${item.commodityName}&isPromotion=${item.isPromotion}`,
        })
        this.closeManage()
    },
    // 设为热销
    setHot(){
        
    },
    // 小店 删除商品
    delScart() {
        
    },
    goSmallIndex(){
        wx.redirectTo({
            url: '/pages/smallShop/exclusive/exclusive',
        })
    },
    goodsTobottom(){
        if(!this.data.toBottom){
          this.getScartData()
        }
    },
    
    share() {
        // let storeId =  wx.getStorageSync('storeId');
        // wx.navigateToMiniProgram({
        //     appId:'wx132b20834f422e55',
        //     path:'/pages/smallShop/myShop/myShop?storeId='+storeId,
        // });
        return;

        var that = this
        wx.requestSubscribeMessage({
            tmplIds: [app.globalData.fx_sale,app.globalData.fx_order_sale_refund,app.globalData.fx_order_sale],
            complete:function(res){
                let cout = that.data.goodsList
                if (cout.length == 0) {
                    wx.showToast({
                        title: '请进入首页，添加商品！',
                        icon: 'none', duration: 1000
                    });
                } else {
                    wx.navigateTo({
                        url: '../../retail/PosterScart/PosterScart?share="share"'
                    })
                }
            }
        })

    },
    shareScart(e){
        let that = this
        let data = e.currentTarget.dataset.source
        let cdata =  this.data
        let salesUserId = cdata.userInfoSj.salesUserId
        let saleUniqueId = data.saleUniqueId
        let commodityid = data.commodityId
        let tempskuid = data.tempSpecId
        let storeId  = wx.getStorageSync('storeId')
        wx.requestSubscribeMessage({
            tmplIds: [app.globalData.fx_sale,app.globalData.fx_order_sale_refund,app.globalData.fx_order_sale],
            complete:function(res){
                wx.navigateTo({
                    url: `../../retail/Poster/Poster?commodityId=${commodityid}&tempSkuId=${tempskuid}&storeId=${storeId}&salesUserId=${salesUserId}&saleUniqueId=${saleUniqueId}`
                })
            }
        })
    },
    showManagement(e){
        let item = e.currentTarget.dataset.source
        this.data.goodsList.forEach(res=>{
            if(res.id == item.id) {
                res.showManage = !res.showManage
            }else{
                res.showManage = false
            }
        })
        this.setData({
            goodsList:this.data.goodsList,
            selectGoods:item
        })
    },
    refrenshHotSale(){  // 刷新商品
        wx.showLoading({
          title: '刷新中',
        })
        if (this._freshing) return
        this._freshing = true
        setTimeout(async () => {
            this.setData({
                pageCurr: 1,
                toBottom:false,
                goodsList:[],
                isLoad:false
            })
          await this.getScartData()
          wx.showToast({
            title: '刷新成功',
            icon:'none'
          })
          this._freshing = false
        }, 1000)
      }, 

    onPullDownRefresh: function () {
       this.setData({
        name: '',
        userInfo: {},
        userInfoSj: {},
        storeId: '',
        storeData: {}, //小店的参数
        goodsList: '',
        userList:[1,2,3],
        toBottom:false, // 小店商品是否触底
        pageCurr:1,
        pageSize:10,
       })
       this.onLoad()
    },
})