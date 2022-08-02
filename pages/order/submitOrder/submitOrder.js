// pages/order/submitOrder/submitOrder.js
const time = require("../../../utils/util")
const app = getApp()
Page({
  useStore: true,
  /**
   * 页面的初始数据
   */
  data: {
    showTel: false, // 手机
    showSale: false, //优惠
    submitObj: '',
    active: 0,
    personnel: 0,
    agentUserId:'',
    haveToStore:false, // 有门店团购
    haveLogistics: false, // 有物流配送
    haveToCity:false,     // 有同城配送
    salesUserId:0,
    arrivalsTime: '选择时间', // 到店时间
    contacts: '', // 联系人
    contactWay: '', // 手机号
    message: '', // 留言,
    selectedSaleText: '未使用优惠券',
    couponsId: 0, //优惠id
    optionsList:{},
    show: false,
    minDate: new Date(2010, 0, 1).getTime(),
    maxDate: new Date(2010, 0, 31).getTime(),
    orderType: 1,   // 1 物流配送  2同城配送  3门店团购
    columnsTake: [],
    timeTake: '',
    multiArray: [
      [''],
      ['']
    ],
    multiIndex: [0, 0, 0],
    todayList:[],
    normalList:[],
    date: '',
    index: 0,
    showTime: 'block',
    showTimeText: 'none',
    businessModelTake: false,  //  tab是否显示
    iphoneValue: null,
    openingTime:'',
    multiArrayNow:'',
    addressList:[], // 自取收货地址列表
    showAddressList: false,
    selectedAress:{}, // 选中的地址,
    AddresInfo:{},
    storeId:0,
    cartShop:{},
    nocityFlag:false,
    deduct:0
  },
  TimeID:-1,
  TimeShow:false,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({cartShop:{...app.globalData.setInfo}})
    this.setData({optionsList:options})
    
    let userInfo = wx.getStorageSync('zl_userInfo');
    this.setData({
      storeId:options.storeId,
      orderType:options.orderType?options.orderType:"1"
    });
    let phone = userInfo.data.data.phoneNumber
    
    if(phone == undefined){
      this.setData({ showTel:true });
    }
    this.setData({
      personnel: options.personnel,
      agentUserId:options.agentUserId,
      salesUserId: options.salesUserId
    });

    let { submitObj } = app.store.getState()
    if (submitObj) {
      submitObj = JSON.parse(submitObj)
      if(submitObj.shipping == null){
        let that= this
        // wx.chooseAddress({
        //   success (res) {
        //     let data = {address:res.detailInfo,contacts:res.userName,contactWay:res.telNumber,provincesName:res.provinceName,cityName:res.cityName,areaId:res.postalCode,areaName:res.countyName,isDefault:1
        //     }
        //     wx.showLoading({ title: '保存中', mask: true });
        //     app.sjrequest('/commodity/addShipping',data).then(res=>{
        //       let shiping={...data,id:res.data.data.id}
        //       submitObj.shipping = shiping
        //       that.setData({ submitObj:submitObj })
        //       wx.hideLoading()
        //     })
        //   }
        // })
      }
      if(submitObj.phoneNumber){
        this.setData({
          iphoneValue:submitObj.phoneNumber
        })
      }
      submitObj.businessModel.sort()
      if(submitObj.businessModel.length>1){ // 有tabbar栏
        this.setData({
          businessModelTake: true,
          // orderType:submitObj.businessModel[0]
        })
      }else{
        this.setData({
          // orderType:submitObj.businessModel[0]
        })
      }
      if(submitObj.businessModel.indexOf('3') != -1){  // 门店团购 
        this.setData({
          haveToStore:true,
          addressList:submitObj.mustaddressList,
          selectedAress:submitObj.mustaddressList ? submitObj.mustaddressList[0]:'',
        })
      }
      if(submitObj.businessModel.indexOf('1') != -1){  // 物流配送
        this.setData({ haveLogistics:true });
      }
      if(submitObj.businessModel.indexOf('2') != -1){  // 同城配送
        this.setData({ haveToCity:true });
      }

      if (submitObj.unusableCouponsList.length) {
        submitObj.unusableCouponsList.forEach(item => {
          item.endTime = time.formatTimeSec(item.endTime)
        })
      }
      if (submitObj.usableCouponsList.length) {
        submitObj.usableCouponsList.forEach(item => {
          item.endTime = time.formatTimeSec(item.endTime)
        })
      }
      let data = this.data.multiArray

      let cstart =submitObj.openingTime? parseInt(submitObj.openingTime.substr(0, 2)):'08';
      let cend =submitObj.closingTime? parseInt(submitObj.closingTime.substr(0, 2)) :'20';
      let cstart2 = app.formatTime(new Date(),'小时')-1+2;
      console.log(cstart,cend,cstart2)
      data[1]=this.get7day('小时', { // 选择时间在开店时间和关店时间内
        start: cstart,
        end: cend-0||24
      })
      console.log(data,data[1])
      this.setData({
        normalList:data[1]
      })
      if(cstart2<cstart){ // 现在时间小于开店时间
        data[0] = this.get7day(1)
       this.TimeShow = true
      }else if(cstart2<cend){ // 现在时间在营业时间
        data[0] = this.get7day(1)
        data[1]=this.get7day('小时', {
          start: cstart2||8,
          end: cend-0||24
        })
      }else if (cstart2>=cend){ // 现在时间大于关店时间
        data[0] = this.get7day(1)
        data[0].shift()
      }

      //data[2] = this.get7day('分')
      this.setData({
        todayList:data[1],
        multiArray: data,
        multiArrayNow: JSON.stringify(data),
        submitObj,
        openingTime:cstart
      })
      //console.log(this.data.submitObj)
      // 1 配送消费 2 店内消费 3 预定
      let title = '填写订单'
      wx.setNavigationBarTitle({ title: title });
    }
    if (submitObj.usableCouponsList.length) {
      let res = submitObj.usableCouponsList.sort((a, b) => {
         return b.deduct-a.deduct })
      this.setData({
        selectedSaleText:res[0].couponName,
        couponsId: res[0].id,
        deduct:res[0].deduct
      })
      this.changeNum(res[0].id)
    }
  },

  addCopy() {
    let address = this.data.selectedAress.address
    wx.setClipboardData({
      data: address,
      success(res) {
        wx.getClipboardData({
          success(resc) {
            console.log(resc.data) // data
          }
        });
      }
    })
  },

  get7day(t, obj) {
    if (t == '小时') {
      let { start,end } = obj;
      let time = []
      end = end || 24
      start = start || 0
      for (let i = start; i <= end; i++) {
        let s = i
        if (i == 24) { s = 0 }
        if (i < 10 && i != 0) {
          s = '0' + i
        }
        time.push("" + s)
      }
      return time
    }
    if (t == '分') {
      let time = []
      for (let i = 0; i < 60; i++) {
        let s = i
        if (i < 10) { s = '0' + i }
        time.push("" + s)
      }
      return time
    }
    if(t == 1){
      let day = []
      let j = 0
      for (let i = 0; i < 7; i++) {
        let ts = new Date().getTime() + (i+j) * 24 * 3600 * 1000
        ts = app.formatTime(new Date(ts), '月')
        day.push(ts.split(' ')[0] + '日')
      }
      return day
    }
  },
  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value,
      showTime: 'none',
      showTimeText: 'inline-table'
    })
  },
  bindMultiPickerColumnChange(e){
    console.log('----');
    console.log(e)
    if(e.detail.column==0&&e.detail.value==0){
        this.data.multiArray[1] = this.data.todayList
        this.setData({
          multiArray: this.data.multiArray
        })
    }else if(e.detail.column==0&&e.detail.value>0){      
      this.data.multiArray[1] = this.data.normalList
      this.setData({
        multiArray: this.data.multiArray
      })
    }
    
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  onChange(e) {
    this.setData({
      orderType: e.currentTarget.dataset.type
    })
    this.changeNum()
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  },
  onSelectTake(event) {
    console.log(event.detail);
    this.setData({
      timeTake: event.detail.name
    })
  },
  onDisplay() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  // 编辑数量
  editNumber(e) {
    const { num, index} = e.currentTarget.dataset
    let {submitObj} = this.data
    if (submitObj.commList[index].amount == 1 && num === -1) {
      wx.showToast({title: '数量不能小于1',icon: 'none'});
      return;
    }
    submitObj.commList[index].amount += num
    this.setData({submitObj});
    this.changeNum();
  },
  changeNum(e) {
    let that= this
    let submitObj = this.data.submitObj
    let commList = this.data.submitObj.commList
    let commoditys = []
    commList.forEach(item => {
      commoditys.push({
        commodityId: item.commodityId,
        tempSpecId: item.tempSpecId,
        amount: item.amount
      })
    });
    let cshppingId = 0
    console.log(this.data.orderType)
    if(this.data.orderType!=3){
      cshppingId = (submitObj.shipping&&submitObj.shipping.id )|| (submitObj.shipping&&submitObj.shipping.shippingId)
    }
    let data = {
      marchantId: this.data.submitObj.marchantId,
      shppingId: cshppingId,
      orderType: this.data.orderType,
      commoditys
    }
    console.log(this.data.submitObj)
    if (e) {
      data.couponsId = e
    } else(
      this.setData({selectedSaleText: '未使用优惠券'})
    )
    console.log(data)
    var token = wx.getStorageSync('token')
    app.sjrequest1('/order/onekeyAboutOrder', data, token).then(res => {
      if (res.data.code === 200) {
          // 更新 store 数据
          app.store.setState({
            submitObj: JSON.stringify(res.data.data)
          })
          if (res.data.data.unusableCouponsList.length) {
            res.data.data.unusableCouponsList.forEach(item => {
              item.endTime = time.formatTimeSec(item.endTime)
            })
          }
          if (res.data.data.usableCouponsList.length) {
            res.data.data.usableCouponsList.forEach(item => {
              item.endTime = time.formatTimeSec(item.endTime)
            })
          }
          this.setData({
            submitObj: res.data.data
          })
      }
    })
  },
  // 获取当前时间
  getCurrentDate() {
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '/' + m + '/' + d + ' ' + h + ':' + minute + ':' + second
  },
  // 到店时间
  handleDateChange(e) {
    // console.log(e)
    this.setData({
      arrivalsTime: e.detail.dateString
    })
  },
  // 联系人
  bindContacts(e) {
    this.setData({ contacts: e.detail.value.trim() });
  },
  canUse() {
    this.setData({ active: 0 });
  },
  nocanUse() {
    this.setData({ active: 1 });
  },
  // 手机号
  bindContactWay(e) {
    this.setData({ contactWay: e.detail.value.trim() });
  },

  getPhoneNumber: function (e) {
    let _this = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      //校验是否过期
      wx.checkSession({
        success: function () {
          // session_key 未过期，并且在本生命周期一直有效
          _this.gettel(e); //获取手机号
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '需同意授权才可获取手机号码',
      })
    }
  },
  gettel: function (e) {
    let _this = this;
    let iv = e.detail.iv;
    let encryptedData = e.detail.encryptedData;
    let sessionkey = wx.getStorageSync('sessionkey')
    let token = wx.getStorageSync('token')
	let appid= wx.getStorageSync('appid')
	let openid = wx.getStorageSync('openId1')
    let data =  {
      appid:appid,
      openid:openid,
      iv: iv,
      encryptedData: encryptedData,
    }
    app.sjrequest('/thirdWxLogin/deciphering',data).then(res=>{
      let userInfo =wx.getStorageSync('zl_userInfo')
      userInfo.data.data.phoneNumber =  res.data
      wx.setStorageSync('zl_userInfo', userInfo)
      // console.log(res,"3333333"); //手机号在这里面哦
        _this.setData({
          showTel: false
        })
        if (res.data.code == 200) {
          wx.showToast({
            title: '绑定成功',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '绑定成功',
            icon: res.data.msg
          })
        }
    })
  },
  closeTel() {
    this.setData({
      showTel: false
    });
  },
  closeSale() {
    this.setData({
      showSale: false
    });
  },
  // 留言
  bindMessage(e) {
    this.setData({
      message: e.detail.value.trim()
    })
  },
  // 跳转收货地址
  selectAddreee() {
    app.store.setState({ from: 'submitOrder' });
    wx.navigateTo({
      url: '/pages/Address/AddressList/AddressList'
    })
  },
  // 跳转发票列表
  selectInvoice() {
    app.store.setState({ from: 'submitOrder' });
    wx.navigateTo({
      url: '/pages/Invoice/InvoiceList/InvoiceList'
    })
  },
  //优惠券
  showSale() {
    if (!this.data.submitObj.usableCouponsList.length && !this.data.submitObj.unusableCouponsList.length) {
      wx.showToast({ title: '暂无优惠',icon: 'none'});
      return
    }
    if (!this.data.submitObj.shipping&&this.data.orderType!=3) {
      wx.showToast({title: '请先选择地址',icon: 'none' });
      return
    }
    this.setData({showSale: true});
  },
  selectSale(e) {
    if(this.data.active){ return }
    let index = e.currentTarget.dataset.index
    this.setData({
      selectedSaleText: this.data.submitObj.usableCouponsList[index].couponName,
      couponsId: this.data.submitObj.usableCouponsList[index].id,
      deduct:this.data.submitObj.usableCouponsList[index].deduct,
      showSale: false
    })
    // console.log(this.data.selectedSaleText)
    this.changeNum(this.data.submitObj.usableCouponsList[index].id)
  },

  // 提交订单
  tjdd:function() {
    if(this.emitSub){return;}
    this.emitSub=true;
    setTimeout(()=>{this.emitSub=false;},3000);

    var that = this; var rold = this;

    if (that.data.orderType != 3) {
      if (!that.data.submitObj.shipping) {
        that.selectAddreee()
        that.TimeID = -1; return;
      }
      let soj = that.data.submitObj
      let provinces = soj.entirelyAddress.indexOf(soj.shipping.provincesName);
      let city = soj.entirelyAddress.indexOf(soj.shipping.cityName);
      if(that.data.orderType == 2 && (provinces==-1 || city==-1)){
        that.setData({nocityFlag:true});
        that.TimeID = -1; return;
      }
    }

    let postFn = '/order/submitReserveOrder'

    const parmas = {
      marchantId: that.data.submitObj.marchantId,
      paymentWay: 2,
      message: that.data.message,
      commoditys: [],
      orderType:  that.data.orderType
    }
    that.data.submitObj.commList.forEach(el => {
      if(that.data.salesUserId!=0){
        parmas.commoditys.push({
          commodityId: el.commodityId,
          tempSpecId: el.tempSpecId,
          amount: el.amount,
          salesUserId: parseInt(that.data.salesUserId)
        })
      }else{
        parmas.commoditys.push({
          commodityId: el.commodityId,
          tempSpecId: el.tempSpecId,
          amount: el.amount
        })
      }
    })
    if (!!that.data.submitObj.invoice) { //选择了发票
      parmas.invoice = {}
      parmas.invoice.companyName = that.data.submitObj.invoice.companyName
      parmas.invoice.companyDp = that.data.submitObj.invoice.companyDp
      parmas.invoice.email = that.data.submitObj.invoice.email
    }
    postFn = '/order/submitCityOrder'
    if (that.data.couponsId > 0) {
      parmas.couponsId = that.data.couponsId
    }
    if (that.data.orderType!=3) {
      parmas.shippingId = that.data.submitObj.shipping.shippingId || that.data.submitObj.shipping.id
    }
    
    if (that.data.submitObj.commList[0].skuId) { // 秒杀
      postFn = '/seckill/submitOrder'
      parmas.commoditys.forEach((item, index) => {
        item.tempSpecId = that.data.submitObj.commList[index].skuId
      })
    }
    // 使用社交token
    wx.showLoading({ title: '加载中...' });
    const token = wx.getStorageSync('token')
    if (that.data.personnel != 0) {
      parmas.saleUniqueId = that.data.personnel
    }
    if(that.data.agentUserId!=''){
      parmas.agentUserId = that.data.agentUserId
    }
    if (that.data.orderType==3) {
      let submitObj = that.data.submitObj
      if(submitObj.shipping){
        parmas.reservedPhone = that.data.iphoneValue
      }         
      parmas.shippingId = 0
      let date = that.data.multiArray
      let ide = that.data.multiIndex
      let str = date[0][ide[0]] + date[1][ide[1]]
      let strd = new Date().getFullYear() + '/' + str.replace('月', '/')
      parmas.arrivalsTime = strd.replace('日', ' ')
      
      parmas.shippingAddress = JSON.stringify({
        shopName:that.data.selectedAress.shopName,
        contact:that.data.selectedAress.contact,
        contactWay:that.data.selectedAress.contactWay,
        address:that.data.selectedAress.address
      });

      if (that.data.showTime !== 'none') {
        wx.showToast({
          title: '请选择自取时间',
          icon: 'none',
          duration: 2000,
          success: res => {
            that.TimeID = -1
          }
        })
        return false;
      }

      let iphoneValue = that.data.iphoneValue
      if (!iphoneValue) {
        wx.showToast({
          title: '请输入手机号码',
          icon: 'none',
          duration: 2000,
          success: res => {
            that.TimeID = -1
          }
        })
        return false;
      }
    }

    app.sjrequest1(postFn, parmas, token).then(res => {
      wx.hideLoading()
      if (res.data.code === 200) {
        let merchantId = wx.getStorageSync('merchantId');
        let appid = wx.getStorageSync('appid');
        let orderNumber=res.data.data.orderNumber;
        var postData = {
          marchantId:merchantId,appid:appid,
          time_expire:res.data.data.time_expire,
          uniqueId: res.data.data.uniqueId,
          orderNumber: orderNumber,
          payPlatform: 'JSAPI',
          paymentWay: 2,
          body: that.data.submitObj.marchantName
        }

        parmas.orderType && (postData.orderType=parmas.orderType);

        app.sjrequest('/order/paymentOrder', postData, token).then(res1 => {
          if (res1.data.code === 200) {
            app.store.setState({ from: 'submitOrder'});
            var that = that
            wx.showLoading({ title: '请稍等...' })
            wx.requestPayment({
              appId: res1.data.data.appId,
              nonceStr: res1.data.data.nonceStr, // 支付签名随机串，不长于 32 位
              package: res1.data.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
              signType: res1.data.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              timeStamp: res1.data.data.timeStamp, // 支付签名时间戳，
              paySign: res1.data.data.paySign, // 支付签名
              success: function (wxres) {
                wx.hideLoading();
                let appid = wx.getStorageSync('appid')
                let data = {
                    authorizerAppid:appid,
                    sceneTypes:[1,2,3]
                }
                app.mb2request('/subTemplate/listPriTemplateId',data).then(res=>{
                  let  tempData  = res.data.data
                      wx.requestSubscribeMessage({
                        tmplIds:res.data.data,
                        success: function (res) {
                          wx.getSetting({
                            withSubscriptions: true,
                            success (res) {
                              var isSettingFlag = false;
                              var subStatus=1;
                              if(res.subscriptionsSetting.itemSettings){
                                for(let key in res.subscriptionsSetting.itemSettings){
                                  if(tempData.indexOf(key) > -1){
                                    isSettingFlag = true;break;
                                  }
                                }
                              }                                    
                              if(isSettingFlag){ subStatus = 2 }

                              let subData=[
                                {
                                  status: subStatus,appId:appid, targettype:4,
                                  marchantid: rold.data.submitObj.marchantId,
                                  templateid: tempData[0],targetid:orderNumber
                                },
                                {
                                  status: subStatus,appId:appid, targettype:4,
                                  marchantid:  rold.data.submitObj.marchantId,
                                  templateid: tempData[1],targetId:orderNumber
                                },
                                {
                                  status: subStatus,appId:appid, targettype:4,
                                  marchantid:  rold.data.submitObj.marchantId,
                                  templateid: tempData[2],targetId:orderNumber
                                }
                              ];
                              app.sjrequest1('/subscription/add', subData).then(res => {})
                            }
                          })
                        },
                        complete: function (res) {
                          if (parmas.orderType==3) {
                            wx.redirectTo({
                              url: `/pages/order/orderListTake/orderListTake?tabsitem=1`,
                            })
                          } else if(parmas.orderType==2){
                            wx.redirectTo({
                              url: `/pages/order/orderListCity/orderListCity?tabsitem=1`,
                            })
                          }else {
                            wx.redirectTo({
                              url: `/pages/order/orderDetail/orderDetail?uniqueId=${postData.uniqueId}`,
                            })
                          }
                        }
                      })
                })
              },
              fail: function (wxres) {
                wx.showToast({ title: '支付失败', icon: 'none' });

                if (parmas.orderType==3) {
                  wx.redirectTo({
                    url: `/pages/order/orderListTake/orderListTake`,
                  })
                }else if(parmas.orderType==2){
                  wx.redirectTo({
                    url: `/pages/order/orderListCity/orderListCity`,
                  })
                } else {
                  wx.redirectTo({
                    url: `/pages/order/orderDetail/orderDetail?uniqueId=${postData.uniqueId}`,
                  })
                }
              }
            });
          }
        })
      } else if (res.data.code == 325) {
        that.setData({
          showTel: true
        })
      } else if (res.data.code == 600) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },

  bindconfirmIphone(e) {
    var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证手机号的正则表达式
    if (!reg.test(e.detail.value)) {

      this.setData({
        iphoneValue: ''
      })
    } else {
      this.setData({
        iphoneValue: e.detail.value
      })
    }


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 选择收货地址
  selectAddress(){
    this.setData({
      showAddressList:true,
    })
    // wx.showLoading({
    //   title: '加载中',
    // })
    // let data = {
    //   marchantId:this.data.submitObj.marchantId
    // }
    // app.sjrequest('/marchant/queryMustaddressList',data).then(res=>{
    //   if(res.data.code == 200){
    //     wx.hideLoading()
    //     this.setData({
    //       showAddressList:true,
    //       addressList:res.data.data
    //     })
    //   }else{
    //     wx.showToast({
    //       title: res.data.msg,
    //       icon: 'none'
    //     })
    //   }
    // })
  },
  // 关闭自取地址
  closeAddressList(){
    this.setData({
      showAddressList:false,
    })
  },
  // 确认收货地址
  comfirmAddress(e){
    let idx = e.currentTarget.dataset.idx
    this.setData({
      selectedAress:this.data.addressList[idx],
      showAddressList: false
    })
  },
  getAddress(){
    
  },
  closeBgNocity(){
    this.setData({nocityFlag:false});
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})