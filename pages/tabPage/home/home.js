// pages/tabPage/home/home.js

const app = getApp();
const time = require('../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.getSystemInfo.statusBarHeight||20,  // 状态栏高度
    menuButtonHeight: app.globalData.MenuButton.height + (app.globalData.MenuButton.top - app.globalData.getSystemInfo.statusBarHeight)*2, // 导航栏高度
    statusAllHeight: app.globalData.getSystemInfo.statusBarHeight+app.globalData.MenuButton.height + (app.globalData.MenuButton.top - app.globalData.getSystemInfo.statusBarHeight)*2,
    menuHeight:app.globalData.MenuButton.height,  // 胶囊高度
    //banner图数据
    bannerList:['a','b','c'],
    //关注店铺
    followsList:[],
    currentShopIndex:0,//当前展示店铺下标

    marchantList:[],//关注店列表
    classProductList: [],// 分类商品列表
    promotionIndex:0,
    commentIndex:0,
    auctionIndex:0,
    pageCurr: 1,
    stopLoad:false,
    buton:false,
    firstIn: true,//是否第一次进入状态
    offsetTop:0,//滚动吸顶容器距离顶部的距离
    fixedContainer:false,//是否固定工具栏位置
    marchantTypeList:[],
    currentClassId:0,

    //推荐商品分页参数
    recommendPaging:{
      robPageCurr:1,
      stopRobReq:false,
      farmersPageCurr:1,
      stopFarmersReq:false,
      robList:[],
      farmersList:[],
    },

    marchantCount:7000,//已入住商家数量
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: function () {
    this.getRobRecommended();//获取 限时抢购 推荐商品列表
    this.getFarmersRecommended();//获取 农特产品 推荐商品列表
    wx.getStorage({
      key: 'marchant_number_key',
      success:res=>{this.setData({marchantCount:res.data});}
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var recommendPaging=this.data.recommendPaging;
    recommendPaging.farmersPageCurr=1;
    recommendPaging.robPageCurr=1;
    recommendPaging.stopRobReq=false;
    recommendPaging.stopFarmersReq=false;

    this.setData({
      recommendPaging,
      pageCurr: 1,
      stopLoad:false,
      currentShopIndex:0,
      marchantTypeList:[{
        businessName:'精选',id:0,productList:[],subtitle:'我的收藏',
        paging:{pageCurr:1,pageSize:10,isReq:true}
      }]
    });

    var that =this;
    //查看是否授权
    wx.getSetting({
      success: function (res) {
        if (wx.getStorageSync('wx_userinfo_key')) {
          if(wx.getStorageSync('token')){
            that.setData({ buton:false})
          }else{
            that.setData({buton:true})
          }
          that.isAuth=true;
          //用户已授权
          that.getStoreData();
          that.getLikeList();
        } else {
          if(that.data.firstIn){
            that.setData({firstIn:false})
            wx.navigateTo({
              url: '/pages/shopHome/home/home',
            })
          }
          that.setData({ buton:true })
          //用户没有授权
        }
        that.getBannerList();
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 上拉底部抵触事件
  */ 
  onReachBottom(){
    var marchantTypeList=this.data.marchantTypeList;
    var currentTypeId=this.data.currentClassId;
    var currentItem=marchantTypeList.find((item,index)=>item.id==currentTypeId);
    if(currentItem.paging.isReq){
      currentItem.paging.pageCurr++;
      if(currentTypeId==0){
        this.getLikeList();
      }else{
        this.getClassProductList(currentItem.id);
      }
    }
  },

  //监听页面滚动
  onPageScroll(e){
    var scrollTop=e.scrollTop;
    var offsetTop=this.data.offsetTop;
    if(scrollTop > offsetTop && offsetTop!=0){
      this.data.fixedContainer || this.setData({fixedContainer:true});
    }else{
      this.data.fixedContainer && this.setData({fixedContainer:false});
    }
  },

  //  获取轮播图
  getBannerList(){
    // app.sjrequest('/basic/queryBannerList',{}).then(res=>{
    //   this.setData({bannerList:res.data.data})
    // })

    var params={ pageCurr:1,pageSize:10,commodityType:3}
    app.sjrequest('/commodity/queryRecommendCommodityList',params).then(res=>{
      if(res.statusCode==200 && res.data.code==200){
        this.setData({bannerList:res.data.data})
      }
   })
  },

  //获取 限时抢购 推荐商品列表
  getRobRecommended(){
    var recommendPaging=this.data.recommendPaging;
    var params={
      pageCurr:recommendPaging.robPageCurr,
      pageSize:10,commodityType:1
    }
    app.sjrequest('/commodity/queryRecommendCommodityList',params).then(res=>{
      if(res.statusCode==200 && res.data.code==200){
        var rows=res.data.data
        rows.forEach(item=>{
          var lowPrice=item.lowPrice+'';
          var priceArr=lowPrice.split('.');
          item.intPrice=priceArr[0];
          item.floatPrice=priceArr[1];
        })
        recommendPaging.robList.push(...rows);
        recommendPaging.stopRobReq=rows.length!==10;
        this.setData({recommendPaging});
      }
    })
  },

  //获取 农特产品 推荐商品列表
  getFarmersRecommended(){
    var recommendPaging=this.data.recommendPaging;
    var params={
      pageCurr:recommendPaging.farmersPageCurr,
      pageSize:10,commodityType:2
    }
    app.sjrequest('/commodity/queryRecommendCommodityList',params).then(res=>{
      if(res.statusCode==200 && res.data.code==200){
        var rows=res.data.data;
        rows.forEach(item=>{
          var lowPrice=item.lowPrice+'';
          var priceArr=lowPrice.split('.');
          item.intPrice=priceArr[0];
          item.floatPrice=priceArr[1];
        })
        recommendPaging.farmersList.push(...rows);
        recommendPaging.stopFarmersReq=rows.length!==10;
        this.setData({recommendPaging});
      }
    })
  },

  //推荐商品分页
  CommendScrolltolower(e){
    var recommendPaging=this.data.recommendPaging;
    var type=e.currentTarget.dataset.type;
    if(type==1 && !recommendPaging.stopRobReq){
      recommendPaging.robPageCurr++;
      this.setData({recommendPaging},()=>{
        this.getRobRecommended();
      });
    }else if(type==2 && !recommendPaging.stopFarmersReq){
      recommendPaging.farmersPageCurr++
      this.setData({recommendPaging},()=>{
        this.getFarmersRecommended();
      });
    }
  },
  
  // 获取关注
  getFollows(){
    let data = {pageCurr: 1,pageSize: 4}
    app.sjrequest('/marchant/queryConcerns',data).then(res =>{
      
      if(res.data.code == 200){
        res.data.data.forEach(item=>{
          item.orderType = item.businessModel.split(',').sort()[0]
        })
        this.setData({
          followsList:res.data.data.slice(0,4)
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
  },

  // 查询关注的商家列表 与关注商家的分类列表
  getStoreData(){
    app.sjrequest('/marchant/queryConcernsData').then(res=>{
      if(res.statusCode==200 && res.data.code==200){
        var marchantList=res.data.data.marchantList || [];
        var marchantTypeList=res.data.data.marchantTypeList || [];
        marchantTypeList=this.data.marchantTypeList.concat(marchantTypeList);
        marchantList.forEach(item=>{
          item.paging={
            pageCurr:1,pageSize:10,
            isReq:item.promotionList.length==10
          }
        });
        
        marchantTypeList.forEach((item)=>{
          item.productList=[];
          item.subtitle=this._getSubtitle(item.businessName);
          item.paging={
            pageCurr:1,pageSize:10,
            isReq:item.productList.length==10
          }
        });
    
        this.setData({marchantList,marchantTypeList},()=>{
          this.getNodeInfo()
        });
      }
    })
  },

  _getSubtitle(businessName){
    switch(businessName){
      case '精选': return '我的收藏';
      case '美妆护肤': return '精致女生';
      case '服饰鞋包': return '时尚生活';
      case '母婴用品': return '妈妈的爱';
      case '酒水食品': return '放心购';
      case '茶叶特产': return '好物宜身';
      case '家纺绿植': return '温暖的家';
      default: return '';
    }
  },

  //获取分页列表
  getStoreProductList(id,paging,index){
    var marchantList=this.data.marchantList;
    var storeItem=marchantList[index];
    var data={
      marchantId:id,
      pageCurr:paging.pageCurr,
      pageSize:paging.pageSize
    }
    app.sjrequest('/commodity/queryAllCommodityList',data).then(res=>{
      if(res.statusCode==200 && res.data.code==200){
        var list=res.data.data;
        paging.isReq=list.length==paging.pageSize;
        storeItem.promotionList.push(...list);
        this.setData({marchantList});
      }
    })
  },

  //scroll-view 分页
  scrolltolower(event){
    var i=event.target.dataset.index;
    var storeItem=this.data.marchantList[i];
    var {id,paging} = storeItem;
    if(paging.isReq){
      paging.pageCurr++
      this.getStoreProductList(id,paging,i);
    }
  },
  
  // 查询收藏列表
  getLikeList(){
    var marchantTypeList=this.data.marchantTypeList;
    var currentTypeId=this.data.currentClassId;
    var currentTypeItem=marchantTypeList.find(item=>item.id==currentTypeId) || {};
    var {paging} = currentTypeItem;
    var postData={
      pageCurr:paging.pageCurr,
      pageSize:paging.pageSize
    }
    app.sjrequest('/commodity/queryCommodityLikeList',postData).then(res=>{
      if(res.statusCode==200 && res.data.code==200){
        var data=res.data.data;
        var stopLoad=data.length<10;
        currentTypeItem.paging.isReq=data.length==currentTypeItem.paging.pageSize;
        if(currentTypeItem.paging.pageCurr==1){
          currentTypeItem.productList=data;
        }else{
          currentTypeItem.productList.push(...data);
        }
        var classProductList=currentTypeItem.productList;
        this.setData({stopLoad,classProductList});
      }
    })
  },

  //切换分类导航
  swetchTabClass(e){
    var classid=e.currentTarget.dataset.classid;
    var marchantTypeList=this.data.marchantTypeList;
    var currentTypeItem=marchantTypeList.find(item=>item.id==classid) || {};
    this.setData({currentClassId:classid});

    var productList=currentTypeItem.productList || [];
    if(productList.length){
      this.setData({classProductList:productList});
    }else{
      if(classid===0){
        this.getLikeList(classid);
      }else{
        this.getClassProductList(classid);
      }
    }
  },

  //获取关注商家 的分类商品列表
  getClassProductList(classId){
    var marchantTypeList=this.data.marchantTypeList;
    var classItem=marchantTypeList.find(item=>item.id==classId);
    var {pageCurr,pageSize} = classItem.paging;
    var ids=[];
    classItem.marchantList.forEach(item=>{ids.push(item.id)});

    var postData={pageCurr,pageSize,marchantIds:ids}
    app.sjrequest('/commodity/queryAllCommodityList',postData).then(res=>{
      if(res.statusCode==200 && res.data.code==200){
        var data=res.data.data;
        classItem.paging.isReq=data.length==classItem.paging.pageSize;
        classItem.productList.push(...data);
        var classProductList=classItem.productList;
        this.setData({marchantTypeList,classProductList});
      }
    })
    
  },

  //滚动吸顶容器节点信息
  getNodeInfo(){
    if(!this.data.offsetTop){
      const query = wx.createSelectorQuery()
      query.select('.product-class-tab-box').boundingClientRect((res)=>{
        var offsetTop=res.top-res.height;
        this.setData({offsetTop});
        console.log('节点信息：',res);
      })
      query.exec()
    }
  },

})