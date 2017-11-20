const path = require('path')
const webpack = require('webpack')
const config =  require('./webpack.config.base.js')

config.plugins.push(new webpack.DefinePlugin({ //全局常量
    ENV: "'dev-server'",
    URL_API: "'https://api-dev.apidomain.com'"
}))

// 加快dev速度
config.output.filename = 'js/[name].js'
config.output.chunkFilename = 'js/[name].js'
config.plugins.push(new webpack.HotModuleReplacementPlugin())

config.output.path = path.resolve(__dirname, '../dist/dev-server/')

config.devServer = {
    hot: true,
    proxy: {
        "/": {
            bypass: function(req) {
                const re = /(\/[a-zA-Z0-9\-\_]*)+(\/)?(\?.+)?/i
                if (re.test(req.url)) {
                    return "/index.html"
                }
            }
        }
    }
}

module.exports = config
