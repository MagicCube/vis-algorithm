const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    context: path.join(__dirname, "./src"),
    entry: {
        "vendor": [ "d3" ],
        "sap.a": [ "./sap/a/resource/index.less" ],
        "km": [ "./km/app/Application.js", "./km/resource/index.less" ]
    },
    output: {
        path: "./public/assets",
        publicPath: "/assets",
        filename: "[name]/bundle.js"
    },
    devServer: {
        contentBase: "./public"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loaders: [
                    "ui5-loader?sourceRoot=./src",
                    "babel-loader?sourceRoot=./src"
                ]
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            },
            {
                test: /\.(png|jpg)$/, loader: "url-loader?limit=1048576"
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("./[name]/resource/index.css")
    ]
};
