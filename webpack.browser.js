const fs = require('fs')
const path = require('path')

module.exports = {
    mode: 'development',
    target: 'web',
    entry: {
        'm-remote-controls': './src/scripts/components/controls/m-remote-controls.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve('./src', 'dist')
    },
    // externals: nodeModules,
    module: {
        rules: [
            {
                test: /\.(s*)(c|a)ss$/,
                use: ['raw-loader', 'sass-loader']
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