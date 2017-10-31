<template>
    <div id="attachments-wrap">
        <div class="attachments-items" v-for="(item, index) in list">
            <div class="pull-left">
                <img :src="item.file_qiniu_url" alt="">
                <div class="image-name">
                    <span>{{item.file_name | fileNameFilter}}</span>
                </div>
                <div class="image-ext">
                    {{item.file_name | fileExtFilter}}
                </div>
                <span class="image-size" v-if="item.file_size > 0">({{item.file_size | smartFileSizeFilter}})</span>
            </div>
            <!-- <i class="mintui mintui-back" @click="deleteAttachment(item, index)"></i> -->
            <span class="icon-delete" @click="deleteAttachment(item, index)"></span>
        </div>
        <upload-image @callback="uploadSuccess" v-if="list.length < maxFileNum"></upload-image>
    </div>
</template>

<script>
    import uploadImage from './upload-image.vue'
    export default {
        components: {uploadImage},
        props: {
            list: {
                type: Array,
            },
            maxFileNum: {       //文件数量限制
                type: Number,
                default: 1
            }
        },
        filters: {
            fileNameFilter(val) {
                const dotIndex = val.lastIndexOf('.')
                if (dotIndex > -1) {
                    return val.slice(0, dotIndex)
                } else {
                    return val
                }
            },
            fileExtFilter(val) {
                const dotIndex = val.lastIndexOf('.')
                if (dotIndex > -1) {
                    return val.slice(dotIndex, val.length)
                } else {
                    return ''
                }
            },
            smartFileSizeFilter(value) {
                var FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                var FILE_SIZE_STEP = 1024;
                function fileSizeFormat(value, power) {
                    return (value / Math.pow(FILE_SIZE_STEP, power)).toFixed(2) + FILE_SIZE_UNITS[power];
                }
                value = parseFloat(value, 10);
                for (var i = 0; i < FILE_SIZE_UNITS.length; i++) {
                    if (value < Math.pow(FILE_SIZE_STEP, i)) {
                        if (FILE_SIZE_UNITS[i - 1]) {
                            return fileSizeFormat(value, i - 1);
                        }
                        return value + FILE_SIZE_UNITS[i];
                    }
                }
                return fileSizeFormat(value, i - 1);
            }
        },
        methods:{
            uploadSuccess(data) {
                this.list.push(data)
            },
            deleteAttachment(item, index) {
                this.list.splice(index, 1)
            }
        }
    }
</script>
<style>
    #attachments-wrap {
        margin-bottom: 0.22rem;
        .attachments-items {
            height: 0.74rem;
            width: 100%;
            padding: 0.1rem 0.2rem;
            margin-bottom: 0.22rem;
            text-align: right;
            border: 1px solid #e0ebee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .pull-left {
                display: flex;
                align-items: center;
            }
            img {
                max-height: 0.5rem;
                max-width: 0.5rem;
                margin-right: 0.2rem;
            }
            .image-name {
                span {
                    display: block;
                    height: 0.5rem;
                    line-height: 0.5rem;
                    max-width: 2rem;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            .image-size {
                margin-left: 6px;
            }
            .icon-delete {
                padding: 0.1rem;
                color: #666;
                display: inline-block;
                background: url('./../static/images/icon_close.png') no-repeat center;
                background-size: contain;
                width: 16px;
                height: 16px;
            }
        }
    }
</style>
