// pages/shopHome/components/category-pages/category-pages.js


var app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentList: Array,
    tempId:{
        type:[String,Number],
        value:1
    },
    shopList: {
        type: Array,
        value: []
    },
    hotelList: {
        type: Array,
        value: []
    },
    activityInfo:{
        type:Object
    },



    marchantId: {
      type: String,
      value: ''
    },
    mainOrderType: { //主推业务 1物流 2同城 3预订 , 判断当前是商户是哪个经营模式
      type: String,
      value: ''
    },
    addcouponList: { // 优惠券的张数
      type: Array,
      value: ''
    },

  },
  /* 组件生命周期 */
  lifetimes: {
    attached() {}
  },
  /**
   * 组件的初始数据
   */
  data: {
    goodsData: {}, //同城、预定分类商品信息
    navList: [], //同城、预定分类列表
    btnTitle: '',
    orderTemplate: '', //订单模板 1.物流 2.同城 3.预订
    classItem: '',
    pageSize: 10000,
    goodsList: [], // 存放所有分类下的所有商品
    currentLeft: 0, //左侧选中的下标
    selectId: "item0", //当前显示的元素id
    scrollTop: 0, //到顶部的距离
    distance: 0,
    hieghtArr: [], // 存储每个rig-height节点的高度

    showBuyPopup: false, // 控制弹窗关闭和显示
    skuList: [], //规格列表
    nowSku: {}, //选中的规格
    goodsData: {}, //同城、预定分类商品信息
    goodsItem: {}, //正在操作的商品信息
    buyCount: 1, //购买数量
    isCountDesabled: false,
    DefaultSpec: {}, // 商品默认信息 
    showSpec: false, // 控制添加到购物车的商品通知
    commodityCouponsList:[],//门店优惠券列表
    switchGoodsList: [],  //存储切换的商品用于渲染
    
    
  },
  // 监听数据变化
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
        this.setData({
          orderTemplate: nowVal,
          btnTitle
        }, () => {
          this.getClassifyNavList();
          // 获取门店优惠券用于显示有券领取的icon
          app.sjrequest('/coupons/queryCouponsGet',{marchantId:wx.getStorageSync('merchantId')}).then(res=>{
            if(res.data.code == 200) {
              this.setData({
                commodityCouponsList: res.data.data 
              })
            }
          })
        });
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goSaleShop(e){
      let url = e.currentTarget.dataset.url
      let marchantId = wx.getStorageSync('merchantId')
      wx.navigateTo({
          url: url,
      })
  },
  
  //获得活动列表
  getActiveList(){
      const data={'marchantId':this.properties.marchantId,'sourceType':'applet'}
      app.sjrequest('/activity/queryActivityList',data).then(res =>{
          console.log('活动列表：====',res);
      })
  },



    addCart() {
      console.log(this.data.nowSku, 'DefaultSpec')
      if (this.data.nowSku.stock == 0) {
        wx.showToast({
          title: '暂无库存',
          icon: 'none',
          duration: 2000
        })
        this.setData({
          showSpec: false
        })
        return
      }
      var data = {
        'tempSpecId': this.data.nowSku.id,
        'commodityId': this.data.nowSku.commodityId,
        'amount': this.data.buyCount, // 购买数量
        'marchantId': this.data.marchantId,
        'operate': 1
      }
      app.sjrequest('/commodity/addTrolley', data).then(res => {
        if (res.data.code == 200) {
          wx.showToast({
            title: '添加成功',
            icon: 'success'
          })
          let ids = wx.getStorageSync('merchantId')
          app.sjrequest('/commodity/countTrolley', {
            marchantId: ids
          }).then(res => {
            this.setData({
              showSpec: false,
              buyCount: 1
            })
          })
        }
      })
    },
    // 立即购买
    buyNow() {
      var nowSku = this.data.nowSku;
      var orderTemplate = this.data.orderTemplate;
      var marchantId = this.properties.marchantId;
      var buyCount = this.data.buyCount; // 选中的数量
      console.log(nowSku, orderTemplate, buyCount)
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
    querySkuList(goodsItem) { //查询规格列表
      var {
        marchantId
      } = this.properties;
      app.sjrequest('/commodity/queryCommoSku', {
        marchantId,
        commodityId: goodsItem.commodityId
      }).then(res => {
        console.log(res, '规格')
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
    openBuyPopup(e) { //打开购买弹窗
      var goodsItem = e.currentTarget.dataset.goodinfo;
      console.log(goodsItem, '打开购买弹窗')
      this.querySkuList(goodsItem);
    },
    closeBuyPopup() { //关闭购买弹窗
      this.setData({
        showBuyPopup: false
      });
    },

    toGoodsDetails(e) {
      var id = e.currentTarget.dataset.id; // 商品ID
      var mainOrderType = this.properties.mainOrderType; // 商家经营模式
      var url = '/pages/Index/GoodsDetails/GoodsDetails?id=' + id
      if (mainOrderType == 2 || mainOrderType == 3) {
        mainOrderType == 2 && (url += `&city=1`); //同城
        mainOrderType == 3 && (url += `&reserve=1`); //预订
      }
      wx.navigateTo({
        url
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
          console.log('分类列表', this.data.navList)
        }
      })
    },


    switchGoods(e) {
      let index = e.currentTarget.dataset.pos
      let goodsList = this.data.goodsList[index]
      this.setData({
        switchGoodsList: goodsList,
        currentLeft: e.currentTarget.dataset.pos,
      })
      console.log(this.data.switchGoodsList, '切换的商品')
    },

    //选择项目左侧点击事件 currentLeft：控制左侧选中样式  selectId：设置右侧应显示在顶部的id
    proItemTap(e) {
      this.setData({
        currentLeft: e.currentTarget.dataset.pos,
        selectId: "item" + e.currentTarget.dataset.pos
      })
    },

    // 计算右侧每一个分类的高度，在数据请求成功后请求即可
    selectHeight() {
      let heightArr = [];
      let h = 0;
      const query = this.createSelectorQuery();
      query.in(this).selectAll('.rig-height').boundingClientRect((res) => {})
      query.exec((res) => {
        res[0].forEach((item) => {
          h += item.height;
          heightArr.push(h);
          this.setData({
            heightArr
          })
        })
      })
    },

    //监听scroll-view的滚动事件
    scrollEvent(event) {
      if (this.data.heightArr.length == 0) {
        return;
      }
      let scrollTop = event.detail.scrollTop;
      let current = this.data.currentLeft; //当前选中下标
      if (scrollTop >= this.data.distance) { //页面向上滑动
        //如果右侧当前可视区域最底部到顶部的距离 超过 当前列表选中项距顶部的高度（且没有下标越界），则更新左侧选中项
        if (current + 1 < this.data.heightArr.length && scrollTop >= this.data.heightArr[current]) {
          this.setData({
            currentLeft: current + 1
          })
        }
      } else { //页面向下滑动
        //如果右侧当前可视区域最顶部到顶部的距离 小于 当前列表选中的项距顶部的高度，则更新左侧选中项
        if (current - 1 >= 0 && scrollTop < this.data.heightArr[current - 1]) {
          this.setData({
            currentLeft: current - 1
          })
        }
      }
      //更新到顶部的距离
      this.setData({
        distance: scrollTop
      })
    },

    async getProductList() { //查询 预订与同城 商品 , 右边查出所有商品，查出的商品排序和左边的tab栏顺序保持一致
      var {
        marchantId,
        mainOrderType
      } = this.properties;
      var pageSize = this.data.pageSize;
      var classifyId = this.data.classItem.id;
      let classifyIdArr = this.data.navList
      // 每个商品分类ID都发一次请求，然后合并到一个数组
      let goodsList = [] // 存所有商品信息
      for (let item of classifyIdArr) {
        try {
          let res = await app.sjrequest('/commodity/queryCommodityList', {
            marchantId,
            classifyId: item.id, // 每个商品分类ID
            pageSize, // 一次返回多少条数据
          })
          if (res.statusCode == 200 && res.data.code == 200) {
            let list = res.data.data || [];
            this.handlerOrderTemplate(list) // 处理orderTemplate 字段
            goodsList.push(list)
          } else {
            throw '状态码错误'
          }
          this.setData({
            goodsList
          })
        } catch (error) {
          console.log(error)
        }
      }
      console.log(goodsList, 'goodsList')
      wx.nextTick(() => {
        this.selectHeight()
        this.setData({
          switchGoodsList: this.data.goodsList[0]
        })
      })
    },
    handlerOrderTemplate(list) { // 处理orderTemplate数据
      for (let item of list) {
        item.orderTemplate = item.orderTemplate.split(',')
        for (let key in item.orderTemplate) {
          if (item.orderTemplate[key] == '1') {
            item.orderTemplate[key] = '物流'
          }
          if (item.orderTemplate[key] == '2') {
            item.orderTemplate[key] = '同城'
          }
          if (item.orderTemplate[key] == '3') {
            item.orderTemplate[key] = '自提'
          }
        }
      }
      return list
    },
    // 添加购物车

  }
})