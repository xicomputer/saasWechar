const paymentUtil = require("../../../../utils/paymentUtil")
const templateMessageUtil = require("../../../../utils/templateMessageUtil")
const plugin = requirePlugin('WechatSI');
const app = getApp()
let SocketTask
Page({
  data: {
    pageNum: 1,
    pageSize: 10,
    socketOpen: null,
    socketClose: false,
    _connectNum: 0,
    currentIndex: 0,
    isShowBidMask: false,
    isShowPayMask: false,
    isCheckDoc: true,
    isShowAddprice: false,
    isMyPrice: true,
    isWon: false,
    isShowYanChi: false,
    addPriceIndex: 0,
    myPrice: 0,
    auctionDetail: {},
    bidList: [],
    bidRecordList:[],
    userInfo:{},
    isShowGuangZhu: true,
    auctionId: null,
    exitType: 0,
    yuyueFlag: true,
    audioSrc:'',
  },
  onLoad: function (options) {
    let zl_userInfo = wx.getStorageSync('zl_userInfo');
    if(zl_userInfo){
      this.initData(options,zl_userInfo);
    }else{
      app.userLogin().then(res=>{
        zl_userInfo = wx.getStorageSync('zl_userInfo');
        this.initData(options,zl_userInfo);
      })
    }
  },

  initData(options,zl_userInfo){
    this.setData({
      ['userInfo.type']: 1,
      ['userInfo.userId']: zl_userInfo.data.data.userId,
      ['userInfo.headImgUrl']: zl_userInfo.data.data.headimgurl,
      ['userInfo.nickName']: zl_userInfo.data.data.nickname,
      socketOpen: null,
    });
    app.globalData.options = options
    if(options.scene){
      const scene = decodeURIComponent(options.scene)
      this.getCodeParams(scene)
    }else{
      this.setData({
        auctionId: options.auctionId || '6fbaad2552954b1186b70b3fbbcb76d5',
        ['userInfo.auctionId']: options.auctionId,
      })
      this.getAuctionDetail()
    }
  },

  //检查参拍资格
  getQualification(){
    return new Promise((resolve,reject)=>{
      app.request.auctionRequest(
        '/bidding/isParticipationAuction',
        this.data.userInfo.auctionId,
        'form-data',
      ).then(res=>{
        console.log('检查结果',res);
        if(res && res.data.code==200){
          resolve(true);
        }else{
          wx.showToast({
            title:res.data.msg,
            icon:'none',
          });
          reject(false);
        }
      }).catch(err=>{
        reject(false);
      })
    })
  },

  async checkTmp(tmplIds){
    const params = {
      auctionId: this.data.auctionId,
      templateIds: tmplIds
    }
    let result
    await app.request.auctionRequest('/applet/hasSubscription', params).then((res) =>{
      result = res.data
    })
    return result
  },
  getCodeParams(id){
    let data = {id : id} 
    let that = this
    app.sjrequest('/marchant/queryIdentifica',data).then(res=>{
      if(res.data.code == 200) {
        that.setData({
          auctionId: JSON.parse(res.data.data.scene).id,
          ['userInfo.auctionId']: JSON.parse(res.data.data.scene).id,
        })
        that.getAuctionDetail()
      }
    })
  },
  getAuctionDetail(){
    const params = this.data.auctionId
    app.request.auctionRequest('/auction/detail', params).then((res) =>{
      if(res.data.code == 200){
        let result = res.data.data
        if(result.userList){
          result.userList.length = result.userList.length>20 ? 20 : result.userList.length
        }
        result.xsAuctionItem.priceRangeArray = result.xsAuctionItem.priceRange.split(',')
        result.xsAuctionItem.priceRangeString = ''
        for(let index in result.xsAuctionItem.priceRangeArray){
          result.xsAuctionItem.priceRangeString = result.xsAuctionItem.priceRangeString + '￥' + result.xsAuctionItem.priceRangeArray[index]
          if(index != result.xsAuctionItem.priceRangeArray.length-1){
            result.xsAuctionItem.priceRangeString = result.xsAuctionItem.priceRangeString + '/'
          }
        }
        if(result.xsAuctionBiddingRecordVOList.length){
          for(let index in result.xsAuctionBiddingRecordVOList){
            var nickName=result.xsAuctionBiddingRecordVOList[index].nickName;
            var nickNameStr=nickName.length>5?nickName.substr(0,5)+'...':nickName;
            result.xsAuctionBiddingRecordVOList[index].nickName = nickNameStr;
          }
          this.setData({
            bidRecordList:result.xsAuctionBiddingRecordVOList,
            isMyPrice: this.data.userInfo.userId != result.xsAuctionBiddingRecordVOList[0].userId
          })
        }
        if(result.status == 3 && result.xsAuctionBiddingRecordVOList.length){
          this.showWon()
        }
        this.setData({
          ['userInfo.endTime']: result.endTime,
          auctionDetail: result
        })
        if(result.status != 3)
        {
          this.createSocket()
        }
      }
    })
  },
  getBidInfo(){
    const params = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      auctionId: this.data.auctionId
    }
    app.request.auctionRequest('/record/list', params).then((res) =>{
      if(res.data.code == 200){
        let result = res.data.data
        for(let index in result){
          result[index].nickName = result[index].nickName[0] + '***'
        }
        this.setData({
          bidList: result
        })
      }
    })
  },
  imgClick(e) {
    const {src, list} = e.currentTarget.dataset
    let imageList = []
    for (let index = 0; index < list.length; index++) {
      imageList[index] = list[index].httpAddress
    }
    wx.previewImage({
      current: src,
      urls: imageList
    })
  },
  getCurrentIndex(e){
    this.setData({
      currentIndex: e.detail.current
    })
  },
  changeTime(e){
    this.setData({
      timeData: e.detail
    });
  },
  overTime(){
    this.getAuctionDetail()
    if(this.data.auctionDetail.status == 3 && this.data.bidRecordList.length){
      this.showWon()
    }
  },
  showWon(){
    this.setData({
      isWon: true
    })
  },
  contactShop(){
    wx.navigateTo({
      url: `/pages/order/contact/contact?logoPic=${this.data.auctionDetail.merchantLogo}&marchantId=${this.data.auctionDetail.merchantId}&marchantName=${this.data.auctionDetail.merchantName}`,
    })
  },
  toShop(){
    this.setData({
      exitType: 1
    })
    this.isShowGuanzhuTankuang()
  },
  exit(){
    if(this.data.exitType == 1){
      wx.navigateTo({
        url: `/pages/shopHome/home/home?marchantId=${this.data.auctionDetail.merchantId}`,
      })
    }else if(this.data.exitType == 2){
      wx.navigateTo({
        url: `/pages/activity/pmhd/list/list?merchantId=${this.data.auctionDetail.merchantId}`,
      })
    }else{
      this.backList()
    }
  },
  async isShowGuanzhuTankuang(){
    const tmpIsCheck= await this.checkTmp([templateMessageUtil.tmplIds1,templateMessageUtil.tmplIds5]);
    if(tmpIsCheck == 'true'){
      this.setData({
        isShowGuangZhu: true
      })
      this.exit()
    }else{
      this.setData({
        isShowGuangZhu: false
      })
    }
  },
  async remind(){
    //检查是否有参拍资格
    var result=await this.getQualification();
    if(!result){return;}

    templateMessageUtil.templateMessage(1).then(res =>{
      var params=[];
      var tempItem={
        auctionId: this.data.auctionId,
        merchantId: this.data.auctionDetail.merchantId,
        status: 1,
      }
      if(res[templateMessageUtil.tmplIds1] == 'accept'){
        tempItem.templateId=templateMessageUtil.tmplIds1;
        var itemobj={...tempItem};
        params.push(itemobj);
      }

      if(res[templateMessageUtil.tmplIds5] == 'accept'){
        tempItem.templateId=templateMessageUtil.tmplIds5;
        var itemobj={...tempItem};
        params.push(itemobj);
      }
     
      wx.getSetting({
        success:(res)=>{
          if(res.subscriptionsSetting){
             var itemSettings=res.subscriptionsSetting.itemSettings;
             if(itemSettings){
              var keys=Object.keys(itemSettings);
              params.forEach(temp=>{
                if(keys.indexOf(temp.templateId)!=-1){
                  temp.status=2;
                }
              });
             }
          }

          if(params.length>0){
            app.request.auctionRequest('/applet/save', params).then((res) =>{
              if(res.data.code == 200){
                wx.showToast({
                  title: '订阅成功',
                  icon: 'none'
                })
                this.setData({
                  isShowGuangZhu: true,
                })
              }
            });
            this.exit();
          }
        }
      });
    }).catch((err) =>{
      wx.showToast({
        title: '订阅消息失败,请点击右上角三个点中的设置打开消息订阅开关',
        icon:'none'
      })
    })
  },
  toUserNotice(){
    wx.navigateTo({
      url: '/pages/activity/pmhd/userNotice/userNotice',
    })
  },
  showBidMask(e){
    const {type} = e.currentTarget.dataset
    if(type == 1){
      this.getBidInfo()
    }
    this.setData({
      isShowBidMask: true
    })
  },
  showNotBidMask(){
    this.setData({
      isShowBidMask: false
    })
  },
  async reservation(){
    //检查是否有参拍资格
    var result=await this.getQualification();
    if(!result){return;}

    if(!this.data.yuyueFlag){
      return
    }
    const tmpIsCheck= await this.checkTmp([templateMessageUtil.tmplIds3])
    const that = this
    that.setData({
      yuyueFlag: false
    })
    wx.showModal({
      title: '提示',
      content: '确定要预约吗？',
      success (res) {
        if (res.confirm) {
          if(!tmpIsCheck){
            templateMessageUtil.templateMessage(3).then(res =>{
              console.log("res[templateMessageUtil.tmplIds3]:",res[templateMessageUtil.tmplIds3])
              if(res[templateMessageUtil.tmplIds3] == 'accept'){
                const params = [{
                  auctionId: that.data.auctionId,
                  merchantId: that.data.auctionDetail.merchantId,
                  status: 1,
                  templateId: templateMessageUtil.tmplIds3
                }]
                app.request.auctionRequest('/applet/save', params).then((res) =>{
                  if(res.data.code == 200){
                    that.setData({
                      ['auctionDetail.isSubscribe']: 1
                    })
                  }
                })
              }
            })
          }
        }
        that.setData({
          yuyueFlag: true
        })
      }
    })
  },
  async showPayMask(e){
    //检查是否有参拍资格
    var result=await this.getQualification();
    if(!result){return;}

    const {type} = e.currentTarget.dataset
    if(type == 1){
      const tmpIsCheck= await this.checkTmp([templateMessageUtil.tmplIds5,templateMessageUtil.tmplIds2,templateMessageUtil.tmplIds4])
      if(tmpIsCheck){
        this.setData({
          isShowPayMask: true
        })
        return
      }
      templateMessageUtil.templateMessage(5).then(res =>{
        let params = []
        var tempItem={
          auctionId: this.data.auctionId,
          merchantId: this.data.auctionDetail.merchantId,
          status: 1,
        }
        if(res[templateMessageUtil.tmplIds2] == 'accept'){
          tempItem.templateId=templateMessageUtil.tmplIds2;
          params.push(tempItem );
        }
        if(res[templateMessageUtil.tmplIds4] == 'accept'){
          tempItem.templateId=templateMessageUtil.tmplIds4;
          params.push(tempItem );
        }
        if(res[templateMessageUtil.tmplIds5] == 'accept'){
          tempItem.templateId=templateMessageUtil.tmplIds5;
          params.push(tempItem );
        }
        
        wx.getSetting({
          success:(res)=>{
            if(res.subscriptionsSetting){
               var itemSettings=res.subscriptionsSetting.itemSettings;
               if(itemSettings){
                var keys=Object.keys(itemSettings);
                params.forEach(temp=>{
                  if(keys.indexOf(temp.templateId)!=-1){
                    temp.status=2;
                  }
                });
               }
            }
            
            if(params.length){
              app.request.auctionRequest('/applet/save', params).then((res) =>{
                if(res.data.code == 200){
                  this.setData({
                    ['auctionDetail.isSubscribe']: 1
                  })
                }
              })
            }
          }
        });
      })
    }
    this.setData({
      isShowPayMask: true
    })
  },
  showNotPayMask(){
    this.setData({
      isShowPayMask: false
    })
  },
  toPayment(){
    let tips = ''
    if(this.data.auctionDetail.bond == 0){
      if(this.data.auctionDetail.status == '1'){
        tips = '报名成功'
      }else{
        tips = '参喊成功'
      }
    }else{
      tips = '去支付'
    }
    if(!this.data.isCheckDoc){
      wx.showToast({
        title: '需要同意协议才能竞喊哦~~',
        icon: 'none'
      })
      return
    }
    const params = {
      auctionId: this.data.auctionId,
      cashDeposit: this.data.auctionDetail.bond,
      status: this.data.auctionDetail.status
    }
    app.request.auctionRequest('/bidding/save', params).then((res) =>{
      if(res.data.code == 200){
        let result = res.data.data
        if(tips == '去支付'){
          this.paymentMoney(result)
        }else{
          wx.showToast({
            title: tips,
            icon: 'none'
          })
          this.setData({
            ['auctionDetail.isApply'] : 1
          })
          this.showNotPayMask()
        }
      }
    })
  },
  paymentMoney(data){
    const that = this
    paymentUtil.auctionWxpay(data).then(() => {
      that.setData({
        ['auctionDetail.isApply'] : 1
      })
      that.showNotPayMask()
    })
  },
  checkDoc(){
    this.setData({
      isCheckDoc: !this.data.isCheckDoc
    })
  },
  showAddpriceDialog(){
    this.setData({
      isShowAddprice: true,
    })
  },
  showAddprice(e){
    const that = this
    const {type} = e.currentTarget.dataset
    if(that.data.isMyPrice){
      if(that.data.isShowAddprice && type == 1){
        wx.showModal({
          title: '是否确认加价',
          content: '我的报价：'+that.data.myPrice + '元',
          success (res) {
            if (res.confirm) {
              const params = {
                auctionId: that.data.auctionId,
                premiumCount: that.data.auctionDetail.PremiumCount,
                price: that.data.myPrice,
                userId:that.data.userInfo.userId
              }
              app.request.auctionRequest('/bidding/userPremium', params).then((res) =>{
                if(res.data.code == 200){
                  that.setData({
                    isShowAddprice: false
                  })
                  wx.showToast({
                    title: '加价成功',
                    icon: 'none'
                  })
                }else if(res.data.code == 500){
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    showCancel: false,
                    success (res) {
                      if (res.confirm) {
                        let myPrice = 0
                        if(that.data.bidRecordList.length){
                          myPrice = Number(that.data.bidRecordList[0].price) + Number(that.data.auctionDetail.xsAuctionItem.priceRangeArray[0])
                        }else{
                          myPrice = Number(that.data.auctionDetail.xsAuctionItem.startingPrice) + Number(that.data.auctionDetail.xsAuctionItem.priceRangeArray[0])
                        }
                          that.setData({
                            addPriceIndex: 0,
                            myPrice: myPrice.toFixed(2)
                          })
                      }
                    }
                  })
                }
              })
            }
          }
        })
      }else{
        let myPrice = 0
        if(this.data.bidRecordList.length){
          myPrice = Number(this.data.bidRecordList[0].price) + Number(this.data.auctionDetail.xsAuctionItem.priceRangeArray[0])
        }else{
          myPrice = Number(this.data.auctionDetail.xsAuctionItem.startingPrice) + Number(this.data.auctionDetail.xsAuctionItem.priceRangeArray[0])
        }
          this.setData({
            isShowAddprice: true,
            addPriceIndex: 0,
            myPrice: myPrice.toFixed(2)
          })
      }
    }
  },
   showNotAddprice(){
    this.setData({
      isShowAddprice: false
    })
  },
  addPrice(e){
    const {index} = e.currentTarget.dataset
    let myPrice = this.data.myPrice
    if(index == this.data.addPriceIndex){
      myPrice = Number(myPrice) + Number(this.data.auctionDetail.xsAuctionItem.priceRangeArray[index])
    }else{
      if(myPrice==0){
        if(this.data.bidRecordList.length){
          myPrice = Number(this.data.bidRecordList[0].price) + Number(this.data.auctionDetail.xsAuctionItem.priceRangeArray[index])
        }else{
          myPrice = Number(this.data.auctionDetail.xsAuctionItem.startingPrice) + Number(this.data.auctionDetail.xsAuctionItem.priceRangeArray[index])
        }
      }else{
        myPrice = Number(myPrice) + Number(this.data.auctionDetail.xsAuctionItem.priceRangeArray[index])
      }
    }
    this.setData({
      isShowAddprice: true,
      myPrice: myPrice.toFixed(2),
      addPriceIndex: index
    })
  },
  backAddPrice(){
    let myPrice = 0
    if(this.data.bidRecordList.length){
      myPrice = Number(this.data.bidRecordList[0].price) + Number(this.data.auctionDetail.xsAuctionItem.priceRangeArray[0])
    }else{
      myPrice = Number(this.data.auctionDetail.xsAuctionItem.startingPrice) + Number(this.data.auctionDetail.xsAuctionItem.priceRangeArray[0])
    }
    this.setData({
      isShowAddprice: true,
      addPriceIndex: 0,
      myPrice: myPrice.toFixed(2)
    })
  },
  toList(e){
    const {type} = e.currentTarget.dataset;
    if(type==1){
      wx.navigateTo({
        url: `/pages/activity/pmhd/list/list?merchantId=${this.data.auctionDetail.merchantId}`,
      });
    }else{
      this.setData({
        exitType: 2
      })
      this.isShowGuanzhuTankuang()
    }
  },
  toPayMoney(){
    var query=`auctionId=${this.data.auctionId}&status${this.data.auctionDetail.biddingStatus}`
    wx.navigateTo({
      url: `/pages/activity/pmhd/pmList/pmList?${query}`,
    })
  },
  backList(){
    let pages = getCurrentPages()
    if(pages[pages.length - 2]){
      wx.navigateBack({
        delta: 0,
      })
    }else{
      wx.redirectTo({
        url: `/pages/activity/pmhd/list/list?merchantId=${this.data.auctionDetail.merchantId}`,
      })
    }
  },
  showYanChi(){
    this.setData({
      isShowYanChi: !this.data.isShowYanChi
    })
  },
  showGuanzhuan(){
    this.setData({
      isShowGuangZhu: false
    })
  },
  showNotGuanzhuan(){
    this.setData({
      isShowGuangZhu: true
    })
  },
  sendSocketMessage(msg){
    console.log("msg:",msg)
    if(this.data.socketOpen){
      SocketTask.send({
        data: JSON.stringify(msg)
      })
    }
  },
  createSocket(){
    const that = this
    if(this.data.socketOpen){
      return;
    }  
    this.webSocket()
    SocketTask.onOpen(() => {
      this.sendSocketMessage(that.data.userInfo)
    })
    SocketTask.onClose(()=>{
      this.setData({
        socketOpen: false
      })
      if(!this.data.socketClose){
          this.reConnect();
      }
    })
    SocketTask.onError(()=>{
      that.setData({
        socketOpen: false
      })
    })
    SocketTask.onMessage((onMessage) =>{
      let result = JSON.parse(onMessage.data)
      console.log("result:",result)
      if(result.type == 1){
        let auctionDetail = that.data.auctionDetail
        console.log("infos:",that.data.auctionDetail)
        const params = {
          userId: result.userId,
          headImgUrl: result.headImgUrl,
          nickName: result.nickName,
        }
        if(auctionDetail.userList){
          auctionDetail.userList.push(params)
        }else{
          auctionDetail.userList = [params]
        }
        that.setData({
          auctionDetail: auctionDetail
        })
      }else if(result.type == 2){
        this.compoundAudio(result.nickName,result.price);
        let auctionDetail = that.data.auctionDetail
        auctionDetail.premiumCount = result.premiumCount
        auctionDetail.delayCount = result.delayCount
        that.setData({
          auctionDetail: auctionDetail
        })
        let nickName = result.nickName;
        var nickNameStr=nickName.length>5?nickName.substr(0,5)+'...':nickName;
        const params = {
          id: result.id,
          auctionId: result.auctionId,
          userId: result.userId,
          nickName: nickNameStr,
          headImgUrl: result.headImgUrl,
          price: result.price,
          createTime: result.createTime
        }
        let bidRecordList = that.data.bidRecordList
        bidRecordList.unshift(params)
        if(bidRecordList.length > 3){
          bidRecordList = bidRecordList.slice(0,3)
        }
        that.setData({
          bidRecordList: bidRecordList,
          isMyPrice: that.data.userInfo.userId != result.userId
        })
      }
    })
  },

  compoundAudio(uname,price){
    var that=this;
    plugin.textToSpeech({
      lang: "zh_CN",tts: true,
      content: uname+"当前喊价"+price+"元",
      success: function (res) {
        that.setData({ audioSrc: res.filename })
        that.playAudio();
      }
    });
  },

  playAudio(){
    if (this.data.audioSrc == '') {
      return;
    }
    this.innerAudioContext.src = this.data.audioSrc
    this.innerAudioContext.play();
  },
  webSocket(){
    const that = this
    SocketTask = wx.connectSocket({
      url: app.request.socketUrl,
      success() {
        that.setData({
          socketOpen: true
        })
      }
    })
  },
  onReady: function () {
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError(function (res) {
      wx.showToast({ title: '语音播放失败', icon: 'none'})
    })
  },
  onHide: function () {    
    this.setData({
       isShowGuangZhu: true      
    })      
  },
  onUnload: function () {
    this.setData({
      socketOpen: false,
      socketClose: true
    })
//     SocketTask.close()
  },
   reConnect() {
    let timer, _this = this;
    if (this.data._connectNum < 20) {    
      timer = setTimeout(() => {
        _this.createSocket()
        this.data._connectNum += 1;
      }, 3000)       
    } else if (this.data._connectNum < 50) {
      timer = setTimeout(() => {
        _this.createSocket()
        this.data._connectNum += 1;
      }, 10000)       
    }
  },
  onShareAppMessage: function () {
    return {
      title: this.data.auctionDetail.xsAuctionItem.auctionItemName
    }
  }
})