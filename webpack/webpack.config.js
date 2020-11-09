const path = require('path');

module.exports = {
    entry: './src/main.js',
    mode: 'development',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, '../katalog/static/webpack'),
    },    
    performance: {
        hints: false
    },
    watch: true,
    watchOptions: {
        aggregateTimeout: 50,
        // poll: 1000
    },
};