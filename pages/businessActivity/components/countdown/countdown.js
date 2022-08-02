// pages/businessActivity/components/countdown/countdown.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        endTime:{
            type:String,
            value:''
        },
        useSlot:{
            type:Boolean,
            value:false,
        }
    },

    observers:{
        'endTime':function(){
            this.startTime();
        }
    },

    lifetimes: { // 生命周期函数，
        ready: function () { },
        moved: function () { },
        detached: function () {
            if(this.data.interval){
                clearInterval(this.data.interval);
                this.setData({interval:null});
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        showText:'活动剩余时间:0天0小时0分',
        interval:null
    },

    /**
     * 组件的方法列表
     */
    methods: {
        _parseDate(str,resType) { //resType 取值 'object' | 'number'
            var a = str.split(/[^0-9]+/);
            var date = new Date(a[0], a[1] - 1, a[2], a[3] || 0, a[4] || 0, a[5] || 0);
            return resType == 'number' ? date.getTime() : date;
        },

        computedTimes(times){
            var dayTimes=24*60*60*1000;
            var day=Math.floor(times/dayTimes);
            times=times%dayTimes;
            var h=Math.floor(times/(60*60*1000));
            times=times%(60*60*1000);
            var mi=Math.floor(times/(60*1000));
            times=times%(60*1000);
            var s=Math.floor(times/1000);
            return {day,h,mi,s};
        },

        startTime(){
            var endTime=this.properties.endTime;
            var nowDate=new Date().getTime();
            var endDate=this._parseDate(endTime,'number');
            var times=endDate-nowDate;
            if(!this.data.interval && times>0){
                var interval=setInterval(()=>{
                    if(times>=0){
                        var {day,h,mi,s}=this.computedTimes(times);
                        var showText=`活动剩余时间:${day}天${h}小时${mi}分${s}秒`;
                        this.setData({showText},()=>{
                            times-=1000;
                            this.triggerEvent('change',{day,h,mi,s});
                        });
                    }else{
                        if(this.data.interval){
                            clearInterval(this.data.interval);
                            this.setData({interval:null});
                        }
                        this.triggerEvent('activityEndEvent');
                    }
                },1000);
                this.setData({interval});
            }
        },

    },


})
