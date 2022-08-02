let app=getApp();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        cWidth:292,
		cHeight:504,
		posterImg:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options){
            var shareUrl=decodeURIComponent(options.shareUrl);
            this.setData({shareUrl});
            console.log('分享页面地址-----',shareUrl);
            this.getCodeImg(shareUrl);
        }
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
    onShareAppMessage: function () {

    },

    getCodeImg(shareUrl){
        var appid=wx.getStorageSync('appid');
        app.sjrequest1('/activityBusiness/createQr',{
            page:shareUrl,
            appId:appid
        }).then(res=>{
            console.log('小程序码地址---',res);
            if(res.statusCode==200 && res.data.code===0){
                var data=res.data.data;
                this.setData({codeImg:data});
                this.drawCanvasImg2(data);
            }
        })
    },

    drawCanvasImg2(codeImg){
        wx.showLoading({title:'海报生成中'})
        var ctx=wx.createCanvasContext('activityPosterCanvas');
        ctx.save();

        var imgUrl='../imgs/activity_posters.png';
        var {cWidth,cHeight} = this.data;
        ctx.drawImage(imgUrl,0,0,cWidth,cHeight);

        wx.getImageInfo({
            src:codeImg,
            success:res=>{
                var filePath=res.path;

                ctx.fillStyle='#fff';
                ctx.fillRect(96,359,100,100);
                
                ctx.drawImage(filePath,99,362,93,93);

                this.roundRect(ctx,96,359,100,100,5);

                //绘制文本
                ctx.restore();
                ctx.fillStyle='#fff';
                ctx.textAlign='center';
                ctx.textBaseline='middle';
                ctx.fontSize='30px';
                ctx.fillText('长按识别二维码参与活动',cWidth/2,476);

                ctx.draw(true);
                setTimeout(()=>{
                    //导出图片
                    wx.canvasToTempFilePath({
                        canvasId:'activityPosterCanvas',
                        x:0,y:0,width:cWidth,height:cHeight,
                        destWidth:cWidth*2,destHeight:cHeight*2,
                        success:res=>{
                            console.log('==导出的图片===',res);
                            this.setData({posterImg:res.tempFilePath});
                            wx.hideLoading();
                        },
                        fail:err=>{
                            console.log(err);
                        }
                    });
                },300)
            },
            fail:err=>{
                console.log('err=====:',err);
            }
        });
    },

    roundRect(ctx, x, y, w, h, r) {
        // 开始绘制
        ctx.beginPath()
        // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
        // 这里是使用 fill 还是 stroke都可以，二选一即可
        //ctx.setFillStyle('transparent')
        // ctx.setStrokeStyle('transparent')
        // ctx.fillStyle='transparent';
        ctx.strokeStyle='transparent';
        // 左上角
        ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
        
        // border-top
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + w - r, y)
        ctx.lineTo(x + w, y + r)
        // 右上角
        ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
        
        // border-right
        ctx.lineTo(x + w, y + h - r)
        ctx.lineTo(x + w - r, y + h)
        // 右下角
        ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
        
        // border-bottom
        ctx.lineTo(x + r, y + h)
        ctx.lineTo(x, y + h - r)
        // 左下角
        ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
        
        // border-left
        ctx.lineTo(x, y + r)
        ctx.lineTo(x + r, y)
        
        // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
        // ctx.fill()
        ctx.stroke()
        ctx.closePath()
        // 剪切
        ctx.clip()
    },

    savePoster(){
        wx.saveImageToPhotosAlbum({
            filePath:this.data.posterImg,
            success:res=>{
                wx.showToast({title:'保存成功',icon:'none'});
            }
        });
    }

})