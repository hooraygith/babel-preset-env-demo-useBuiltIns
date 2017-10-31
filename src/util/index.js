/* eslint-disable camelcase */
import cache from 'lscache'
import isMobile from './is-mobile'
import isName from './is-name'
import date from './date.js'

export default {
    setCache: cache.set,
    getCache: cache.get,
    removeCache: cache.remove,
    flushCache: cache.flush,
    isMobile,
    isName,
    date
}
