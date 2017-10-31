<template>
    <div>
        <collpase style="width:100%;height:100%;" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
            <collpaseItem v-for="item in list" :key="item.id" :name="item.id">
                <div slot="title" :class="s.titleWrap">
                    <div :class="s.title">
                        <h6>{{item.customer_name}}</h6>
                        <p v-if="$route.name!=='listIntention'">订阅起止日期：{{item.subscribe_start_dt|date}} ~ {{item.subscribe_end_dt|date}}</p>
                    </div>
                </div>
                <ul slot="content" :class="s.list">
                    <li :class="s.listItem">
                        <label>客户创建时间：</label>
                        <p>{{item.add_dt|date('yyyy-MM-dd HH:mm:ss')}}</p>
                    </li>
                    <li :class="s.listItem">
                        <label>客户名称：</label>
                        <p>{{item.customer_name}}</p>
                    </li>
                    <li :class="s.listItem">
                        <label>联系人姓名：</label>
                        <p>{{item.contact_name}}</p>
                    </li>
                    <li :class="s.listItem">
                        <label>联系人手机号：</label>
                        <p>{{item.contact_mobile}}</p>
                    </li>
                    <li :class="s.listItem">
                        <label>企业识别码：</label>
                        <p>{{item.company_no}}</p>
                    </li>
                </ul>
            </collpaseItem>
        </collpase>
        <nodata v-if="list.length == 0&&!loading" :tip="listApi.nodata"></nodata>
    </div>
</template>
<script>
import collpase from './../component/layout/collapse/index.js'
import nodata from './../component/layout/listNodata.vue'
export default {
    components: { collpase, collpaseItem: collpase.collpaseItem, nodata },
    data() {
        return {
            list: [],
            listApi: {},
            page: {
                p: 1,
                limit: 50,
                totalpage: 1
            },
            loading: false,
        }
    },
    filters: {
        date(val, format = 'yyyy-MM-dd') {
            if (!val) return val;
            val.length == 7 && (val += '-01');
            return Vue.$Util.date.format(val, format);
        }
    },
    watch: {
        '$route': 'fixApi',
    },
    methods: {
        fixApi() {
            switch (this.$route.name) {
                case 'listCompany':
                    this.listApi = { api: '/sales/api/wechat/customer_list/', type: 1, nodata: ['暂无企业版客户', '您报备成功并购买企业版成功的客户可在这里查看'] }
                    break
                case 'listUnrenew':
                    this.listApi = { api: '/sales/api/wechat/customer_list/', type: 0, nodata: ['暂无未续费客户', '您的企业版已到期的客户可在这里查看'] }
                    break
                case 'listIntention':
                    this.listApi = { api: '/sales/api/wechat/intention_customer_list/', nodata: ['暂无意向客户', '您的报备成功的客户可在这里查看'] }
                    break
                default:
                    break
            }
            this.list = []
            this.page = {
                p: 1,
                limit: 50,
                totalpage: 1
            }
        },
        async fetchList() {
            this.loading = true
            let params = Object.assign({}, { p: this.page.p, limit: this.page.limit }, { type: this.listApi.type })
            try {
                let data = await Vue.$Api.get(this.listApi.api, { params })
                let list = this.list
                this.list = list.concat(data.objects)
                this.page = Object.assign({}, this.page, { p: data.p, totalpage: data.totalpage })
            } catch (e) {
                console.log(e.errormsg)
            }
            this.loading = false
        },
        loadMore() {
            if (this.page.p < this.page.totalpage) {
                this.loading = true;
                this.page.p += 1
                this.fetchList()
            }
        }
    },
    created() {
        this.list = []
        this.fixApi()
        this.fetchList()
    }
}
</script>
<style module="s" lang="scss">
.list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.listItem {
    display: flex;
    margin: .1rem 0;
    font-size: .28rem;

    label {
        display: block;
        width: 2.3rem;
        color: #80848f;
    }
    p {
        color: #495060;
        max-width: 60%;
    }
}

.titleWrap {
    width: 88%;
    .title {
        height: 1.29rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        h6 {
            font-size: .34rem;
            color: #495060;
            font-weight: normal;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        p {
            font-size: .24rem;
            color: #80848f;
            margin-top: .06rem;
        }
    }
}
</style>