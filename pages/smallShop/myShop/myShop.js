const app = getApp()
const time = require("../../../utils/util")
Page({
    data: {
        navs: [
            {
              name: '购物车',
              src: '/pages/img/my/menu-gwc.png',
              url: '/pages/Index/ShopCart/ShopCart',
              inAnimation:'menu-in-animation1',
              outAnimation:'menu-out-animation1',
              bottom: '380rpx',
              right: '20rpx'
            },
            {
              name: '我的',
              src: '/pages/img/my/menu-wd.png',
              url: '/pages/tabPage/me/me',
              bottom: '240rpx',
              right: '140rpx',
              inAnimation:'menu-in-animation2',
              outAnimation:'menu-out-animation2',
            },
            // {
            //   name: '订阅通知',
            //   src: '/pages/img/my/menu-sq.png',
            //   url: '/pages/smallShop/releaseDynamic/releaseDynamic',
            //   bottom: '180rpx',
            //   right: '140rpx',
            //   inAnimation:'menu-in-animation2',
            //   outAnimation:'menu-out-animation2',
            // },
            {
              name: '返回',
              src: '/pages/img/my/menu-fh.png',
              url: 'top',
              bottom: '120rpx',
              right: '20rpx',
              inAnimation:'menu-in-animation3',
              outAnimation:'menu-out-animation3',
            }
          ],
          // 小店数据
          storeData: {}, //小店的参数
          goodsList:[], // 商品列表
          headimgurlList:[], // 购买的人
          idx: 0, // 当前滚动的索引
          isFavorite: false, //是否收藏
          buton:false, // 是否登录
          cartNum:0, // 购物车数量
          storeId:0, // 小店id
          animation:'', // 点赞动画抖动
          salesUserId: 0, // 分销人员id
          animation1:'', // 点赞动画
          animation2:'', // 上漂动画
          isStart: false, //是否开始动画
          userList:[1,2,3],
          toBottom:false, // 小店商品是否触底
          goodsCur:1,  // 小店商品页数
          // 热卖
          hotSaleList:[],
          stopSaleLoading:false,
          saleCurr: 1,
          // 订阅通知的数据
          tabActive: 0, // tabBar
          fileList: [],
          stopLoading:false,
          dynamicList:[],
          pageCurr:1,
          pageSize:10,
          top: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:async function(options) {
      wx.hideHomeButton({})
      app.userLogin().then(async (res)=>{
        app.globalData.options = options
        if(options.scene){ //小程序码
          const scene = decodeURIComponent(options.scene)
          await this.getCodeParams(scene)
        }
        else{  // 正常流程
          
          this.setData({
            storeId:options.storeId?options.storeId:res.setInfo.merchantId,
            // ['navs[2].url']: '/pages/smallShop/releaseDynamic/releaseDynamic?storeId=' + options.storeId
          })
        }
        var that = this
        //查看是否授权
        wx.getSetting({
          success:  function (res) {
            if (wx.getStorageSync('wx_userinfo_key')) {
              // 已授权
              that.setData({
                buton:false
              })
            } else {
              //用户没有授权
              that.setData({
                buton:true
              })
            }
          }
        })
        await that.getParams()
        if(that.data.headimgurlList.length&&!that.data.isStart){
          that.setData({
            isStart:true
          })
          setTimeout(res=>{that.animationStill()},1000) 
        }
        wx.setNavigationBarTitle({
          title: that.data.storeData.nickName+'的小店',
        })
        wx.setStorageSync('scartHaipao',that.data.storeData)
      })
    },
    
    
  //是否从小程序码进来
    getCodeParams(id){
      let data = {id : id} 
      let that = this
      return app.sjrequest('/marchant/queryIdentifica',data).then(res=>{
        if(res.data.code == 200) {
          that.setData({
            storeId: JSON.parse(res.data.data.scene).storeId,
            //  +  JSON.parse(res.data.data.scene).storeId
            ['navs[2].url']: '/pages/smallShop/releaseDynamic/releaseDynamic?storeId='+JSON.parse(res.data.data.scene).storeId
          })
        }else{
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          })
        }
      })
    },
    //获取页面参数
    getParams(){
      wx.showLoading({
        title: '加载中',
      })
      let that = this
      let data = {storeId:this.data.storeId,pageCurr:this.data.goodsCur,pageSize:10}
      const res = app.sjrequest('/sales/querySalesMarchantList',data).then(res=>{
        if(res.data.code == 200) {
          wx.hideLoading()
          res.data.data.commodityList.forEach(item=>{ // 处理倒计时数据
              if(item.countdown){
                  let time1 = time.formatTimeSec(item.countdown)
                  item.countdown = new Date(time1.replace(/-/g, '/')).getTime() - new Date().getTime()
                  console.log(item.countdown)
              }
          })
          if(that.data.goodsCur == 1){
            this.setData({
              storeData:res.data.data.salesStore,
              goodsList:res.data.data.commodityList,
              userList:res.data.data.userList,
              headimgurlList:res.data.data.headimgurlList,
              salesUserId:res.data.data.salesStore.salesUserId,
              isFavorite:res.data.data.isFavorite==0?false:true,
              goodsCur:that.data.goodsCur + 1
            })
          }else{
            this.setData({
              goodsList:that.data.goodsList.concat(res.data.data.commodityList),
              goodsCur:that.data.goodsCur + 1
            })
            console.log(that.data.goodsList)
          }
          if(res.data.data.commodityList.length<10){
            that.setData({
              toBottom:true
            })
          }
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      })
      return res
    },
    //点赞动画
  favoriteAnimation(){
    var animation = wx.createAnimation({
      duration: 100, // 动画持续时间，单位 ms
      timingFunction: 'linear', // 动画的效果
      delay: 10, // 动画延迟时间，单位 ms
      transformOrigin: '50% 50%' // 动画的中心点
    })
    animation.rotate(-10).step();
    animation.rotate(0).step();
    animation.rotate(10).step();
    animation.rotate(0).step();
    var animation1 = wx.createAnimation({
      duration: 3000, // 动画持续时间，单位 ms
      timingFunction: 'linear', // 动画的效果
      delay: 10, // 动画延迟时间，单位 ms
      transformOrigin: '50% 50%' // 动画的中心点
    })
    animation1.opacity(1).step({duration:10});
    animation1.opacity(0.5).translate(10,-20).step({duration:500});
    animation1.opacity(0.5).translate(10,-20).step({duration:500});
    animation1.opacity(0).translate(0,0).step({duration:0});
    this.setData({
      animation: animation.export(),
      animation1: animation1.export()
    });
  },
    // 点赞
  operaFavoritePraise(){
    let that = this
    let data = {
      type:1,
      storeId: that.data.storeData.id
    }
    const res =  app.sjrequest('/sales/operaFavoritePraise',data).then(res=>{
      if(res.data.code == 200) {
        wx.vibrateShort()
        // that.favoriteAnimation()
        that.data.storeData.praise += 1
        this.setData({
          storeData: that.data.storeData,
        })
       
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
    return res
  },
  //购买过的动画
  animationStill(){

    let that = this
    var animation2 = wx.createAnimation({
        duration: 3000, // 动画持续时间，单位 ms
        timingFunction: 'ease-out', // 动画的效果
        delay: 100, // 动画延迟时间，单位 ms
        transformOrigin: '50% 50%' // 动画的中心点
      })
      animation2.opacity(1).step({duration:100});
      animation2.opacity(0.99).translateY(-150).step({duration:2000});
      animation2.opacity(0.99).translateY(-150).step({duration:2000});
      animation2.opacity(0).translateY(0).step({duration:0});
      this.setData({
        animation2: animation2.export()
      });
      setTimeout(function() {
        if(that.data.idx<that.data.headimgurlList.length-1){
          that.setData({
            idx:that.data.idx+1
          })
        }else{
          that.setData({
            idx:0
          })
        }
        this.animationStill()  //官方写法就这样.暂时没有找到相关api.
      }.bind(this), 3000)
  },
  // 点击收藏
  operaFavorite(){
    var that = this
    if(this.data.isFavorite){
      wx.showModal({
        title: '取消收藏',
        content: '确定要取消收藏吗？',
        showCancel: true,//是否显示取消按钮
        cancelText:"我再想想",//默认是“取消”
        cancelColor:'#576b95',//取消文字的颜色
        confirmText:"残忍取消",//默认是“确定”
        confirmColor: '#ccc',//确定文字的颜色
        success: function (res) {
           if (res.cancel) {
              //点击取消,默认隐藏弹框
              return
           } else {
            that.favoriteStore()
           }
        }
     })
    }else{
      that.favoriteStore()
    }
  },
  // 取消/收藏店铺
  favoriteStore(){
    let that = this
    let data = {type:2,storeId: that.data.storeData.id}
    const res =  app.sjrequest('/sales/operaFavoritePraise',data).then(res=>{
      if(res.data.code == 200) {
        that.setData({
          isFavorite:!that.data.isFavorite
        })
        if(that.data.isFavorite){
          wx.showToast({
            title: '已收藏小店',
            icon: 'none'
          })
        }else{
          wx.showToast({
            title: '已取消收藏',
            icon: 'none'
          })
        }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
    return res
  },
  //获得购物车数量
  getCartNum(){
    // var data={marchantId:this.data.marchantId}
    const res = app.sjrequest('/commodity/countTrolley').then(res =>{
      if(res.data.code==200){
        var countTrolley = res.data.data.countTrolley
        this.setData({cartNum:countTrolley})
      }
    })
    return res
  },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
            
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
      this.getCartNum()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },
    //  热卖
    getHotSaleList(){ // 获取热卖列表
      const that = this
      let data = {storeId:this.data.storeId,pageCurr:this.data.saleCurr,pageSize:10}
      return app.sjrequest('/sales/queryHotCommodityList',data).then(res=>{
        if(res.data.code == 200){
          wx.hideLoading()
          that.setData({
            hotSaleList:that.data.hotSaleList.concat(res.data.data)
          })
          if(res.data.data.length<that.data.saleCurr){
            that.setData({
              stopSaleLoading:true
            })
          }
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      })
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
      app.globalData.options = {}
    },
    // 订阅通知
    changeTabbar(e){
      this.setData({ tabActive: e.detail });
      if(e.detail == 1&&this.data.hotSaleList.length == 0) {
        wx.showLoading({
          title: '加载中',
        })
        this.getHotSaleList()
      }
      if(e.detail == 2&&this.data.dynamicList.length == 0) {
        wx.showLoading({
          title: '加载中',
        })
        this.getDynamicList()
      }
    },
    // 获取订阅通知列表
    getDynamicList(){
      const that = this
      let data = {storeId:this.data.storeId,pageCurr:this.data.pageCurr,pageSize:this.data.pageSize}
      return app.sjrequest('/sales/queryAllComment',data).then(res=>{
        if(res.data.code == 200){
          wx.hideLoading()
          var list = res.data.data
          for(var i in list){
            list[i].addTime=time.formatTime(list[i].addTime)
            var contentString = ''
            var contentList = JSON.stringify(list[i].content)
            contentList = contentList.slice(1,contentList.length-1)
            contentList = contentList.split('\\n')
            contentList.forEach(item => {
                contentString = contentString + item+'<br />'
            });
            list[i].content = contentString
          }
          that.setData({
            dynamicList:that.data.dynamicList.concat(list)
          })
          if(list.length<that.data.pageSize){
            that.setData({
              stopLoading:true
            })
          }
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      })
    },
    // 倒计时结束
    finishedCountDown(e){
        let idx = e.currentTarget.dataset.idx
        this.data.goodsList[idx].ishide = true
        this.setData({
            goodsList:this.data.goodsList
        })
    },
    // 重新获取订阅通知列表
    reGetList(){
      this.setData({
        pageCurr:1,
        dynamicList:[],
        stopLoading:false
      })
      return this.getDynamicList()
    },
    // 重新获取热销列表
    reGetSaleList(){
      this.setData({
        hotSaleList:[],
          stopSaleLoading:false,
          saleCurr: 1,
      })
      return this.getHotSaleList()
    },
    // 点赞
  liketap(e){
    var id=e.currentTarget.dataset['id']
    var index=e.currentTarget.dataset['index']
    var data={'commentId':id}
    app.sjrequest('/sales/operationPraise',data).then(res =>{
      if(res.data.code == 200) {
        var list=this.data.dynamicList
        list[index].isPraise=!list[index].isPraise
        if (list[index].isPraise) {
          list[index].praise += 1;
        } else {
          list[index].praise -= 1;
        }
        this.setData({dynamicList:list})
      }
    })
  },
    /**图片预览 */
    imgClick(e){
      var src = e.currentTarget.dataset.src
      var imgList = e.currentTarget.dataset.list
      wx.previewImage({
        current: src,
        urls: imgList
      })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },
    toTop(){
      console.log(this.data.top)
      this.setData({
        top:0
      })
    },
    refrenshDynamic(){ // 刷新动态 
      wx.showLoading({
        title: '刷新中',
      })
      if (this._freshing) return
      this._freshing = true
      setTimeout(async () => {
        await this.reGetList()
        wx.showToast({
          title: '刷新成功',
          icon:'none'
        })
        this._freshing = false
      }, 1000)
    },
    refrenshHotSale(){  // 刷新热销
      wx.showLoading({
        title: '刷新中',
      })
      if (this._freshing) return
      this._freshing = true
      setTimeout(async () => {
        await this.reGetSaleList()
        wx.showToast({
          title: '刷新成功',
          icon:'none'
        })
        this._freshing = false
      }, 1000)
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
      
    },
    goodsTobottom(){ // 商品触底事件
      if(!this.data.toBottom){
        this.getParams()
      }
    },
    dynamicTobottom(){ // 动态触底事件
      if(!this.data.stopLoading){
        this.setData({
          pageCurr:this.data.pageCurr+1
        })
        this.getDynamicList()
      }
    },
    hotSaleTobottom(){  // 热销触底事件
      if(!this.data.stopSaleLoading){
        this.setData({
          saleCurr:this.data.saleCurr+1
        })
        this.getHotSaleList()
      }
    },
    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    return {
      title: this.data.storeData.nickName+'的小店',
      path: "/pages/smallShop/myShop/myShop?storeId=" + this.data.storeId,
      imageUrl:''
    }
  },
  onShareTimeline: function () {
		return {
	      title: this.data.storeData.nickName+'的小店',
	      query: `storeId=${this.data.storeId}`,
	      imageUrl: ''
	    }
	}
})