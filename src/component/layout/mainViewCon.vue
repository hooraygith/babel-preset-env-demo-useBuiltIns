<template>
    <div :class="s.container">
        <header :class="s.header">
            <div :class="s.avator">
                <img :src="userInfo.wechat_user_headimgurl">
            </div>
            <div :class="s.infowrap">
                <p :class="s.name">{{userInfo.agent_name}}</p>
                <p :class="s.phone">{{userInfo.agent_mobile}}</p>
            </div>
        </header>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: 'mainViewCon',
    data() {
        return {
            userInfo: {}
        }
    },
    methods: {
        async getUserInfo() {
            console.log(1)
            try {
                let data = await Vue.$Api.get('/sales/api/wechat/wechat_user/')
                this.userInfo = data
            } catch (e) {
                console.log(e.errormsg)
            }
        }
    },
    created() {
        this.getUserInfo()
    }
}
</script>
<style module="s" lang="scss">
.container {
    width: 100%;
    height: 100%;
    position: relative;
    padding: .4rem .3rem 0;
    &:before {
        z-index: 1;
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 1.8rem;
        background-image: linear-gradient(to top, #799af1, #22a2fc);
    }
}

.header {
    display: flex;
    align-items: center;
    padding-left: 5.7%;
    z-index: 2;
    position: relative;
    height: 2.4rem;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 5px 15px #ddd;
    border-radius: .1rem;
}

.avator {
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 50%;
    overflow: hidden;
    img {
        width: 100%;
        background-color:#ccc;
    }
}

.infowrap {
    margin-left: 6.9%;
    .name {
        color: #333;
        font-size: .42rem;
        margin-bottom: .1rem;
    }
    .phone {
        color: #858585;
        font-size: .24rem;
    }
}
</style>