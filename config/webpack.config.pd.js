const webpack = require('webpack')
const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin
const path = require('path')
const Clean = require('clean-webpack-plugin')
const config =  require('./webpack.config.base.js')
const cdn = 'https://cdn.cdndomain.com/'

config.plugins.push(
    new webpack.DefinePlugin({ //全局常量
        ENV: "'pd'",
        URL_API: "'https://api.apidomain.com'"
    }),
    new uglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),
    // 压缩 css
    new webpack.LoaderOptionsPlugin({
        minimize: true
    })
)
config.plugins.push(new Clean(['dist/pd'],{
    root: process.cwd()
}))  //清空目录

config.output.path = path.resolve(__dirname, '../dist/pd/')
config.output.publicPath = `${cdn}static/cdnpath/`

module.exports = config
