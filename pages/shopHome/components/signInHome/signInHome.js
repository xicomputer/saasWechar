// pages/shopHome/components/hotVideo/hotVideo.js
let app = getApp()
const time = require('../../../../utils/util')
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		userInfo: Object,
		firstSignInData: Object
	},
	/**
	 * 组件的初始数据
	 */
	observers: {
		'firstSignInData': function (nowVal) {
			let nowDay = new Date().getDay()
			if (nowDay == 0) {
				nowDay = 7
			}
			this.setData({
				signData: nowVal,
				nowDay
			})
		}
	},
	data: {
		signData: {}, // 保存签到数据
		isSignInToday: '', // 保存今天未签到的时间
		nowDay: -1, //今天的时间
		weekList: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
	},
	lifetimes: {
		attached: function () {
			this.getSignData()
		}
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		// 判断今天有没有签到
		isSignInToday() {
			let data = this.data.signData.signinList
			let currentTime = String(time.getCurrentTime())
			for (let index in data) {
				if (data[index].signinTime == currentTime && data[index].isSignin == 0) { // 表示今天未签到
					this.setData({
						isSignInToday: currentTime,
					})
				}
			}
			console.log(this.data.isSignInToday, this.data.signData.signinList[0].signinTime, '今天没有签到的时间')

		},
		goIntegral() { //跳转到优惠券页面
			let merchantId = wx.getStorageSync('merchantId')
			wx.navigateTo({
				url: `/pages/Index/integral/integral?marchantId=${merchantId}`,
			})
		},
		// 查询用户签到数据
		getSignData() {
			let marchantId = wx.getStorageSync('merchantId')
			let data = {
				marchantId,
				type: 2
			}
			app.userLogin().then(r => {
				app.sjrequest('/integral/operateSignin', data).then(res => {
					if (res.data.code == 200) {
						let time1 = time.formatTimeSec(res.data.data.countDownTime)
						res.data.data.countDownTime = new Date(time1.replace(/-/g, '/')).getTime() - new Date().getTime();
						let nowDay = new Date().getDay()
						if (nowDay == 0) {
							nowDay = 7
						}
						this.setData({
							signData: res.data.data,
							nowDay
						})
					}
					this.isSignInToday()
				})
			})

		},
	}
})