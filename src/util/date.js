/**
 * Created by ethan on 2016/4/24.
 */
const dateProcess = {
    toInt(str) {
        return parseInt(str, 10) || 0
    },
    padNumber(num, digits, trim) {
        var neg = "";
        if (num < 0) {
            neg = '-';
            num = -num;
        }
        num = "" + num;
        while (num.length < digits)
            num = "0" + num;
        if (trim)
            num = num.substr(num.length - digits);
        return neg + num;
    },
    dateGetter(name, size, offset, trim) {
        var self = this;
        return (date)=> {
            var value = date["get" + name]()
            if (offset > 0 || value > -offset)
                value += offset
            if (value === 0 && offset === -12) {
                value = 12
            }
            return self.padNumber(value, size, trim);
        }
    },
    dateStrGetter(name, shortForm) {
        return (date, formats)=> {
            var value = date["get" + name]();
            var get = (shortForm ? ("SHORT" + name) : name).toUpperCase();
            return formats[get][value];
        }
    },
    timeZoneGetter(date) {
        var self = this;
        var zone = -1 * date.getTimezoneOffset();
        var paddedZone = (zone >= 0) ? "+" : "";
        paddedZone += self.padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) + self.padNumber(Math.abs(zone % 60), 2);
        return paddedZone;
    },
    ampmGetter(date, formats) { //上午下午
        return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
    },
};
const dateUtil = {
    locate: {
        AMPMS: {
            0: "上午",
            1: "下午"
        },
        DAY: {
            0: "星期日",
            1: "星期一",
            2: "星期二",
            3: "星期三",
            4: "星期四",
            5: "星期五",
            6: "星期六"
        },
        MONTH: {
            0: "1月",
            1: "2月",
            2: "3月",
            3: "4月",
            4: "5月",
            5: "6月",
            6: "7月",
            7: "8月",
            8: "9月",
            9: "10月",
            10: "11月",
            11: "12月"
        },
        SHORTDAY: {
            "0": "周日",
            "1": "周一",
            "2": "周二",
            "3": "周三",
            "4": "周四",
            "5": "周五",
            "6": "周六"
        },
        fullDate: "y年M月d日EEEE",
        longDate: "y年M月d日",
        medium: "yyyy-M-d H:mm:ss",
        mediumDate: "yyyy-M-d",
        mediumTime: "H:mm:ss",
        "short": "yy-M-d ah:mm",
        shortDate: "yy-M-d",
        shortTime: "ah:mm"
    },
    DATE_FORMATS: {
        yyyy: dateProcess.dateGetter("FullYear", 4),
        yy: dateProcess.dateGetter("FullYear", 2, 0, true),
        y: dateProcess.dateGetter("FullYear", 1),
        MMMM: dateProcess.dateStrGetter("Month"),
        MMM: dateProcess.dateStrGetter("Month", true),
        MM: dateProcess.dateGetter("Month", 2, 1),
        M: dateProcess.dateGetter("Month", 1, 1),
        dd: dateProcess.dateGetter("Date", 2),
        d: dateProcess.dateGetter("Date", 1),
        HH: dateProcess.dateGetter("Hours", 2),
        H: dateProcess.dateGetter("Hours", 1),
        hh: dateProcess.dateGetter("Hours", 2, -12),
        h: dateProcess.dateGetter("Hours", 1, -12),
        mm: dateProcess.dateGetter("Minutes", 2),
        m: dateProcess.dateGetter("Minutes", 1),
        ss: dateProcess.dateGetter("Seconds", 2),
        s: dateProcess.dateGetter("Seconds", 1),
        sss: dateProcess.dateGetter("Milliseconds", 3),
        EEEE: dateProcess.dateStrGetter("Day"),
        EEE: dateProcess.dateStrGetter("Day", true),
        a: dateProcess.ampmGetter,
        Z: dateProcess.timeZoneGetter
    },
    rdateFormat: /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,
    raspnetjson : /^\/Date\((\d+)\)\/$/,
    format(date, format='yyyy-MM-dd') {
        var locate = dateUtil.locate,
            text = "",
            parts = [],
            fn, match;
        format = format || "mediumDate";
        //format = locate[format] || format;
        if (typeof date === "string") {
            if (/^\d+$/.test(date)) {
                date = dateProcess.toInt(date);
            } else if (dateUtil.raspnetjson.test(date)) {
                date = +RegExp.$1;
            } else {
                var trimDate = date.trim();
                var dateArray = [0, 0, 0, 0, 0, 0, 0];
                var oDate = new Date(0);
                //取得年月日
                trimDate = trimDate.replace(/^(\d+)\D(\d+)\D(\d+)/, (_, a, b, c)=> {
                    var array = c.length === 4 ? [c, a, b] : [a, b, c];
                    dateArray[0] = dateProcess.toInt(array[0]);     //年
                    dateArray[1] = dateProcess.toInt(array[1]) - 1; //月
                    dateArray[2] = dateProcess.toInt(array[2]);     //日
                    return "";
                });
                var dateSetter = oDate.setFullYear;
                var timeSetter = oDate.setHours;
                trimDate = trimDate.replace(/[T\s](\d+):(\d+):?(\d+)?\.?(\d)?/, (_, a, b, c, d)=> {
                    dateArray[3] = dateProcess.toInt(a); //小时
                    dateArray[4] = dateProcess.toInt(b); //分钟
                    dateArray[5] = dateProcess.toInt(c); //秒
                    if (d) {                //毫秒
                        dateArray[6] = Math.round(parseFloat("0." + d) * 1000)
                    }
                    return "";
                });
                var tzHour = 0;
                var tzMin = 0;
                trimDate = trimDate.replace(/Z|([+-])(\d\d):?(\d\d)/, (z, symbol, c, d)=> {
                    dateSetter = oDate.setUTCFullYear;
                    timeSetter = oDate.setUTCHours;
                    if (symbol) {
                        tzHour = dateProcess.toInt(symbol + c);
                        tzMin = dateProcess.toInt(symbol + d);
                    }
                    return "";
                });

                dateArray[3] -= tzHour;
                dateArray[4] -= tzMin;
                dateSetter.apply(oDate, dateArray.slice(0, 3));
                timeSetter.apply(oDate, dateArray.slice(3));
                date = oDate;
            }
        }
        if (typeof date === "number") {
            date = new Date(date);
        }
        while (format) {
            match = dateUtil.rdateFormat.exec(format);
            if (match) {
                parts = parts.concat(match.slice(1));
                format = parts.pop();
            } else {
                parts.push(format);
                format = null;
            }
        }
        parts.forEach((value)=> {
            fn = dateUtil.DATE_FORMATS[value];
            text += fn ? fn(date, locate) : value.replace(/(^'|'$)/g, "").replace(/''/g, "'");
        });
        return text;
    },
    addYear(date, value) {//添加年
        date = dateUtil.dateParse(date);
        date.setFullYear(date.getFullYear() + value);
        return date;
    },
    addMonths(date, value) {//添加月
        date = dateUtil.dateParse(date);
        date.setMonth(date.getMonth() + value);
        return date;
    },
    addDays(date, value) {//添加天
        date = dateUtil.dateParse(date);
        date.setDate(date.getDate() + value);
        return date;
    },
    addHours(date, value) {//添加小时
        date = dateUtil.dateParse(date);
        date.setHours(date.getHours() + value);
        return date;
    },
    addMinutes(date, value) {//添加分钟
        date = dateUtil.dateParse(date);
        date.setMinutes(date.getMinutes() + value);
        return date;
    },
    addSeconds(date, value) {//添加秒
        date = dateUtil.dateParse(date);
        date.setSeconds(date.getSeconds() + value);
        return date;
    },
    addMilliseconds(date, value) {//添加毫秒
        date = dateUtil.dateParse(date);
        date.setMilliseconds(date.getMilliseconds() + value);
        return date;
    },
    dateParse(date) {
        let format = dateUtil.format(date, 'yyyy-MM-dd HH:mm:ss.sss');
        var value;
        format.replace(/^(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+).(\d+)$/, (full,year,month,day,hours,minutes,seconds,milliseconds)=>{
            month = month - 1; //月
            let dt = new Date(year,month,day,hours,minutes,seconds);
            dt.setMilliseconds(dt.getMilliseconds() + milliseconds);
            value = dt;
        });
        return value;
    },
    timeSpan(date1, date2) {//时间跨度
        date1 = dateUtil.dateParse(date1);
        date2 = dateUtil.dateParse(date2);
        //相差总的毫秒数
        let totalMilliseconds = date2.getTime() - date1.getTime();
        //相差总秒数
        let totalSeconds = totalMilliseconds / 1000;
        //相差总分钟数
        let totalMinutes = totalMilliseconds / (60*1000);
        //相差总小时数
        let totalHours = totalMilliseconds / (3600*1000);
        //相差总天数
        let totalDays = totalMilliseconds / (24*3600*1000);
        //相差总月数
        let totalMonths = totalMilliseconds / (30*24*3600*1000);
        //相差总年数
        let totalYears = totalMilliseconds / (365*24*3600*1000);
        //相差天数
        let days = Math.floor(totalMilliseconds / (24*3600*1000));
        //相差小时数
        let leave1 = totalMilliseconds % (24*3600*1000); //计算天数后剩余的毫秒数
        let hours = Math.floor(leave1 / (3600*1000));
        //计算相差分钟数
        let leave2 = leave1 % (3600*1000); //计算小时数后剩余的毫秒数
        let minutes = Math.floor(leave2 / (60*1000));
        //计算相差秒数
        let leave3 = leave2 % (60*1000); //计算分钟数后剩余的毫秒数
        let seconds = Math.round(leave3 / 1000);
        return {
            days,hours,minutes,seconds,totalMilliseconds,totalSeconds,totalMinutes,totalHours,totalDays,totalMonths,totalYears,
            print: " 相差: " + days + "天, " + hours + "小时, " + minutes + "分钟, " + seconds + "秒",
        };
    }
};


export let format = dateUtil.format;
export let addYear = dateUtil.addYear;
export let addMonths = dateUtil.addMonths;
export let addDays = dateUtil.addDays;
export let addHours = dateUtil.addHours;
export let addMinutes = dateUtil.addMinutes;
export let addSeconds = dateUtil.addSeconds;
export let addMilliseconds = dateUtil.addMilliseconds;
export let dateParse = dateUtil.dateParse;
export let timeSpan = dateUtil.timeSpan;
export default dateUtil;
