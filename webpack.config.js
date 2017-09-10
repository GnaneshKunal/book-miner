const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        app: './src/index.tsx'
    },
    output: {
        filename: './dist/bundle.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            { test: /\.tsx?$/, loader: 'ts-loader'}
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        modules: [
            path.join(process.cwd(), 'app'),
            'node_modules'
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
};