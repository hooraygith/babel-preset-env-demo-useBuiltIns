<template>
    <mainViewCon>
        <div :class="s.pageCell" @click.prevent="showunBind">
            <mt-cell title="解绑账号" is-link></mt-cell>
        </div>
    </mainViewCon>
</template>
<script>
import { MessageBox } from 'mint-ui'
import { Toast } from 'mint-ui'
import mainViewCon from './../component/layout/mainViewCon.vue'
import mixin from './../mixins/mixin.js'
export default {
    mixins: [mixin],
    data() {
        return {}
    },
    components: { mainViewCon },
    methods: {
        showunBind() {
            MessageBox({
                title: '解绑账号',
                message: '解绑后，您将无法查看客户信息及接收任何通知提醒，请确认是否立即解绑？',
                showCancelButton: true,
                confirmButtonText: '立即解绑'
            }).then(action => {
                if (action == 'confirm') {
                    this.unBind()
                }
            })
        },
        async unBind() {
            try {
                let data = await Vue.$Api.post('/sales/api/wechat/unbind/')
                Toast('解绑成功！')
                Vue.$Util.setCache('is_bound', false)
                setTimeout(function() {
                    wx.closeWindow()
                }, 500);
            } catch (e) {
                Toast(e.errormsg)
            }
        }
    },
    created() {
        if (!Vue.$Util.getCache('is_bound')) {
            this.$router.replace({ name: 'bind' })
        }
    }
}
</script>
<style module="s">
.pageCell {
    margin-top: .56rem;
}
</style>