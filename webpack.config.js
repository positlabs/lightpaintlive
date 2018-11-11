
const glob = require('glob')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const entry = {}
;(['index', 'globals']).forEach(e => {
    entry[e] = `./src/js/${e}.js`
})

const pugToCompile = glob.sync('src/templates/*.pug').filter(f => !path.parse(f).base.startsWith('_'))
const htmlPlugins = pugToCompile.map(template => {
    const file = path.parse(template)
    return new HtmlWebpackPlugin({
        filename: `../${file.name}.html`,
        template: template,
        inject: false
    })    
})

const pug = {
    test: /\.pug$/,
    use: ['html-loader?attrs=false', 'pug-html-loader']
}

const config = {
    entry,
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: '[name].js',
    },
    module: {
        rules: [
            pug,
            // {
            //     test: /src\/styles\/components\/*\.(s*)(c|a)ss$/,
            //     use: [
            //         { loader: 'raw-loader' }, // use raw to get the string for injecting in shadow dom
            //         // { loader: 'style-loader' },
            //         {
            //             loader: 'css-loader',
            //             options: {url: false}
            //         },
            //         { loader: 'sass-loader' }
            //     ]
            // },
            {
                test: /\.(s*)(c|a)ss$/,
                use: [
                    // TODO make a rule for components scss
                    // { loader: 'raw-loader' }, // use raw to get the string for injecting in shadow dom
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {url: false}
                    },
                    { loader: 'sass-loader' }
                ]
            },
        ]
    },
    plugins: [
        ...htmlPlugins
    ]
}
module.exports = config