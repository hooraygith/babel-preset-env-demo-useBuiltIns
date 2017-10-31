const path = require('path')
const webpack = require('webpack')
const config =  require('./webpack.config.base.js')

config.plugins.push(new webpack.DefinePlugin({ //全局常量
    ENV: "'dev-server'",
    URL_API: "'https://api-dev.apidomain.com'"
}))

config.output.path = path.resolve(__dirname, '../dist/dev-server/')

config.devServer = {
    // publicPath: "/",
    // contentBase: "../dist/dev-server/",
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
