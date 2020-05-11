var winston = require('winston');
winston.emitErrs = true;

module.exports = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'debug',
      filename: __dirname + '/../logs/all-logs.log',
      handleExceptions: true,
      json: false,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false,
      timestamp: true,
      label: 'REST'
    }),
    new winston.transports.Console({
      level: 'silly',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      json: false,
      colorize: true,
      label: 'REST'
    })
  ],
  exitOnError: false
});

module.exports.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};
