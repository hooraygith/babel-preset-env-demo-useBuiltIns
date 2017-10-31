/*
 * 姓名正则，联系人姓名，员工姓名，不能有数字和标点符号
 */

export default (val) => {
    // const re = /^([a-zA-Z\u4e00-\u9fa5])+$/gi
    const re = /^[^0-9]*$/
    return re.test(val)
}
