const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const webpackConfig = {
    entry: {
        bundle: ['babel-polyfill', `${__dirname}/../../app/App.tsx`],
    },
    output: {
        path: path.resolve(__dirname, './../../../dist'),
        filename: 'js/[name].js',
        publicPath: `/dist`,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: require.resolve('eslint-loader'),
                enforce: 'pre',
            },
            {
                test: /\.(ts|tsx)$/,
                include: [path.resolve(__dirname, './../../app')],
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            experimentalFileCaching: false,
                        },
                    },
                ],
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                math: 'always',
                            },
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                loader: 'svg-sprite-loader',
                options: {},
            },
        ],
    },
    plugins: [
        new CaseSensitivePathsPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css?[fullhash]-[chunkhash]-[name]',
            linkType: 'text/css',
        }),
        new SpriteLoaderPlugin({
            plainSprite: true,
        }),
    ],
};

module.exports = webpackConfig;
