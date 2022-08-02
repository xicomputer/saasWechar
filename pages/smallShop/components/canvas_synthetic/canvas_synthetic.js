// components/canvas_synthetic/canvas_synthetic.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        canvasId:{
            type:String,
            value:''
        },
        canvasWidth:{
            type:Number,
            value:0
        },
        canvasHeight:{
            type:Number,
            value:0
        },
        canvasBgcolor:{
            type:String,
            value:'#fff'
        },
        showline:{
            type:Boolean,
            value:true
        },
        imgs:{
            type:Array,
            value:[],//{src:'',width:0,height:0,x:0,y:0}
        },
        imgUrl:{
            type:String,
            value:''
        },
        texts:{
            type:Array,
            value:[],//{content:'测试',color:'#999',size:20,x:10,y:10}
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        tempImgUrl:'',//存储生成后的图片
    },

    // 组件生命周期
    lifetimes: {
        created: function(){
    
        },
        attached: function() {// 在组件实例进入页面节点树时执行
            
        },
        detached: function() {// 在组件实例被从页面节点树移除时执行
            
        },
    },

    /**
     * 组件的方法列表
     */
    methods: {
        //获取背景图片信息
        async startSyntheticImg(){
            let arr=[]; 
            for(let item of this.properties.imgs){
                let imgItem={...item};
                if(item.src.search(/https:\/\/|http:\/\/'/)!==-1){
                    let result = await wx.getImageInfo({ src:item.src});
                    imgItem.src=result.path;
                }
                arr.push(imgItem);
            }
            this.syntheticImg(arr);
        },

        //绘制合成图片
        syntheticImg(imgs){
            var {
                canvasId,texts,canvasWidth,canvasHeight,
                canvasBgcolor,showline
            } = this.properties;
            const ctx = wx.createCanvasContext(canvasId,this);

            //绘制白色背景
            ctx.setFillStyle(canvasBgcolor);
            ctx.fillRect(0,0,canvasWidth,canvasHeight);

            //绘制背景图
            imgs.forEach(item=>{
                ctx.drawImage(
                    item.src, item.x, item.y,
                    item.width,item.height
                ); 
            });

            //绘制文本
            ctx.setTextAlign('left'); 
            ctx.setTextBaseline('top');
            texts.forEach(item=>{
                ctx.setFillStyle(item.color); // 文字颜色：黑色
                ctx.setFontSize(item.size);    // 文字字号：22px
                //开始绘制文本的 x/y 坐标位置（相对于画布）
                if(item.textWidth){
                    this.textNewline(ctx,item);
                }else{
                    ctx.fillText(item.content, item.x, item.y,item.textWidth);
                }
                ctx.draw(true);
            });

            if(showline){
                //绘制虚线
                ctx.setLineDash([6, 8], 3);
                ctx.beginPath();
                ctx.moveTo(0,395);
                ctx.lineTo(400, 395);
            }
            
            ctx.stroke();//stroke() 方法会实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径
            ctx.draw(true);
            this.generateImg();
        },

        //生成图片
        generateImg(){
            var that=this;
            setTimeout(function(){
                var {canvasId,canvasWidth,canvasHeight} = that.properties;
                var {cWidth,cHeight} = that.data;
                //把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径
                wx.canvasToTempFilePath({ 
                    x: 0, y: 0,
                    width: canvasWidth,
                    height: canvasHeight,
                    //输出的图片的尺寸（写成width的两倍，生成的图片则更清晰）
                    destWidth: canvasWidth*2, 
                    destHeight: canvasHeight*2,
                    canvasId: canvasId,
                    success: function(res){
                        var tempImgUrl=res.tempFilePath;
                        that.setData({tempImgUrl});
                        that.triggerEvent('generateComplete', {
                            url:tempImgUrl,width:cWidth,height:cHeight
                        });
                    },
                    fail:err=>{
                        console.log(err)
                    }
                },that);
            },300);
        },

        //保存图片
        saveImg(){
            wx.saveImageToPhotosAlbum({
                filePath:this.data.tempImgUrl,
                success:res=>{
                    wx.showToast({title:'已保存到相册',icon:'none'});
                    console.log('保存成功！',res);
                }
            })
        },

        //文本换行处理
        textNewline(ctx,textItem){
            var text = textItem.content;
            var chr =text.split("");//这个方法是将一个字符串分割成字符串数组
            var temp = "";
            var row = [];
            ctx.setFontSize(textItem.size)
            ctx.setFillStyle(textItem.color)
            for (var a = 0; a < chr.length; a++) {
                if (ctx.measureText(temp).width < textItem.textWidth) {
                    temp += chr[a];
                } else {
                    a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
                    row.push(temp);
                    temp = "";
                }
            }
            row.push(temp); 
            //如果数组长度大于2 则截取前两个
            if (row.length > 2) {
                var rowCut = row.slice(0, 2);
                var rowPart = rowCut[1];
                var test = "";
                var empty = [];
                for (var a = 0; a < rowPart.length; a++) {
                    if (ctx.measureText(test).width < 220) {
                    test += rowPart[a];
                    }
                    else {
                    break;
                    }
                }
                empty.push(test);
                var group = empty[0] + "..."//这里只显示两行，超出的用...表示
                rowCut.splice(1, 1, group);
                row = rowCut;
            }
            for (var b = 0; b < row.length; b++) {
                ctx.fillText(row[b], 10, textItem.y + b * 20, textItem.textWidth);
            }
            ctx.draw()
        }

    }
})
