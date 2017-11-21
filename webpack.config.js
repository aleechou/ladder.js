var path = require('path')

module.exports = {
    entry: {
        mainwindow: __dirname+"/src/mainwnd/mainwindow.js",
        quickwnd: __dirname+"/src/quickwnd/quickwindow.js",
    },
    
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: '[name].build.js'
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ],
            }, {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {}
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.vue', '.json']
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true
    },
    externals: {
        "vue/dist/vue.js": "window.Vue"
        , "iview/dist/iview.js": "window.iview"
    }
}


require("./auto-register-vue-component")(module.exports, __dirname+"/src")