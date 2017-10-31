import axios from 'axios'

const instance = axios.create({
    baseURL: URL_API
})

instance.interceptors.request.use(config => {
    config.headers.accesstoken = Vue.$Util.getCache('accesstoken')
    return config
}, error => {
    return Promise.reject(error);
})

instance.interceptors.response.use(res => {
    res = res.data
    if (!res || res.resultcode !== 200) {
        if (res.resultcode === 403) {
            Vue.$Util.removeCache('accesstoken')
        }
        return Promise.reject(res)
    } else {
        return res.data
    }
}, error => {
    return Promise.reject(error);
})

export default instance
