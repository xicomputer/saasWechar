//消息订阅
const tmplIds1 = 'GZIJspjTbLTkEi77lWWXripwMv2Wt1ILto3OGCLj8xg'//竞拍价格被超越通知
const tmplIds2 = 'suNbhsvBS9pQ2sJ7iQFehdazX_TKnR3j-PrUGotCuLs'//竞拍成功通知
const tmplIds3 = '5E6XOeSBYf8kAFApXfHMhuUcGxIo6vpcL965jVcvgvE'//拍卖状态改变提醒
const tmplIds4 = 'fqS3_AlCUt6tQZMMzroJLH72heDZR_fvV_jz-MKasNw'//拍品支付通知
const tmplIds5 = 'vZmvHDtLkKdjC4pxDVwpiksWMr2Oki6WqY84jtj2hNM'//商家发布拍卖提醒
function templateMessage(type) {
	let tmplIds
	if(type == 1){
		tmplIds = [tmplIds1,tmplIds5]
	}else if(type == 3){
		tmplIds = [tmplIds3]
	}else if(type == 4){
		tmplIds = [tmplIds4]
	}else if(type == 5){
		tmplIds = [tmplIds2,tmplIds4,tmplIds5]
	}
	let promise = new Promise((resolve, reject) => {
		wx.requestSubscribeMessage({
		  tmplIds: tmplIds,
		  success (res) {
			  resolve(res)
		  },
		  fail (err) {
			  reject(err)
			}
		})
	})
	return promise
}
module.exports = {
	tmplIds1: tmplIds1,
	tmplIds2: tmplIds2,
	tmplIds3: tmplIds3,
	tmplIds4: tmplIds4,
	tmplIds5: tmplIds5,
	templateMessage: templateMessage
}
