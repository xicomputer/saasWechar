// pages/Address/NewAddress/NewAddress.js
import AreaList from '../../../public/js/area';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ["省市区县", "、", "乡镇等"],
    customItem: "",
    // 默认地址选择
    defaultboll: 0,
    addrname: '',
    addrphone: "",
    addrarea: "",
    isDefault: 0, //标识是否为默认地址 1是 0否
    title: "",
    shippingId: "",
    address: "",
    checked: true,
    showarea: false,
    areaList: AreaList,
    provincesName: "", //省
    cityName: "", //市
    areaName: "", //区
    provincesId: "", //省code
    cityId: "", //市code
    areaId: "", //区code
    shop_address: "",
    addr: {},
    path: "/addlist",
    from: '',
    orderData: '',
    title: '新建地址'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.item) {
      wx.setNavigationBarTitle({
        title: '修改地址'
      })
      var item = JSON.parse(options.item)
      console.log(item, '这个item是什么')
      this.setData({
        title: '修改地址',
        shippingId: item.shippingId,
        addrarea: item.address,
        checked: item.isDefault == 1 ? true : false,
        provincesName: item.provincesName,
        cityName: item.cityName,
        areaName: item.areaName,
        addrname: item.contacts,
        addrphone: item.contactWay,
        areaId: item.areaId,
        shop_address: item.provincesName + '' + item.cityName + '' + item.areaName
      })
    }
  },
  onChange() {
    this.setData({
      checked: !this.data.checked
    })
  },
  showAreaList() {
    this.setData({
      showarea: true
    })
  },
  /*点击取消*/
  cancel() {
    this.setData({
      showarea: false
    })
  },
  updateName(e) {
    this.setData({
      addrname: e.detail.value
    })
  },
  updatePhone(e) {
    this.setData({
      addrphone: e.detail.value
    })
  },
  addrarea(e) {
    this.setData({
      addrarea: e.detail.value
    })
    console.log(this.data.addrarea)
  },
  confirm: function (item) {
    console.log(item)
    var values = item.detail.values
    if (values[0].name != "" && values[1].name != "" && values[2].name != "") {
      var province = values[0].name
      var city = values[1].name
      var area = values[2].name
      this.setData({
        showarea: false,
        shop_address: province + " " + city + " " + area,
        areaName: area,
        cityName: city,
        provincesName: province,
        areaId: values[2].code,
      });
      console.log(this.data.shop_address)
    }
  },
  saveBtn() {
    var that = this;
    var pages = getCurrentPages()
    var prevPge = pages[pages.length - 2]
    if (this.data.addrname == "") {
      wx.showToast({
        icon: 'none',
        title: '收货人姓名不能为空！',
      })
      return;
    }
    if (this.data.addrphone == "") {
      wx.showToast({
        icon: 'none',
        title: '请填写收货人手机号！',
      })
      return;
    }
    var re = /^1\d{10}$/;
    let str = this.data.addrphone;
    if (!re.test(str)) {
      wx.showToast({
        icon: 'none',
        title: '抱歉手机号不合法',
      })
      return;
    }
    if (this.data.shop_address == "") {
      wx.showToast({
        icon: 'none',
        title: '请选择所在地区',
      })
      return;
    }
    if (this.addrarea == "") {
      wx.showToast({
        icon: 'none',
        title: '请填写详细地址！',
      })
      return;
    }

    if (this.data.checked == true) {
      this.setData({
        isDefault: 1
      })
    } else {
      this.setData({
        isDefault: 0
      })
    }
    1
    if (this.data.title == "新建地址") {
      let data = {
        address: this.data.addrarea,
        contacts: this.data.addrname,
        contactWay: this.data.addrphone,
        provincesName: this.data.provincesName,
        cityName: this.data.cityName,
        areaId: this.data.areaId,
        areaName: this.data.areaName,
        isDefault: this.data.isDefault
      }
      wx.showLoading({
        title: '保存中',
        mask: true
      })
      app.sjrequest('/commodity/addShipping', data).then(res => {
        if (res.data.code == 200) {
          wx.showToast({
            title: '新建成功！',
          })
          wx.navigateBack({
            delta: 0,
            success: (res) => {
              prevPge.showaddrList()
            },
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }

      })
    } else {
      let data = {
        address: this.data.addrarea,
        contacts: this.data.addrname,
        contactWay: this.data.addrphone,
        provincesName: this.data.provincesName,
        cityName: this.data.cityName,
        areaId: this.data.areaId,
        areaName: this.data.areaName,
        isDefault: this.data.isDefault,
        shippingId: this.data.shippingId
      }
      console.log(data,'修改参数')
      wx.showLoading({
        title: '修改中',
        mask: true
      })
      app.sjrequest('/commodity/updateShipping', data).then(res => {
        if (res.data.code == 200) {
          wx.showToast({
            icon: 'none',
            title: '修改成功！',
          }).then(res => {
            wx.navigateBack({
              delta: 0,
              success: (res) => {
                prevPge.showaddrList()
              },
              fail: (res) => {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })
              },
              complete: (res) => {},
            })
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      })
    }
  },
  // getPosition() {
  //   let that = this
  //   wx.getSetting({
  //     success(res) { // 查看所有权限
  //       console.log(res.authSetting['scope.userLocation'])
  //       let status = res.authSetting['scope.userLocation'] // 查看位置权限的状态，此处为初次请求，所以值为undefined
  //       if (!status) { // 如果是首次授权(undefined)或者之前拒绝授权(false)
  //         wx.authorize({ // 发起请求用户授权
  //           scope: 'scope.userLocation',
  //           success() { // 用户允许了授权
  //             wx.chooseLocation({
  //               success(res) {
  //                 console.log(res)
  //                 that.loadCity(res.longitude, res.latitude)
  //                 that.setData({
  //                   addrarea: res.name
  //                 })
  //               }
  //             })
  //           },
  //           fail() {
  //             wx.showToast({
  //               title: '没有获取地理位置的权限，请点击右上角的设置进行授权',
  //               icon: 'none'
  //             })
  //           }
  //         })
  //       } else {
  //         wx.chooseLocation({
  //           success(res) {
  //             console.log(res)
  //             that.loadCity(res.longitude, res.latitude)
  //             that.setData({
  //               addrarea: res.name
  //             })
  //           }
  //         })
  //       }
  //     }
  //   })
  // },
  // 逆地理编码得到省市区
  loadCity: function (longitude, latitude) {
    var that = this
    var ak = 'nAETk3quykytq5oGFuDuxZWG6ex2j7yz'
    wx.request({
      url: 'https://api.map.baidu.com/reverse_geocoding/v3/?ak=' + ak + '&output=json&coordtype=wgs84ll&location=' + latitude + ',' + longitude,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res); // 打印信息，可以参考下图
        // 省
        var province = res.data.result.addressComponent.province;
        // 市
        var city = res.data.result.addressComponent.city;
        // 区
        var district = res.data.result.addressComponent.district;
        var newCity = province + ' ' + city + ' ' + district;
        var areaId = res.data.result.addressComponent.adcode
        that.setData({
          shop_address: province + " " + city + " " + district,
          areaName: district,
          cityName: city,
          provincesName: province,
          areaId: areaId
        })
        console.log(newCity)
      },
      fail: function () {
        util.showErrorToast('定位当前位置失败');
      }
    })
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