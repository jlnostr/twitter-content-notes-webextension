const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const ZipPlugin = require('zip-webpack-plugin');

const rootPath = __dirname + "/../";
const manifest = require(rootPath + "/public/manifest.json");

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new ZipPlugin({
            path: rootPath + "/zip/",
            filename: `extension-v${manifest.version}.zip`,
        })
    ]
});