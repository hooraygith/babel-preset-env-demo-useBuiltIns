const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
    entry: ['./index.js'],
    output: {
        path: __dirname + '/dist',
        // name hash chunkhash
        filename: 'js/[name]-[chunkhash:8].js',
        chunkFilename: "js/chunk-[name]-[chunkhash:8].js"
        // publicPath: '//blog-cdn.oss-cn-shenzhen.aliyuncs.com/'
        // publicPath: './'
    },
    resolve: {
        modules: ['node_modules']
    },
    module: {
        rules: [
        {
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.js$/,
            loader: 'babel-loader'
        }, {
            test: /\.(scss|css)$/,
            use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: "css-loader!postcss-loader!sass-loader"
                })
        }, {
            test: /\.(jpe?g|svg|png|gif|webp)$/,
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: 'img/[name]-[hash:8].[ext]'
            }
        }]
    },
    plugins: [
        // new uglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),

        // // split vendor js into its own file
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',
        //     minChunks: function (module, count) {
        //     // any required modules inside node_modules are extracted to vendor
        //     return (
        //         module.resource &&
        //         /\.js$/.test(module.resource) &&
        //         module.resource.indexOf(
        //         path.join(__dirname, './node_modules')
        //         ) === 0
        //     )
        //   }
        // }),

        // // extract webpack runtime and module manifest to its own file in order to
        // // prevent vendor hash from being updated whenever app bundle is updated
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'manifest',
        //     chunks: ['vendor']
        // }),

        // // css 插入 html head
        // new ExtractTextPlugin('css/[name]-[chunkhash:8].css'),

        // // 压缩 css，
        // // 经过测试，对于压缩完的css和未压缩的css,gzip后大小差不多，
        // // 但gzip每次都压缩会浪费nginx的性能
        // new webpack.LoaderOptionsPlugin({
        //     minimize: true
        // }),

        // // js 插入 html body
        // new HtmlWebpackPlugin({
        //     filename: 'index.html',
        //     template: './src/index.html'
        // }),

        // // 关闭vue的调试
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         NODE_ENV: '"production"'
        //     }
        // })
    ]
}
