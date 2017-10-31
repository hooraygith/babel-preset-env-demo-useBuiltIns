<template>
    <mainViewCon>
        <nav :class="s.navBox">
            <ul>
                <li :class="s.navList">
                    <router-link :to="{name:'listCompany'}" :class="s.navItem">
                        <img src="./../static/images/manage_company.png" alt="企业版客户">
                        <span>企业版客户</span>
                    </router-link>
                    <router-link :to="{name:'listUnrenew'}" :class="s.navItem">
                        <img src="./../static/images/manage_notpay.png" alt="未续费客户">
                        <span>未续费客户</span>
                    </router-link>
                    <router-link :to="{name:'listIntention'}" :class="s.navItem">
                        <img src="./../static/images/manage_intention.png" alt="意向客户">
                        <span>意向客户</span>
                    </router-link>
                </li>
                <li :class="s.navList">
                    <router-link :to="{name:'listReport'}" :class="s.navItem">
                        <img src="./../static/images/manage_report.png" alt="客户报备">
                        <span>客户报备</span>
                    </router-link>
                    <a :class="s.navItem"></a>
                    <a :class="s.navItem"></a>
                </li>
            </ul>
        </nav>
    </mainViewCon>
</template>
<script>
import mixin from '../mixins/mixin.js'
import mainViewCon from './../component/layout/mainViewCon.vue'
export default {
    mixins: [mixin],
    data() {
        return {}
    },
    components: { mainViewCon },
    created() {
        if (!Vue.$Util.getCache('is_bound')) {
            this.$router.replace({ name: 'bind' })
        }
    },
}
</script>
<style module="s" lang="scss">
@import './../static/scss/mixin.scss';
.navBox {
    margin-top: .56rem;
    text-align: center;
    ul {
        list-style: none;
        padding: 0;
    }
}

.navList {
    display: flex;
    @include border-v(bottom, #e8e9eb);
}

.navItem {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex: 1;
    padding: .48rem 0;
    &:not(:last-child) {
        @include border-h(right, #e8e9eb);
    }
    img {
        height: .72rem;
        width: .72rem;
        margin-bottom: .2rem;
    }
    span {
        font-size: .28rem;
        color: #323232;
    }
}
</style>