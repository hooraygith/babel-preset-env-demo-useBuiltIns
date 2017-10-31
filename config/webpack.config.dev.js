const webpack = require('webpack')
const path = require('path')
const Clean = require('clean-webpack-plugin')
const config =  require('./webpack.config.base.js')
const cdn = 'https://cdn.cdndomain.com/'

config.plugins.push(new webpack.DefinePlugin({ //全局常量
    ENV: "'dev'",
    URL_API: "'https://api-dev.apidomain.com'"
}))
config.plugins.push(new Clean(['dist/dev'],{
    root: process.cwd()
}))  //清空目录

config.output.path = path.resolve(__dirname, '../dist/dev/')
config.output.publicPath = `${cdn}static/cdnpath/`

module.exports = config
