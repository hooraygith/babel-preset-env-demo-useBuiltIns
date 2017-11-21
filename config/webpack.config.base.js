const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
    entry: [path.resolve(__dirname, '../src/index.js')],
    output: {
        // name hash chunkhash
        filename: 'js/[name]-[chunkhash:8].js',
        chunkFilename: 'js/[name]-[chunkhash:8].js',
        publicPath: '/'
    },
    resolve: {
        modules: ['node_modules', path.join(__dirname, '../src')],
        alias: {
            'vue': 'vue/dist/vue.common.js'
        }
    },
    module: {
        rules: [
        {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    'css': [
                        'vue-style-loader',
                        {
                            'loader': 'css-loader!postcss-loader!sass-loader'
                        }
                    ]
                }
            }
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
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
                limit: 5000,
                name: 'img/[name]-[hash:8].[ext]'
            }
        }, {
            test: /\.(eot|woff2?|ttf)$/,
            loader: 'url-loader',
            query: {
                limit: 1,
                name: 'font/[name]-[hash:8].[ext]'
            }
        }, {
            test: /\.(html|ejs)$/,
            loader: 'html-loader'
        }]
    },
    plugins: [
        new webpack.ProvidePlugin({
            Vue: 'vue'
        }),

        // split vendor js into its own file
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function(module, count) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                    path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        }),

        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),

        // scope hosting
        new webpack.optimize.ModuleConcatenationPlugin(),

        // css 插入 html head
        new ExtractTextPlugin('css/[name]-[contenthash:8].css'),

        // js 插入 html body
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.ejs'
        })
    ]
}
