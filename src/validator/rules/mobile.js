/*
 * 手机号规则，为空的判断在另外的规则里
 */

export default (value, args) => {
    if (typeof value === 'undefined') {
        return true
    }
    if (value.toString() === '') {
        return true
    }

    return Vue.$Util.isMobile(value)
}
