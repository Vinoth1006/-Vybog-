// const winston = require('winston');
const { createLogger, format, transports, error } = require('winston');

// const AWS = require('aws-sdk');
// const config = require('./handler/config');
// AWS.config.update({
//     accessKeyId: config.AWS_S3_KEY,
//     secretAccessKey: config.AWS_S3_SECRET,
//     region: config.AWS_S3_REGION
// });

// const s3 = new AWS.S3({
//     accessKeyId: config.AWS_S3_KEY,
//     secretAccessKey: config.AWS_S3_SECRET,
//     region: 'ap-south-1', // Specify your desired AWS region
// });
// class S3Transport extends winston.Transport {
//     constructor(options) {
//         super(options);
//         this.bucket = options.bucket;
//         this.keyPrefix = options.keyPrefix || 'logs/';
//     }
//     log(level, msg, meta, callback) {
//         const logMessage = `${level}: ${msg}\n`;
//         const params = {
//             Bucket: this.bucket,
//             Key: `${this.keyPrefix}${Date.now()}.log`,
//             Body: logMessage,
//         };
//         s3.putObject(params, (err) => {
//             if (err) {
//                 console.error('Error uploading log:', err);
//             }
//             callback(null, true);
//         });
//     }
// }
// if (event.identity) {
//     origin = event.identity.sourceIp;
//   }

let link = 'https://staging.vybog.app/'

const myFormat = format.printf(({ level, message, label, stack ,error}) => {
    const time = new Date();
    const formattedTime = `${time.getFullYear()}-${(time.getMonth() + 1).toString().padStart(2, '0')}-${time.getDate().toString().padStart(2, '0')} ${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
  return `Domain: ${link}--${label}: ${formattedTime} { ${level}: ${stack || message || error} }`;
});
const logger = new createLogger({
    level: 'info',
    format: format.combine(
      format.colorize(),
      format.label({ label: ' Date & Time' }),
      format.timestamp(),
      format.errors({ stack: true }),
      format.json(),
      myFormat
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
    //   new S3Transport({
    //     bucket: config.AWS_S3_LOG_BUCKET,
    //   }),
      new transports.Console(),
      // new transports.File({
      //   filename: 'log/infos.log',
      //   maxFiles: 5,
      //   maxsize: 2242880,
      //   level: 'info'
      // })
    ],
  });

// const logger = winston.createLogger({
//     transports: [
//         new winston.transports.Console(),
//         // new S3Transport({
//         //     bucket: config.AWS_S3_log_BUCKET,
//         // }),
//     ],
// });

logger.info('winston Logger Running');


module.exports = logger;