<template>
    <div :class="s.bind">
        <p :class="s.tip"><i>*</i>客户报备成功后将成为您的意向客户</p>
        <div :class="s.form">
            <div :class="s.form_item">
                <label :class="[s.form_label, s.required]">客户名称</label>
                <div :class="s.form_input">
                    <input type="text" placeholder="请输入" v-validate="'required|name'" name="客户名称" data-vv-validate-on="blur" v-model="model.customer_name">
                    <span :class="s.form_error" v-show="errors.has('客户名称')">{{errors.first('客户名称')}}</span>
                </div>
            </div>
            <div :class="s.form_item">
                <label :class="[s.form_label, s.required]">联系人姓名</label>
                <div :class="s.form_input">
                    <input type="text" placeholder="请输入" v-validate="'required|name'" name="联系人姓名" data-vv-validate-on="blur" v-model="model.contact_name">
                    <span :class="s.form_error" v-show="errors.has('联系人姓名')">{{errors.first('联系人姓名')}}</span>
                </div>
            </div>
            <div :class="s.form_item">
                <label :class="[s.form_label, s.required]">联系人手机号</label>
                <div :class="s.form_input">
                    <input type="mobile" placeholder="请输入" v-validate="'required|mobile'" name="联系人手机号" data-vv-validate-on="blur" v-model="model.contact_mobile">
                    <span :class="s.form_error" v-show="errors.has('联系人手机号')">{{errors.first('联系人手机号')}}</span>
                </div>
            </div>
            <div :class="s.form_item">
                <label :class="s.form_label">企业识别码</label>
                <div :class="s.form_input">
                    <input type="text" placeholder="请输入" v-model="model.company_no">
                </div>
            </div>
            <div :class="s.form_item">
                <label :class="[s.form_label, s.min]">备注</label>
                <div :class="[s.form_input, s.max]">
                    <input type="text" placeholder="请输入" v-model="model.remark">
                </div>
            </div>
            <div :class="[s.form_item,s.attachment]">
                <label :class="[s.form_label, s.min]">
                    附件
                </label>
                <div :class="[s.form_input, s.max]">
                    <input style="font-size:12px" type="text" readonly placeholder="(您可以上传联系人名片和沟通记录照片)">
                </div>
            </div>
            <div :class="s.attachment">
                <div>
                    <attachment :list="attachList" :max-file-num="2"></attachment>
                </div>
            </div>
        </div>
        <div :class="s.actions">
            <mt-button type="primary" size="large" @click="submit">提交</mt-button>
        </div>
    </div>
</template>
<script>
import attachment from '../component/attachment.vue'
export default {
    components: { attachment },
    data() {
        return {
            model: {
                company_no: '',
                contact_mobile: '',
                contact_name: '',
                customer_name: '',
                remark: ''
            },
            attachList: []
        }
    },
    methods: {
        submit() {
            this.$validator.validateAll()
                .then(async result => {
                    if (result) {
                        try {
                            if (this.attachList.length) {
                                this.model.file1 = this.attachList[0].file_qiniu_url
                                this.model.file2 = this.attachList[1] && this.attachList[1].file_qiniu_url
                            }
                            await Vue.$Api.post('/sales/api/wechat/reported_customer/', this.model)
                            Vue.$Toast('提交成功')
                            setTimeout(() => {
                                this.$router.push({ name: 'listReport' })
                            }, 1000)
                        } catch (e) {
                            console.warn(e)
                            e.errormsg && Vue.$Toast(e.errormsg)
                        }
                    }
                })
        }
    },
    created() {

    }
}
</script>
<style module="s">
@import './../static/scss/mixin.scss';
.bind {
    width: 92%;
    margin: 0 auto;
    .tip {
        font-size: 12px;
        color: #80848f;
        padding: 0.4rem 0 0.72rem;
        i {
            color: #ff9900;
        }
    }
    .form_item {
        height: 1.1rem;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        color: #495060;
        border-bottom: 1px solid #e1e6eb;
    }
    .attachment {
        border-bottom: none;
        .form_label {
            &.min {
                width: 10%;
            }
        }
    }
    .form_label {
        width: 30%;
        font-size: 15px;
        line-height: 1em;
        &.required::after {
            position: absolute;
            content: '*';
            color: #ed3f14;
        }
        &.min {
            width: 15%;
        }
    }
    .form_input {
        width: 70%;
        position: relative;
        line-height: 1em;
        &.max {
            width: 85%;
        }

        &>input {
            width: 100%;
            font-size: 14px;
            line-height: 1em;
        }
        .input_checkcode {
            display: flex;
            input {
                width: 64%;
            }
            .getcode {
                width: 36%;
                text-align: center;
                font-size: 12px;
                @include border-h;
            }
        }
    }
    .form_error {
        width: 100%;
        color: #ed3f14;
        position: absolute;
        font-size: 12px;
        line-height: 1em;
    }
    .actions {
        margin-top: 0.6rem;
    }
}
</style>