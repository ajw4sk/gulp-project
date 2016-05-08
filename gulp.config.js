module.exports = function() {
    var client = './src/client/';
    var clientApp = client + 'app/';

    var config = {
        temp: './.tmp/',
        // file paths
        alljs: [
            './src/**/*.js',
            './*.js'
        ],
        client: client,
        index: client + 'index.html',
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js'
        ],

        less: client + 'styles/styles.less',

        //bower and npm locations
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'

        }
    };

    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    return config;
};