import VeeValidate from 'vee-validate'
import dict from 'validator/dict'
import rules from 'validator/rules'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.min.css'
import 'static/scss/normal.scss'
import 'static/scss/reset.scss'
import './static/scss/mixin.scss'
import App from './App.vue'
import Api from 'api/http'
import router from './router/router.js'
import Util from './util'

window['Vue'] = Vue
Vue.$Util = Vue.prototype.$Util = Util
Vue.$Api = Vue.prototype.$Api = Api
Vue.$Message = Vue.prototype.$Message = Mint.MessageBox
Vue.$Toast = Vue.prototype.$Toast = Mint.Toast

Vue.use(Mint)
Vue.use(VeeValidate)
VeeValidate.Validator.updateDictionary(dict)
VeeValidate.Validator.setLocale('zh_CN')
Object.keys(rules).forEach(rule => {
    VeeValidate.Validator.extend(rule, rules[rule])
})

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
