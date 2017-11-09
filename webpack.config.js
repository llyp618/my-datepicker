var path = require('path')

var resolvePath = function(p){
	return path.resolve(__dirname,p)
}
var srcPath = resolvePath('./src'),
	distPath = resolvePath('./dist')

module.exports = {
	entry: resolvePath('./src/main.js'),
	output: {
		path: distPath,
		filename: '[name].js' ,
		libraryTarget:'umd'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.less$/,
				exclude: /node_modules/,
				//...
			}
		]
	}
}