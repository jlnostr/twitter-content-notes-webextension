/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = "../src/";

module.exports = {
	entry: {
		content_script: path.join(__dirname, srcDir + "content_script.ts"),
	},
	output: {
		path: path.join(__dirname, "../dist/"),
		filename: "js/[name].js",
	},
	optimization: {
		splitChunks: {
			name: "vendor",
			chunks: "initial",
		},
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: "public/" }],
		}),
	],
};
