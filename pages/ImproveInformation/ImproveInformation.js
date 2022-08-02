// pages/ImproveInformation/ImproveInformation.js
import AreaList from '../../public/js/area';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    useName:"",
    tel:"",
    card:"",
    businessName:"",
    shop_pname:"",
    shop_address:"",
    shop_detail_address:"",
    isCard1:false,
      isCard2:false,
      isCard3:false,
      isbusiness:false,
    card1: "https://xssj.letterbook.cn/applet/images/card1.png",
    card2: "https://xssj.letterbook.cn/applet/images/card2.png",
    card3: "https://xssj.letterbook.cn/applet/images/card3.png",
    shop_Category: "",
    license: "https://xssj.letterbook.cn/applet/images/face.png",
    showarea: false,
    show: false,
    areaList: AreaList,
    shop_address: "",
    showCategory: false,
    navList: [],
    navListItem: [],
    navActive:"",
    marchantTypeId:"",
    businessName:"",
    provinceidcode:"",
    cityidcode:"",
    areaidcode:"",
    uniqueId:"",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uniqueId = wx.getStorageSync('uniqueId')
    this.setData({uniqueId:uniqueId})
  },
// 限制图片上传的大小
// oversize:function(file){
//   wx.showToast({
//     title: '文件大小不能超过4M',
//     icon: 'none'
//   })
//   return
// },

  
  afterRead4(event) {
    var that = this;
    const {
      file
    } = event.detail;
    console.log(file.path, '***')
    that.setData({
      license: file.path,
      isbusiness:true,
    });
  },
  clickCategory: function () {
    var token = wx.getStorageSync('token')
    var that =this;
    that.setData({
      showCategory: true,
    })
    wx.request({
      //接口，
      url: 'https://xssj.letterbook.cn/xssh/merchant/queryMarchantBigTypeList',
      header: {
        token: token,
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {},
      method: 'POST',
      success: function (res) {
        console.log(res)
        that.setData({
          navList:res.data.data,
        })
        console.log(res.data.data[0].marchantTypeId,'****')
         that.getMarchantItem(res.data.data[0].marchantTypeId)
      },
      fail: function () {
        doFail();

      },
    })
  },
  getMarchantItem:function(index){
    var token = wx.getStorageSync('token')
    var that =this;
    wx.request({
      //接口，
      url:'https://xssj.letterbook.cn/xssh/merchant/queryMarchantLittleTypeList',
        header: {
          token:token, 
          'content-type': 'application/x-www-form-urlencoded'
        },
      data: { 
        parentId:index
      },
            method: 'POST',
            success: function (res) {
              that.setData({
                navListItem:res.data.data
              })
                             
      },
            fail: function () {
                doFail();
        
      },
        })
},
onChange:function(e){
  console.log(e.target.dataset.index)
  this.getMarchantItem(e.target.dataset.index);
},
suerCategories:function(event){
  console.log(event.currentTarget.dataset.index.marchantTypeId)
  this.setData({
    showCategory: false,
    marchantTypeId:event.currentTarget.dataset.index.marchantTypeId,
    businessName:event.currentTarget.dataset.index.businessName
  });
},
// changeNav:function(val,idx){
//   console.log(val,idx)
//   this.setData({
//     navActive:idx
//   })
//   this.getMarchantItem(val.marchantTypeId)

// },
  openshopshow:function () {
    var that = this;
    // that.data.showarea = !that.data.showarea
    that.setData({
      show: true,
      showarea: true
    })
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onClose1() {
    this.setData({
      showCategory: false,
    });
  },
  cancel: function () {
    this.setData({
      show: false
    });
  },
  confirm: function (item) {
    console.log(item)
    var values = item.detail.values
    if (values[0].name != "" && values[1].name != "" && values[2].name != "") {
      var province = values[0].name
      var city = values[1].name
      var area = values[2].name
      this.data.provinceidcode = values[0].code;
      this.data.cityidcode = values[1].code;
      this.data.areaidcode = values[2].code;
      this.setData({
        show: false,
        shop_address: province + " " + city + " " + area
      });
    }
  },
  onDescribe1:function(e){
    this.setData({
      useName:e.detail.value,
    })
  },
  onDescribe2:function(e){
    this.setData({
      tel:e.detail.value,
    })
  },
  onDescribe3:function(e){
    this.setData({
      card:e.detail.value,
    })
  },
  onDescribe4:function(e){
    this.setData({
      businessName:e.detail.value,
    })
  },
  onDescribe5:function(e){
    this.setData({
      shop_pname:e.detail.value,
    })
  },
  onDescribe6:function(e){
    this.setData({
      shop_address:e.detail.value,
    })
  },
  onDescribe7:function(e){
    this.setData({
      shop_detail_address:e.detail.value,
    })
  },
  clickSubimt:function(){
    var token = wx.getStorageSync('token')
    //console.log(this.data.tel)
    if(this.data.useName==''){
      wx.showToast({
        title: '请填写姓名',
        icon: 'none'
      })
      return;
    }
    if(this.data.useName.length>10){
      wx.showToast({
        title: '姓名不能超过十个字符',
        icon: 'none'
      })
      return;
    }
    if(this.data.tel==''){
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return;
    }
    if(!(/^1[3456789]\d{9}$/.test(this.data.tel))){
      wx.showToast({
        title: '手机号有误',
        icon: 'none'
      })
      return;
    }
    if(this.data.card==''){
      wx.showToast({
        title: '请输入身份证',
        icon: 'none'
      })
      return;
    }
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if(reg.test(this.data.card) === false){
      wx.showToast({
        title: '身份证输入有误',
        icon: 'none'
      })
      return;
    }
    if(this.data.businessName==''){
      wx.showToast({
        title: '请选择经营品类',
        icon: 'none'
      })
      return;
    }
    if(this.data.shop_pname==''){
      wx.showToast({
        title: '请填写商家名称',
        icon: 'none'
      })
      return;
    }
    if(this.data.shop_pname.length>10){
      wx.showToast({
        title: '商家名称不能超过',
        icon: 'none'
      })
      return;
    }
    if(this.data.shop_address==''){
      wx.showToast({
        title: '请选择商家地址',
        icon: 'none'
      })
      return;
    }
    if(this.data.shop_detail_address==''){
      wx.showToast({
        title: '请填写商家详细地址',
        icon: 'none'
      })
      return;
    }
    if(this.data.shop_detail_address.length>30){
      wx.showToast({
        title: '商家详细地址不能超过30个字符',
        icon: 'none'
      })
      return;
    }
    if(this.data.isbusiness==false){
      wx.showToast({
        title: '请上传营业执照',
        icon: 'none'
      })
      return;
    }
    Dialog.confirm({
      title: '提示',
      message: '确认提交？',
    })
      .then(() => {
        wx.request({
          //接口，
          //url:'https://xssj.letterbook.cn/xssh/merchant/addMarchant',
            header: {
              token:token, 
              'content-type': 'application/x-www-form-urlencoded'
            },
          data: {
            licenseImg:this.data.license,
           
            legalPerson:this.data.useName,//姓名
            legalPersonCardId:this.data.tel,//电话
            legalPersonCardId:this.data.card,//身份证号码
            nickName:this.data.shop_pname,//商家名称
            address:this.data.shop_detail_address,//详细地址

            marchantTypeId:this.data.marchantTypeId,//经营品类id
            provinceid:this.data.provinceidcode,
            cityid:this.data.cityidcode,
            areaid:this.data.areaidcode,
            
            uniqueId:this.data.uniqueId,
           
            
            },
                method: 'POST',
                success: function (res) {
                  wx.navigateBack({
                    delta:1
                 })
                                 
          },
                fail: function () {
                    doFail();
            
          },
            })
      });
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

  },

  /**
   * 用户点击右上角分享
   */
   
})