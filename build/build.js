const webpack = require("webpack")
const env = process.argv[2]
const config = require("../config/webpack.config." + env + ".js")

webpack(config, (err, stats) => {
    if (err) {
        console.error(err)
        return
    }
    console.log(stats.toString({
        chunks: false, // Makes the build much quieter
        colors: true
    }))
    console.log('打包成功，请访问： http//localhost:12000')
})
