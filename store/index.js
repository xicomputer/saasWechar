// const Store = require('wxministore');
// import store from './store/index.js'
import Store from "./../utils/lib/store";
// import Store from "wxministore";
export default new Store({
  state: {
    //以下为自定义的全局状态，用法和页面中的data: {...} 一致。
    // msg: 'Mini Store 是一个基于微信小程序的全局状态库。\n能够在Page，Component，template中任意wxml文件内使用全局状态。\n且全局的状态完全同步。',
    msg: 'Mini Store',
    user: {
      name: 'Leisure'
    },
    
    // submitOrderType: '',  // 提交订单类型
    submitObj: '', // 提交订单 数据
    form: '', // 从哪进入 地址
    counter: 0
  },
  methods: {
    goAnyWhere(e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    }
  },
  pageListener: {
    onLoad(options) {
      console.log('我在' + this.route, '参数为', options);
    },
    onHide() {
    }
  },
  // 开启了局部模式
  openPart: true
})