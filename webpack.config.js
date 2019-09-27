const path = require('path');

// PLUGINS
const
    TerserJSPlugin = require('terser-webpack-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
    {CleanWebpackPlugin} = require('clean-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

let devMode = false;

let config = env => {
    // check if --env.dev is provided
    devMode = (!!env && !!env.dev);

    return {
        context: path.resolve('./resources'),
        mode: "development",
        watch:true,
        entry: [
            "./sass/main.scss",
            "./js/app.js",
        ],
        output: {
            path: path.resolve( "./public/assets"),
            filename: "[name].js",
            publicPath:'/assets/'
        },
        target: "web",
        optimization: {
            minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessor: require('cssnano'),
                cssProcessorPluginOptions: {
                    preset: ['default', {discardComments: {removeAll: true}}],
                },
                canPrint: true
            })],
        },
        devtool: "cheap-module-eval-source-map",
        devServer:{
          contentBase:path.resolve('./public'),
            hot:true,
            overlay:true
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: ['babel-loader'],
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader:'eslint-loader',
                    enforce:"pre",
                },
                {
                    test: /\.(css|scss)$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: devMode,
                            },
                        },
                        {
                            loader: 'css-loader',
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: (loader) => [
                                    require("autoprefixer")
                                ]
                            }
                        }, 'sass-loader',
                    ],
                },
                {
                    test: /\.(woff2?|eot|ttf|otf|wav)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                limit: 8192,
                            },
                        },
                    ],
                }, {
                    test: /\.(png|jpg|gif|svg|)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                        {
                            loader: 'img-loader',
                            options: {
                                enabled: !devMode
                            }
                        }
                    ],
                },
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: devMode ? '[name].css' : '[name].css',
                chunkFilename: '[id].css',
                ignoreOrder: false, // Enable to remove warnings about conflicting order
            }),
            new CleanWebpackPlugin({
                verbose: true,
                dry: true
            }),
            new HtmlWebpackPlugin()
        ],
    }
};

// modifications depending if on dev
/*




if (!dev) {
    config.plugins.push(new TerserJSPlugin());
}*/

module.exports = config;