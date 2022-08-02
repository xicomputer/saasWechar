// components/menu.js
Component({
	/**
	 * Component properties
	 */
	properties: {
		navs:{
			type:Array,
			value:[]
		},
		cartnum:{
			type:Number,
			value:0
		},
		marchantId:{
			type:Number,
			value:-1
		}

	},

	/**
	 * Component initial data
	 */
	data: {
		isFold: false,//动画切换
		isShow: true,//是否显示
	},
	/**
	 * Component methods
	 */
	methods: {
		onClickAdd: function () {
			this.setData({
				isFold: !this.data.isFold,
				isShow: false
			})
		},
		toJump(e){
			var url = e.currentTarget.dataset.url
		
			console.log(this.data.marchantId)
			if(url=='top'){
				if (wx.pageScrollTo) {
					wx.pageScrollTo({
					  scrollTop: 0
					})
				} else {
					wx.showModal({
						title: '提示',
						content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
					})
				}
			}else{
				if(url == "/pages/tabPage/me/me"){
					wx.switchTab({
					  url: '/pages/tabPage/me/me',
					})
				}else{
					wx.navigateTo({
						url:url+'?marchantId='+this.data.marchantId
					})
				}
	
			}
		}
	}
})
