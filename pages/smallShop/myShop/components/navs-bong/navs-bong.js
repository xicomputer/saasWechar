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
			if(url=='top'){
				this.triggerEvent('test')
			}else if(url=="/pages/tabPage/me/me"){
				wx.navigateTo({
				  url: '/pages/tabPage/me/me',
				});
			}else{
				wx.navigateTo({
					// url:url+'?marchantId='+this.data.marchantId
					url:url
				})
			}
		}
	}
})
