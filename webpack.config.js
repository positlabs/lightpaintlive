const fs = require('fs')
const path = require('path')

const nodeModules = {}
fs.readdirSync('node_modules')
    .filter((x) => {
        return ['.bin'].indexOf(x) === -1
    })
    .forEach((mod) => {
        nodeModules[mod] = 'commonjs ' + mod
    })


module.exports = {
    mode: 'development',
    target: 'electron-renderer',
    node: {
        __dirname: false,
    },
    entry: {
        'ipc-controller': './src/scripts/ipc-controller.js',
        'globals': './src/scripts/globals.js',
        'mercury-app': './src/scripts/components/mercury-app.js',
        'm-controls': './src/scripts/components/controls/m-controls.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve('./src', 'dist')
    },
    externals: nodeModules,
    module: {
        rules: [
            {
                test: /\.(s*)(c|a)ss$/,
                use: ['raw-loader', 'sass-loader']
                // use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.html$/,
                use: ['raw-loader']
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            }
        ]
    },
}