

// pages/sign-inActivity/sign-inActivity.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		token: '',
		merchantId: '',
		appid: '',
		signInDates: [], // 签到日期
		receiveId : '',  //奖品领取ID
		retroaceDate: null,  //需要补签的日期
		shareNum: 0,   // 需要分享的次数
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			token: wx.getStorageSync('token'),
			merchantId: wx.getStorageSync('merchantId'),
			appid: wx.getStorageSync('appid'),
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
	// 用户分享时触发
	async getSignInInfo() {
		try {
			let res = await app.signInRequest('/operation/signature/info', { merchantId: this.data.merchantId })
			if (res.data.code == 200) {
				console.log(res, '签到活动信息')
				this.setData({
					signInDates: res.data.data.signatureDates,
					receiveId: res.data.data.receivePrizeInfo.receiveId,
					shareNum : res.data.data.shareNum   // 需要分享的次数
				})
				this.getRetroaceDate()
			}
		} catch (error) {
			console.log(error)
		}
	},
	// 查询需要补签的日期
	getRetroaceDate(){
		for (let item of this.data.signInDates) {
			let lengt = this.data.signInDates.length - 1
			if (item.isSignature == 0 && item.dataFlag !== this.data.signInDates[lengt].dataFlag) {
				this.setData({
					retroaceDate : item,
				})
				console.log(this.data.retroaceDate, '补签的日期')
				break
			}
		}
	},
	// 上传分享次数
	async countNumberShare() {
		if (this.data.retroaceDate) {
			let data = {
				dateFlag: this.data.retroaceDate.dataFlag ,  // 补签日期
				receiveId: this.data.receiveId  // 领取的ID
			}
			// 当前分享完成后立即补签，所以需要手动+1
			if (this.data.retroaceDate.shareNum  + 1 < this.data.shareNum) {
				let res = await app.signInRequest('/operation/signature/repair/share/add', data) 
			}else {
				let resShare = await app.signInRequest('/operation/signature/repair/share/add', data) 
				let resAdd = await app.signInRequest('/operation/signature/repair/add', data)
			}
		}else {
			wx.showToast({
			  title: '已经补签完成',
			})
		}
	},
	onShareAppMessage: function () {
		this.getSignInInfo()
		setTimeout(() => {
			this.countNumberShare()
		},200)  // 查询今天要补签的日期
		
		return {
			title: '签到活动',
		}
	},
	// onShareTimeline: function () {
	// 	this.getSignInInfo()   // 查询今天要补签的日期
	// 	this.countNumberShare()
	// 	return {
	// 		title: '签到活动',
	// 	}
	// }
})