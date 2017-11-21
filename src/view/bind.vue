<template>
    <div :class="s.bind">
        <p :class="s.tip"><i>*</i>请输入您的真实姓名和手机号码，进行绑定账号</p>
        <div :class="s.form">
            <div :class="{[s.form_item]:true,[s.hasError]:errors.has('name')}">
                <label :class="s.form_label">姓名</label>
                <div :class="s.form_input">
                    <input type="text" placeholder="请输入" v-validate="'required|name'" name="name" data-vv-validate-on="blur" v-model="query.name">
                    <span :class="s.form_error" v-show="errors.has('name')">{{errors.first('name')}}</span>
                </div>
            </div>
            <div :class="{[s.form_item]:true,[s.hasError]:errors.has('mobile')}">
                <label :class="s.form_label">手机号</label>
                <div :class="s.form_input">
                    <input type="mobile" placeholder="请输入" v-validate="'required|mobile'" name="mobile" data-vv-validate-on="blur" v-model="query.mobile">
                    <span :class="s.form_error" v-show="errors.has('mobile')">{{errors.first('mobile')}}</span>
                </div>
            </div>
            <div :class="{[s.form_item]:true,[s.hasError]:errors.has('checkcode')}">
                <label :class="s.form_label">验证码</label>
                <div :class="s.form_input">
                    <div :class="s.input_checkcode">
                        <input type="text" placeholder="请输入" name="checkcode" v-validate="'required'" data-vv-validate-on="blur" v-model="query.checkcode">
                        <div :class="s.getcode">
                            <a href="javascript:;" @click="getCode" v-if="!sendStatus">获取验证码</a>
                            <a href="javascript:;" v-else style="color:#80848f">{{countNum}}s后重发</a>
                        </div>
                    </div>
                    <span :class="s.form_error" v-show="errors.has('checkcode')">{{errors.first('checkcode')}}</span>
                </div>
            </div>
        </div>
        <div :class="s.actions">
            <mt-button type="primary" size="large" @click="submit">提交</mt-button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            query: {
                name: '',
                mobile: '',
                checkcode: ''
            },
            sendStatus: false,
            submitStatus: false,
            countNum: 60,
        }
    },
    methods: {
        getCode() {
            if (!this.submitStatus) {
                this.$validator.validate('mobile')
                    .then(async res => {
                        if (res) {
                            this.submitStatus = true
                            try {
                                await Vue.$Api.post('/sales/api/wechat/get_checkcode/', { mobile: this.query.mobile })
                                Vue.$Toast('验证码已发送，请注意查收')
                                this.sendStatus = true
                                this.count()
                            } catch (e) {
                                this.resetCount()
                                console.warn(e)
                                e.errormsg && Vue.$Toast(e.errormsg)
                            }
                        }
                        this.submitStatus = false
                    })
            }
        },
        count() {
            if (this.countNum === 0) {
                this.resetCount()
                return
            } else {
                setTimeout(() => {
                    this.countNum--
                        this.count()
                }, 1000);
            }
        },
        resetCount() {
            this.sendStatus = false
            this.countNum = 60
        },
        async submit() {
            this.$validator.validateAll()
                .then(async res => {
                    if (res) {
                        try {
                            const data = await Vue.$Api.post('/sales/api/wechat/bind/', this.query)
                            if (data.accesstoken) {
                                Vue.$Toast('绑定成功')
                                Vue.$Util.setCache('accesstoken', data.accesstoken)
                                Vue.$Util.setCache('is_bound', true)
                                Vue.$Util.setCache('expire_date', data.expire_date)
                            }
                            setTimeout(() => {
                                this.$router.replace({ name: 'manage' })
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
        // 如果已经绑定，跳去 我的
        if (Vue.$Util.getCache('is_bound')) {
            this.$router.push({ name: 'my' })
        }

        // 测试 ...
        const a = {
            aa: '1',
            bb: '2'
        }

        const c = {
            ...a,
            cc: '3'
        }

        console.log(44, c)
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
        height: 0.98rem;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        color: #495060;
        border-bottom: 1px solid #e1e6eb;
        &.hasError {
            height: 1.2rem;
        }
    }
    .form_label {
        width: 20%;
        font-size: 15px;
    }
    .form_input {
        width: 80%;
        position: relative;
        font-size: 14px;
        &>input {
            width: 100%;
            font-size: 14px;
        }
        .input_checkcode {
            display: flex;
            align-items: center;
            input {
                width: 64%;
                font-size: 14px;
            }
            .getcode {
                width: 36%;
                text-align: center;
                font-size: 12px;
                @include border-h;
                a{
                    font-size: 14px;
                }
            }
        }
    }
    .form_error {
        width: 100%;
        color: #ed3f14;
        position: absolute;
        font-size: 12px;
    }
    .actions {
        margin-top: 0.6rem;
    }
}
</style>