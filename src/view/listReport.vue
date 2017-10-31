<template>
    <div :class="s.container">
        <collpase :class="s.listContainer" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
            <div :class="s.reportHeader">
                <mt-button style="height:.56rem" type="primary" size="small" @click="clickToApply">申请客户报备</mt-button>
            </div>
            <collpaseItem v-for="item in list" :key="item.id" :name="item.id">
                <div slot="title" :class="s.titleWrap">
                    <h6 :class="s.title">{{item.customer_name}}</h6>
                    <span v-if="item.status == 1" :class="s.status" style="color:orange">报备中</span>
                    <span v-if="item.status == 2" :class="s.status" style="color:red">报备失败</span>
                    <span v-if="item.status == 3" :class="s.status" style="color:green">报备成功</span>
                </div>
                <ul slot="content" :class="s.list">
                    <li :class="s.listItem">
                        <label>申请时间：</label>
                        <p>{{item.application_time|date('yyyy-MM-dd HH:mm:ss')}}</p>
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
                    <li :class="s.listItem">
                        <label>备注：</label>
                        <p>{{item.remark}}</p>
                    </li>
                    <li :class="s.listItem">
                        <label>附件：</label>
                        <p>{{item.filenum}}个</p>
                    </li>
                </ul>
            </collpaseItem>
        </collpase>
        <nodata v-if="list.length==0&&!loading" :tip="['暂无客户报备记录','您提交的客户报备申请记录可在这里查看']"></nodata>
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
            page: {
                p: 1,
                limit: 50,
                totalpage: 1,
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
    methods: {
        async fetchList() {
            this.loading = true
            let params = Object.assign({}, this.page)
            try {
                let data = await Vue.$Api.get('/sales/api/wechat/reported_customer_list/', { params })
                let list = data.objects
                for (let item of list) { //处理附件数量
                    if (item.file1 !== '' && item.file2 !== '') {
                        item.filenum = 2
                    } else if (item.file1 == '' && item.file2 == '') {
                        item.filenum = 0
                    } else {
                        item.filenum = 1
                    }
                }
                this.list = this.list.concat(list)
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
        },
        clickToApply() {
            // let url =location.href.replace('list-report','apply')
            // window.location.href = url
            this.$router.push({ name: 'apply' })
        }
    },
    created() {
        this.list = []
        this.fetchList()
    }
}
</script>
<style module="s" lang="scss">
@import './../static/scss/mixin.scss';
.container {
    width: 100%;
    height: 100%;
}

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

.reportHeader {
    padding-right: .29rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: .99rem;
    @include border-v();
}

.titleWrap {
    width: 88%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
        height: .99rem;
        line-height: .99rem;
        font-size: .34rem;
        color: #495060;
        font-weight: normal;
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .status {}
}
</style>