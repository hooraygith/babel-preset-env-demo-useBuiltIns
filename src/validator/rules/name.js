/*
 * 姓名规则，联系人姓名、员工姓名等，为空的判断在另外的规则里
 */

export default (value, args) => {
    if (typeof value === 'undefined') {
        return true
    }
    if (value.toString() === '') {
        return true
    }

    return Vue.$Util.isName(value)
}
