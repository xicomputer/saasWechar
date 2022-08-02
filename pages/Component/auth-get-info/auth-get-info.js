let app=getApp();

Component({
    lifetimes:{
        attached(){
            this.userLogin();
        }
    },
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        showInfoMask:false,
        showPhoneMask:false,

        info:{},
    },

    /**
     * 组件的方法列表
     */
    methods: {
        userLogin(){
            app.userLogin(true).then(res=>{
                setTimeout(()=>{
                    this.storeUserInfo();
                    app.globalEvent.$emit('loginComplete');
                },300);
            }).catch(err=>{
                app.globalEvent.$emit('loginReject');
            })
        },

        storeUserInfo(){
            wx.getStorage({
                key:'zl_userInfo',
                success:res=>{
                    var result=res.data;
                    this.codeInfo=result;
                    if(result.statusCode==200 && result.data.code==200){
                        var data=result.data.data;
                        if(!data.headimgurl || !data.nickname){
                            this.setData({showInfoMask:true});
                        }
                        if(!data.phoneNumber){
                            this.setData({showPhoneMask:true});
                        }
                    }
                },
                fail:err=>{
                    this.setData({showPhoneMask:true, showInfoMask:true});
                }
            });
        },

        getUserInfo(){
            if(this.emitAuto){return;}
            this.emitAuto=true;
            setTimeout(()=>{this.emitAuto=null},1000);
            
            wx.getUserProfile({
                desc: '头像昵称信息展示',
                success:res=>{ this.saveInfo(res);}
            })
        },

        saveInfo(data){
            let appid=wx.getStorageSync('appid');
            var openid=wx.getStorageSync('thirdWxOpenId');
            app.sjrequest('/thirdWxLogin/auth',{
                appid,openid,
                encryptedData:data.encryptedData,
                iv:data.iv
            }).then(res=>{
                if(res.statusCode==200 && res.data.code==200){
                    var data=res.data.data;
                    var info={
                        avatarUrl:data.headimgurl,
                        nickName:data.nickname,
                    };
                   
                    this.setData({showInfoMask:false});
                    wx.setStorage({key:'wx_userinfo_key',data:{userInfo:info}});

                    var codeInfo=this.codeInfo;
                    if(codeInfo && codeInfo.data && codeInfo.data.data){
                        var resData=codeInfo.data.data;
                        resData.headimgurl=data.headimgurl;
                        resData.nickname=data.nickname;
                        wx.setStorage({key:'zl_userInfo',data:resData});
                    }
                }
            })
        },

        getPhoneNumber(e){
            var detail=e.detail;
            var codeInfo=this.codeInfo;
            var appId='',openId='';
            if(codeInfo && codeInfo.data && codeInfo.data.data){
                var setInfo=codeInfo.data.data.setInfo || {};
                appId=setInfo.appId;
                openId=setInfo.openId;
            }
            if(detail.iv){
                var {iv,encryptedData}=detail;
                app.sjrequest('/thirdWxLogin/deciphering',{
                    appid:appId,openid:openId,iv,encryptedData
                }).then(res=>{
                    if(res.statusCode==200 && res.data.code==200){
                        var phone=res.data.data.phoneNumber;
                        this.setData({showPhoneMask:false});
                        if(codeInfo && codeInfo.data && codeInfo.data.data){
                            var resData=codeInfo.data.data;
                            resData.phoneNumber=phone;
                            wx.setStorage({key:'zl_userInfo',data:codeInfo});
                        }
                    }
                })
            }
        },

    }
})
