/**
 * Created by Dianmi-LSP on 2017/2/20.
 */
export default{
    data() {
        let appId
        if (ENV === 'dev-server' || ENV === 'dev') {
            appId = 'wx97cf5a6c086ecba4'
        } else if (ENV === 'test') {
            appId = 'wxd98280c89d732ed7';
        } else if (ENV ==='pd') {
            appId = 'wx1ec85317889074c2';
        }

        return {
            appId: appId,
            sign:{
                timestamp: null,
                noncestr: "",
                signature: ""
            }
        }
    },
    methods: {
        wxConfig() {
            wx.config({
                debug: ENV == 'dev-server' || ENV == 'dev', // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: this.appId, // 必填，公众号的唯一标识
                timestamp: this.sign.timestamp, // 必填，生成签名的时间戳
                nonceStr: this.sign.noncestr, // 必填，生成签名的随机串
                signature: this.sign.signature,// 必填，签名，见附录1
                jsApiList: ['closeWindow','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','chooseImage','uploadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function(){
                console.log('已成功')
            })
            wx.error(function(res){
                console.log(res)
            })
        }
    },
    created() {
        // 绑定了才去拿签名
        if (Vue.$Util.getCache('is_bound')) {
            Vue.$Api.post('/sales/api/wechat/get_jsapi_signature/', {url: location.href.split('#')[0]}).then(res => {
                this.sign = {
                    timestamp: res.timestamp,
                    noncestr: res.noncestr,
                    signature: res.signature
                }
                this.wxConfig()
            }).catch(e => {
                console.warn(e)
                e.errormsg && Vue.$Toast(e.errormsg)
            })
        }

    }
}
