/* eslint-disable @typescript-eslint/no-var-requires */
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const ZipPlugin = require("zip-webpack-plugin");

const rootPath = __dirname + "/../";

module.exports = merge(common, {
	mode: "production",
	plugins: [
		new ZipPlugin({
			path: rootPath + "/zip/",
			filename: `extension.zip`,
		}),
	],
});
