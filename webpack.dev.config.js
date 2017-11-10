var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var resolvePath = function(p){
	return path.resolve(__dirname,p)
}

var srcPath = resolvePath('./src'),
		distPath = resolvePath('./dist'),
		NODE_ENV = process.env.NODE_ENV

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
				use:['style-loader','css-loader','postcss-loader','less-loader']
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				use: [
          {
            loader: 'url-loader',
            options: {
							limit: 10000
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
							limit: 10000
            }
          }
        ]
      }
		]
	},
	devServer: {
		contentBase: distPath,
		port: 9000
	},
	devtool: '#cheap-module-eval-source-map',
	plugins: [
		new webpack.DefinePlugin({
			'process.env': NODE_ENV
		}),
		new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      inject: true
    }),
	]
}