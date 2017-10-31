<template>
    <div class="upload-box">
        <div class="progress" v-if="item.uploading" v-for="item in chooseImg">
            <div class="progress-bar" :style="{width:item.progress+'%'}"></div>
            <div class="progress-bar-info">{{item.progress}}%</div>
        </div>
        <button @click="clickHandle" class="btn-upload">+ 点此选择上传文件</button>
    </div>
</template>
<style>
    .upload-box {
        .btn-upload {
            height: 0.74rem;
            width: 100%;
            padding: 0;
            line-height: 0.74rem;
            color: #398de7;
            background-color: #fff;
            border: 1px dashed #e4e4e4;
        }
        .progress {
            margin-bottom: 20px;
            height: 0.74rem;
            width: 100%;
            line-height: 0.74rem;
            border: 1px solid #dcdcdc;
            position: relative;
            .progress-bar{
                position: absolute;
                height:0.74rem;
                left: -1px;
                top:-1px;
                background-color: #5bc0de;
                border: 1px solid #dcdcdc;
                border-right: none;
            }
            .progress-bar-info{
                position: absolute;
                right: 10px;
            }
        }
    }
</style>
<script>
    export default {
        props: {
            count: {   //上传张数
                type: Number,
                default: 1
            }
        },
        data(){
            return{
                uploading: false,
                localIds: [],
                serverIds: [],
                chooseImg: [],
                imgBase64: [],
                interval: {},
                serverId: ''
            }
        },
        methods:{
            clickHandle(){
                if (this.uploading) return   //上传中不可操作
                wx.chooseImage({
                    count: this.count, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: res => {
                        this.localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片


                        res.localIds.forEach(item => {
                            let _term = {localId:item, start:false, progress:0,uploading:false,imgInfo:{}};
                            this.chooseImg.push(_term);
                        })
                        this.syncUpload();
                    }
                })
            },
            showImg(localIds){
                for(let i=0;i<localIds.length;i++){
                    wx.getLocalImgData({
                        localId: localIds[i], // 图片的localID
                        success: res => {
                            var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                            localData = localData.replace('jpg', 'jpeg');
                            this.imgBase64.push(localData)
                        }
                    })
                }
            },
            uploadItem(index){   //一张图片上传
                return new Promise((resolve, reject)=>{
                    let elem = this.chooseImg[index];
                    wx.uploadImage({
                        localId: elem.localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                        isShowProgressTips: 1, // 默认为1，显示进度提示
                        success: async (res) => {
                            console.log(res);
                            this.serverIds.push(res.serverId); // 返回图片的服务器端ID
                            this.serverId = res.serverId
                            resolve(res);
                            let data = await this.uploadToQiniu(res.serverId, index);   //上传到微信的图片  经后台上传七牛
                            elem.progress = 100;
                            clearTimeout(this.interval[elem.localId]);
                            setTimeout(() => {
                                elem.uploading = false;
                            }, 50)
                        },
                        fail:function(res){
                            $toast.error('上传失败');
                            reject(res)
                        }
                    })
                })
            },
            async uploadToQiniu(media_id, index){
                let params={
                    api_type: 101,
                    media_id: media_id,
                    media_type: 1
                }
                try {
                    const data = await Vue.$Api.post('/sales/api/wechat/reported_file/', params)
                    this.$emit('callback', data)
                    this.chooseImg[index].imgInfo = data
                } catch (e) {
                    console.warn(e)
                    e.errormsg && Vue.$Toast(e.errormsg)
                }
            },
            syncUpload(){
                this.uploading=true;
                let localId = this.localIds.pop();
                let index = 0;
                let uploadItem = {}
                for(let [i, elem] of this.chooseImg.entries()){
                    if(elem.localId == localId){
                        elem.start = true;
                        elem.uploading=true;
                        uploadItem = elem;
                        index = i;
                        break
                    }
                }
                Promise.all([this.uploadItem(index)]).then(()=>{
                    if(this.localIds.length > 0){
                        this.syncUpload();
                    }else{
                        this.uploading=false;
                    }
                });
                this.progressHandle(index);
            },
            progressHandle(index){   //模拟进度条
                let elem = this.chooseImg[index];
                if(elem.start){
                    var _interval = () => {
                        if(elem.progress>=90){
                            clearTimeout(this.interval[elem.localId]);
                        }else{
                            elem.start = false;
                            elem.progress += Math.ceil(Math.random()*10);
                            this.interval[elem.localId] = setTimeout(()=>{
                                _interval();
                            },50)
                        }
                    }
                    _interval()

                    this.interval[elem.localId] = ''
                }
            }
        },
        beforeDestory(){
            for (let item in this.interval) {
                clearTimeout(this.interval[item]);
            }
        }
    }
</script>
