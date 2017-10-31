/*
 * 手机号正则
 */

export default (val) => {
    const re = /^1[3578][0-9]{9}$/gi
    return re.test(val)
}
