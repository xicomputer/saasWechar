const auctionUrl = 'https://xinshu.service.letterbook.cn/auction' // 线上拍卖请求地址
const socketUrl = 'wss://xinshu.service.letterbook.cn/ws' // 线上socket请求地址
// const auctionUrl = 'http://192.168.0.100:9300/auction' // 本地拍卖请求地址
// const socketUrl = 'ws://192.168.0.100:8088/ws' // 本地socket请求地址

// 拍卖异步请求
function auctionRequest(url, data, type, method) {
	const zl_jwt = wx.getStorageSync('zl_jwt')
	const token = wx.getStorageSync('token')
	let promise = new Promise((resolve, reject) => {
		wx.showLoading({
			title: '加载中',
			mask: true
		})
		wx.request({
			url: auctionUrl + url,
			method: method ? method : 'POST',
			data: data,
			header: {
				'Authorization': zl_jwt,
				'content-type': type == 'form-data' ? 'application/form-data' : 'application/json;charset=UTF-8'
			},
			success: (res) => {
				if (res.statusCode == 200) {
					if (res.data.code == 403 && !token) {
						console.log(111)
						wx.navigateTo({
							url: '/pages/shopHome/home/home',
						})
					}
					resolve(res);
				} else {
					reject(res.data);
				}
			},
			fail: () => {
				wx.showToast({
					title: '服务器开小差了，请稍后再试',
					icon: 'none',
				})
				reject('服务器开小差了，请稍后再试')
			},
			complete: () => {
				wx.hideLoading()
			}
		})
	})
	return promise
}
module.exports = {
	socketUrl: socketUrl,
	auctionRequest: auctionRequest,
}