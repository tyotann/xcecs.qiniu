/**
 * Created by TYOTANN on 2014/6/20.
 */
var log4js = require('log4js');

log4js.configure({
    appenders: [
        {  type: 'console'},
        {
            type: 'file',
            filename: 'logs/access.log',
            maxLogSize: 10240,
            backups: 5
        }
    ],
    replaceConsole: true
});

exports.logger = function (name) {
    var logger = log4js.getLogger(name);
    logger.setLevel('INFO');
    return logger;
};
