import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/apply', meta: {title: '申请客户报备'}, name: 'apply', component: r => require.ensure([], () => r(require('../view/apply.vue')), 'apply')},
        {path: '/bind', meta: {title: '绑定账号'}, name: 'bind', component: r => require.ensure([], () => r(require('../view/bind.vue')), 'bind')},
        {path: '/list-company', meta: {title: '企业版客户'}, name: 'listCompany', component: r => require.ensure([], () => r(require('../view/list.vue')), 'listCompany') },
        {path: '/list-unrenew', meta: {title: '未续费客户'}, name: 'listUnrenew', component: r => require.ensure([], () => r(require('../view/list.vue')), 'listUnrenew') },
        {path: '/list-intention', meta: {title: '意向客户'}, name: 'listIntention', component: r => require.ensure([], () => r(require('../view/list.vue')), 'listIntention') },
        {path: '/list-report', meta: {title: '客户报备'}, name: 'listReport', component: r => require.ensure([], () => r(require('../view/listReport.vue')), 'listReport') },
        {path: '/list', meta: {title: '客户列表'}, name: 'list', component: r => require.ensure([], () => r(require('../view/list.vue')), 'list')},
        {path: '/manage', meta: {title: '客户管理'}, name: 'manage', component: r => require.ensure([], () => r(require('../view/manage.vue')), 'manage')},
        {path: '/my', meta: {title: '我的账号'}, name: 'my', component: r => require.ensure([], () => r(require('../view/my.vue')), 'my')}
    ]
})
router.beforeEach(async (to, from, next) => {

    // router hooks here

    next()
})

export default router