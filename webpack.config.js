const path = require('path')

module.exports = {
    devServer: {
        static: {
            directory: path.join(__dirname, 'public')
        },
        compress: true,
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
}